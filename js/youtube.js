	$(document).ready(function(){
		

		 //move he last list item before the first item. The purpose of this is if the user clicks to slide left he will be able to see the last item.
        $('#menu-ul li:first').before($('#menu-ul li:last')); 
        
        
        //when user clicks the image for sliding right        
        $('#right_scroll img').click(function(){
        
            //get the width of the items 
            var item_width = $('#menu-ul li').outerWidth() + 10;
            
            //calculae the new left indent 
            var left_indent = parseInt($('#menu-ul').css('left')) - item_width;
            
            //make the sliding effect 
            $('#menu-ul:not(:animated)').animate({'left' : left_indent},1500,function(){    
                
                //get the first list item and put it after the last
                $('#menu-ul li:last').after($('#menu-ul li:first')); 
                
                //and get the left indent to the default -300px
                $('#menu-ul').css({'left' : '-300px'});
            }); 
        });


		//Search for youtube videos
		$("form").on("submit", function(e){
				e.preventDefault();
				$('#menu-ul').empty();
				//prepare the request
				var request = gapi.client.youtube.search.list({
					part:"snippet",
					type:"video",
					q:encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
					maxResults:30,
					order:"relevance"
								
				});
				
				//execute the request
				request.execute(function(response){
					var results = response.result;
					$.each(results.items, function(index, item){
						$.get("videos.html", function(data){
							$("#menu-ul").append(getHtmlData(data, [{"title":item.snippet.title.shortenString(60,true), "videoId":item.id.videoId, "description":item.snippet.description}]));
						})
					});
				});
		});

		$("#menuButton").on("click", function(e){
			e.preventDefault();
			allPlaylists();
		});

		$("#menuButton2").on("click", function(e){
			e.preventDefault();
			$('#breathingTV-sub').hide();
			//player.loadVideoById("sgd");
			
			allPlaylists();
			$('.searchBox').show();
			$('#menu-ul').addClass('carousel-scroll');
			$('#player').remove();
			$('#breathingTV-sub').append("<div id='player'></div>");
			$('#player').css('top', '-9999px');
			$('#breathingTV-sub').hide();
		});
	});

	

	function allPlaylists(){
		//Show youtube breathing.tv chanel playlists
		$('#menu-ul').empty();
		$.get(
			"https://www.googleapis.com/youtube/v3/playlists", {
				part: "snippet",
				maxResults : 30,
				channelId : "UCI6VH6jFUIykNg4zc9N0adQ",
				key:"AIzaSyAI8A5amdhhTudW6k5tEhzIjf9ItkWomdw"},

				function(data){
					$.each(data.items, function(index, item){
						$.get("playlists.html", function(data){
							$("#menu-ul").append(getHtmlData(data, [{"playlistId":item.id, "thumbnail":item.snippet.thumbnails.default.url, "title":item.snippet.title, "description":item.snippet.description.shortenString(50,true)}]));
							
						});
						
					})
				}
		);
	}

    function showPlaylist(playlistId) {
    	//When click event on playlist show playlists videos/items/content
      	$('#menu-ul').empty();
	      $.get(
			"https://www.googleapis.com/youtube/v3/playlistItems", {
				part: "snippet",
				maxResults : 30,
				playlistId : playlistId,
				key:"AIzaSyAI8A5amdhhTudW6k5tEhzIjf9ItkWomdw"},

				function(data){
					$.each(data.items, function(index, item){
						$.get("videos.html", function(data){
							$("#menu-ul").append(getHtmlData(data, [{"title":item.snippet.title.shortenString(60,true), "videoId":item.snippet.resourceId.videoId, "description":item.snippet.description.shortenString(30,true)}]));
							
						});

						
					})
				}
		);
    }

     function playVideo(videoId) {
    	//When click event on video from video list play video - start player
      	$('#player, #menu-ul').empty();
      	$('.searchBox').hide();
      	//$('.searchBox').css('height', '0px');
      	$('#breathingTV-sub').show();
	     playYouVideo(videoId);
	    //$("#player").append("<iframe id='testbla' class='video w100' width='100%' height='105%' src='https://www.youtube.com/embed/"+videoId+"' frameborde='0' allowfullscreen></iframe>");
	    $('#fullScr, #turboButton').fadeIn();
		$('#roundBut').fadeIn();
		$('#countNum').fadeIn();
		$('.explanation').hide();	
		$('#menu-ul').removeClass('carousel-scroll');
		$('#player').css({
			'position':'absolute',
			'top':'0px',
			'left':'0px',
		});
		setTimeout(function(){showBubbles.turboBublle('#turboButton');showBubbles.countBubble('#countNum');}, 500);
		setTimeout(function(){showBubbles.removeBubble('.turboBublle');showBubbles.removeBubble('.turboBublle');}, 4000);
    }


 
// Load the IFrame Player API code asynchronously.
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  var player;
    
function playYouVideo(getId) {
    player = new YT.Player('player', {
    	 videoId:getId,
   		 height: '100%',
     	 width: '100%',

	  playerVars: { 
         'fs': 0,
		 'autohide':0,
	},
	  events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
    });
  }
  
  
function onPlayerReady(event) {
		event.target.playVideo();
		done = false;	//resets back to false so we can call onPlayerStateChange(event) function
}

// when video ends
function onPlayerStateEnd() {        
			
			 $('#imgCircle').fadeIn(1000);
			 setTimeout(function(){ $('#main-car').fadeIn(1000);},1000);
			 //setTimeout(function(){getUserMedia({audio:true}, goStream);}, 2000);	

			 setTimeout(function(){$('.explanation').fadeIn(500);}, 1000);
     }
	
	function pauseVideo() {
        player.pauseVideo();
		
      }
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(pauseVideo, 200);
		  $('#popupButton').fadeIn(1000);
          done = true;
		}
	  }

