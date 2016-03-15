<!DOCTYPE HTML>
<html lang="en">
	<head>
		<title>Nordic Network | Free Server Hosting</title>
		<meta name="viewport" content="width=device-width; initial-scale=1.0;">
		
		<link rel="stylesheet" type="text/css" href="css/other.css">
		<link rel="stylesheet" type="text/css" href="css/nav.css">
		<link rel="stylesheet" type="text/css" href="css/footer.css">
		<link rel="stylesheet" type="text/css" href="css/index.css">
		
		<script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
		<script src="js/nav.js"></script>
	</head>
	<body>
		<?php include 'navbar.html'; ?>
		<img src="pics/nordic-nature.jpg" id="main-pic"/>
		<div id="server-button"><p><a href="/register">GET YOUR <strong>FREE</strong> SERVER</a></p></div>
		<div id="status">
			<p>Servers Left</p>
			<div class="progress-bar"><span style="width: 100%"></span><p id="status-p">256</p></div>
			<p>RAM Usage</p>
			<div class="progress-bar" style="margin-bottom: 2vh"><span style="width: 0%"></span><p id="status-p">0% (0 out of 64 GB)</p></div>
		</div>
		<?php include 'footer.html'; ?>
		<div id="test" style="width: 100vw; height: 100vh">Testing some stuff :P</div>
	</body>
</html>