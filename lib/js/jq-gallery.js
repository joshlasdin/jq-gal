// Made by Modo Design Group (www.mododesigngroup.com)
// Last updated: 07/07/2011

$.fn.gallery = function(){
    
    var gallery = '<div id="gallery"><div class="container"><span class="loading"></span><div class="header"><div class="drawer"><div id="scroll"><div class="viewport"><ul class="thumbs overview"></ul></div><div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div></div></div><div class="menu"><ul class="controls"><li class="nav"><a class="prev" title="' + photodata.global.prev +'" href="javascript:;"></a><p class="current">Photo <span class="num"></span>&nbsp;of&nbsp;<span class="total"></span></p><a class="next" title="' + photodata.global.next +'" href="javascript:;"></a></li><li class="drawer-trigger"><a href="javascript:;" title="' + photodata.global.thumbhide + '" class="active"></a></li><li class="exit"><a href="javascript:;" title="' + photodata.global.exit + '"></a></li></ul><h2 class="title"></h2></div></div><div class="body"><div class="image"><img src="lib/img/loading.gif" alt="" class="slide" /><p class="copyright"></p><p class="caption"></p><p class="meta"><span class="location"></span>&nbsp;<span class="date"></span></p></div></div></div></div>';
    
    $('body').prepend(gallery);
    
    for(var i = 0; i < photodata.photos.length; i++){
        $('#gallery ul.thumbs').append('<li><a href="' + photodata.photos[i].path + '"><img src="' + photodata.photos[i].thumb + '" alt="' + photodata.photos[i].title + '" /></a></li>');
    };
    
    $('#gallery a, a[rel=gallery]').click(function(e){ e.preventDefault(); });
    
    var c = $('#gallery');
    var drawer = open;
        
    $('.header', c).height($('.drawer').height() + $('.menu').height());
    $('.current .total').text(photodata.photos.length);
    
    $(this).click(enter)
    $('.drawer-trigger a').click(slideDrawer);
    $('.drawer a').click(advancePhoto);
    $('.controls a').each(bubble);
    $('.exit a').click(exit);
    $('.next').click(function(){ $('.drawer .active').next('li').find('a').click() });
    $('.prev').click(function(){ $('.drawer .active').prev('li').find('a').click() });
    $('.drawer .thumbs').width((photodata.photos.length * 110) + 14);
    
    $(window).resize(function(){
        positioning();
        $('#scroll').tinyscrollbar({ axis: 'x' });
    });
    
    
    // start application
    function enter() {
        $('h2.title').text(photodata.global.galleryname);
        $('.thumbs li:first-child a').click();
        c.fadeIn(500);
        positioning();
        $('#scroll').tinyscrollbar({ axis: 'x' });
    };
    
    
    // position main content
    function positioning(){
        var vw = $(window).width();            // viewport width
        var vh = $(window).height();           // viewport height
        
        $('.drawer').width(vw - 40);
        
        $('.image', c).css({
            'max-width': vw - 50 + 'px'
        });
        
        $('img.slide', c).css({
            'max-height':  vh - ($('.header', c).height() + 150) + 'px',
            'max-width': vw - 60 + 'px'
        });
        
        var iw = $('.image', c).width();       // image area width
        var ih = $('.image', c).height();      // image area height
        var offsetX = '-' + (iw / 2) + 'px';
        var offsetY = $('.header').height() + 25 + 'px';
                
        $('.image', c).css({
            'margin-left': offsetX,
            'top': offsetY
        });
    };
    
    
    // toggle thumbnail drawer
    function slideDrawer(){
        var imgarea = $('.image', c).offset();
        
        if(drawer == open){
            $('.header', c).animate({
                'height': $('.menu', c).height() + 'px'
            }, 500, function(){
                $('.drawer-trigger a').removeClass('active').find('.tip').text(photodata.global.thumbshow);
                $('.drawer').hide();
                drawer = closed;
            });
            
            $('.image', c).animate({
                'top': imgarea.top - $('.drawer', c).height() + 'px'
            }, 500, function(){ positioning() });
            
        } else if(drawer == closed){
            $('.drawer').show();
            $('.header', c).animate({
                'height': $('.menu', c).height() + $('.drawer', c).height() + 'px'
            }, 500, function(){
                $('.drawer-trigger a').addClass('active').find('.tip').text(photodata.global.thumbshow);
                drawer = open;
            });
            
            $('.image', c).animate({
                'top': imgarea.top + $('.drawer', c).height() + 'px'
            }, 500, function(){ positioning() });
        };
    };
    
    
    // advance main content
    function advancePhoto(){
        var num = $(this).parents('li').index();
        
        $('.image').hide();
        $('.loading').fadeIn(500);
        $('.caption').text(photodata.photos[num].title);
        $('.copyright').text(photodata.photos[num].copyright);
        $('.meta .location').text(photodata.photos[num].location);
        $('.meta .date').text(photodata.photos[num].date);
        
        $('<img>', {
            src:   photodata.photos[num].path,
            load:  function() {
                var newImg = $(this);
                newImg.addClass('slide');
                
                $('.loading').fadeOut(500, function(){
                    $('img.slide').replaceWith(newImg);
                    positioning();
                    $('.image').fadeIn();
                });
            }
        });
        
        $('.drawer .active').removeClass('active');
        $(this).parent().addClass('active');
        
        $('.current .num').text(num + 1);
        
        if(num == 0){ $('.prev').addClass('disabled') } else { $('.prev').removeClass('disabled') };
        if(num == photodata.photos.length - 1){ $('.next').addClass('disabled') } else { $('.next').removeClass('disabled') };
        
    };
    
    
    // link bubbles
    function bubble(){
        $(this).append('<div class="bubble"><span class="tip">' + $(this).attr('title') + '<img src="/themes/usgbc/lib/img/jq-gallery/bubble.png" alt="" /></span></div>');
        $(this).attr('title', '');
        
        $(this).mouseover(function(){ 
            if($(this).hasClass('disabled')){ } else { $('.bubble', this).fadeIn(250) }; 
        }).mouseleave(function(){ 
            $('.bubble', this).hide(); 
        }).click(function(){
            $('.bubble', this).hide();
        });
    };
    
    
    // exit application
    function exit(){ c.fadeOut(250) };
};

