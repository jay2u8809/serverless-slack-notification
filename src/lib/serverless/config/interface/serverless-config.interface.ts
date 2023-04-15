import {
  AwsLambdaArchitectureType,
  AwsLambdaRuntimeType,
  AwsRegionType,
} from '../../providers/aws/config/interface/aws-config.interface';

export type ProviderType = 'aws';
export type FunctionRuntimeType = AwsLambdaRuntimeType;
export type RegionType = AwsRegionType;
export type ArchitectureType = AwsLambdaArchitectureType;

export interface Provider {
  name: ProviderType;
  runtime: FunctionRuntimeType;
  region: RegionType;
  architecture: ArchitectureType;
  stage: string;
}
export interface Functions {
  [key: string]: {
    name: string;
  };
}
export interface Custom {
  name: string;
  Error: Error;
  errorCode: string;
}
export interface ServerlessService {
  service: string;
  provider: Provider;
  functions: Functions;
  custom: Custom;
}
export interface ServerlessApp {
  service: ServerlessService;
}

// serverless framework cli options
export type Options = CliOptions;
interface CliOptions {
  stage: string;
  region: RegionType;
  config: string;
  functions: string;
}

export interface Serverless {
  app: ServerlessApp;
  options: Options;
}

export interface Hooks {
  [key: string]: () => void;
}
export const EventLifecycles = {
  BeforeDeploy: 'before:deploy:deploy',
  AfterDeploy: 'after:deploy:deploy',

  BeforePackageInit: 'before:package:initialize',
  PackageInit: 'package:initialize',
  AfterPackageInit: 'after:package:initialize',

  BeforePackageCreateDeploymentArtifacts:
    'before:package:createDeploymentArtifacts',
  PackageCreateDeploymentArtifacts: 'package:createDeploymentArtifacts',
  AfterPackageCreateDeploymentArtifacts:
    'after:package:createDeploymentArtifacts',
};
