import * as cdk from "aws-cdk-lib";
import { AppEnv, CdkEnvironments } from "@roadreadysafety/cdk-infrastructure/constants";
import { applyCdkTags } from "@roadreadysafety/cdk-infrastructure/utils/tagging";
import * as stacks from "./stacks";
import { AppStackProps, CloudfrontCertificateStackProps, DnsStackProps } from "./stacks";

const app = new cdk.App();

const gitRepoName = "rrsTxCourseGuide";
const rootDomain = "txcourseguide.com";

const appConfig: Record<AppEnv, Omit<AppStackProps & CloudfrontCertificateStackProps & CloudfrontCertificateStackProps & DnsStackProps, "certificate" | "hostedZone">> = {
  [AppEnv.QA]: {
    appEnv: AppEnv.QA,
    env: CdkEnvironments[AppEnv.QA],
    crossRegionReferences: true,
    domainName: `qa.${rootDomain}`,
    googleVerificationTxt: "google-site-verification=EHjTUN2dhJOI6qyJK3s6Xj154bsSK2X189OeUjNpg5M",
    dkimValue: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArP/0BqH0bbQ3tQcPl73EK/AZcu704L8ebGefgG0DDiNBCSELZ5v46LKlbHOTXXUL7f9q33t2RDl23ZLzB7XhBwFCgFqducEp00TXURLxR1qM8LzwM+WKLa5PoapD6dSrJuyz/xdfgMwj8AVgdTRQghZzP8wZEqJwPYvGepIbKIIqKNUG875bQcGKvzzugHVIOOzrk3oY/nUUjU1xeqEI7Wi99cfBYsCv1a/rK0/tWXY26Bx5QlGuvDwKPpHYRf0tUcbmj6QAsTsa5Y9EuVcp7axOGA6/MqNjMXhKjtBanVh9x4XKRBbXNcZnqOHdPHRokOkt97ongW0C1LEH8aMpSwIDAQAB",
    dmarcPolicy: "reject",
  },
  [AppEnv.PROD]: {
    appEnv: AppEnv.PROD,
    env: CdkEnvironments[AppEnv.PROD],
    crossRegionReferences: true,
    domainName: rootDomain,
    googleVerificationTxt: "google-site-verification=0ZBx192zBIrLLL2A8BxDA58qCqT3a77ZOTBemty3CZM",
    existingHostedZoneId: "Z08769821BMPC7MBE1M1Z",
    dkimValue: "v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnmvgsGqsY7lwhgKGdoP2UhTz/KX8aE6a7n/bSbSoagWfJGVOmKPCiYr5vK+xG62RBF8l2i1KFRtDAoGBnWFsJ18Uh1KqXkoCyG/e84+iWjHBQxQDZ6DuSfGWYVnEO6g3JhmHZH2KnQ3LWuY3CZbjdILjM8aC0ypZapvORPiK59Xbmb0p3LLuvt2S7YQq+iDX6gJJpeQX675xGa1838DoQcq/PPfqBr+DS4VBDUMCRw+AygW9C3DuASOej5eWAjT2zWBvZs1NXNqOsDNEs00ecJr05uIo62Il1CXX6IvmZPS2KPuO1+jV1CHud1BGdw2Hah7ONDqF2tDtUNgnoTG9MQIDAQAB",
    dmarcPolicy: "reject",
    // Deploy QA DNS stack first, then paste the 4 NS record values here.
    subdomainDelegations: [
      {
        subdomain: "qa",
        nameServers: ["ns-1333.awsdns-38.org", "ns-433.awsdns-54.com", "ns-1944.awsdns-51.co.uk", "ns-731.awsdns-27.net"],
      },
    ],
  },
};

Object.values(AppEnv).forEach((env) => {
  const config = appConfig[env];

  const dnsStack = new stacks.DnsStack(app, `rrsTxCourseGuide-dns-${env}`, {
    ...config,
    env: config.env,
    subdomainDelegations: config.subdomainDelegations,
  });
  applyCdkTags(dnsStack, env, gitRepoName);

  const certStack = new stacks.CloudfrontCertificateStack(app, `rrsTxCourseGuide-cloudfront-certs-${env}`, {
    ...config,
    hostedZone: dnsStack.hostedZone,
    env: { account: config.env!.account, region: "us-east-1" },
  });
  certStack.addDependency(dnsStack);
  applyCdkTags(certStack, env, gitRepoName);

  const appStack = new stacks.AppStack(app, `rrsTxCourseGuide-app-${env}`, {
    ...config,
    env: config.env as Required<cdk.Environment>,
    hostedZone: dnsStack.hostedZone,
    certificate: certStack.certificate,
  });
  applyCdkTags(appStack, env, gitRepoName);
});