(function($){$.fn.tinyscrollbar=function(options){var defaults={axis:'y',wheel:40,scroll:true,size:'auto',sizethumb:'auto'};var options=$.extend(defaults,options);var oWrapper=$(this);var oViewport={obj:$('.viewport',this)};var oContent={obj:$('.overview',this)};var oScrollbar={obj:$('.scrollbar',this)};var oTrack={obj:$('.track',oScrollbar.obj)};var oThumb={obj:$('.thumb',oScrollbar.obj)};var sAxis=options.axis=='x',sDirection=sAxis?'left':'top',sSize=sAxis?'Width':'Height';var iScroll,iPosition={start:0,now:0},iMouse={};if(this.length>1){this.each(function(){$(this).tinyscrollbar(options)});return this;}
this.initialize=function(){this.update();setEvents();};this.update=function(){iScroll=0;oViewport[options.axis]=oViewport.obj[0]['offset'+sSize];oContent[options.axis]=oContent.obj[0]['scroll'+sSize];oContent.ratio=oViewport[options.axis]/oContent[options.axis];oScrollbar.obj.toggleClass('disable',oContent.ratio>=1);oTrack[options.axis]=options.size=='auto'?oViewport[options.axis]:options.size;oThumb[options.axis]=Math.min(oTrack[options.axis],Math.max(0,(options.sizethumb=='auto'?(oTrack[options.axis]*oContent.ratio):options.sizethumb)));oScrollbar.ratio=options.sizethumb=='auto'?(oContent[options.axis]/oTrack[options.axis]):(oContent[options.axis]-oViewport[options.axis])/(oTrack[options.axis]-oThumb[options.axis]);setSize();};function setSize(){if(!sAxis)oContent.obj.removeAttr('style');oThumb.obj.removeAttr('style');iMouse['start']=oThumb.obj.offset()[sDirection];var sCssSize=sSize.toLowerCase();oScrollbar.obj.css(sCssSize,oTrack[options.axis]);oTrack.obj.css(sCssSize,oTrack[options.axis]);oThumb.obj.css(sCssSize,oThumb[options.axis]);};function setEvents(){oThumb.obj.bind('mousedown',start);oTrack.obj.bind('mouseup',drag);if(options.scroll&&this.addEventListener){oWrapper[0].addEventListener('DOMMouseScroll',wheel,false);oWrapper[0].addEventListener('mousewheel',wheel,false);}
else if(options.scroll){oWrapper[0].onmousewheel=wheel;}};function start(oEvent){iMouse.start=sAxis?oEvent.pageX:oEvent.pageY;var oThumbDir=parseInt(oThumb.obj.css(sDirection));iPosition.start=oThumbDir=='auto'?0:oThumbDir;$(document).bind('mousemove',drag);$(document).bind('mouseup',end);oThumb.obj.bind('mouseup',end);return false;};function wheel(oEvent){if(!(oContent.ratio>=1)){oEvent=$.event.fix(oEvent||window.event);var iDelta=oEvent.wheelDelta?oEvent.wheelDelta/120:-oEvent.detail/3;iScroll-=iDelta*options.wheel;iScroll=Math.min((oContent[options.axis]-oViewport[options.axis]),Math.max(0,iScroll));oThumb.obj.css(sDirection,iScroll/oScrollbar.ratio);oContent.obj.css(sDirection,-iScroll);oEvent.preventDefault();};};function end(oEvent){$(document).unbind('mousemove',drag);$(document).unbind('mouseup',end);oThumb.obj.unbind('mouseup',end);return false;};function drag(oEvent){if(!(oContent.ratio>=1)){iPosition.now=Math.min((oTrack[options.axis]-oThumb[options.axis]),Math.max(0,(iPosition.start+((sAxis?oEvent.pageX:oEvent.pageY)-iMouse.start))));iScroll=iPosition.now*oScrollbar.ratio;oContent.obj.css(sDirection,-iScroll);oThumb.obj.css(sDirection,iPosition.now);;}
return false;};return this.initialize();};})(jQuery);



