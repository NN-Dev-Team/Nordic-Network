<html>
	<head>
		<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
		<meta content="utf-8" http-equiv="encoding">
		<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
		<script src="http://code.jquery.com/jquery-1.11.1.js"></script>
		<script src="js/controlpanel-client.js"></script>
	</head>
	<body>
		<h2>Press Inspect Element and switch to the console :)</h2>
		<p>(Type startServer(0, 0); and press enter when in the console)</p>
		<?php
			$str = '<p>This server is using ';
			$str .= PHP_OS;
			$str .= ' OS</p>';
			echo $str;
		?>
	</body>
</html>