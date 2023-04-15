import {
  FunctionRuntimeType,
  Functions,
  Provider,
} from '../../config/interface/serverless-config.interface';

export interface ProviderInterface {
  /**
   * fetch function names from config file
   * @param functions
   */
  fetchFunctionNames(functions?: Functions): string[];

  /**
   * fetch function's runtime info from config file
   * @param provider
   */
  fetchFunctionRuntime(provider?: Provider): FunctionRuntimeType;
}
