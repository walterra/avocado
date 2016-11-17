import eslint from 'rollup-plugin-eslint';

export default {
  entry: 'index.js',
  dest: 'build/avocado.js',
  format: 'umd',
  moduleName: 'avocado',
  sourceMap: 'inline',
  plugins: [
    eslint()
  ]
};