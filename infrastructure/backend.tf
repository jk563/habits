terraform {
  backend "s3" {
    # Configure these values via backend config file or CLI flags
    # bucket = var.terraform_state_bucket  # Not allowed in backend block
    # key    = "habits/terraform.tfstate"
    # region = "eu-west-2"
    # encrypt = true

    # Note: Backend configuration must be provided via:
    # 1. Backend config file: terraform init -backend-config=backend.hcl
    # 2. CLI flags: terraform init -backend-config="bucket=my-bucket"
    # 3. Environment variables in CI/CD
  }
}
