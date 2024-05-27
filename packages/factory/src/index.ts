// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

/*
You should probably not touch this file.
It's mostly filled automatically with new plugins.
*/

import type { GetPluginsOptions, GetPluginsOptionsWithCWD } from '@dd/core/types';
// #imports-injection-marker

import type { OptionsWithTelemetryEnabled, TelemetryOptions } from '@dd/telemetry-plugins/types';
import {
    helpers as telemetryHelpers,
    getPlugins as getTelemetryPlugins,
    CONFIG_KEY as TELEMETRY_CONFIG_KEY,
} from '@dd/telemetry-plugins';
// #imports-injection-marker

import type { UnpluginContextMeta, UnpluginInstance, UnpluginOptions } from 'unplugin';
import { createUnplugin } from 'unplugin';

export interface Options extends GetPluginsOptions {
    // Each product should have a unique entry.
    // #types-injection-marker

    [TELEMETRY_CONFIG_KEY]?: TelemetryOptions;

    // #types-injection-marker
}

// This remains internal as we inject the cwd part only from here.
interface OptionsWithCWD extends Options, GetPluginsOptionsWithCWD {}

export const helpers = {
    // Each product should have a unique entry.
    // #helpers-injection-marker

    [TELEMETRY_CONFIG_KEY]: telemetryHelpers,

    // #helpers-injection-marker
};

export const buildPluginFactory = (): UnpluginInstance<Options, true> => {
    return createUnplugin((userOptions: Options, unpluginMetaContext: UnpluginContextMeta) => {
        // TODO: Implement config overrides with environment variables.
        const options: OptionsWithCWD = {
            cwd: process.cwd(),
            ...userOptions,
        };

        const plugins: UnpluginOptions[] = [];

        // Based on configuration add corresponding plugin.
        // #configs-injection-marker

        if (options[TELEMETRY_CONFIG_KEY] && options[TELEMETRY_CONFIG_KEY].disabled !== true) {
            plugins.push(...getTelemetryPlugins(options as OptionsWithTelemetryEnabled));
        }

        // #configs-injection-marker

        return plugins;
    });
};
