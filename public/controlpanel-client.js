var username = null;
while(username == null) {
	username = window.prompt("What do you want to be called?", "Guest");
}
var values = [];

fs.readFile('../public/properities.txt', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	values = data.split("\n");
});
console.log("Creating socket...");
var socket = io('http://' + host + ":" + port);
$('form').submit(function(){
	socket.emit('chat message', { "msg": $('#m').val(), "user": username });
	$('#m').val('');
	console.log("Sent message");
	return false;
});
socket.on('chat message', function(data){
	$('#messages').append($('<li>').text(data.user + ": " + data.msg));
});