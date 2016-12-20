import eslint from 'rollup-plugin-eslint';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.js',
  dest: 'build/avocado.js',
  format: 'cjs',
  moduleName: 'avocado',
  sourceMap: 'inline',
  plugins: [
    eslint(),
    nodeResolve({
      jsnext: true
    })
  ]
};