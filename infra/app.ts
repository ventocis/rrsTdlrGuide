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
    dkimValue: "v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnvEXNV+gEYUtLFXCInTm9bHQF4hBZX0dh0HMgO+8WVnuzvVv+UBgJlxJ7cKG0XXzHV0QcYGe6t/uUKY9EPRFYmXP3IHs6TKkHBoN0nxBvSSLWpER4sabLd+MVgz74pOz29WMs2nuG0uJSih1RchDaTYJOBv08QLlUInSA+0FVhZlAvNxZ3KST1qs9a/6GHD/y9IqWb492oIHdSmmzlq3lBJVCTuHv0jfLCM/yHy56+QZieETWg3ZGsXkJtHSh35av7DnPHdfyfdJ0lZQiWQjHJYdVYsNsL8/d1i/EbfpD9vhNtWpDRsj0JbXMokXz7ptmKua3JTLC8pPzX4WZTIVIQIDAQAB",
    dmarcPolicy: "reject",
  },
  [AppEnv.PROD]: {
    appEnv: AppEnv.PROD,
    env: CdkEnvironments[AppEnv.PROD],
    crossRegionReferences: true,
    domainName: rootDomain,
    googleVerificationTxt: "google-site-verification=0ZBx192zBIrLLL2A8BxDA58qCqT3a77ZOTBemty3CZM",
    existingHostedZoneId: "Z08769821BMPC7MBE1M1Z",
    dkimValue: "v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0A22yOKzvnf68B24wMGTjowha5H26NbSgMc1OCI1IGFyaTGxL1nB7efvjJmZI8wdZ0BJ8skbhWC+cZp7SFeRABoWuTKARK+L+Uh5LkRp86Sz+yqaYvE5Uc3iTXayFaNsK7O+xYP++1I0+g8r0lz5QyuFowROn/KNi0S+d7SOIWB+9l2PSsaCm4pj02FEVGrO15bJmfMIiOYZMD3vwxOnBsh80eDeuDDfTuzJe6zfvuRLD8MW5tJhh5sW5o6Rzr4QK1eoZA25T5TOpzvckALVULGvOVWKX1SRyW1mhZ5d7A+g/I0LtBdZKjMgt3U1y7YVnPwO62NiUDe2xNuEBNMoFQIDAQAB",
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
