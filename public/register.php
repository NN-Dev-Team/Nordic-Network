<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<!-- Load universal CSS from file -->
		<link rel="stylesheet" href="/css/universal.css">
		<!-- Load custom CSS from file -->    
		<link rel="stylesheet" href="/css/register.css">
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
		<!-- Load custom JS -->
		<script src="/js/register.js"></script>
		
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
		
		<div id="ad-box-outer">
			<div class="ad" id="ad-box-inner"></div>
		</div>
		<form action="/">
			<div id="register">
			<fieldset>
				<h1>Register</h1>
				<br>
				<div class="form-group">
         
                <input type="Email" class="form-control" id="email" placeholder="Email">
                </div>
				<div class="form-group">
         
                    <input type="password" class="form-control" id="passwrd" placeholder="Password">
                </div>
				<div class="form-group">
         
                    <input type="password" class="form-control" id="passwrd" placeholder="Confirm Password">
                </div>
	
				<input type="submit" class="btn btn-default" value="Register" id="register-button"></input>
	            <br></br>
	</fieldset>
		</form>
		</div>
		<div class="ad" id="ad-box-mobile"></div>
	</body>
</html>
