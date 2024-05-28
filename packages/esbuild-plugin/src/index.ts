// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

import { buildPluginFactory } from '@dd/factory';

export const datadogEsbuildPlugin = buildPluginFactory().esbuild;

export { helpers } from '@dd/factory';

export type { Options as EsbuildPluginOptions } from '@dd/factory';
