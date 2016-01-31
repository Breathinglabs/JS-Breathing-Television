function callPlayer(frame_id, func, args) {
    if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
    var iframe = document.getElementById(frame_id);
    if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
        iframe = iframe.getElementsByTagName('iframe')[0];
    }
    if (iframe) {
        // Frame exists, 
        iframe.contentWindow.postMessage(JSON.stringify({
            "event": "command",
            "func": func,
            "args": args || [],
            "id": frame_id
        }), "*");
    }
}

function turboMode(){
	var checkValue = document.getElementById('turboButton').value;
	if(checkValue == "turbo mode"){
		document.getElementById('turboButton').value = "disable turbo mode";
		$('#turboButton').css({'background':'red', 'color':'white'});
		$("#playButton img").attr('src','images/double speed.png');
		$("#pauseButton img").attr('src','images/play.png');
		
	}
		
	else{
		document.getElementById('turboButton').value = "turbo mode";
		$('#turboButton').css({'background':'white', 'color':'black'});
		player.pauseVideo();
		playerPos_2 = parseInt($('#player').css('top'));
		$("#playButton img").attr('src','images/play.png');
		$("#pauseButton img").attr('src','images/pause1.png');
		
		if(playerPos_2 == 0){
			$("#popupButton").show();
		}
	}
		
}


