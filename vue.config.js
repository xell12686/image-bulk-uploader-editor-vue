const path = require('path')

module.exports = {
    chainWebpack: config => {
        config.plugin('copy')
            .tap(args => {
                args[0].push({
                    from: path.resolve(__dirname, 'src/assets/img'),
                    to: path.resolve(__dirname, 'dist/img'),
                    toType: 'dir',
                    ignore: ['.DS_Store']
                })
                return args
            })
    },
    filenameHashing: false,
    css: {
        sourceMap: true,
        loaderOptions: {
            sass: {
                additionalData: `@import '@/scss/app.scss';`
            }
        }
    }
}