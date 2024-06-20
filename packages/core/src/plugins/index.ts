// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

import type { Meta, Options } from '../types';

import { getGlobalContextPlugin } from './global-context';

export const getInternalPlugins = (options: Options, meta: Meta) => {
    const { globalContext, globalContextPlugin } = getGlobalContextPlugin(options, meta);

    return { globalContext, internalPlugins: [globalContextPlugin] };
};
