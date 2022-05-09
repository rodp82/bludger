import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';


import { join } from 'path';

export class UiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Frontend
    const websiteBucket = new Bucket(this, 'BludgerUi', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    });

    new BucketDeployment(this, 'BludgerUiDeployment', {
      sources: [
        Source.asset(join(__dirname, '../../../../dist/apps/ui')),
      ],
      destinationBucket: websiteBucket,
    });


    new CfnOutput(this, 'FrontendUrl', {
      description: 'The url of the website',
      value: websiteBucket.bucketWebsiteUrl,
    });

  }
}
