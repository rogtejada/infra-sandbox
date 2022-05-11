import * as cdk from '@aws-cdk/core';
import { Bucket, BlockPublicAccess } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution, OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucket = new Bucket(this, 'ReactAppBucket', {
      bucketName: 'simple-app',
      websiteIndexDocument: 'index.html',
      blockPublicAccess: new BlockPublicAccess({ restrictPublicBuckets: false })
    });

    this.deployApp(bucket);

    // set up cloudfront
    const cloudFrontOai = new OriginAccessIdentity(this, 'OAI');
    const distribution = this.createCloudFrontDistribution(bucket, cloudFrontOai);

    // grant read permissions to cloud front
    bucket.grantRead(cloudFrontOai.grantPrincipal);
  }

  private deployApp(bucket: Bucket): BucketDeployment {
    return new BucketDeployment(this, 'DeployFiles', {
      sources: [Source.asset('../app/build')],
      destinationBucket: bucket,
    });
  }

  private createCloudFrontDistribution(bucket: Bucket, cloudFrontOai: OriginAccessIdentity): CloudFrontWebDistribution {
    return new CloudFrontWebDistribution(this, 'ReactAppDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: cloudFrontOai,
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    })
  }
}
