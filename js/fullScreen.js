function fullScreen(){
	//Full Screen load at the begining
	$('html').keydown(function(e){
		if(e.keyCode  == 27 &&  checkFullscreen == true){
				$('#player, #ytThumbsPlayer').css({
				'position':'absolute',
				'top':'0px',
				'left':'0px',
			}),
			checkFullscreen = false,
			$('#fullScr').css('position','absolute'),
			$('#fullScr').removeClass('toggleSmall').addClass('toggleFull'),
			$('#turboButton').css('position','absolute'),
			//$('#tv_container').css('margin','0'),
			$('.sonic').css('left','190'),
			$('#roundBut').css({'position':'absolute', 'left':'40%'}),
			$('#popupButton').css({'top':'15%','left':'20%','width':'60%'}),
			$('#playButton, #pauseButton').css({'top':'15%','left':'35%','width':'40%'}),
			exitFullscreen(),
			$('#countNum').css({'position':'absolute', 'left':'45%'});
		}
	});
	$('#fullScr').click(function(){
		if($('.toggleFull')[0]){
			$('#player').css({
				'position':'fixed',
				'top':'0px',
				'left':'0px',
				'width':'100%',
				'height':'100%'
			}),
			checkFullscreen = true,
			$('#fullScr').css('position','fixed'),
			$('#fullScr').removeClass('toggleFull').addClass('toggleSmall'),
			$('#turboButton').css('position','fixed'),
			//$('#tv_container').css('margin','100px auto'),
			$('.sonic').css('left','240'),
			$('#roundBut').css({'position':'fixed', 'left':'40%'}),
			$('#popupButton').css({'top':'15%','left':'10%','width':'80%'}),
			$('#playButton, #pauseButton').css({'top':'10%','left':'20%','width':'60%'}),
			launchIntoFullscreen(document.documentElement),
			$('#countNum').css({'position':'fixed', 'left':'44%', 'bottom':'2px'});
		}else{
			$('#player').css({
				'position':'absolute',
				'top':'0px',
				'left':'0px',
			}),
			checkFullscreen = false,
			$('#fullScr').css('position','absolute'),
			$('#fullScr').removeClass('toggleSmall').addClass('toggleFull'),
			$('#turboButton').css('position','absolute'),
			//$('#tv_container').css('margin','0'),
			$('.sonic').css('left','190'),
			$('#roundBut').css({'position':'absolute', 'left':'40%'}),
			$('#popupButton').css({'top':'15%','left':'20%','width':'60%'}),
			$('#playButton, #pauseButton').css({'top':'15%','left':'35%','width':'40%'}),
			exitFullscreen(),
			$('#countNum').css({'position':'absolute', 'left':'45%'});
		}
			
	});

	$('#form-box').hover(
		function(){
			showBubbles.searchBubble('#form-box');
		}, 
		function(){
			showBubbles.removeBubble('.bubbles');
	});

	$('#turboButton').hover(
		function(){
			showBubbles.turboBublle('#turboButton');
		}, 
		function(){
			showBubbles.removeBubble('.turboBublle');
	});

	$('#countNum, #roundBut').hover(
		function(){
			showBubbles.countBubble('#countNum');

		}, 
		function(){
			showBubbles.removeBubble('.turboBublle');

	});
}


var showBubbles = {
	searchBubble:function(buubleId){
			
			var getPos = ($(buubleId).position().left) + ($(buubleId).width())/3;
			var getPos2 =($("#menuButton").position().left) - ($("#menuButton").width())/2;
			$(buubleId).append("<div class='bubbles' style='left:"+getPos+"px'><b>Hint:</b> search for anything on youtube to play it on blow.</div>");
			$(buubleId).append("<div class='bubbles' style='left:"+getPos2+"px'><b>Hint:</b> back  to breathing.tv playlist</div>");
			$('.bubbles').fadeIn(500);
	},

	turboBublle:function(buubleId){
			var getPos = ($(buubleId).position().left) + 180;
			console.log(getPos);
			$("#breathingTV-sub").append("<div class='turboBublle' style='left:"+getPos+"px'>Hint: Enable TURBO MODE to fast forward videos on blow.</div>");
			$('.turboBublle').fadeIn(500);
	},

	countBubble:function(buubleId){
			var getPos = ($(buubleId).position().left) + 180;
			console.log(getPos);
			$("#breathingTV-sub").append("<div class='turboBublle' style='left:"+getPos+"px'>Hint: Blow into the headset to play video.</div>");
			$('.turboBublle').fadeIn(500);
	},
	removeBubble:function(id){
		$(id).remove();
	}
	
}