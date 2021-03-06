// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

import path from 'path';
import { outputJson } from 'fs-extra';

import { HooksContext } from '../types';
import { BuildPlugin } from '../webpack';

const output = async function output(this: BuildPlugin, { report, metrics, stats }: HooksContext) {
    if (typeof this.options.output === 'string') {
        const startWriting = Date.now();
        const outputPath = path.resolve(this.options.context!, this.options.output);

        try {
            const spaces = '  ';
            await outputJson(
                path.join(outputPath, 'timings.json'),
                {
                    tapables: report.timings.tapables,
                    loaders: report.timings.loaders,
                    modules: report.timings.modules,
                },
                { spaces }
            );
            this.log(`Wrote timings.json`);
            await outputJson(path.join(outputPath, 'dependencies.json'), report.dependencies, {
                spaces,
            });
            this.log(`Wrote dependencies.json`);
            await outputJson(
                path.join(outputPath, 'stats.json'),
                stats.toJson({ children: false }),
                { spaces }
            );
            this.log(`Wrote stats.json`);
            if (metrics) {
                await outputJson(path.join(outputPath, 'metrics.json'), metrics, { spaces });
                this.log(`Wrote metrics.json`);
            }
            this.log(`Wrote files in ${Date.now() - startWriting}ms.`);
        } catch (e) {
            this.log(`Couldn't write files. ${e.toString()}`, 'error');
        }
    }
};

export const hooks = { output };
