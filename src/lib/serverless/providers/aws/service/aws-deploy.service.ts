import { ProviderInterface } from '../../interface/provider-service.interface';
import {
  FunctionRuntimeType,
  Functions,
  Provider,
} from '../../../config/interface/serverless-config.interface';
import { AwsRegionType } from '../config/interface/aws-config.interface';
import { ConfigRepository } from '../../../../config/config.repository';

export class AwsDeployService implements ProviderInterface {
  public fetchFunctionNames(functions?: Functions): string[] {
    if (!functions && ConfigRepository.getCliOptions().functions)
      return [...ConfigRepository.getCliOptions().functions];
    return this.fetchAwsLambdaNames(
      functions || ConfigRepository.getFunctions(),
    );
  }

  public fetchFunctionRuntime(provider?: Provider): FunctionRuntimeType {
    return provider?.runtime || ConfigRepository.getProvider().runtime;
  }

  public fetchRegion(provider?: Provider): AwsRegionType {
    return provider?.region || ConfigRepository.getProvider().region;
  }

  // === private ===
  private fetchAwsLambdaNames(functions: Functions): string[] {
    return Object.values(functions).map((item) => item.name);
  }
}
