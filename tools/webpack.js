'use strict';

const path = require('path');
const qs = require('qs');
const webpack = require('webpack');
const Clean = require('clean-webpack-plugin');
const WrapperPlugin = require('wrapper-webpack-plugin');

const CWD = process.cwd();
const NODE_MODULES = path.join(CWD, 'node_modules');
const PACKAGE = require(path.join(CWD, 'package.json'));
const ENTRY = path.join(CWD, 'src/index.js');
const DIST = path.join(CWD, 'dist');
const SRC = path.dirname(ENTRY);

const loader = name => `${name}-loader?${qs.stringify(require(`.\/${name}`), {
    encode: false,
    arrayFormat: 'brackets'
})}`;

module.exports = {
    devtool: 'source-map',
    entry: [ENTRY],
    output: {
        path: DIST,
        filename: 'dist.js',
        publicPath: '/',
        library: PACKAGE.name,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        modules: [NODE_MODULES],
        extensions: ['.js', '.jsx'],
    },
    resolveLoader: {
        modules: [NODE_MODULES]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [SRC],
                exclude: /(node_modules)/,
                use: [
                    {loader: loader('babel')},
                ]
            },
        ]
    },
    plugins: [
        new Clean([DIST], {root: CWD}),
        new WrapperPlugin({
            header: 'var __is__dev__ = process.env.NODE_ENV !== "production";\n\n',
            footer: ''
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false},
            sourceMap: true
        })
    ]
};
