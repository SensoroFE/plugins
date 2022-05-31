import { join } from 'path';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import { Mustache, winPath } from 'umi/plugin-utils';
import { resolveProjectDep } from './utils';

import type { IApi } from 'umi';

export default (api: IApi) => {
  let pkgPath: string;

  try {
    pkgPath =
      resolveProjectDep({
        pkg: api.pkg,
        cwd: api.cwd,
        dep: 'lins-core',
      }) || dirname(require.resolve('lins-core/package.json'));
  } catch (e) {}

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
          dictionary: joi.array(),
          noLoginPaths: joi.string(),
        });
      },
    },
    enableBy: api.EnableBy.config
  });

  function checkPkgPath() {
    if (!pkgPath) {
      throw new Error(`Can't find lins-core package. Please install lins-core first.`);
    }
  }

  api.modifyConfig((memo) => {
    checkPkgPath();

    memo.alias['lins-core'] = pkgPath;
    return memo;
  });

  api.modifyAppData((memo) => {
    const version = require(`${pkgPath}/package.json`).version;
    memo.linsCore = {
      pkgPath,
      version,
    };
    return memo;
  });

  api.onGenerateFiles(async () => {
    // provider.tsx
    const coreTpl = readFileSync(
      join(winPath(__dirname), '../templates', 'Provider.tpl'),
      'utf-8',
    );

    const { dictionary = [], skipStateCheck = false, ...rest } = api.config.linsCore ?? {};

    api.writeTmpFile({
      path: `Provider.tsx`,
      content: Mustache.render(coreTpl, {
        config: JSON.stringify(rest ?? {}),
        dictionary: JSON.stringify(dictionary),
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
