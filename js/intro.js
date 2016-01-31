//Var for full screen
var w;
var checkFullscreen = false;
var done = false;
		
	$(window).load(function(){
	var urlErrorhendling = window.location.href;
	if(urlErrorhendling != "http://breathing.tv/"){
		window.location.replace("http://breathing.tv/");
	}
	
	// do functionality on screens smaller than 768px
		if (window.matchMedia('(max-width: 732px)').matches)
		{
		  $('#header').css('border-bottom', 'none');
		  $('#intro').remove();
		  var element = document.createElement("div");
		  element.id = "noMobile";
		  element.setAttribute("style", "color:#666;font-size:3em; margin:80px auto; width:300px; text-align:center");
		  element.innerHTML="<h1>This application works only on devices with screen width larger than 732px </h1>"
		  $('#allCover').append(element);
		}else{
			//allPlaylists();
			circle.draw();	//draw circle, for now is hidden in css

			//INTRO
			setTimeout(function(){$('#loadingintro').remove();}, 1000);
			setTimeout(function(){	$('#intro').addClass('test');},1500);	

			//On intro end run algorithm
			$("#intro img").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
				setTimeout(function(){$('#intro').fadeOut();}, 1000);
				setTimeout(function(){$('#intro').remove();$('.explanation').fadeIn();breathingAlgorithm.run();}, 1100);
				//setTimeout(function(){$('.searchBox').fadeIn(); allPlaylists();}, 1200);
				setTimeout(function(){$('.searchBox').fadeIn(); allPlaylists();}, 1200);
			});

			fullScreen();
		}
			

		

		 		
 		
	
		
	});