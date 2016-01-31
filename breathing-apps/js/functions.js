//Change variables in html doc
function getHtmlData(template, data) {
	// initiate the result to the basic template
	res = template;
	// for each data key, replace the content of the brackets with the data
	for(var i = 0; i < data.length; i++) {
		res = res.replace(/\{\{(.*?)\}\}/g, function(match, j) { // some magic regex
			return data[i][j];
		})
	}
	return res;
} // and that's it!

//Shorten string
String.prototype.shortenString =
     function(n,useWordBoundary){
         var toLong = this.length>n,
             s_ = toLong ? this.substr(0,n-1) : this;
         s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
         return  toLong ? s_ + '&hellip;' : s_;
      };

// Find the right method, call on correct element
	function launchIntoFullscreen(element) {
		  if(element.requestFullscreen) {
			element.requestFullscreen();
		  } else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		  } else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		  } else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		  }
	}

	function playVideo(videoId) {
    
	     playYouVideo(videoId);
	     $('#slider-range, #slider-range-r').show();
	    //$("#player").append("<iframe id='testbla' class='video w100' width='100%' height='105%' src='https://www.youtube.com/embed/"+videoId+"' frameborde='0' allowfullscreen></iframe>");
	   
    }