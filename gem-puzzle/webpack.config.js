const path = require('path');
const HTMLWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// const TerserWebpackPlugin = require('terser-webpack-plugin');
// const { loader } = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

// const optimization = () => {
//   const config = {
//     splitChunks: {
//       chunks: 'all',
//     },
//   };

//   if (isProd) {
//     config.minimizer = [
//       new OptimizeCssAssetWebpackPlugin(),
//       new TerserWebpackPlugin(),
//     ];
//   }

//   return config;
// };

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
      ],
    },
  }];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'production',
  entry: ['@babel/polyfill', './js/Game.js'],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/dist/',
  },
  resolve: {
    extensions: ['.js', '.png', '.jpg', '.jpeg', '.wav'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // optimization: optimization(),
  devServer: {
    port: 4200,
  },
  // devtool: isDev ? 'source-map' : '',
  plugins: [
    new HTMLWebPackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    // Plugin for coping files from dir to dir
    // new CopyWebpackPlugin([
    //   {
    //     from: '',
    //     to: ''
    //   }
    // ])
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|svg|wav)$/,
        use: ['file-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node-modules/,
        use: jsLoaders(),
      },
    ],
  },
};
