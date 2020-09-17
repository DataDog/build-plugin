describe('Modules', () => {
    test('It should filter modules the same with Webpack 5 and 4', () => {
        const { Modules } = require('../modules');

        const mockedModules = [
            {
                name: 'moduleWebpack4',
                dependencies: [
                    { name: 'dep1', module: { name: 'dep1' } },
                    { name: 'dep2' },
                    { name: 'dep3', module: { name: 'dep3' } },
                ],
            },
            {
                name: 'moduleWebpack5',
                dependencies: [{ name: 'dep1' }, { name: 'dep2' }, { name: 'dep3' }],
            },
        ];

        const mockCompilation = {
            moduleGraph: {
                getModule(dep: any) {
                    return mockedModules[0].dependencies.find(
                        (d) => d.name === dep.name && d.module
                    );
                },
            },
        };

        const modules = new Modules();
        modules.afterOptimizeTree({}, mockedModules, '/', mockCompilation);
        const modulesWebpack4 = modules.storedModules['moduleWebpack4'].dependencies;
        const modulesWebpack5 = modules.storedModules['moduleWebpack5'].dependencies;

        expect(modulesWebpack5.length).toBe(modulesWebpack4.length);
    });
});