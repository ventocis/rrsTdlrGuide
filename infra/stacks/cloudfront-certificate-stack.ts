import type { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import type { AppEnv } from "@roadreadysafety/cdk-infrastructure/constants";
import type * as r53 from "aws-cdk-lib/aws-route53";

export interface CloudfrontCertificateStackProps extends cdk.StackProps {
  env: cdk.Environment;
  appEnv: AppEnv;
  domainName: string;
  hostedZone: r53.IHostedZone;
}

/**
 * Creates ACM certificate for the CloudFront distribution.
 * Must be deployed in us-east-1 (CloudFront requirement).
 * Covers both the domain and www subdomain.
 */
export class CloudfrontCertificateStack extends cdk.Stack {
  readonly certificate: acm.ICertificate;

  constructor(scope: Construct, id: string, props: CloudfrontCertificateStackProps) {
    super(scope, id, props);

    this.certificate = new acm.Certificate(this, "Certificate", {
      domainName: props.domainName,
      subjectAlternativeNames: [`www.${props.domainName}`],
      validation: acm.CertificateValidation.fromDns(props.hostedZone),
    });
  }
}
