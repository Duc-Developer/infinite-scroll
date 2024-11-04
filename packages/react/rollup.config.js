import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../../.env') });

const isProduction = process.env.NODE_ENV === 'production';

export default {
    input: 'src/index.tsx',
    output: [
        {
            file: 'dist/index.js',
            format: 'esm',
            sourcemap: !isProduction,
        },
    ],
    external: ['react', 'react-dom'],
    plugins: [
        postcss({
            modules: {
                generateScopedName: isProduction ? '[hash:base64]' : '[name]__[local]___[hash:base64:5]',
            },
            extract: 'styles/index.css',
            minimize: true,
            inject: false,
            extensions: ['.css']
          }),
        resolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' }),
        isProduction && terser(),
    ],
};