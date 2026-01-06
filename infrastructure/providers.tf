terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Primary provider for EU resources
provider "aws" {
  region = var.aws_region
}

# US East 1 provider for CloudFront ACM certificate
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
