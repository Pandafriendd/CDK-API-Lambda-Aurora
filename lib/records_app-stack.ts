import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';

//REPLACE THIS
const dbARN = "arn:aws:rds:ap-south-1:457175632986:cluster:db-blog";
//REPLACE THIS
const dbSecretARN = "arn:aws:secretsmanager:ap-south-1:457175632986:secret:rds-db-credentials/db-blog-44Xlmk";


export class RecordsAppStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);
    
    
    const lambdaRole = new iam.Role(this, 'AuroraServerlessBlogLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonRDSDataFullAccess'),
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
        ]
    });

    const handler = new lambda.Function(this, "RecordsHandler", {
     role: lambdaRole,
     runtime: lambda.Runtime.NODEJS_12_X, // So we can use async in widget.js
     code: lambda.Code.asset("resources"),
     handler: "records.main",
     environment: {
       TABLE: dbARN,
       TABLESECRET: dbSecretARN,
       DATABASE: "recordstore"
     }
   });
    
    const api = new apigateway.RestApi(this, "records-api", {
      restApiName: "Records Service",
      description: "This service serves records."
   });

    const getRecordsIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": 200 }' }
    });

    api.root.addMethod("GET", getRecordsIntegration); // GET /

    const record = api.root.addResource("{id}");
    const postRecordIntegration = new apigateway.LambdaIntegration(handler);
    const getRecordIntegration = new apigateway.LambdaIntegration(handler);

    record.addMethod("POST", postRecordIntegration); // POST /{id}
    record.addMethod("GET", getRecordIntegration); // GET/{id}
  }
}