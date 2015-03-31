var http = require('http');
var https = require('https');

exports.getJSON = function(options, onResult)
{
    var prot = options.port == 443 ? https : http;
    var request = prot.request(options, function(response)
    {
        var output = '';
        response.setEncoding('utf8');

        response.on('data', function (chunk) {
            output += chunk;
        });

        response.on('end', function() {
            var obj = JSON.parse(output);
            var sendingObject={dumpData:obj};
            if(response.statusCode==200)
            	sendingObject.code=1;
            onResult(response.statusCode, sendingObject);
        });
    });

    request.on('error', function(err) {
        //res.send('error: ' + err.message);
    });
    request.end();
};
