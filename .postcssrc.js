module.exports = {
    plugins: {
      'autoprefixer': {
        browsers: ['Android >= 4.0', 'iOS >= 8']
      },
      'postcss-pxtorem': {
        // 根据设计稿尺寸/10
        rootValue: (arg) => {
          return arg.file.includes("vant") ? 37.5 : 75
        },
        propList: ['*']
      }
    }
  }
  
  