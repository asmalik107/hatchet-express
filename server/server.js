var express = require('express');
var path = require('path');

var isDev = process.env.NODE_ENV !== 'production';
var port = process.env.PORT || 3000;

var app = express();

console.log(isDev);


if (isDev) {
    var webpack = require('webpack');
    var webpackMiddleware = require('webpack-dev-middleware');
    var config = require('../webpack.config.js');
    var webpackHotMiddleware = require('webpack-dev-middleware');

    var compiler = webpack(config);

    app.use(express.static(__dirname + '../dist'));
    app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true,
            progress:true
        }
    }));
    app.use(webpackHotMiddleware(compiler));

} else {
    var publicPath = path.resolve(__dirname, '../dist');
    app.use(express.static(publicPath));
}

var router = express.Router();


router.get('/test', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api/v1', router);

app.listen(port, function () {
    console.log('Server running on port: ' + 3000);
});

