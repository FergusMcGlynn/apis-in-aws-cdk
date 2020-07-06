import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apiGateway from '@aws-cdk/aws-apigateway';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const fetchDataLambda = new lambda.Function(this, 'apiDemoFetchDataFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset("../fetchDataLambda"),
    });

    new apiGateway.LambdaRestApi(this, 'apiDemoRestApi', {
      handler: fetchDataLambda,
    });

  }
}
