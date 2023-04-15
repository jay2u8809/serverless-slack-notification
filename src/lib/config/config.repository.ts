import { Config, CONFIG_TITLE } from './interface/config.interface';
import {
  Custom,
  Functions,
  Provider,
  ServerlessService,
} from '../serverless/config/interface/serverless-config.interface';

export class ConfigRepository {
  private static CUSTOM: Custom;
  private static PROVIDER: Provider;
  private static FUNCTIONS: Functions;

  public static setConfig(serverless: ServerlessService): boolean {
    return (
      !!ConfigRepository.setCustom(serverless.custom) &&
      !!ConfigRepository.setProvider(serverless.provider) &&
      !!ConfigRepository.setFunctions(serverless.functions)
    );
  }

  public static getCustom(): Config {
    return <Config>ConfigRepository.CUSTOM;
  }

  public static getProvider(): Provider {
    return <Provider>ConfigRepository.PROVIDER;
  }

  public static getFunctions(): Functions {
    return <Functions>ConfigRepository.FUNCTIONS;
  }

  // === private ===
  private static setCustom(custom: Custom): Custom {
    ConfigRepository.CUSTOM = custom[CONFIG_TITLE] as Config;
    return ConfigRepository.CUSTOM;
  }

  private static setProvider(provider: Provider): Provider {
    ConfigRepository.PROVIDER = { ...provider };
    return ConfigRepository.PROVIDER;
  }

  private static setFunctions(functions: Functions): Functions {
    ConfigRepository.FUNCTIONS = { ...functions };
    return ConfigRepository.FUNCTIONS;
  }
}
