<html>
	<head>
		<title>Nordic Network</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<link rel="stylesheet" href="/css/nav-proto.css">
		<link rel="stylesheet" href="/css/other-proto.css">
		<link rel="stylesheet" href="/css/register.css">
		<link rel="stylesheet" href="/css/footer-proto.css">
		<link rel="stylesheet" href="css/styles.css">
		<script src="/js/register.js"></script>
	</head>
	<body>
		<?php include 'navbar-proto.html'; ?>
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
		<?php include 'footer.html'; ?>
	</body>
</html>