var breathingAlgorithm = {
	libraryCheck : function(){
		// the minimum version of jQuery we want
		var v = "1.3.2";
		var x;
		var startstop = 0;
		
		// check prior inclusion and version
		if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
			var done = false;
			var script = document.createElement("script");
			script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
			script.onload = script.onreadystatechange = function(){
				if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
					done = true;
					
				}
			};
			document.getElementsByTagName("head")[0].appendChild(script);
		} else {
		
		}
	},
	
	noiseLevelConst : 5000,		//Constant we add to noise level for fast on event TOF
	noiseOffConst:2000,			//Constant we add to noise level for fast off event
	noiseOffSlowConst:2000,			//Constant we add to noise level for fast off event
	onFastConstant : -0.4,		//Constant we multiply max variance to get minimum
	onFastNumOfVar : 4,			//Minimum variable to check if they pass windowCondition_2
	offSlowNumOfPow : 10,			//Minimum variable to check if they pass windowCondition_2
	offFastConst : 0.5,			//Off fast event constant to multiply with onFastConstant
	functionRunning : false,	//Tells if blow detection is on, if true we are exhaling
	ThrOnFast : 1,				//Threshold for our fast on event
	ThrOffFast : 1,				//Threshold for our fast off event
	ThrOffSlow : 1,					//Threshold for our slow off event
	maxVariance : 0,
	minVariance : 0,
	pow : 0,						//Sum of all frequency element data(frequencyBin) - power
	noiseLevel : -1,			//Noise level (room)
	pwVariance : 0,				//Our current variance 
	varOffVar : 0,
	playerPos : 20,
	sampleSize : 1024, // number of samples to collect before analyzing data
	fftSize : 1024, // must be power of two // **
	frequencyBin: new Array,	//Put all frequency element data in array
	countBlow : 0,			//Detected blow count for determining noise level calculation time
	windowArray : new Array,	//For variance storage FIFO for determining slow or fast event
	vcd : 0,					//For b.windowArray array size
	windowArray_2 : new Array,	//For variance storage when b.pow > b.ThrOnFast
	vcd_2 : 0,					//For b.windowArray_2 array size
	mainCondition : false,		//If b.pow > b.ThrOnFast - if true it is
	offFastVar : 0,
	offFastVarCount : 0,
	pcd : 0,					//Number of elements in arrays for slow events
	PowerWindow : new Array,	//Array for b.pow to help us calculate variance b.pwVariance
	pw : 0,
		
	run : function(pfu){
		var b = breathingAlgorithm;
		
		
		//add your own parameters here
		this.pfu = pfu || {};
				
		if(this.pfu.runjQuery == true){
			breathingAlgorithm.libraryCheck();
		}
		
		if(this.pfu.onFNlc){//On event: noise level constant nl + ...
			b.noiseLevelConst = this.pfu.onFNlc;
		}
		
		if(this.pfu.onFvar){//On event number of variances to check
			b.onFastNumOfVar = this.pfu.onFvar;
		}
		
		if(this.pfu.onFCvar){//On event variable constant max.var * ...
			b.onFastConstant = this.pfu.onFCvar;
			b.onFastConstant = -1 * b.onFastConstant;
		}
			
		/*Notification microphone acces window, if allowed go to goStream function*/
		getUserMedia({audio:true}, goStream);
		}
	
	
};		
		var b = breathingAlgorithm;
		var sourceNode, analyserNode, javascriptNode;
				
		
		
		//main logic varaibles
		
		
		
		
		//Create audioContext
		window.AudioContext = window.AudioContext ||
							window.webkitAudioContext ||
							window.mozAudioContext ||
							window.oAudioContext ||	
							window.msAudioContext;
		
		var audioContext = new AudioContext();
		
		/*getUserMedia function def and prefix*/
		function getUserMedia(dictionary, callback){
			try{
				navigator.getUserMedia = navigator.getUserMedia ||
										navigator.webkitGetUserMedia ||
										navigator.mozGetUserMedia;
				
				navigator.getUserMedia(dictionary, callback, error);						
			}
			catch(e){
				alert('getUserMedia threw exception :' + e);
			}
		}
		
		/*Main function goStream for signal processing and exhalation algorithm process*/
		function goStream(stream){
			$('#allCover, .explanation').remove();
			

			var frequencyArray; // array to hold frequency data
			
			// create the media stream from the audio input source (microphone)
			sourceNode = audioContext.createMediaStreamSource(stream);
			audioStream = stream;

			analyserNode   = audioContext.createAnalyser();
			
			analyserNode.smoothingTimeConstant = 0.3; // **
			analyserNode.fftSize = b.fftSize; // **

			javascriptNode = audioContext.createScriptProcessor(b.sampleSize, 1, 1);
			
			// setup the event handler that is triggered every time enough samples have been collected
			javascriptNode.onaudioprocess = function () {	
				b.pow = 0;
								
				frequencyArray = new Uint8Array(analyserNode.frequencyBinCount);
				analyserNode.getByteFrequencyData(frequencyArray);
				
				//put in all frequencyArray data						
				for (var i = 0; i < frequencyArray.length; i++) {
					b.frequencyBin[i] = frequencyArray[i];		
				}
				
				//sum all data in array
				$.each(b.frequencyBin,function() {
					b.pow += this;				
				});
				
				//set noise level increase noise level and if current is > than saved then current is our new noise level(room)
				if(b.noiseLevel == -1){		//For very first input signal, just to set it on  
					b.noiseLevel = b.pow;
				}else{				//Setting noise level on off event and first 30 on event signals  
					if(b.pow < b.noiseLevel){
						b.noiseLevel = b.pow;
					}else if(b.pow > b.noiseLevel){
					
						if(b.countBlow < 30){
							b.noiseLevel = b.noiseLevel+10;			//noise level
						}else if(b.countBlow > 30){
							b.noiseLevel = b.noiseLevel+0;			//noise level
						}
					}
				}
				
				//Setting all thresholds for our on events
				b.ThrOnFast = Math.round(b.noiseLevel + b.noiseLevelConst);
				b.ThrOffFast = Math.round(b.noiseLevel + b.noiseOffConst);
				b.ThrOffSlow = Math.round(b.noiseLevel + b.noiseOffSlowConst);
				
				//Calculating variances - putting each b.pow in array and the sub current and one past
				b.PowerWindow[b.pw] = b.pow;
				if(b.pw > 0 && b.pw < 500){
					b.pwVariance = Math.round(b.PowerWindow[b.pw] - b.PowerWindow[b.pw-1]);
				}
				
				else if(b.pw > 500){
					b.pw = 0;
				}
				b.pw++;
				
				b.playerPos = parseInt($('#player').css('top'));
				
				//Check if function for when exhalation is detected (on event) is running
				if(b.functionRunning == false){
					b.countBlow  = 0;
					if($('#menu-ul').hasClass('carousel-scroll')){
						//$('#menu-ul').stop();
					}else{
							var getTurbo1 = document.getElementById('turboButton').value;
							if (getTurbo1 == "disable turbo mode" && b.playerPos == 0){
								player.setPlaybackRate(1);
								$("#popupButton").hide();
								//$("#playButton").hide();
								//$("#pauseButton").hide();
								player.playVideo();
							}else{
							
							}
					}
					
					onEvent(b.pow, b.pwVariance);
				}      
				
				//Check if function for when exhalation is not detected (off event) is running				
				else if(b.functionRunning == true){
					b.countBlow++;

					if($('#menu-ul').hasClass('carousel-scroll')){
								 //when user clicks the image for sliding right        
     
        
						            //get the width of the items ( i like making the jquery part dynamic, so if you change the width in the css you won't have o change it here too ) '
						            var item_width = $('#menu-ul li').outerWidth() + 10;
						            
						            //calculae the new left indent of the unordered list
						            var left_indent = parseInt($('#menu-ul').css('left')) - item_width;
						            
						            //make the sliding effect using jquery's anumate function '
						            $('#menu-ul:not(:animated)').animate({'left' : left_indent},1500,function(){    
						                
						                //get the first list item and put it after the last list item (that's how the infinite effects is made) '
						                $('#menu-ul li:last').after($('#menu-ul li:first')); 
						                
						                //and get the left indent to the default -210px
						                $('#menu-ul').css({'left' : '-300px'});
						            }); 
        
							}

						else{
							var getTurbo2 = document.getElementById('turboButton').value;
					if (getTurbo2 == "disable turbo mode" && b.playerPos == 0){
							$("#popupButton").hide();
							
							$("#pauseButton").hide();
							player.setPlaybackRate(2);
							player.playVideo();
					}
					else{
						player.setPlaybackRate(1);
					}
						}
					
					offEvent(b.pow, b.pwVariance);
				}
				
			}
			
			// Now connect the nodes together
			// Do not connect source node to destination - to avoid feedback
			sourceNode.connect(analyserNode);
			analyserNode.connect(javascriptNode);
			javascriptNode.connect(audioContext.destination);
			
		}
		
		//Error function
		function error(){
			$('.explanation').hide();	
			$('.explanation span').text('Make sure that your headset is conected.');
			$('.explanation img').attr('src','images/headset-no.png').css('margin-top','20px');
			$('.explanation').fadeIn(500);
		}
		
		var stopPopup;
		//Events that are triggered on on and off event
		var doEvent = function(){
				return{
					stop: function(){
						$('.sonic').fadeOut(0);
					//$('.imgHeadset').attr('src','images/headset youtube.png');
					if(b.playerPos == 0){
					var getTurbo = document.getElementById('turboButton').value;
							if (getTurbo == "disable turbo mode")
								$("#pauseButton").show();
					
						$('#pauseButton').fadeIn(500).delay(500).fadeOut();
						stopPopup = setTimeout(function(){$('#popupButton').fadeIn(500);},1500);
						document.getElementById("countNum").innerHTML = "Inhale through nose";
						setTimeout(function(){document.getElementById("countNum").innerHTML = "Exhale through pursed lips";},1600);
						setTimeout(function(){$('input[type="button"], input[type="text"]').removeAttr('disabled').css('opacity','1');$('#turboButton').css('opacity','0.7');}, 2500);
						//firstYouPlay = true;
					}
					else{
						$('input[type="button"], input[type="text"]').removeAttr('disabled').css('opacity','1');
						$('#turboButton').css('opacity','0.7');
					}
					
						b.functionRunning = false;
						/*$('.currentMenu').stop(true);*/
						if(!$('#menu-ul').hasClass('carousel-scroll')){
							player.pauseVideo();
						}
						
						circle.stop();
						w.terminate();
							w = undefined;
					},
					
					start: function(){
						$('input[type="button"], input[type="text"]').attr('disabled','disabled').css('opacity','0.5');
						$('#turboButton').css('opacity','0.3');
						//$('.imgHeadset').attr('src','images/headsetRed.png');
						$('.sonic').fadeIn(500);
						

						
						if(b.playerPos == 0){
							var getTurbo = document.getElementById('turboButton').value;
							if (getTurbo == "turbo mode")
								player.setPlaybackRate(1);
							else	
								player.setPlaybackRate(2);
						  
						  player.playVideo();
						  circle.play();
						   clearInterval(stopPopup);
						  //$('#imgCircle').attr('src','images/button.png');
						  $('#countNum').fadeIn(500);
						  $('#popupButton').fadeOut(500);
						  $('#playButton').fadeIn(500).delay(500).fadeOut();

						  if(w == undefined)
							w = new Worker("js/timer.js");					  	
					w.onmessage = function(event){
						document.getElementById("countNum").innerHTML = 'Your exhalation: '+event.data+'s';
					};
						}
						
					/*	else{
						if($('#mainPlaylist').hasClass("currentMenu")){
							var mennuLength = (menuWidth() - 700) * -1;
						}
						else if($('#showPlaylist').hasClass("currentMenu")){
							var mennuLength = (menuWidth()-700) * -1;
						}
						 else if($('#ytThumbs').hasClass("currentMenu")){
							var mennuLength = (menuWidth()-900) * -1;
						} 
						  $('.currentMenu').animate({marginLeft:mennuLength}, 5000, function(){});
						}*/

						 
						   b.functionRunning = true;
					
						
					}
				};
		}();
		
		//Function for checking if variances are in certen interval
		function CheckOn(value, index, ar) {
			if (value > b.minVariance && value < -1 * b.minVariance)
				return true;
			else
				return false;
		}
		
					
		/* ALGORITHM FOR DETECTING ON EVENTS */
		function onEvent(getTotal, getVariance){
			
		//FAST 
			//calculate max and min variance and set b.mainCondition on true when done
			if(getTotal > b.ThrOnFast && b.mainCondition == false){
					//when variance > 0 count max and set min variance
					if(getVariance > 0 && getVariance > b.maxVariance){
						b.maxVariance = getVariance;
						b.minVariance = Math.round(b.onFastConstant * b.maxVariance);
						b.varOffVar = b.minVariance*b.offFastConst;
					//when variance < 0 get first neg variance and set b.mainCondition
					}else if(getVariance < 0 && getVariance < b.maxVariance){
						b.mainCondition = true;
					}
			}
			
			//when we get max and min variances we check if next 4(onFastNumOfVar) variances are bigger than b.minVariance.
			else if(getTotal > b.ThrOnFast && b.mainCondition == true){
				b.windowArray[b.vcd] = getVariance;	
				if(b.vcd == b.onFastNumOfVar){
					if (b.windowArray.every(CheckOn)){
						b.functionRunning = true;
						doEvent.start();
					}
					else{
						b.mainCondition = false;
						b.vcd = 0;
						b.windowArray.length = 0;
						b.maxVariance = 0;
						b.minVariance = 0;
					}
				}
				else{
					b.vcd++;
				}
			}
		//SLOW
			
			if(b.pcd < 35){
				if(getTotal > b.ThrOnFast && getVariance > -3000){
					b.pcd ++;
				}else{
					b.pcd = 0;
				}
			}else{
				b.functionRunning = true;
			
				doEvent.start();
				b.pcd = 0;
			}
		}

		function CheckOff(value, index, ar) {
			if (value < b.ThrOffSlow)
				return true;
			else
				return false;
		}
		
		/* ALGORITHM FOR DETECTING OFF EVENTS */
		function offEvent(getOffTotal, getOffVariance){
			
			
			
			//get min variable of the previous 20 variables	
				if(b.offFastVarCount < 15){
					if(getOffVariance < b.offFastVar){
						b.offFastVar = getOffVariance;
					}b.offFastVarCount++;
				}else{
					b.offFastVarCount = 0;
				}
				
		//FAST
			if(getOffTotal < b.ThrOffFast && b.offFastVar < b.varOffVar)
			{	
				executeOffEv();
				
			}
			
		//SLOW
			//If the last 10 b.pow < b.ThrOnFast/2
			else if(getOffTotal < b.ThrOffFast && b.offFastVar > b.varOffVar){
			b.windowArray_2[b.vcd_2] = getOffTotal;
				if(b.vcd_2 == b.offSlowNumOfPow){
					if (b.windowArray_2.every(CheckOff)){
						executeOffEv();
					}else{}
					b.windowArray_2.splice(0, 1);
				}
				else{
					b.vcd_2++;
				}
			}
		
		}

		//function to be called if off event is triggered
		function executeOffEv(){
				b.vcd = 0;
				b.vcd_2=0;
				b.pw = 0;
				b.pcd = 0;
				b.maxVariance = 0;
				b.minVariance = 0;
				b.varOffVar = 0;
				b.mainCondition = false;
				b.windowArray.length = 0;
				b.windowArray_2.length = 0
				b.offFastVar = 0;
				b.offFastVarCount = 0;
				b.functionRunning = false;
				doEvent.stop();
		}
		
		

