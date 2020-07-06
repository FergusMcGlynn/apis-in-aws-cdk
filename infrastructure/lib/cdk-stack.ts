import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apiGateway from '@aws-cdk/aws-apigateway';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // set up a lambda using the source code in 'fetchDataLambda' project
    const fetchDataLambda = new lambda.Function(this, 'apiDemoFetchDataFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset("../fetchDataLambda"),
    });

    // set up a REST API
    const api = new apiGateway.RestApi(this, 'apiDemoRestApi');

    // define a /courses endpoint for the REST API
    const coursesEndpoint = api.root.addResource('courses');

    // handle GET requests to the /courses endpoint with the lambda
    coursesEndpoint.addMethod('GET', new apiGateway.LambdaIntegration(fetchDataLambda));

  }
}
