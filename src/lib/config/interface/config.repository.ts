import { Custom } from '../../serverless/interface/serverless-config.interface';
import { Config, PluginConfig } from './config.interface';

export class ConfigRepository {
  static getPluginConfig(config: Custom): Config {
    console.debug('get-plugin-config', PluginConfig.title, config);
    return config[PluginConfig.title] as Config;
  }
}
