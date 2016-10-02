import path from 'path';
import webpack from 'webpack';
import cssnext from 'postcss-cssnext';
import postcssFocus from 'postcss-focus';
import postcssReporter from 'postcss-reporter';

import getDotenv from '../src/universal/utils/dotenv';
import HappyPack from 'happypack';
import {platform} from 'os';
getDotenv();

const root = process.cwd();
const clientInclude = [path.join(root, 'src', 'client'), path.join(root, 'src', 'universal')];
const globalCSS = path.join(root, 'src', 'universal', 'styles', 'global');
const srcDir = path.join(root, 'src');

const babelQuery = {
  plugins: [
    ['transform-decorators-legacy'],
    ['inline-import'],
    ['react-transform', {
      transforms: [{
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module'],
      }, {
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react'],
      }],
    }],
  ],
};
console.log('hoo:' + babelQuery.toString());
export default {
  devtool: 'eval',
  context: srcDir,
  entry: {
    app: [
      'eventsource-polyfill',
      'babel-polyfill',
      'react-hot-loader/patch',
      'client/client.js',
      'webpack-hot-middleware/client',
    ],
  },
  output: {
    filename: 'app.js',
    chunkFilename: '[name]_[chunkhash].js',
    path: path.join(root, 'build'),
    publicPath: '/static',
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [
          postcssFocus(), // Add a :focus to every :hover
          cssnext({ // Allow future CSS features to be used, also auto-prefixes the CSS...
            browsers: ['last 2 versions', 'IE > 10'], // ...based on this browser list
          }),
          postcssReporter({ // Posts messages from plugins to the terminal
            clearMessages: true,
          }),
        ],
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__PRODUCTION__': false,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.EnvironmentPlugin([
      'PROTOCOL',
      'HOST',
      'PORT',
    ]),
    new HappyPack({
      loaders: ['babel'],
      threads: 4,
    }), // wait some days fix this problem
  ],
  resolve: {
    extensions: ['.js', '.gql'],
    modules: [srcDir, 'node_modules'],
  },
  node: {
    dns: 'mock',
    net: 'mock',
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.txt$/, loader: 'raw-loader'},
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/, loader: 'url-loader?limit=10000'},
      {test: /\.(eot|ttf|wav|mp3)$/, loader: 'file-loader'},
      {
        test: /\.css$/,
        loader: 'style!css',
        include: globalCSS,
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss',
        exclude: globalCSS,
        include: clientInclude,
      },
      {
        test: /\.js$/,
        loader: 'babel',
        query: babelQuery,
        include: clientInclude,
      },

    ],
  },
};
