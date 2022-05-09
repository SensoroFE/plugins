import { IApi } from 'umi';
import { dirname } from 'path';
import { resolveProjectDep } from './utils/resolveProjectDep';

export default (api: IApi) => {
  let pkgPath: string;

  try {
    pkgPath =
      resolveProjectDep({
        pkg: api.pkg,
        cwd: api.cwd,
        dep: '@sensoro-design/react',
      }) || dirname(require.resolve('@sensoro-design/react/package.json'));
  } catch (e) {}

  api.describe({
    key: 'sensoroDesign',
    config: {
      schema(Joi) {
        return Joi.object({
          // babel-plugin-import
          import: Joi.boolean(),
        });
      },
    },
    enableBy: api.EnableBy.config,
  });

  function checkPkgPath() {
    if (!pkgPath) {
      throw new Error(`Can't find @sensoro-design/react package. Please install @sensoro-design/react first.`);
    }
  }

  api.modifyAppData((memo) => {
    checkPkgPath();
    const version = require(`${pkgPath}/package.json`).version;
    memo.sensoroDesign = {
      pkgPath,
      version,
    };
    return memo;
  });

  api.modifyConfig((memo) => {
    checkPkgPath();

    // @sensoro-design/react import
    memo.alias['@sensoro-design/react'] = pkgPath;

    return memo;
  });

  // babel-plugin-import
  api.addExtraBabelPlugins(() => {
    return api.config.sensoroDesign.import && !api.appData.vite
      ? [
          [
            require.resolve('babel-plugin-import'),
            {
              libraryName: '@sensoro-design/react',
              libraryDirectory: 'es',
              style: (name: string) => {
                if (name === '@sensoro-design/lib/utils') {
                  return false;
                }
                return `${name}/style`;
              },
              camel2DashComponentName: false,
            },
          ],
        ]
      : [];
  });
}
