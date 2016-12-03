<!DOCTYPE html>
<html lang=en>
	<head>
		<title>Nordic Network - Flexible server hosting, the Nordic way</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1"> 
		<!-- Load universal CSS from file -->
		<link rel="stylesheet" href="/css/universal.css">
		<!-- Load custom CSS from file -->    
		<link rel="stylesheet" href="/css/create-server.css">
		<!-- Load bootstrap stylesheet from CDN -->
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<!-- Load JQuery from CDN -->
		<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
		<!-- Load Socket.io -->
		<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
		<!-- Load bootstrap JS from CDN -->
		<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<!-- Load JQuery Waypoints from CDN -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.js"></script>
		<!-- Load Fontastic CSS from file -->
        <link rel="stylesheet" href="/css/fontastic.css">
		<!-- Load SweetAlert -->
		<script src="/sweetalert/dist/sweetalert.min.js"></script>
		<link rel="stylesheet" type="text/css" href="/sweetalert/dist/sweetalert.css">
		<!-- Load custom JS from file -->
		<script src="/js/createserv-client.js"></script>
	</head>
	<body onscroll="changeOpacity()">
		<!-- Nav -->
		<?php
			if(isset($_COOKIE['session'])) {
				include 'nav-user.php';
			} else {
				include 'nav-guest.php';
			}
		?>
	</body>
</html>
