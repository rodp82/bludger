import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { Construct } from 'constructs';
import { join } from 'path';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // DB


    // Lambda
    const layer = new LayerVersion(this, 'BludgerLambdaLayer', {
      compatibleRuntimes: [Runtime.NODEJS_14_X],
      code: Code.fromAsset(join(__dirname, '../../../../libs/layers')),
      description: 'Includes NestJS and AWS-SDK v3',
    });

    const lambda = new NodejsFunction(this, 'BludgerApiLambda', {
      entry: join(__dirname, '../../../../dist/apps/api/main.js'),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 1024,
      timeout: Duration.seconds(5),
      environment: {

      },
      layers: [layer],
      bundling: {
        externalModules: [
          // '@aws-sdk/client-apigatewaymanagementapi',
          // '@aws-sdk/client-dynamodb',
          // '@aws-sdk/client-eventbridge',
          // '@aws-sdk/client-iam',
          // '@aws-sdk/client-s3',
          // '@aws-sdk/client-schemas',
          // '@aws-sdk/client-secrets-manager',
          // '@azure/msal-node',
          '@nestjs/common',
          '@nestjs/core',
          // '@nestjs/config',
          // '@nestjs/passport',
          '@nestjs/mapped-types',
          '@nestjs/microservices',
          '@nestjs/platform-express',
          '@vendia/serverless-express',
          'cache-manager',
          'class-transformer',
          'class-validator',
          'express',
          // 'joi',
          // 'jsonwebtoken',
          // 'lodash',
          // 'passport',
          // 'passport-azure-ad',
          'reflect-metadata',
          'rxjs',
          'source-map-support',
        ],
      },
    });

    const api = new LambdaRestApi(this, 'BludgerApiGateway', {
      description: 'HTTP API Gateway',
      // defaultAuthorizationScopes: [],
      handler: lambda

    });

    // httpApi.addRoutes({
    //   path: '/{proxy+}',
    //   methods: [
    //     HttpMethod.GET,
    //     HttpMethod.POST,
    //     HttpMethod.PUT,
    //     HttpMethod.DELETE,
    //   ],
    //   integration: new HttpLambdaIntegration('BludgerApiLambdaIntegration', lambda),
    // });

    new CfnOutput(this, 'ApiUrl', { description: 'The url of the API', value: api.url });
  }
}
