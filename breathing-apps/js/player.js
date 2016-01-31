  var inhalePlayer;
  var done = false;
  var startVideoLoop = 0;
 
  var myTitle = "";
  
	
  var loadingVar = new Array;
  loadingVar[0]= 0;
	loadingVar[1]= 0;
	loadingVar[2]= 0;
	loadingVar[3]= 0;
	loadingVar[4]= 0;
	loadingVar[5]= 0;
	
function playYouVideo(getId) {
  done = false;
	if (!inhalePlayer){
		inhalePlayer = new YT.Player('inhalePlayer', {
     	 videoId:getId,
			 
		 playerVars: { 
			 'fs': 0,
			 'loop':1,
		},
		  events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			  }
		});
		
		exhalePlayer = new YT.Player('exhalePlayer', {
		  videoId:getId,
		 
		  playerVars: { 
			 'fs': 0,
			 'loop':1,
		},
		  events: {
				'onReady': onPlayerReady,
	            'onStateChange': onPlayerStateChangeOth

			  }
		});
	} 
	else{
		
		inhalePlayer.loadVideoById({'videoId':getId});
		exhalePlayer.loadVideoById({'videoId':getId});
		
	}
	history.pushState({}, '', ' ');
	getHrefId = getId;
	
}
  
  
function onPlayerReady(event){
		setTimeout(function(){inhalePlayer.pauseVideo();}, 500);
		setTimeout(function(){exhalePlayer.pauseVideo();}, 500);
		var timeDur = inhalePlayer.getDuration();
		secToMin(timeDur, 'max-r');
		  $('html,body').animate({
			        scrollTop: $("#player-content").offset().top},
			        2000);
}

function onPlayerStateChange(event) {
        if (!done) { 
		  var timeDur;
          setTimeout(function(){inhalePlayer.pauseVideo();}, 500);
		  setTimeout(function(){exhalePlayer.pauseVideo();}, 500);
          done = true;
		  setTimeout(function(){timeDur = inhalePlayer.getDuration();secToMin(timeDur, 'max-r');}, 1000);
		}
		if(event.data === 0) {          
                inhalePlayer.seekTo(startVideoLoop);
				inhalePlayer.playVideo();
            }
}

function onPlayerStateChangeOth(event) {
        if(event.data === 0) {          
                exhalePlayer.seekTo(startVideoLoop);
				exhalePlayer.playVideo();
            }
}

function clearYouVideo(){
	$('#inhalePlayer, #exhalePlayer').remove();
	$('#player-wrapper').append('<div id="inhalePlayer"></div><div id="exhalePlayer"></div>');
}

function secToMin(getSeconds, getElem){
	if(isNaN(getSeconds)){
		alert("unexpected error while launching program. Please restart and try again");
	}
	else{
		var minutes = Math.floor(getSeconds / 60);
		var seconds = getSeconds - minutes * 60;
		seconds = parseInt(seconds);
		$('.'+getElem).text(minutes+':'+seconds);
		var passDur = getSeconds;
		history.pushState({}, '', '#'+getHrefId+'#0'+getSeconds+'#0#'+getSeconds);
		
		setMiddleTime(getSeconds);
		
		setRangeslider(passDur);
	}
}

function setMiddleTime(getMiddle){
		setMiddle = getMiddle/2;
		var minutesM = Math.floor(setMiddle / 60);
		var secondsM = setMiddle - minutesM * 60;
		secondsM = parseInt(secondsM);
		$('.middle-r').text(minutesM+':'+secondsM);
		$('#player-content').show();
		$('#bottom-part').show();
}
	
function setRangeslider(getSec){
	
	loadingVar[0]= 0;
	loadingVar[1]= getSec;
	loadingVar[2]= 0;
	loadingVar[3]= getSec;
	loadingVar[4]= getSec;
	loadingVar[5]= getSec;
	
	
		
	$( "#slider-range" ).slider({
		range: true,
		min: 0,
		max: getSec,
		values: [0, getSec],
		slide: function( event, ui) {
			
			
			var nM = Math.floor(ui.values[0]/ 60);
			var nS = ui.values[0] - nM*60;
			$("#minamount").val(nM+':'+nS);
			inhalePlayer.seekTo(ui.values[0]);
			
			var nM2 = Math.floor(ui.values[1]/ 60);
			var nS2 = ui.values[1] - nM2*60;
			$("#maxamount").val(nM2+':'+nS2);
			loadingVar[0] = ui.values[0];
			loadingVar[1] = ui.values[1];
			
			history.pushState({}, '', '#'+getHrefId+'#'+loadingVar[0]+'#'+loadingVar[1]+'#'+loadingVar[2]+'#'+loadingVar[3]);
		
		
		
			if(loadingVar[4] != ui.values[1]){
				inhalePlayer.loadVideoById({'videoId':getHrefId, 'startSeconds': loadingVar[0], 'endSeconds': loadingVar[1]});
				startVideoLoop = loadingVar[0];
			}
			loadingVar[4] = ui.values[1];
			
		}
			
		});
		
		
			
		$( "#slider-range-r" ).slider({
			range: true,
			min: 0,
			max: getSec,
			values: [0, getSec],
			slide: function( event, ui ) {
			
				var lM = Math.floor(ui.values[0]/ 60);
				var lS = ui.values[0] - lM*60;
				$("#minamount-r").val(lM+':'+lS);
				
				var lM2 = Math.floor(ui.values[1]/ 60);
				var lS2 = ui.values[1] - lM2*60;
				$("#maxamount-r").val(lM2+':'+lS2);
				
				exhalePlayer.seekTo(ui.values[0]);
				
				loadingVar[2] = ui.values[0];
				loadingVar[3] = ui.values[1];
				
				
				history.pushState({}, '', '#'+getHrefId+'#'+loadingVar[0]+'#'+loadingVar[1]+'#'+loadingVar[2]+'#'+loadingVar[3]);
				
				
				if(loadingVar[5] != ui.values[1]){
					exhalePlayer.loadVideoById({'videoId':getHrefId, 'startSeconds': loadingVar[2], 'endSeconds': loadingVar[3]});
					startVideoLoop = loadingVar[2];
				}
				loadingVar[5] = ui.values[1];
			}

		});
		
		
	

}

function fixPreview(){
	inhalePlayer.pauseVideo();
	exhalePlayer.pauseVideo();
}