import { App } from 'aws-cdk-lib';
import { UiStack } from './stacks/ui-stack';
import { ApiStack } from './stacks/api-stack';

const env = {
  account: '218634853689',
  region: 'ap-southeast-2'
};

const app = new App();

new ApiStack(app, 'BludgerApiStack', {
  env: env
});

new UiStack(app, 'BludgerUiStack', {
  env: env,
  domainName: 'rodpattison.com',
  siteSubDomain: 'bludger',
});
