// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

import { Metafile } from 'esbuild';
import { formatModuleName, getDisplayName } from '../helpers';
import { LocalModule, LocalOptions } from '../types';

const modulesMap: { [key: string]: LocalModule } = {};

const getDefaultLocalModule = (name: string): LocalModule => ({
    name: getDisplayName(name),
    chunkNames: [],
    size: 0,
    dependencies: [],
    dependents: [],
});

export const getModulesResults = (options: LocalOptions, esbuildMeta?: Metafile) => {
    const context = options.context;
    if (!esbuildMeta) {
        return {};
    }

    // Indexing chunks so we can access them faster.
    const outputs = esbuildMeta.outputs;
    const chunkIndexedSets: Record<string, Set<string>> = {};
    const chunkIndexed: Record<string, string[]> = {};
    const parseModules = (chunkName: string, moduleName: string) => {
        const formatedModuleName = formatModuleName(moduleName, context);
        chunkIndexedSets[formatedModuleName] = chunkIndexedSets[formatedModuleName] || new Set();
        const formatedChunkName = chunkName.split('/').pop()?.split('.').shift() || 'unknown';
        chunkIndexedSets[formatedModuleName].add(formatedChunkName);

        if (outputs[moduleName] && outputs[moduleName].inputs.length) {
            for (const inputModuleName of Object.keys(outputs[moduleName].inputs)) {
                parseModules(moduleName, inputModuleName);
            }
        }
    };

    for (const [chunkName, chunk] of Object.entries(outputs)) {
        for (const moduleName of Object.keys(chunk.inputs)) {
            parseModules(chunkName, moduleName);
        }
    }

    for (const key of Object.keys(chunkIndexedSets)) {
        chunkIndexed[key] = Array.from(chunkIndexedSets[key]);
    }

    for (const [path, obj] of Object.entries(esbuildMeta.inputs)) {
        const moduleName = formatModuleName(path, context);
        const module: LocalModule = modulesMap[moduleName] || getDefaultLocalModule(moduleName);

        module.size = obj.bytes;
        if (chunkIndexed[moduleName]) {
            module.chunkNames = chunkIndexed[moduleName];
        }

        for (const dependency of obj.imports) {
            const depName = formatModuleName(dependency.path, context);
            module.dependencies.push(depName);
            const depObj: LocalModule = modulesMap[depName] || getDefaultLocalModule(depName);
            depObj.dependents.push(moduleName);
            modulesMap[depName] = depObj;
        }

        modulesMap[moduleName] = module;
    }
    return modulesMap;
};
