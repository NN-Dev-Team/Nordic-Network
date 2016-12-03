<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<!-- Load universal CSS from file -->
		<link rel="stylesheet" href="/css/universal.css">
		<!-- Load custom CSS from file -->    
		<link rel="stylesheet" href="/css/login.css">
		<!-- Load JQuery from CDN -->
		<script src="http://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
		<!-- Load bootstrap CSS from CDN -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<!-- Load bootstrap JS from CDN -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
		<!-- Load Socket.io -->
		<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
		<!-- Load JQuery Waypoints from CDN -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.js"></script>
		<!-- Load SweetAlert -->
		<script src="/sweetalert/dist/sweetalert.min.js"></script>
		<link rel="stylesheet" type="text/css" href="/sweetalert/dist/sweetalert.css">
		<!-- Load custom JS -->
		<script src="/js/login.js"></script>
		
		<title>Nordic Network - Flexible server hosting, the Nordic way</title>
    </head>
	
    <body>
		<?php
			if(isset($_COOKIE['session'])) {
				include 'nav-user.php';
			} else {
				include 'nav-guest.php';
			}
		?>
		
		<div id="login-form">
			<br />
			<br />
			<h1 id="Login Title"> Login </h1>
			<form role="form" class="form-horizontal">
				<div class="form-group">
			
					<input type="email" class="form-control" id="email" placeholder="Email">
				</div>
				
				<div class="form-group">
         
					<input type="password" class="form-control" id="pwd" placeholder="Password">
				</div>
				<button type="submit" class="btn btn-default" id="login-button">Log in</button>
			</form>
			<br />
		</div>
    </body>
</html>
