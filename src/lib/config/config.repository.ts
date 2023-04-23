import { Config, CONFIG_TITLE } from './interface/config.interface';
import {
  Functions,
  Options,
  Provider,
  ServerlessService,
} from '../serverless/config/interface/serverless-config.interface';

export class ConfigRepository {
  private static SERVICE_NAME: string;
  private static CUSTOM: Config;
  private static PROVIDER: Provider;
  private static FUNCTIONS: Functions;
  private static CLI_OPTIONS: Options;

  public static setConfig(
    serverless: ServerlessService,
    cli?: Options,
  ): boolean {
    ConfigRepository.setCliOptions(cli);
    return (
      !!ConfigRepository.setServiceName(serverless.service) &&
      !!ConfigRepository.setCustom(serverless.custom) &&
      !!ConfigRepository.setProvider(serverless.provider) &&
      !!ConfigRepository.setFunctions(serverless.functions)
    );
  }

  public static getServiceName(): string {
    return ConfigRepository.SERVICE_NAME;
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

  public static getCliOptions(): Options {
    return <Options>ConfigRepository.CLI_OPTIONS;
  }

  // === private ===
  private static setServiceName(name: string): string {
    ConfigRepository.SERVICE_NAME = name;
    return ConfigRepository.SERVICE_NAME;
  }

  private static setCustom(custom: Config): Config {
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

  public static setCliOptions(cli: Options): Options {
    ConfigRepository.CLI_OPTIONS = { ...cli };
    return <Options>ConfigRepository.CLI_OPTIONS;
  }
}
