import { defineConfig } from '@umijs/max';
import { routes } from './routes';

export default defineConfig({
  routes,
  hash: true,
  model: {},
  antd: {},
  initialState: {},
  linsCore: {
    baseUrl: 'https://lins-test1-api.sensoro.com'
  },
  plugins: [require.resolve('@sensoro/umi-plugin-lins-core')],
  npmClient: 'pnpm'
});
