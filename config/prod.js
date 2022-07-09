module.exports = {
	env: {
		NODE_ENV: '"production"',
		HOST: '"https://api.cnpatrickstar.com"'
	},
	defineConstants: {},
	mini: {},
	h5: {
		/**
		 * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
		 * 参考代码如下：
		 * webpackChain (chain) {
		 *   chain.plugin('analyzer')
		 *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
		 * }
		 */
	},
	plugins: [
		[
			'taro-plugin-sync-in-wsl',
			{
				weapp: [
					{
						sourcePath: 'dist',
						outputPath: '/mnt/d/out/wejh'
					}
				]
			}
		]
	]
};
