module.exports = {
	env: {
		NODE_ENV: '"development"',
		HOST: '"https://api.cnpatrickstar.com"'
	},
	defineConstants: {},
	mini: {},
	h5: {},
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
