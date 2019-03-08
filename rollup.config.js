import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

export default [
  // browser-friendly UMD build, with GatherStub
  {
    input: 'src/index.browser.ts',
    output: {
      name: 'Gather',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [commonjs(), resolve(), typescript(), uglify()],
  },
  // CommonJS and ES
  {
    input: 'src/gather.ts',
    external: ['ms'],
    plugins: [typescript()],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
