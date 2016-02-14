var express = require('express');
var path = require('path');


var app = express();

var port = process.env.PORT || 3000;

var publicPath = path.resolve(__dirname, '../dist');
app.use(express.static(publicPath));

console.log('publicPath', publicPath);

app.listen(port, function () {
    console.log('Server running on port: ' + 3000);
});