import type { AppEnv } from "@roadreadysafety/cdk-infrastructure/constants";
import { StaticSite, GoogleWorkspaceEmail } from "@roadreadysafety/cdk-infrastructure/constructs";
import * as cdk from "aws-cdk-lib";
import type * as acm from "aws-cdk-lib/aws-certificatemanager";
import type * as r53 from "aws-cdk-lib/aws-route53";
import type { Construct } from "constructs";
import * as path from "path";

export interface AppStackProps extends cdk.StackProps {
  env: Required<cdk.Environment>;
  appEnv: AppEnv;
  domainName: string;
  hostedZone: r53.IHostedZone;
  certificate: acm.ICertificate;
  googleVerificationTxt: string;
  dkimValue?: string;
  dmarcPolicy: "none" | "quarantine" | "reject";
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    new StaticSite(this, "Site", {
      siteName: "tdlrguide",
      domainName: props.domainName,
      hostedZone: props.hostedZone,
      certificate: props.certificate,
      buildOutputPath: path.join(__dirname, "../../dist"),
      env: props.env,
      isPrerendered: true,
      customErrorConfig: { mode: "static", errorPage: "/404.html" },
    });

    new GoogleWorkspaceEmail(this, "Email", {
      hostedZone: props.hostedZone,
      googleVerificationTxt: props.googleVerificationTxt,
      dkimValue: props.dkimValue,
      dmarcPolicy: props.dmarcPolicy,
    });
  }
}
