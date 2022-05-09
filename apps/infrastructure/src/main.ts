import * as cdk from '@aws-cdk/core';
import { UiStack } from './stacks/ui-stack';
import { ApiStack } from './stacks/api-stack';

const app = new cdk.App();
new UiStack(app, 'BludgerUiStack');
new ApiStack(app, 'BludgerApiStack');
