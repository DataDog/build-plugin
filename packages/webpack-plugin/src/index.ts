// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

// This file is partially generated.
// Anything between #types-export-injection-marker
// will be updated using the 'yarn cli integrity' command.

import { buildPluginFactory } from '@dd/factory';

import pkg from '../package.json';

export const datadogWebpackPlugin = buildPluginFactory({
    version: pkg.version,
}).webpack;

export { helpers } from '@dd/factory';

export type { Options as EsbuildPluginOptions } from '@dd/core/types';

export type {
    // #types-export-injection-marker
    TelemetryTypes,
    // #types-export-injection-marker
} from '@dd/factory';
