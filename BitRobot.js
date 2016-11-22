var moment = require('moment');
var WebSocket = require('ws');
var ready = 0;

var listenws = function () {
	
	
	console.log(moment().format()+" Connecting to blockchain...")
	var bcsource = 'wss://ws.blockchain.info/inv';
	var ws = new WebSocket(bcsource);

	ws.on('open', function open() {
		console.log(moment().format()+' Blockchain source connected '+bcsource);
	  	ws.send('{"op":"addr_sub", "addr":"1PLNu2x4pniSg4zC8ThVJZArj6fvukgo6T"}');
	  	ws.send('{"op":"addr_sub", "addr":"1PLPvSG8FS2FUCyDTdycCzDSAcwVN7tJp1"}');

	  	//ws.send('{"op":"unconfirmed_sub"}') //all
	  	
	});


	ws.on('message', function(indata, flags) {
		// flags.binary will be set if a binary data is received.
		// flags.masked will be set if the data was masked.
		


		
		var data = JSON.parse(indata);
		
		if (ready == 1) { 
			console.log(data.x);
			for (var i in data.x.out) {
				if (data.x.out[i].addr == "1PLNu2x4pniSg4zC8ThVJZArj6fvukgo6T") {
					var apimsg =  { "buy" : "1.0" };
					var apimsgstr = JSON.stringify(apimsg);
					arduino.write(apimsgstr); 
				}

				if (data.x.out[i].addr == "1PLPvSG8FS2FUCyDTdycCzDSAcwVN7tJp1") {
					var apimsg =  { "buy" : "2.0" };
					var apimsgstr = JSON.stringify(apimsg);
					arduino.write(apimsgstr); 	
				}
			}
		}


	});

	ws.on('close', function close() {
		console.log(moment().format()+' Blockchain connection closed...');
		listenws();
	});
}

listenws();

/* ====================================== */

var SerialPort = require("serialport"); // so we can access the serial port
var scraper = require('json-scrape')(); // cleans messy serial messages.

var arduino;

//LIST DEVICES/AUTODETECT
SerialPort.list( function (err, ports) {
console.log(ports)
   arduino = new SerialPort('COM3', {baudrate: 9600}); //you must set the port and baudrate
    arduConnect(arduino);
});


var arduConnect = function (device) {
	ready = 1;
  	device.on("data", datahandler);
}

var datahandler = function (data) {
  scraper.write(data); 
}

scraper.on('data', function (data) {
  console.log(data)   
  //io.sockets.emit("arduino", data)
});