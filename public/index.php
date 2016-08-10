<!DOCTYPE html>
<html lang=en>
	<head>
		<title>Nordic Network - Flexible server hosting, the Nordic way</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- Load custom CSS from file -->    
		<link rel="stylesheet" href="/css/styles.css">
        <!-- Load Odometer Theme CSS from file -->
        <link rel="stylesheet" href="/css/odometer-theme-minimal.css" />
		<!-- Load bootstrap CSS from CDN -->
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<!-- Load JQuery from CDN -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
		<!-- Load bootstrap JS from CDN -->
		<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<!-- Load JQuery Waypoints from CDN -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.js"></script>
		<!-- Load Fontastic CSS from file -->
        <link rel="stylesheet" href="/css/fontastic.css">
        <!-- Load custom JS from file -->
		<script src="/js/index.js"></script>
        <!-- Load Odometer JS from file -->
        <script src="/js/odometer.js"></script>
	</head>
	<body id="top">
		<!-- Nav -->
		<?php
			if(isset($_COOKIE['session'])) {
				include 'nav-user.php';
			} else {
				include 'nav-guest.php';
			}
		?>
		<div id="cookie-notice">
            <?php include 'cookies.html'; ?>
        </div>
		<!-- Jumbotron/Image -->
    
		<div id="jumbo-nomargin" class="jumbotron">
			<div class="container-fluid">    
				<div id="jumbo-container">
					<br />
					<h1 id=title>High quality game servers.</h1>
					<br />
					<br />
					<br />
					<br />
					<a type="button" id="getserver" class="btn btn-primary btn-lg" href="register.php">Get your free server now!</a>
				</div>
				
				<a href="/index/#index-info" class="glyphicon glyphicon-chevron-down white-glyphicon"></a>
				
			</div>
		</div>
		
		<!-- Content -->
		
		<!-- About -->
		<span id="index-info"></span>
		<br />
		<br>
		<div class="container-fluid">   
			
			<br>
			
			<h2 id="features-title">Features</h2>
			<br>
			
			<div class="row">
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/settings-sm.png" height="50px" width="50px"><h4 id="feature-text-title">Powerful dashboard</h4><p id="feature-text" class="center-block">All of our servers come with a custom dashboard. It has a file manager, version installer and many other great features.</p></div>
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/cloud-sm.png" height="50px" width="50px"><h4 id="feature-text-title">Free server page</h4><p id="feature-text" class="center-block">Each server comes with it's very own website hosted by us! Add pictures, videos and text, let players donate upgrades and vote to keep your server alive (Minecraft server websites support Votifier). You can also purchase extensions like forums and blogs!</p></div>
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/game-sm.png" height="50px" width="50px"><h4 id="feature-text-title">Game library</h4><p id="feature-text" class="center-block">We support various games ranging from Minecraft to CS:GO!</p></div>
			</div>
			<br />
			<div class="row">
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/shield-sm.png" height="50px" width="50px"><h4 id="feature-text-title">Secure</h4><p id="feature-text" class="center-block">Our servers are protected from DDOS attacks, and everything else that may hurt your server.</p></div>
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/heart-sm.png" height="50px" width="50px"><h4 id="feature-text-title">Made with <span class="glyphicon glyphicon-heart"></span></h4><p id="feature-text" class="center-block">Made by gamers, for gamers. </p></div>
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/github.png" height="50px" width="50px"><h4 id="feature-text-title">Open Source</h4><p id="feature-text" class="center-block">Our code is open source on Github, so you can help us improve this service.</p></div>
			</div>
			
      <!-- Who wants a cookie? :D     
       _.:::::._
     .:::'_|_':::.
    /::' --|-- '::\
   |:" .---"---. ':|
   |: ( O R E O ) :| There you go :DD
   |:: `-------' ::|
    \:::.......:::/
     ':::::::::::'
        `'"""'` --> 
      
		</div>
		
		<div id="about-text-container">
			<br />
			<h2 id="about-text-title">About us</h2>
			<p id="about-text" class="center-block">Our small group of programmers and designers work hard to give you your own personal server. We make updates all the time, making it better almost everyday, we keep your servers at safe keeping.<br> We will help with whatever you need with our fantastic support and friendly staff.</p><br>
            <br />
            <div>
                
                <h2 id="about-text-title">Statistics</h2>                
                <h5 class="odometer center-block">123</h5>
            </div>
		</div>
		
		<div id="pricing" class="container-fluid">
			
			<br />
			<br />
			<h2 id="pricing-title">Pricing</h2>
			<br />
			<br />
			<br />
			<div class="row">
				<div class="col-sm-3"><img id="pricing-img" class="center-block img-circle" src="/pics/icons/bulb_lg.png" height="100px" width="100px"><h4 id="pricing-text-title">Baldur</h4><p id="pricing-text" class="center-block"><b>Weekly cost:</b> £0,1 <b>OR</b> x votes</p><p id="pricing-text" class="center-block"><b>Features:</b> 256 MB RAM & 1 GB disk space</p></div>
				
				<div class="col-sm-3"><img id="pricing-img" class="center-block img-circle" src="/pics/icons/fire.svg" alt="fire" align="middle" height="100px" width="100px"><h4 id="pricing-text-title">Loki</h4><p id="pricing-text" class="center-block"><b>Weekly cost:</b> £0,2 <b>OR</b> x votes</p><p id="pricing-text" class="center-block"><b>Features:</b> 512 MB RAM, 2 GB disk space & FTP access</p></div>
                
				<div class="col-sm-3"><img id="pricing-img" class="center-block img-circle" src="/pics/icons/bolt.svg" height="100px" width="100px"><h4 id="pricing-text-title">Thor</h4><p id="pricing-text" class="center-block"><b>Weekly cost:</b> £0,4 <b>OR</b> x votes</p><p id="pricing-text" class="center-block"><b>Features:</b> 1 GB RAM, 4 GB disk space & FTP access</p><p id="pricing-text" class="center-block"><b>Monthly cost:</b> £2</p><p id="pricing-text" class="center-block"><b>Premium features:</b> No advertisements on this website</p></div>
                
				<div class="col-sm-3"><img id="pricing-img" class="center-block img-circle" src="/pics/icons/face-lg.png" height="100px" width="100px"><h4 id="pricing-text-title">Odin</h4><p id="pricing-text" class="center-block"><b>Weekly cost:</b> £0,8 <b>OR</b> x votes</p><p id="pricing-text" class="center-block"><b>Features:</b> 2 GB RAM, 8 GB disk space & FTP access</p><p id="pricing-text" class="center-block"><b>Monthly cost:</b> £4</p><p id="pricing-text" class="center-block"><b>Premium features:</b> Tier #3 + Website extensions for free</p></div>                           
			</div>
			<br />
			<br />
			
			
		</div>
		
	</body>
	
	<!-- Footer -->
	<footer id="footer">
 
        <p id="center-text-footer">© Copyright 2016 Nordic Network | Picture provided with <span class="glyphicon glyphicon-heart"></span> by <a href="http://www.gratisography.com">Gratisography</a> | icons by <a href="http://google.github.io/material-design-icons">Google</a> and <a href="http://www.useiconic.com/open">Iconic Open</a></p>
            

    </footer>
    
    
    <!-- Smooth scrolling and scrollspy -->
	<script>
		$('body').scrollspy({target: "#myNavbar"}); 
		$("#top a[href^='/index/#']").on('click', function(e) {
		
			// prevent default anchor click behavior
			e.preventDefault();
			
			// store hash
			var hash = this.hash;
			
			// animate
			$('html, body').animate({
				scrollTop: $(hash).offset().top
				}, 300, function(){
				
				// when done, add hash to url
				// (default click behaviour)
				window.location.hash = hash;
			});
			
		});
	</script>
</html>

<!-- __              _ _            __     _                      _    
  /\ \ \___  _ __ __| (_) ___    /\ \ \___| |___      _____  _ __| | __
 /  \/ / _ \| '__/ _` | |/ __|  /  \/ / _ \ __\ \ /\ / / _ \| '__| |/ /
/ /\  / (_) | | | (_| | | (__  / /\  /  __/ |_ \ V  V / (_) | |  |   < 
\_\ \/ \___/|_|  \__,_|_|\___| \_\ \/ \___|\__| \_/\_/ \___/|_|  |_|\_\
                 Flexible server hosting, The Nordic Way.
                                                                        -->
