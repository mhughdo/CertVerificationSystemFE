const { ESBuildMinifyPlugin } = require('esbuild-loader');

function useEsbuildMinify(config, options) {
	const terserIndex = config.optimization.minimizer.findIndex(minimizer => (minimizer.constructor.name === 'TerserPlugin'));
	if (terserIndex > -1) {
		config.optimization.minimizer.splice(
			terserIndex,
			1,
			new ESBuildMinifyPlugin(options),
		);
	}
}


function useEsbuildLoader(config, options) {
	const jsLoader = config.module.rules.find(rule => rule.test && rule.test.test('.ts'));

	if (jsLoader) {
		jsLoader.use.loader = 'esbuild-loader';
		jsLoader.use.options = options;
	}
}

module.exports = {
   images: {
    domains: ['*.amazonaws.com', 'uet-cert-verification.s3-ap-southeast-1.amazonaws.com'],
  },
  future: {
    webpack5: true,
  },
  webpack: (config, { webpack }) => {
		config.plugins.push(
			new webpack.ProvidePlugin({
				React: 'react',
			}),
		);

		useEsbuildMinify(config);

		useEsbuildLoader(config, {
			loader: 'tsx',
			target: 'es6',
		});

		return config;
	},
  distDir: 'out',
  target: "experimental-serverless-trace",
}
