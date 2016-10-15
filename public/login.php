<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<!-- Load universal CSS from file -->
		<link rel="stylesheet" href="/css/universal.css">
		<!-- Load custom CSS from file -->    
		<link rel="stylesheet" href="/css/login.css">
		<!-- Load bootstrap stylesheet from CDN -->
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<!-- Load JQuery from CDN -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
		<!-- Load bootstrap JS from CDN -->
		<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<!-- Load JQuery Waypoints from CDN -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.js"></script>
		<!-- Load SweetAlert -->
		<script src="/sweetalert/dist/sweetalert.min.js"></script>
		<link rel="stylesheet" type="text/css" href="/sweetalert/dist/sweetalert.css">
		
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
