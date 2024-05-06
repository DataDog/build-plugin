import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import modulePackage from 'module';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

/**
 * @param {import('rollup').RollupOptions} config
 * @returns {import('rollup').RollupOptions}
 */
const bundle = (config) => ({
    ...config,
    input: 'src/index.ts',
    external: ['webpack', 'esbuild', '@dd/tools', '@dd/tests', ...modulePackage.builtinModules],
    plugins: [
        babel({
            babelHelpers: 'bundled',
            include: ['src/**/*'],
        }),
        json(),
        commonjs(),
        nodeResolve({ preferBuiltins: true }),
        ...config.plugins,
    ],
    output: {
        exports: 'named',
        sourcemap: true,
        ...config.output,
    },
});

/**
 * @param {{module: string; main: string;}} packageJson
 * @returns {import('rollup').RollupOptions[]}
 */
export const getDefaultBuildConfigs = (packageJson) => [
    bundle({
        plugins: [esbuild()],
        output: {
            file: packageJson.module,
            format: 'esm',
        },
    }),
    bundle({
        plugins: [esbuild()],
        output: {
            file: packageJson.main,
            format: 'cjs',
        },
    }),
    bundle({
        plugins: [dts()],
        output: {
            dir: 'dist/src',
        },
    }),
];