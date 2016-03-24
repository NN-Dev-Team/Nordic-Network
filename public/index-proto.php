<html>
	<head>
		<title>Nordic Network</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<link rel="stylesheet" href="/css/nav-proto.css">
		<link rel="stylesheet" href="/css/other-proto.css">
		<link rel="stylesheet" href="/css/index-proto.css">
		<link rel="stylesheet" href="/css/footer-proto.css">
		<script src="http://code.jquery.com/jquery-2.2.2.min.js" integrity="sha256-36cp2Co+/62rEAAYHLmRCPIych47CvdM+uTBJwSzWjI=" crossorigin="anonymous"></script>
		<script src="/js/index.js"></script>
	</head>
	<body>
		<img id="main-pic" src="/pics/nordic-nature.jpg">
		<?php include 'navbar-proto.html'; ?>
		<div id="cookie-notice">We use cookies to enhance your user experience and to make the ads displayed better.</div>
		<button id="cookie-notice-button" onclick="acceptCookies();">OK</button>
		<div id="ad-box-outer">
			<div class="ad" id="ad-box-inner"></div>
		</div>
		<div class="center-box" id="upper-box">
			<a href="/register" id="get-server" ondragstart="return false">Get your free server</a>
			<div id="stats">
				RAM usage:
				<div class="progress">
					<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">0%</div>
				</div>
			</div>
		</div>
		<div id="middle-box">
			<div id="feature-uptime"></div>
			<div></div>
		</div>
		<div class="ad" id="ad-box-large"></div>
		<div class="ad" id="ad-box-mobile"></div>
		<?php include 'footer.html'; ?>
	</body>
</html>