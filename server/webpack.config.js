import path from 'path';
import { fileURLToPath } from 'url';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);
export default {
  mode: 'production',
  entry: path.resolve(__dirname, 'index.ts'),
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: './tsconfig.json',
              onlyCompileBundledFiles: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
    extensions: ['.ts', '.js'],
  },
  target: 'node',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist/server/'),
  },
};
