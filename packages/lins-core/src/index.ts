import { join } from 'path';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import { Mustache, winPath } from 'umi/plugin-utils';
import { resolveProjectDep } from './utils';

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
          noLoginPaths: joi.string(),
        });
      },
    },
    enableBy: api.EnableBy.config
  });

  let pkgPath =
    resolveProjectDep({
      pkg: api.pkg,
      cwd: api.cwd,
      dep: 'lins-core',
    }) || dirname(require.resolve('lins-core'));

  api.modifyAppData((memo) => {
    const version = require(`${pkgPath}/package.json`).version;
    memo.pluginLayout = {
      pkgPath,
      version,
    };
    return memo;
  });

  api.modifyConfig((memo) => {
    memo.alias['lins-core'] = pkgPath;
    return memo;
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
    join(api.paths.absTmpPath, `plugin-${api.plugin.key}`, 'runtime.tsx')
  ]);
  api.addRuntimePluginKey(() => ['linsCore']);
}
