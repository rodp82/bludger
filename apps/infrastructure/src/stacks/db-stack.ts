import { CfnOutput, Construct, Duration, Stack, StackProps } from '@aws-cdk/core';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Code, Function, LayerVersion, Runtime } from '@aws-cdk/aws-lambda';

import { join } from 'path';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Backend
    const lambda = new Function(this, 'HomeBudgetApiLambda', {
      code: Code.fromAsset(join(__dirname, '../../../../dist/apps/api')),
      handler: 'main.handler',
      runtime: Runtime.NODEJS_14_X,
      memorySize: 1024,
      timeout: Duration.seconds(5),
    });

    const httpApi = new HttpApi(this, 'HomeBudgetApiGateway', {
      description: 'HTTP API Gateway',
      defaultAuthorizationScopes: [],
    });

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.PUT,
        HttpMethod.DELETE,
      ],
      integration: new HttpLambdaIntegration('HomeBudgetApiLambdaIntegration', lambda),
    });

    new CfnOutput(this, 'ApiUrl', {
      description: 'The url of the API',
      value: httpApi.apiEndpoint,
    });
  }
}