"use strict";
// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.
Object.defineProperty(exports, "__esModule", { value: true });
const filterTreeMetrics = (metric) => 
// Remove tree metrics because way too verbose
!/modules\.tree\.(count|size)$/.test(metric.metric) ? metric : null;
const filterSourcemapsAndNodeModules = (metric) => metric.tags.some((tag) => 
// Remove sourcemaps.
/^assetName:.*\.map$/.test(tag) ||
    // Remove third parties.
    /^moduleName:\/node_modules/.test(tag))
    ? null
    : metric;
const filterMetricsOnThreshold = (metric) => {
    const thresholds = {
        size: 100000,
        count: 10,
        duration: 1000,
    };
    // Allow count for smaller results.
    if (/(entries|loaders|warnings|errors)\.count$/.test(metric.metric)) {
        thresholds.count = 0;
    }
    // Dependencies are huges, lets submit a bit less.
    if (/(modules\.(dependencies|dependents)$)/.test(metric.metric)) {
        thresholds.count = 30;
    }
    // Dependency tree calculation can output a lot of metrics.
    if (/modules\.tree\.count$/.test(metric.metric)) {
        thresholds.count = 150;
    }
    if (/modules\.tree\.size$/.test(metric.metric)) {
        thresholds.size = 1500000;
    }
    // We want to track entry size whatever their size.
    if (/entries\.size$/.test(metric.metric)) {
        thresholds.size = 0;
    }
    // We want to track entry module count whatever their number
    if (/entries\.modules\.count$/.test(metric.metric)) {
        thresholds.count = 0;
    }
    return metric.value > thresholds[metric.type] ? metric : null;
};
exports.defaultFilters = [
    filterTreeMetrics,
    filterSourcemapsAndNodeModules,
    filterMetricsOnThreshold,
];
exports.getMetric = (metric, opts) => ({
    type: 'gauge',
    tags: [...metric.tags, ...opts.tags],
    metric: `${opts.prefix ? `${opts.prefix}.` : ''}${metric.metric}`,
    points: [[opts.timestamp, metric.value]],
});
exports.flattened = (arr) => [].concat(...arr);
exports.getType = (name) => (name.includes('.') ? name.split('.').pop() : 'unknown');
