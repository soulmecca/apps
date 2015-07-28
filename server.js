var net = require('net');
var fs = require('fs');
var chalk = require('chalk');


var port = 3000;

var server = net.createServer(function(c){
	console.log('client connected');
	c.write('Hello Client\r\n');

	
	c.on('data', function(data){
		var read = fs.readFileSync('message.json', 'utf8');
		console.log(data.toString().trim())

		// show the all the stored messages by read
		if (data.toString() === 'read'){
			if(JSON.parse(read).length === 0){
				c.write("There is no message left")
			}else{
				var parsed = JSON.parse(read);
				c.write(chalk.cyan(".  *--------o--------*\n"+"---|  All Messages!  |---\n"+"   *--------o--------*"))
				parsed.forEach(function(val,idx){	
					c.write(JSON.stringify(idx)+". " +JSON.stringify(val[idx])+'\n')
				})	
			}
		}else if (data.toString() === 'commands'){
			c.write(",---. ,---. ,--,--,--.,--,--,--. ,--,--.,--,--,  ,-|  | ,---.\n| .--'| .-. ||        ||        |' ,-.  ||      \' .-. |(  .-'\n\ `--.' '-' '|  |  |  ||  |  |  |\ '-'  ||  ||  |\ `-' |.-'  `)\n`---' `--`--`--'`--`--`--' `--`--'`--''--' `---' `----'")
			c.write("1. read\n" + "2.delete "+ chalk.blue("number or all\n")+ "3.add "+chalk.blue("your message here"))
		}
		else if (data.toString().split(' ')[0] === 'delete'){

			if(JSON.parse(read).length === 0) {
				c.write('There is no message to delete')
			}
			else if(data.toString().split(' ')[1] === 'all' && (read.length != 0)) {
				var empty = [];
				fs.writeFile('message.json', JSON.stringify(empty));
				c.write("All message has been deleted")
			}
			else if(data.toString().split(' ')[1] != 'all' && (read.length != 0)) {
				var parsed = JSON.parse(read);
				parsed.splice(data.toString().split(' ')[1], 1);
				fs.writeFile('message.json', JSON.stringify(parsed));
				c.write("The message has been deleted")    
			}
		}
		// As a first time, a message will be stored in a message.json file.
		else if (data.toString().split(' ')[0] === 'add' && JSON.parse(read).length === 0) {
			var i = 0;
			var arr = [];
			var obj = {};
			obj[i] = data.toString();

			arr.push(obj);
			fs.writeFile('message.json', JSON.stringify(arr));
		}
		// From the second time, messages will be saved in the same json file.
		else if(data.toString().split(' ')[0] === 'add' && JSON.parse(read).length !== 0){
			var parsed = JSON.parse(read);
			var i = parseInt(Object.keys(parsed[parsed.length-1])) + 1;
			var obj = {};
			obj[i] = data.toString().split(' ')[1];
			parsed.push(obj);
			fs.writeFile('message.json', JSON.stringify(parsed));
		}
	});

	c.on('end', function(){
		console.log('client disconnected')
	});

});

server.listen(port, function(){
	console.log('listening on ' + port);
})