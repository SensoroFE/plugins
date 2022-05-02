import { join } from 'path';
import { readFileSync } from 'fs';
import { Mustache, winPath } from 'umi/plugin-utils';

import type { IApi } from 'umi';

export default (api: IApi) => {

  api.describe({
    key: 'linsCore',
    config: {
      schema(joi) {
        return joi.object({
          baseUrl: joi.string(),
          scoketUrl: joi.string(),
          request: joi.object(),
          service: joi.object({
            prefix: joi.string(),
          }),
        });
      },
    },
    enableBy: api.EnableBy.config
  });

  api.onGenerateFiles(async () => {
    // provider.tsx
    const coreTpl = readFileSync(
      join(winPath(__dirname), '../templates', 'Provider.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: `Provider.tsx`,
      content: Mustache.render(coreTpl, {
        config: JSON.stringify(api.config.linsCore ?? {}),
      }),
    });

    // runtime.tsx
    const runtimeTpl = readFileSync(
      join(__dirname, '../templates', 'runtime.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      path: `runtime.tsx`,
      content: Mustache.render(runtimeTpl, {}),
    });
  })

  // Runtime Plugin
  api.addRuntimePlugin(() => [
    join(api.paths.absTmpPath, api.plugin.key, 'runtime.tsx')
  ]);
  api.addRuntimePluginKey(() => ['linsCore']);
}
