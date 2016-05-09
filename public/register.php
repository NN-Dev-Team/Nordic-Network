<html>
		<head>
		<script src="/js/login.js"></script>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<!-- Load custom CSS from file -->    
		<link rel="stylesheet" href="css/styles.css">
		<!-- Load bootstrap stylesheet from CDN -->
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<!-- Load JQuery from CDN -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
		<!-- Load bootstrap JS from CDN -->
		<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<!-- Load JQuery Waypoints from CDN -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.js"></script>
    </head>
	<body id="logregbody">
		<nav id="nav-nomargin" class="navbar navbar-default navbar-fixed-top">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span> 
					</button>
					<a class="navbar-brand" href="/index#top">Nordic Network</a>
				</div>
				<div class="collapse navbar-collapse" id="myNavbar">
					<ul class="nav navbar-nav">
						<li><a href="/index#top">Home</a></li>
						<li><a href="/index#index-info">About</a></li>  
						<li><a href="/index#pricing">Pricing</a></li> 
						<li><a href="/knowledgebase">Support</a></li> 
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li><a href="/register"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
						<li><a href="/login"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
					</ul>
				</div>
			</div>
		</nav>
		
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
