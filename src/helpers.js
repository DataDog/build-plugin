exports.getPluginName = opts => (typeof opts === 'string' ? opts : opts.name);

exports.getMetric = (metric, opts) => ({
    type: 'gauge',
    tags: [...metric.tags, ...opts.defaultTags],
    metric: `${opts.prefix ? `${opts.prefix}.` : ''}${metric.metric}`,
    points: [[opts.timestamp, metric.value]]
});
// Format a module name by trimming the user's specific part out.
exports.getDisplayName = (name, context) =>
    name
        .split(context)
        .pop()
        // Remove loaders query
        .split('!')
        .pop()
        // Remove everything in front of /node_modules
        .replace(/(.*)?\/node_modules\//, '/node_modules/');

exports.formatModuleName = (name, context) =>
    name
        // Remove loaders query
        .split('!')
        .pop()
        // Webpack store its modules with a relative path
        // let's do the same so we can integrate better with it.
        .replace(context, '.');

// Find the module name and format it the same way as webpack.
exports.getModuleName = (module, context) => {
    let name = module.name || module.userRequest;
    if (!name) {
        try {
            name = module.issuer
                ? module.issuer.userRequest
                : // eslint-disable-next-line no-underscore-dangle
                  module._identifier;
        } catch (e) {
            name = 'no-name';
        }
    }
    return exports.formatModuleName(name, context);
};

// Format the loader's name by extracting it from the query.
// "[...]/node_modules/babel-loader/lib/index.js" => babel-loader
exports.formatLoaderName = loader =>
    loader.replace(
        /^.*\/node_modules\/(@[a-z0-9][\w-.]+\/[a-z0-9][\w-.]*|[^/]+).*$/,
        '$1'
    );

// Find a module's loaders names and format them.
exports.getLoaderNames = module =>
    (module.loaders || [])
        .map(l => l.loader || l)
        .map(exports.formatLoaderName);
