// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

import { getLogFn } from '@dd/core/log';
import { request } from 'https';
import type { ServerResponse } from 'http';

import { PLUGIN_NAME } from '../constants';
import type { MetricToSend, OptionsWithTelemetryEnabled } from '../types';

export const sendMetrics = (metrics: MetricToSend[], opts: OptionsWithTelemetryEnabled) => {
    const log = getLogFn(opts.logLevel, PLUGIN_NAME);

    if (!opts.auth?.apiKey) {
        log(`Won't send metrics to Datadog: missing API Key.`, 'warn');
        return;
    }

    if (!metrics || !metrics.length) {
        throw new Error('No metrics to send.');
    }

    const metricsNames = [...new Set(metrics.map((m) => m.metric))]
        .sort()
        .map((name) => `${name} - ${metrics.filter((m) => m.metric === name).length}`);

    // eslint-disable-next-line no-console
    log(`
Sending ${metrics.length} metrics.
Metrics:
    - ${metricsNames.join('\n    - ')}`);

    return new Promise((resolve, reject) => {
        const req = request({
            method: 'POST',
            hostname: opts.auth?.endPoint || 'app.datadoghq.com',
            path: `/api/v1/series?api_key=${opts.auth?.apiKey}`,
        });

        req.write(
            JSON.stringify({
                series: metrics,
            }),
        );

        req.on('response', (res: ServerResponse) => {
            if (!(res.statusCode >= 200 && res.statusCode < 300)) {
                // Untyped method https://nodejs.org/api/http.html#http_http_get_url_options_callback
                // Consume response data to free up memory
                // @ts-ignore
                res.resume();
                reject(`Request Failed.\nStatus Code: ${res.statusCode}`);
                return;
            }
            // Empty event required, otherwise the 'end' event is never emitted
            res.on('data', () => {});
            res.on('end', resolve);
        });

        req.on('error', reject);
        req.end();
    });
};
