variable "aws_region" {
  description = "AWS region for S3 bucket and primary resources"
  type        = string
  default     = "eu-west-2"
}

variable "domain_name" {
  description = "Domain name for the habit tracker application"
  type        = string
  default     = "habits.jamiekelly.com"
}

variable "root_domain" {
  description = "Root domain name (must have existing Route53 hosted zone)"
  type        = string
  default     = "jamiekelly.com"
}

variable "terraform_state_bucket" {
  description = "S3 bucket name for Terraform state storage"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "habits"
}
