// import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
// import { Bucket } from '@aws-cdk/aws-s3';
// import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';


import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { AllowedMethods, Distribution, OriginAccessIdentity, SecurityPolicyProtocol, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { join } from 'path';

export interface StaticSiteProps extends StackProps {
  domainName: string;
  siteSubDomain: string;
}

export class UiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StaticSiteProps) {
    super(scope, id, props);

    const zone = HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });
    const siteDomain = props.siteSubDomain + '.' + props.domainName;
    const cloudfrontOAI = new OriginAccessIdentity(this, 'cloudfront-OAI', {
      comment: `OAI for BludgerUi`
    });

    new CfnOutput(this, 'Site', { value: 'https://' + siteDomain });

    // Content bucket
    const siteBucket = new Bucket(this, 'BludgerUiBucket', {
      bucketName: siteDomain,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,

      /**
       * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
       */
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code

      /**
       * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
       * setting will enable full cleanup of the demo.
       */
      autoDeleteObjects: true, // NOT recommended for production code
    });

    // Grant access to cloudfront
    siteBucket.addToResourcePolicy(new PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));
    new CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

    // TLS certificate
    const certificate = new DnsValidatedCertificate(this, 'BludgerUiCertificate', {
      domainName: siteDomain,
      hostedZone: zone,
      region: 'us-east-1', // Cloudfront only checks this region for certificates.
    });
    new CfnOutput(this, 'Certificate', { value: certificate.certificateArn });


    // CloudFront distribution
    const distribution = new Distribution(this, 'BludgerUiDistribution', {
      certificate: certificate,
      defaultRootObject: "index.html",
      domainNames: [siteDomain],
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: '/error.html',
          ttl: Duration.minutes(30),
        }
      ],
      defaultBehavior: {
        origin: new S3Origin(siteBucket, { originAccessIdentity: cloudfrontOAI }),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }
    })

    new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

    // Route53 alias record for the CloudFront distribution
    new ARecord(this, 'BludgerUiAliasRecord', {
      recordName: siteDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone
    });

    // Deploy site contents to S3 bucket
    new BucketDeployment(this, 'BludgerUiDeployWithInvalidation', {
      sources: [Source.asset('../../dist/apps/ui')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
