var https = require('https');
var request = require('request');
var path = require('path');
var fs = require('fs');

exports.addJar = function(dest, callback) {
	var cbCalled = false;
	var src = path.join(__dirname, "../versions/mc/minecraft_server.1.11.2.jar");
	dest += "/minecraft_server.jar";
	
	var read = fs.createReadStream(src);
	read.on("error", function(err) {
		done({"error": err, "line": __line});
	});
	
	var write = fs.createWriteStream(dest);
	write.on("error", function(err) {
		done({"error": err, "line": __line});
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

exports.getLatestSnapshot = function(callback) {
	request({
		url: "https://launchermeta.mojang.com/mc/game/version_manifest.json",
		json: true
	}, function(err, res, versions) {
		if (!err && res.statusCode === 200) {
			callback(versions.versions[0].url);
		} else {
			console.log(err);
			console.log(res.statusCode);
		}
	});
}

exports.getPre = function(version) {
	// OUTDATED CODE; NEEDS UPDATING
	
/*	var thisVersion = version;
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
			
			var req = https.request(opts, function(res) {
				if(res.statusCode != 403) {
					preUrl = url;
				}
			});
			
			req.end();
		}
		
		thisVersion += 0.1;
	}
	
	return preUrl; */
}