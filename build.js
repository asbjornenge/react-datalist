var babel = require('babel')
var path  = require('path')
require('mocha-stylus-compiler')
babel.transformFile(path.resolve(__dirname,'./src/ReactDataList.js'), {}, function(err, result) {
    console.log(result.code)
})
