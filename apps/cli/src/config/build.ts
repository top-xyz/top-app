import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  alias: {
    '@': './src',
    '@core': './src/core',
    '@modules': './src/modules',
    '@utils': './src/utils',
    '@config': './src/config',
    '@types': './src/types'
  }
}); 