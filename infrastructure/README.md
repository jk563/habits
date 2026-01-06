# Habits Tracker - AWS Infrastructure

This directory contains Terraform configuration for deploying the Habits Tracker as a static website on AWS.

## Architecture

The infrastructure consists of:

- **S3 Bucket** (eu-west-2): Static website file storage
- **CloudFront**: Global CDN with HTTPS support
- **ACM Certificate** (us-east-1): SSL/TLS certificate for HTTPS
- **Route53**: DNS management for habits.jamiekelly.com
- **Origin Access Control**: Secure S3 access from CloudFront only

## Prerequisites

1. **AWS Account** with:
   - Route53 hosted zone for `jamiekelly.com`
   - IAM permissions for S3, CloudFront, ACM, and Route53
   - S3 bucket for Terraform state storage

2. **Tools**:
   - Terraform >= 1.0
   - AWS CLI configured

## Initial Setup

### 1. Configure Backend

Copy the example backend configuration:

```bash
cd infrastructure
cp backend.hcl.example backend.hcl
```

Edit `backend.hcl` with your state bucket name:

```hcl
bucket  = "your-terraform-state-bucket-name"
key     = "habits/terraform.tfstate"
region  = "eu-west-2"
encrypt = true
```

### 2. Configure Variables

Copy the example variables file:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your values:

```hcl
terraform_state_bucket = "your-terraform-state-bucket-name"
aws_region            = "eu-west-2"
domain_name           = "habits.jamiekelly.com"
root_domain           = "jamiekelly.com"
environment           = "production"
project_name          = "habits"
```

### 3. Initialize Terraform

```bash
terraform init -backend-config=backend.hcl
```

### 4. Plan and Apply

Review the planned changes:

```bash
terraform plan
```

Apply the infrastructure:

```bash
terraform apply
```

This will:
1. Create S3 bucket in eu-west-2
2. Create ACM certificate in us-east-1 (required for CloudFront)
3. Create DNS validation records in Route53
4. Wait for certificate validation (can take 5-30 minutes)
5. Create CloudFront distribution
6. Create Route53 A and AAAA records

### 5. Note the Outputs

After successful apply, note these outputs for GitHub Actions:

```bash
terraform output
```

You'll need:
- `s3_bucket_name`
- `cloudfront_distribution_id`

## GitHub Actions Setup

Configure the following secrets in your GitHub repository:

### Required Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS access key for deployment | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for deployment | `wJalr...` |
| `S3_BUCKET_NAME` | S3 bucket name (from Terraform output) | `habits.jamiekelly.com` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID (from Terraform output) | `E1234567890ABC` |

### Setting Secrets

Via GitHub CLI:
```bash
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY
gh secret set S3_BUCKET_NAME
gh secret set CLOUDFRONT_DISTRIBUTION_ID
```

Or via GitHub UI:
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret

## Deployment

The application deploys automatically when changes are pushed to the `main` branch.

Manual deployment:
1. Go to Actions tab in GitHub
2. Select "Deploy to AWS" workflow
3. Click "Run workflow"

## DNS Propagation

After initial deployment:
1. Certificate validation takes 5-30 minutes
2. CloudFront distribution deployment takes 15-20 minutes
3. DNS propagation can take up to 48 hours (usually much faster)

Check status:
```bash
# Check certificate status
aws acm describe-certificate --certificate-arn <arn> --region us-east-1

# Check CloudFront distribution status
aws cloudfront get-distribution --id <distribution-id>
```

## Cost Estimate

Monthly costs (approximate):
- **S3 Storage**: ~$0.50 (for small static site)
- **CloudFront**: ~$1-5 (depends on traffic)
- **Route53**: $0.50 per hosted zone
- **ACM Certificate**: Free
- **Total**: ~$2-6/month for low traffic

## Maintenance

### Update Infrastructure

```bash
cd infrastructure
terraform plan
terraform apply
```

### Destroy Infrastructure

⚠️ **Warning**: This will delete all resources and the website will be offline.

```bash
terraform destroy
```

### View Current State

```bash
terraform show
terraform state list
```

## Troubleshooting

### Certificate Validation Stuck

Check DNS records were created:
```bash
aws route53 list-resource-record-sets --hosted-zone-id <zone-id>
```

### CloudFront 403 Errors

Verify S3 bucket policy allows CloudFront OAC access:
```bash
aws s3api get-bucket-policy --bucket habits.jamiekelly.com
```

### Website Not Loading

1. Check CloudFront distribution status is "Deployed"
2. Verify Route53 records point to CloudFront
3. Check files were uploaded to S3:
   ```bash
   aws s3 ls s3://habits.jamiekelly.com/
   ```

## Security Notes

- S3 bucket is private (not publicly accessible)
- CloudFront uses Origin Access Control (OAC) for secure S3 access
- HTTPS enforced via CloudFront (HTTP redirects to HTTPS)
- TLS 1.2+ only
- State file stored encrypted in S3

## Resources Created

- `aws_s3_bucket.website`
- `aws_cloudfront_distribution.website`
- `aws_cloudfront_origin_access_control.website`
- `aws_acm_certificate.website`
- `aws_route53_record.website` (A record)
- `aws_route53_record.website_ipv6` (AAAA record)
- `aws_route53_record.cert_validation` (CNAME for validation)
