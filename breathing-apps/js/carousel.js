$(document).ready(function() {
	

	//Search for youtube videos
		$("#searchButton").on("click", function(){
				
				$('.ytlist').empty();
				//prepare the request
				var request = gapi.client.youtube.search.list({
					part:"snippet",
					type:"video",
					q:encodeURIComponent($("#searchField").val()).replace(/%20/g, "+"),
					maxResults:30,
					order:"relevance"
								
				});
				
				//execute the request
				request.execute(function(response){
					var results = response.result;
					$.each(results.items, function(index, item){
						$.get("videos.html", function(data){
							$(".ytlist").append(getHtmlData(data, [{"title":item.snippet.title, "videoId":item.id.videoId, "description":item.snippet.description}]));
						})
					});
				});
				$('#carousel-menu .arrow-left, #carousel-menu .arrow-right').show();
		});

		$("#searchField").keypress(function(e) {
			 if(e.keyCode == 13) {
			 	$('.ytlist').empty();
				//prepare the request
				var request = gapi.client.youtube.search.list({
					part:"snippet",
					type:"video",
					q:encodeURIComponent($("#searchField").val()).replace(/%20/g, "+"),
					maxResults:30,
					order:"relevance"
								
				});
				
				//execute the request
				request.execute(function(response){
					var results = response.result;
					$.each(results.items, function(index, item){
						$.get("videos.html", function(data){
							$(".ytlist").append(getHtmlData(data, [{"title":item.snippet.title, "videoId":item.id.videoId, "description":item.snippet.description}]));
						})
					});
				});
				$('#carousel-menu .arrow-left, #carousel-menu .arrow-right').show();
			 }
		});
		   

	var getHrefId;
	
	var thisUrlAdres = window.location.href;
	var newParam = thisUrlAdres.split("/")[4];
	var idParam = newParam.split("#")[1];
	var firstParam = newParam.split("#")[2];
	var secParam = newParam.split("#")[3];
	var thirdParam = newParam.split("#")[4];
	var fourthParam = newParam.split("#")[5];
	var fifthParam = newParam.split("#")[6];
	//newParam = newParam.replace('#','');
		
	if(newParam.indexOf("#appReady") < 0){

		//alert("No param in URL");
			 var done = false;
// Load the IFrame Player API code asynchronously.
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  
       
	
		//end of youtube seardh
		
		$('.arrow-left').click(function(){
			var item_width = parseInt($('.ytlist li').outerWidth() + 20)*4;
			var check_left = parseInt($('.ytlist').css('left'));
			var left_indent = check_left + item_width;
			if(check_left > -30){
				
			}
           else{
				$('.ytlist:not(:animated)').animate({'left' : left_indent},500);
			 }
			
        });
		
		$('.arrow-right').click(function(){
			var item_width = parseInt($('.ytlist li').outerWidth() + 20)*4;
            var check_left = parseInt($('.ytlist').css('left'));
            var left_indent = check_left - item_width;
            
			if(check_left > -5700){
				$('.ytlist:not(:animated)').animate({'left' : left_indent},500);
			}
			
				
		});
		
		
		
		
		
		
		
		
		
		
		//move he last list item before the first item. The purpose of this is if the user clicks to slide left he will be able to see the last item.
        $('.ytlist li:first').before($('.ytlist li:last')); 
        
        
        //when user clicks the image for sliding right        
        $('#right_scroll img').click(function(){
        
            //get the width of the items ( i like making the jquery part dynamic, so if you change the width in the css you won't have o change it here too ) '
            var item_width = $('.ytlist li').outerWidth() + 10;
            
            //calculae the new left indent of the unordered list
            var left_indent = parseInt($('.ytlist').css('left')) - item_width;
            
            //make the sliding effect using jquery's anumate function '
            $('.ytlist:not(:animated)').animate({'left' : left_indent},500,function(){    
                
                //get the first list item and put it after the last list item (that's how the infinite effects is made) '
                $('.ytlist li:last').after($('.ytlist li:first')); 
                
                //and get the left indent to the default -210px
                $('.ytlist').css({'left' : '-210px'});
            }); 
        });
        
        //when user clicks the image for sliding left
        $('#left_scroll img').click(function(){
            
            var item_width = $('.ytlist li').outerWidth() + 10;
            
            /* same as for sliding right except that it's current left indent + the item width (for the sliding right it's - item_width) */
            var left_indent = parseInt($('.ytlist').css('left')) + item_width;
            
            $('.ytlist:not(:animated)').animate({'left' : left_indent},500,function(){    
            
            /* when sliding to left we are moving the last item before the first list item */            
            $('.ytlist li:first').before($('.ytlist li:last')); 
            
            /* and again, when we make that change we are setting the left indent of our unordered list to the default -210px */
            $('.ytlist').css({'left' : '-210px'});
            });
        });
		
		
		
		
		$('#publish').click(function(){
			myTitle = $('#app-title').attr('value');
			var thisUrlAdresf = window.location.href;
			var newParamf = thisUrlAdresf.split("/")[4];
			var idParamf = newParamf.split("#")[1];
			history.pushState({}, '', '#'+idParamf+'#'+loadingVar[0]+'#'+loadingVar[1]+'#'+loadingVar[2]+'#'+loadingVar[3]+'#'+myTitle+'#appReady');
			
			$('#publish-part').show();
			var str= window.location.href;
			document.getElementById('publishText').innerHTML = str;
		});
		
		$('#preview').click(function(){
			myTitle = $('#app-title').attr('value');
			var thisUrlAdresf = window.location.href;
			var newParamf = thisUrlAdresf.split("/")[4];
			var idParamf = newParamf.split("#")[1];
			history.pushState({}, '', '#'+idParamf+'#'+loadingVar[0]+'#'+loadingVar[1]+'#'+loadingVar[2]+'#'+loadingVar[3]+'#'+myTitle+'#appReady');
			
			fixPreview();
			
				var str1= window.location.href;
				var win = window.open(str1, '_blank');
				
				if(win){
					win.focus();
				}
			
			
			
		});
	}
	else{
		//alert("We got some param in URL");
		$('#content, .first-step, #allButtons, #carousel-menu, .content').hide();
		
		$('#main-top').css({'height':'300px'});
		$('#breathingApp').css({'position':'ansolute','top':'-300px'});
		$('#bottom-part').hide();
		$('#breathingApp').show();
		var script = document.createElement("script");
		script.src = "js/breathing.js";
		document.getElementsByTagName("head")[0].appendChild(script);
setTimeout(function(){	$('#intro').addClass('test');},1500);	
	}
	


		
		
  });