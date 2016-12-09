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
		<link rel="stylesheet" href="/css/404.css">
		<!-- Load JQuery from CDN -->
		<script src="http://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
		<!-- Load bootstrap CSS from CDN -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<!-- Load bootstrap JS from CDN -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
		<!-- Load JQuery Waypoints from CDN -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.js"></script>
		<!-- Load Fontastic CSS from file -->
        <link rel="stylesheet" href="/css/fontastic.css">
		<!-- Load custom JS from file -->
		<script src="/js/404.js"></script>
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
		
		<h1 id="title">404</h1>
	</body>
</html>