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
        dep: 'antd',
      }) || dirname(require.resolve('antd/package.json'));
  } catch (e) {}

  api.describe({
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
      throw new Error(`Can't find antd package. Please install antd first.`);
    }
  }

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
