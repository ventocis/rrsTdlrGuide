import { DnsZone } from "@roadreadysafety/cdk-infrastructure/constructs";
import * as cdk from "aws-cdk-lib";
import * as r53 from "aws-cdk-lib/aws-route53";
import type { Construct } from "constructs";

export interface SubdomainDelegation {
  /**
   * The subdomain to delegate (e.g. 'qa' for qa.txcourseguide.com).
   */
  subdomain: string;

  /**
   * The name servers of the delegated subdomain zone.
   */
  nameServers: string[];
}

export interface DnsStackProps extends cdk.StackProps {
  /**
   * The domain name for the hosted zone (e.g. 'txcourseguide.com' or 'qa.txcourseguide.com').
   */
  domainName: string;

  /**
   * If the hosted zone already exists (e.g. created when domain was purchased),
   * provide the zone ID to import it instead of creating a new one.
   */
  existingHostedZoneId?: string;

  /**
   * NS delegations from this zone to subdomain zones.
   */
  subdomainDelegations?: SubdomainDelegation[];
}

export class DnsStack extends cdk.Stack {
  readonly hostedZone: r53.IHostedZone;

  constructor(scope: Construct, id: string, props: DnsStackProps) {
    super(scope, id, props);

    const dnsZone = new DnsZone(this, "DnsZone", {
      zoneName: props.domainName,
      existingHostedZoneId: props.existingHostedZoneId,
    });

    this.hostedZone = dnsZone.hostedZone;

    props.subdomainDelegations?.forEach((delegation) => {
      new r53.NsRecord(this, `NsDelegation-${delegation.subdomain}`, {
        zone: this.hostedZone,
        recordName: `${delegation.subdomain}.${props.domainName}`,
        values: delegation.nameServers,
      });
    });
  }
}
