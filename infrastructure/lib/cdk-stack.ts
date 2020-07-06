import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import { readFileSync } from 'fs';
import {ServicePrincipal} from "@aws-cdk/aws-iam";

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

    // allow lambda to be invoked by API Gateway
    fetchDataLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));

    // load the OpenAPI specification
    const openApiSpecJson = readFileSync("../openApiSpecification.json", 'utf8');
    const openApiSpec = JSON.parse(openApiSpecJson);

    // add lambda integration details for /courses endpoint to the specification
    openApiSpec["paths"]["/courses"]["get"]["x-amazon-apigateway-integration"] = {
      uri: `arn:aws:apigateway:${process.env.CDK_DEFAULT_REGION}:lambda:path/2015-03-31/functions/${fetchDataLambda.functionArn}/invocations`,
      type: "aws_proxy",
      httpMethod: "POST",  // note that lambda proxy integrations require "POST" http method (see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-swagger-extensions-integration.html)
      passthroughBehavior: "when_no_match"
    };

    // set up API based on OpenAPI specification
    new apiGateway.SpecRestApi(this, 'apiDemoRestApi', {
      apiDefinition: apiGateway.ApiDefinition.fromInline(openApiSpec),
    });

  }
}
