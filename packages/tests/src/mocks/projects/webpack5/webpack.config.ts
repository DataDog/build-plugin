// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

import webpackPlugin from '@datadog/webpack-plugin';
import path from 'path';

const config = {
    context: __dirname,
    entry: {
        cheesecake: './src/file0000.js',
        yolo: './src/file0001.js',
    },
    plugins: [
        webpackPlugin({
            auth: {
                apiKey: '',
                appKey: '',
            },
            telemetry: {
                output: './webpack-profile-debug',
            },
        }),
    ],
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
        chunkFilename: '[name].[contenthash].js',
    },
};

export default config;
