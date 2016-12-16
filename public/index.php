<!DOCTYPE html>
<html lang=en>
	<head>
		<title>Nordic Network - Flexible server hosting, the Nordic way</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- Load universal CSS from file -->
		<link rel="stylesheet" href="/css/universal.css">
		<!-- Load custom CSS from file -->    
		<link rel="stylesheet" href="/css/index.css">
		<!-- Load font families -->
		<link href="https://fonts.googleapis.com/css?family=David+Libre|Yatra+One" rel="stylesheet"> 
        <!-- Load Odometer Theme CSS from file -->
        <link rel="stylesheet" href="/css/odometer-theme-minimal.css" />
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
		<!-- Load Fontastic CSS from file -->
        <link rel="stylesheet" href="/css/fontastic.css">
        <!-- Load custom JS from file -->
		<script src="/js/index.js"></script>
        <!-- Load Odometer JS from file -->
        <script src="/js/odometer.js"></script>
	</head>
	<body id="top" onscroll="changeOpacity()">
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
					<br />
					<h1 id="title">Start small, grow big!</h1>
					<p id="subtitle">Free minecraft server hosting, designed to help your server grow.</p>
					<br />
					<br />
					<a type="button" id="getserver" class="btn btn-primary btn-lg" href="/create-server">Get started</a>
				</div>
				
				<a href="/index/#index-info" class="glyphicon glyphicon-chevron-down white-glyphicon"></a>
				
			</div>
		</div>
		
		<!-- Content -->
		
		<!-- About -->
		<span id="index-info"></span>
		<br />
		<br>
		<div class="container-fluid" id="feature-container">   
			
			<br>
			
			<h2 id="features-title">Features</h2>
			<br>
			
			<div class="row">
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/settings-sm.png" height="50px" width="50px"><h3 id="feature-text-title">Powerful dashboard</h3><p id="feature-text" class="center-block">All of our servers come with a custom dashboard. It has a file manager, version installer and many other great features.</p></div>
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/cloud-sm.png" height="50px" width="50px"><h3 id="feature-text-title">Free server page</h3><p id="feature-text" class="center-block">Each server comes with it's very own page hosted by us! Add pictures, videos and text, let players donate and vote to keep your server alive. In the future you'll also be able to purchase extensions like forums and blogs!</p></div>
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/game-sm.png" height="50px" width="50px"><h3 id="feature-text-title">Game library</h3><p id="feature-text" class="center-block">We support various versions of Minecraft, such as PC, Win 10 & PE!</p></div>
			</div>
			<br />
			<div class="row">
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/shield-sm.png" height="50px" width="50px"><h3 id="feature-text-title">Secure</h3><p id="feature-text" class="center-block">Our servers are protected from DDOS attacks, and everything else that may hurt your server.</p></div>
				<div class="col-sm-4"><img id="feature-img" class="center-block" src="/pics/icons/bolt.svg" height="50px" width="50px"><h3 id="feature-text-title">Blazing fast</h3><p id="feature-text" class="center-block">We use Intel Core i7 Quad Core servers running on 4GHz, specifically designed for gaming! More information can be found <a href="https://www.ovh.co.uk/dedicated_servers/details-servers-range-GAME-id-MC-64.xml">here.</a></p></div>
				<div class="col-sm-4"><svg id="feature-img" class="center-block" height="50px" width="50px"><g transform="scale(3)"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></g></svg><h3 id="feature-text-title">Open Source</h3><p id="feature-text" class="center-block">Our code is open source on Github, so you can help us improve this service.</p></div>
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
			<h1 id="stats-servers" class="odometer center-block">123,456</h1>
			<h4 id="stats-txt">servers created so far</h4>
		</div>
		
		<div id="pricing" class="container-fluid">
			
			<br />
			<br />
			<h2 id="pricing-title">Pricing</h2>
			<br />
			<br />
			<br />
			<div class="row" id="pricing-row">
				<div class="pricing-box pricing-box-free"><img id="pricing-img" class="center-block img-circle" src="/pics/icons/bulb_lg.png" height="100px" width="100px"><h3 id="pricing-text-title">Baldur</h3><p class="pricing-text center-block">256 MB RAM</p><p class="pricing-text pricing-text-bottom center-block">1 GB SSD</p><h3 class="pricing-price">FREE</h3></div>
				
				<div class="pricing-box pricing-box-free"><img id="pricing-img" class="center-block img-circle" src="/pics/icons/fire.svg" alt="fire" align="middle" height="100px" width="100px"><h3 id="pricing-text-title">Loki</h3><p class="pricing-text center-block">512 MB RAM</p><p class="pricing-text center-block">2 GB SSD</p><p class="pricing-text pricing-text-bottom center-block">FTP</p><h3 class="pricing-price">£1 / month</h3></div>
                
				<div class="pricing-box pricing-box-premium"><img id="pricing-img" class="center-block img-circle" src="/pics/icons/bolt.svg" height="100px" width="100px"><h3 id="pricing-text-title">Thor</h3><p class="pricing-text center-block">1 GB RAM</p><p class="pricing-text center-block">4 GB SSD</p><p class="pricing-text center-block">FTP</p><p class="pricing-text pricing-text-bottom center-block"><b>No advertisements</b></p><h3 class="pricing-price">£3 / month</h3></div>
                
				<div class="pricing-box pricing-box-premium"><img id="pricing-img" class="center-block img-circle" src="/pics/icons/face-lg.png" height="100px" width="100px"><h3 id="pricing-text-title">Odin</h3><p class="pricing-text center-block">2 GB RAM</p><p class="pricing-text center-block">8 GB SSD</p><p class="pricing-text center-block">FTP</p><p class="pricing-text center-block"><b>No advertisements</b></p><p class="pricing-text pricing-text-bottom center-block"><b>Your own forum</b></p><h3 class="pricing-price">£5 / month</h3></div>                           
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