// Made by Modo Design Group (www.mododesigngroup.com)
// Last updated: 06/08/2011

var videoId;
var timer123;
	
$.fn.video = function(){
	var video = '<div id="video"><div class="container"><div class="body"><div class="meta"><p class="name"></p><p class="author"></p></div><div class="exit"><a href="">Close</a></div><div class="video"><div id="videoembed"></div></div><div class="player"><a class="playpause playing" href="">play/pause</a><a class="sound unmuted" href="">sound</a><div class="duration"><span class="part"><span class="marker"></span></span></div></div></div></div></div>';
	
	$('body').prepend(video);
	$('#video a, a[rel=video]').click(function(e){ e.preventDefault(); });
	
	var c = $('#video');

	
	$(this).click(enter);
	$('.exit a', c).click(exit);
	$('.playing', c).live('click', pause);
	$('.paused', c).live('click', play);
	$('.sound', c).live('click', sound);
	$('.duration', c).live('click', function(e){
		var parentOffset = $(this).offset();
		var relX = e.pageX - parentOffset.left;
		var percent = relX / $('.duration', c).width();
		var timecode = Math.round(ytplayer.getDuration() * percent);
		ytplayer.seekTo(timecode, true);
	});
	
	function enter(){
		videoId = $(this).attr('href');
		c.show();
		embedPlayer();
		$.ajax({
		    url: 'http://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json',
		    dataType: "jsonp",
		    success: function (data) { parseresults(data); }
		});
	};
	
	function exit(){
		clearInterval(timer123);
		ytplayer.stopVideo();
		c.fadeOut(250);
	};
	
	function embedPlayer() {
	    var params = { allowScriptAccess: 'always' };
	    var atts = { id: 'myytplayer' };
	    swfobject.embedSWF('http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer', 'videoembed', '853', '479', '8', null, null, params, atts);
	};
	
	function play(){ 
		if(ytplayer){
			ytplayer.playVideo();
			$(this).removeClass('paused').addClass('playing');
		}
	};
	
	function pause(){
		if(ytplayer){
			ytplayer.pauseVideo();
			$(this).removeClass('playing').addClass('paused');
		}
	};
	
	function sound(){
		if(ytplayer && ytplayer.isMuted()){
			ytplayer.unMute();
			$(this).removeClass('muted').addClass('unmuted');
		} else {
			ytplayer.mute();
			$(this).removeClass('unmuted').addClass('muted');
		};
	};
	
    function parseresults(data) {
    	$('.name', c).html(data.entry.title.$t);
        $('.author', c).html(data.entry.author[0].name.$t);
    };
};

// set up callback listener
function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById('myytplayer');
	ytplayer.loadVideoById(videoId);
	timer123 = setInterval(updateytplayerInfo, 250);
};

function updateytplayerInfo() {
    if (ytplayer) {
        var all = ytplayer.getDuration();
        var part = ytplayer.getCurrentTime();
       	var percent = Math.round((part / all) * 100);
        $('.part').width(percent + '%');
    }
}
