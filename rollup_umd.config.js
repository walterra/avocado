import eslint from 'rollup-plugin-eslint';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.js',
  dest: 'build/avocado_umd.js',
  format: 'umd',
  moduleName: 'avocado',
  sourceMap: 'inline',
  plugins: [
    eslint(),
    nodeResolve({
      jsnext: true,
      browser: true
    })
  ]
};