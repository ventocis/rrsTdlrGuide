import type { AppEnv } from "@roadreadysafety/cdk-infrastructure/constants";
import {
  StaticSite,
  GoogleWorkspaceEmail,
} from "@roadreadysafety/cdk-infrastructure/constructs";
import * as cdk from "aws-cdk-lib";
import type * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as r53 from "aws-cdk-lib/aws-route53";
import type { Construct } from "constructs";
import * as path from "path";

export interface AppStackProps extends cdk.StackProps {
  env: Required<cdk.Environment>;
  appEnv: AppEnv;
  rootDomain: string;
  domainName: string;
  certificate: acm.ICertificate;
  enableEmail?: boolean;
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const hostedZone = r53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: props.rootDomain,
    });

    new StaticSite(this, "Site", {
      siteName: "tdlrguide",
      domainName: props.domainName,
      hostedZone,
      certificate: props.certificate,
      buildOutputPath: path.join(__dirname, "../../.output/public"),
      env: props.env,
      spaFallbackPage: "/200.html",
    });

    if (props.enableEmail) {
      new GoogleWorkspaceEmail(this, "Email", { hostedZone });
    }
  }
}
