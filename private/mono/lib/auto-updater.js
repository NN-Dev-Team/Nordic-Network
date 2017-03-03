var httpsSync = require('http-sync');

Date.prototype.getWeek = function() {
	var date = new Date(this.getTime());
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
	var week1 = new Date(date.getFullYear(), 0, 4);
	return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

exports.addJar = function copyLatestStableJar(dest, callback) {
	var cbCalled = false;
	var src = "../versions/mc/minecraft_server.1.9.2.jar";
	dest += "/minecraft_server.jar";
	
	var read = fs.createReadStream(src);
	read.on("error", function(err) {
		done(err);
	});
	
	var write = fs.createWriteStream(dest);
	write.on("error", function(err) {
		done(err);
	});
	write.on("close", function(ex) {
		done();
	});
	
	read.pipe(write);

	function done(err) {
		if (!cbCalled) {
			callback(err);
			cbCalled = true;
		}
	}
}

exports.getSnapshot = function getMCSnapshotUrl(year, week) {
	var base_url = "https://s3.amazonaws.com/Minecraft.Download/versions/";
	var url = base_url;
	var sUrl = 0;
	var now = new Date();
	var thisYear = now.getFullYear();
	var thisWeek = now.getWeek();
	var strWeek = thisWeek.toString();
	var strYear = year.toString();
	if(strWeek.substring(0, 1) != "0") {
		strWeek = "0" + week; // Makes sure week number always is 2 digits
	}
	
	do {
		var snapshot = strYear.substring(2) + "w" + strWeek;
		var snapList = ['a', 'b', 'c', 'd', 'e', 'f'];
		
		for(i = 0; i < snapList.length; i++) {
			url = base_url + snapshot + "/minecraft_server." + snapshot + snapList[i] + ".jar";
			
			var opts = {
				method: 'HEAD',
				host: url,
				protocol: 'https'
			};
			
			var req = httpsSync.request(opts);
			var res = req.end();
			if(res.statusCode != 403) {
				sUrl = url;
			}
		}
	} while(year != thisYear || week != thisWeek);
	
	return sUrl;
}

exports.getPre = function getMCPreUrl(version) {
	var thisVersion = version;
	var base_url = "https://s3.amazonaws.com/Minecraft.Download/versions/";
	var url = base_url;
	var preUrl = 0;
	
	while(version + 0.2 > thisVersion) {
		for(i = 1; i < 10; i++) {
			url = base_url + thisVersion + "-pre" + i + "/minecraft_server." + thisVersion + "-pre" + i + ".jar";
			
			var opts = {
				method: 'HEAD',
				host: url,
				protocol: 'https'
			};
			
			var req = httpsSync.request(opts);
			var res = req.end();
			if(res.statusCode != 403) {
				preUrl = url;
			}
		}
		
		thisVersion += 0.1;
	}
	
	return preUrl;
}