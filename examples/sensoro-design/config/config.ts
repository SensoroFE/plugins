import { defineConfig } from '@umijs/max';

export default defineConfig({
  hash: true,
  sensoroDesign: {
    import: true,
  },
  plugins: [require.resolve('@sensoro/umi-plugin-sensoro-design-react')],
  npmClient: 'pnpm'
});
