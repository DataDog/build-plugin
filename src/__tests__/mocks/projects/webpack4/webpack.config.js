// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const {
    BuildPlugin
} = require('@datadog/build-plugin/dist/webpack');

module.exports = {
    context: __dirname,
    entry: {
        cheesecake: "./src/file0000.js",
        yolo: "./src/file0001.js"
    },
    plugins: [
        new BuildPlugin({
            output: './webpack-profile-debug',
        }),
    ],
    resolve:{
        plugins: [PnpWebpackPlugin]
    },
    resolveLoader: {
        plugins: [PnpWebpackPlugin.moduleLoader(module)]
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "[name].js",
        chunkFilename: "[name].[contenthash].js"
    }
};
