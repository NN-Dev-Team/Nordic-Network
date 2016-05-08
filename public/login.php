<html>
	<head>
		<script src="/js/login.js"></script>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<!-- Load custom CSS from file -->    
		<link rel="stylesheet" href="/css/styles.css">
		<!-- Load bootstrap stylesheet from CDN -->
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<!-- Load JQuery from CDN -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
		<!-- Load bootstrap JS from CDN -->
		<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<!-- Load JQuery Waypoints from CDN -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.js"></script>
    </head>
	
    <body>
		<nav id="nav-nomargin" class="navbar navbar-default navbar-fixed-top">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span> 
					</button>
					<a class="navbar-brand" href="#">Nordic Network</a>
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
