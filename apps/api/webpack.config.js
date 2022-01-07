var IgnorePlugin = require('webpack').IgnorePlugin;

var env = process.env.NODE_ENV?.trim() || 'development';

module.exports = (options) => {
  const lazyImports = [
    '@nestjs/microservices',
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    'class-validator',
    'class-transformer',
    'cache-manager'
  ];

  const config = {
    ...options,
    entry: (env === 'production') ? 'apps/api/src/lambda.ts' : 'apps/api/src/main.ts',
    externals: [],
    optimization: {
      minimize: false
    },
    plugins: [
      ...options.plugins,
      new IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };

  return config;
};
