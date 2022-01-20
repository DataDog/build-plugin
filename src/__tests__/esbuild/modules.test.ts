// Unless explicitly stated otherwise all files in this repository are licensed under the MIT License.
// This product includes software developed at Datadog (https://www.datadoghq.com/).
// Copyright 2019-Present Datadog, Inc.

import { LocalModule } from '../../types';
import { getModulesResults } from '../../esbuild/modules';
import { Metafile } from 'esbuild';

const mockMetaFile: Metafile = {
    inputs: {
        module1: {
            bytes: 1,
            imports: [],
        },
    },
    outputs: {},
};

describe('getModulesResults', () => {
    test('It should add module size to the results', () => {
        const results = getModulesResults(mockMetaFile, '');
        for (const module of Object.values(results) as LocalModule[]) {
            expect(module.size).toBeDefined();
        }
    });
});
