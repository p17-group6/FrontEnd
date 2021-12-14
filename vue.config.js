/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
	devServer: {
		disableHostCheck: true
	},
	chainWebpack: config => {
		config.module
			.rule("mjs")
			.test(/\.mjs$/)
			.type("javascript/auto")
			.include.add(/node_modules/)
			.end();
	}
};
