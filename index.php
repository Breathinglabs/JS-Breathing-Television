<!DOCTYPE html">
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Breathing TV</title>
<link rel="shortcut icon" href="images/icon-tab2.png"/>
<link rel="stylesheet" type="text/css" href="css/style.css">
<link rel="stylesheet" type="text/css" href="css/tvStyle.css">

<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>

<!--For circle -->
<script src="js/sonic.js"></script>
<!--end for circle -->
</head>

<body>
	<div id="container" class="clearfix">
		<div id="header">
			<div id="logo">
				<h1 id="title">BREATHING.<span>TV </span></h1>
			</div>
		</div>	
		<div id="wrapper-tv">
			<div id="allCover"></div>	
			<div class="searchBox">
				<div class="text-first"><h1>Blow to scroll, click to choose</h1></div>
				<div id="temp-player"></div>
				<div id="menu-container">
					<p class="explanation"><img src="images/mic.png"></img><span>Please allow microphone access.</span></p> 
					<div id="menu-inner">
						<div id="menu-ul" class="carousel-scroll">

						</div>	
					</div>	
					  <div id='right_scroll'><img src='images/right.png' /></div>

				</div>
				<div class="clear"></div>
				<div class="text-second"><h1>Or search for any youtube videos</h1></div>

				<div id="form-box">
					<form action="#" class="searchForm">
						<p><input type="text" id="search" placeholder="Search for youtube videos" ></p>
						<p><input type="submit" class="menu-button" id="searchButton" value="Search" class="form-control"></p>
						<p><input type="button" class="menu-button" id="menuButton"value ="Playlists"></p>
					</form>
					
				</div>
			</div>
				<!--INTRO-->
				<div id="intro" class="img-wrapper"><img src="images/introTV.png" alt="">
				<div id="loadingintro"><img src="images/loading.gif"></div>
					<p class="introLogo">Welcome to BREATHING <span style="color:#EEDA34">TV</span>, breathinglabs.com</p>
				</div>
				<!--INTRO end-->

			<div id="breathingTV-sub">
     			 <div id="breathingTV">
				 	<p class="explanation"><img src="images/mic.png"></img><span>Please allow microphone access.</span></p> 
					<div id="fullScr" class="toggleFull"></div>   
					<div id="disablePlay"></div>   
					<div id="turboButton" class="toggleTurbo" onClick="turboMode()">TURBO</div> 
					<div id="roundBut"><img class="imgHeadset" src="images/headset youtube.png" style="width:30px;margin-top:5px;"></div>
					<div id="countNum">Make exhalation longer</div>
					<div id="popupButton" class="emptyClass"><img src="images/popup.png"></div>
					<div id="playButton" class="emptyClass"><img src="images/play.png"></div>
					<div id="pauseButton" class="emptyClass"><img src="images/pause1.png"></div>
					<div id="player"></div>
				</div>
				<p><input type="button" class="menu-button" id="menuButton2"value ="menu"></p>
			</div>

		</div>

		
	</div>
	
	
<script>
function init(){
		gapi.client.setApiKey("AIzaSyAI8A5amdhhTudW6k5tEhzIjf9ItkWomdw");
		gapi.client.load("youtube", "v3", function(){
			//youtube api is ready
			 console.log('youtube API loaded...');
			
		});
	}
</script>
<script src="http://www.youtube.com/player_api" type="text/javascript"></script>
<script type="text/javascript" src="js/youtube.js"></script>
<script type="text/javascript" src="js/functions.js"></script>
<script type="text/javascript" src="js/fullScreen.js"></script>
<script type="text/javascript" src="js/intro.js"></script>
<script type="text/javascript" src="js/algorithm.js"></script>
<!--For circle -->
<script src="js/circleRound.js"></script>
<!--end for circle-->
<script type="text/javascript" src="https://apis.google.com/js/client.js?onload=init"></script>
</body>
</html>
