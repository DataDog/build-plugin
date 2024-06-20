// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

// #imports-injection-marker
import type { TelemetryOptions } from '@dd/telemetry-plugins/types';
import type * as telemetry from '@dd/telemetry-plugins';
// #imports-injection-marker

import type { UnpluginContextMeta, UnpluginOptions } from 'unplugin';

import type { TrackedFilesMatcher } from './plugins/git/trackedFilesMatcher';

export interface RepositoryData {
    hash: string;
    remote: string;
    trackedFilesMatcher: TrackedFilesMatcher;
}

export type GlobalContext = {
    auth?: AuthOptions;
    cwd: string;
    version: string;
    git?: RepositoryData;
    bundler: {
        name: string;
        config?: any;
    };
};

export type Meta = UnpluginContextMeta & {
    version: string;
};

export type GetPlugins<T> = (options: T, context: GlobalContext) => UnpluginOptions[];

export type LogLevel = 'debug' | 'warn' | 'error' | 'none';

export type AuthOptions = {
    apiKey?: string;
    endPoint?: string;
};

export interface GetPluginsOptions {
    auth?: AuthOptions;
    disableGit?: boolean;
    logLevel?: LogLevel;
}

export interface Options extends GetPluginsOptions {
    // Each product should have a unique entry.
    // #types-injection-marker
    [telemetry.CONFIG_KEY]?: TelemetryOptions;
    // #types-injection-marker
}

export type PluginName = `datadog-${Lowercase<string>}-plugin`;
