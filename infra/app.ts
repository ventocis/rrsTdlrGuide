import * as cdk from "aws-cdk-lib";
import { AppEnv, CdkEnvironments } from "@roadreadysafety/cdk-infrastructure/constants";
import { applyCdkTags } from "@roadreadysafety/cdk-infrastructure/utils/tagging";
import * as stacks from "./stacks";

const app = new cdk.App();

const gitRepoName = "rrsTdlrGuide";
const rootDomain = "tdlrguide.com";

const appConfig = {
  [AppEnv.QA]: {
    appEnv: AppEnv.QA,
    env: CdkEnvironments[AppEnv.QA],
    crossRegionReferences: true,
    rootDomain,
    domainName: `qa.${rootDomain}`,
    googleVerificationTxt: "google-site-verification=h-SIdImfuty-dYtSp4gSp4D9mvSk8QcllaODf70b6bE",
  },
  [AppEnv.PROD]: {
    appEnv: AppEnv.PROD,
    env: CdkEnvironments[AppEnv.PROD],
    crossRegionReferences: true,
    rootDomain,
    domainName: rootDomain,
    googleVerificationTxt: "google-site-verification=IetSJ1ncPYf7YgBV5nPUaMmCs91MCosUExUl3kya1G0",
    existingHostedZoneId: "Z07282621BGEND00G35QX",
  },
};

// TODO: Deploy QA DNS stack first, then paste the 4 NS record values here.
// Find them in the Route 53 console under the qa.tdlrguide.com hosted zone.
const qaSubdomainNameServers: string[] = ["ns-1092.awsdns-08.org", "ns-1020.awsdns-63.net", "ns-184.awsdns-23.com", "ns-1741.awsdns-25.co.uk"];

Object.values(AppEnv).forEach((env) => {
  const config = appConfig[env];

  const dnsStack = new stacks.DnsStack(app, `rrsTdlrGuide-dns-${env}`, {
    ...config,
    env: config.env,
    subdomainDelegations: env === AppEnv.PROD && qaSubdomainNameServers.length > 0 ? [{ subdomain: "qa", nameServers: qaSubdomainNameServers }] : undefined,
  });
  applyCdkTags(dnsStack, env, gitRepoName);

  const certStack = new stacks.CloudfrontCertificateStack(app, `rrsTdlrGuide-cloudfront-certs-${env}`, {
    ...config,
    hostedZone: dnsStack.hostedZone,
    env: { account: config.env!.account, region: "us-east-1" },
  });
  certStack.addDependency(dnsStack);
  applyCdkTags(certStack, env, gitRepoName);

  const appStack = new stacks.AppStack(app, `rrsTdlrGuide-app-${env}`, {
    ...config,
    env: config.env as Required<cdk.Environment>,
    hostedZone: dnsStack.hostedZone,
    certificate: certStack.certificate,
  });
  applyCdkTags(appStack, env, gitRepoName);
});
