<!DOCTYPE html>
<html lang=en>
	<head>
		<title>Nordic Network - Flexible server hosting, the Nordic way</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- Load font family -->
		<link href="https://fonts.googleapis.com/css?family=David+Libre" rel="stylesheet"> 
		<!-- Load universal CSS from file -->
		<link rel="stylesheet" href="/css/universal.css">
		<!-- Load custom CSS from file -->    
		<link rel="stylesheet" href="/css/support.css">
		<!-- Load bootstrap stylesheet from CDN -->
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<!-- Load JQuery from CDN -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
		<!-- Load bootstrap JS from CDN -->
		<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<!-- Load JQuery Waypoints from CDN -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.js"></script>
		<!-- Load Fontastic CSS from file -->
        <link rel="stylesheet" href="/css/fontastic.css">
	</head>
	<body>
		<!-- Nav -->
		<?php
			if(isset($_COOKIE['session'])) {
				include 'nav-user.php';
			} else {
				include 'nav-guest.php';
			}
		?>
		
		<div id="support-title-bg">
			<h1 id="support-title">Support</h1>
		</div>
	</body>
</html>