// not being used by pages
$.fn.drag = function(selector, cb){ 
  var _selector, scrolling = false, offset, start, move, end;
   
  _selector = selector + ":not(.pages-0)"; //don't overide original selector
  offset = null;  
  start = function(e) {  
    var orig, pos, _this;
    
    e.stopPropagation();
    orig = e.originalEvent;  
    _this = $(this);
    
    pos = _this
            .css({
              '-webkit-transition-timing-function' : 'linear',
      				'-webkit-transition-duration' : '1ms'
            })
            .position();  
    
    offset = {  
      prevX : pos.left,
      prevY : pos.top,
      y : orig.changedTouches[0].pageY - pos.top,
      x : orig.changedTouches[0].pageX - pos.left
    };  
    
    
    
  };  
  
  move = function(e) {  
    var orig, x, y, changeY, changeX
  
    orig = e.originalEvent;  
    
    x = orig.changedTouches[0].pageX - offset.x;
    y = orig.changedTouches[0].pageY - offset.y;
          
    e.stopPropagation();
    
    
    var changeX = Math.abs(x - offset.prevX);    
    var changeY = Math.abs(y - offset.prevY);
    
    //removes full app pulldown keep!
    if(offset.prevY - y <= 0){
      e.preventDefault();        
    }
    
    return this.style.webkitTransform = "translate3d("+x+"px, 0, 0)";
    
    
    $(this).css({
      '-webkit-transform' : "translate3d("+x+"px, 0, 0)"
    })
    
    // this.style.webkitTransform = 
  
  };  
  
  end = function(e){
    var _this, _anim, parentPage;
    
    e.stopPropagation();
    
    _this = $(this);
    _anim = $.extend({}, {
			  leaveTransforms : true,
  			useTranslate3d : true
    });

    
    var posDiff = _this.position().left - offset.prevX;
		var dir = posDiff >= 20 
		          ? "right" 
		            : posDiff <= -20 
		              ? "left" 
		              : false;
		              	              
    var parentWidth = _this.parents(selector).eq(0).width();
    var x = dir === 'right' 
            ? parentWidth + 1 
            : dir === 'left' 
              ? 0
              : offset.prevX
    
    
    return _this.css({
      "-webkit-transition" : "-webkit-transform 700ms cubic-bezier(0.075, 0.82, 0.165, 1)",
      "-webkit-transform" : "translate3d("+x+"px, 0, 0)"
    });
    
		//end of mouseup actions
	};
  
  this
    .on('touchstart', _selector, start)
    .on("touchmove", _selector, move) 
    .on('touchend', _selector, end);
};