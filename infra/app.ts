import * as cdk from "aws-cdk-lib";
import {
  AppEnv,
  CdkEnvironments,
} from "@roadreadysafety/cdk-infrastructure/constants";
import { applyCdkTags } from "@roadreadysafety/cdk-infrastructure/utils/tagging";
import * as stacks from "./stacks";

const app = new cdk.App();

const gitRepoName = "rrsTdlrGuide";
const rootDomain = "tdlrguide.com";

const appConfig: Record<
  AppEnv,
  Omit<
    stacks.AppStackProps & stacks.CloudfrontCertificateStackProps,
    "certificate"
  >
> = {
  [AppEnv.QA]: {
    appEnv: AppEnv.QA,
    env: CdkEnvironments[AppEnv.QA],
    crossRegionReferences: true,
    rootDomain,
    domainName: `qa.${rootDomain}`,
    enableEmail: false,
  },
  [AppEnv.PROD]: {
    appEnv: AppEnv.PROD,
    env: CdkEnvironments[AppEnv.PROD],
    crossRegionReferences: true,
    rootDomain,
    domainName: rootDomain,
    enableEmail: true,
  },
};

Object.values(AppEnv).forEach((env) => {
  const config = appConfig[env];

  const certStack = new stacks.CloudfrontCertificateStack(
    app,
    `rrsTdlrGuide-cloudfront-certs-${env}`,
    {
      ...config,
      env: { account: config.env!.account, region: "us-east-1" },
    },
  );
  applyCdkTags(certStack, env, gitRepoName);

  const appStack = new stacks.AppStack(app, `rrsTdlrGuide-app-${env}`, {
    ...config,
    env: config.env as Required<cdk.Environment>,
    certificate: certStack.certificate,
  });
  applyCdkTags(appStack, env, gitRepoName);
});
