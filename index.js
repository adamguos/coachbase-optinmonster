var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

var authKey =
		'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';
var sendGridListId = 69751;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/', function(req, res) {
	console.log(req.body);

	var str = JSON.stringify([{
		'email': req.body.email
	}]);

	request.post({
		headers: {'Authorization': 'Bearer ' + authKey},
		url: 'https://api.sendgrid.com/v3/contactdb/recipients',
		body: str
	}, function(err, res, body) {
		console.log('Status code ' + res.statusCode);
		console.log('SendGrid response: ' + body);

		var obj = JSON.parse(body);
		var id = obj.persisted_recipients;

		request.post({
			headers: {'Authorization': 'Bearer ' + authKey},
			url: 'https://api.sendgrid.com/v3/contactdb/lists/' + sendGridListId + '/recipients/' + id,
		}, function(err, res, body) {
			console.log('Status code ' + res.statusCode);
			console.log('SendGrid response: ' + body + '\n');
		});
	});

	res.redirect(req.body.url);
})

/*var server = http.createServer(app, function(req, res) {
	if (req.method == 'POST') {
		var body = '';

		req.on('data', function(data) {
			body += data;
		});
		req.on('end', function() {
			console.log(body);

			var obj = JSON.parse(body);
			var str = JSON.stringify([{
				'email': obj.email
			}]);

			request.post({
				headers: {'Authorization': 'Bearer ' + authKey},
				url: 'https://api.sendgrid.com/v3/contactdb/recipients',
				body: str
			}, function(err, res, body) {
				console.log('Status code ' + res.statusCode);
				console.log('SendGrid response: ' + body);

				var obj = JSON.parse(body);
				var id = obj.persisted_recipients;

				request.post({
					headers: {'Authorization': 'Bearer ' + authKey},
					url: 'https://api.sendgrid.com/v3/contactdb/lists/' + sendGridListId + '/recipients/' + id,
				}, function(err, res, body) {
					console.log('Status code ' + res.statusCode);
					console.log('SendGrid response: ' + body + '\n');
				});
			});

			res.writeHead(200, {
				'Content-Type': 'text/plain',
				Location: body.url
			});
			res.end('Received');
		});
	}
});

server.listen(port);*/

var server = app.listen(port);
