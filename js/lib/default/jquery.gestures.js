!function(GLOBAL){
  
  var $ = GLOBAL.jQuery;
  var modernizr = GLOBAL.Modernizr;

  
  $.fn.swipe = function(selector, cb){ 
    var _selector, _page, offset, start, move, end;
     
    _selector = selector + ":not(.pages-0)"; //don't overide original selector
    offset = null;  
    
    
    start = function(e) {  
      var orig, pos, _this;
      
      //e.stopPropagation();
      _page = this;
      
      orig = e.originalEvent;  
      _this = $(this);
            
      pos = _this.position();  
       
      offset = {  
        prevX : pos.left,
        prevY : pos.top,
        x : orig.changedTouches[0].pageX,
        y : orig.changedTouches[0].pageY
      };  
            
      
    };  
    
    move = function(e){  
      var orig, y;
    
      if(_page !== this){
        return true;
      }
      
      //e.stopPropagation();
      orig = e.originalEvent;  
      offset.diffX = offset.x - orig.changedTouches[0].pageX;
      offset.diffY = offset.y - orig.changedTouches[0].pageY;
      
    };  
    
    end = function(e){
      var _this, _anim, parentPage, dir, parentWidth, x;
      
      
      if(Math.abs(offset.diffY) > 20 && _page !== this){
        return true
      }
      
      e.stopPropagation();
      

      dir = offset.diffX >= 40 ? "forward" : offset.diffX <= -40 ? "back" : false;

      if(dir){
        return window.history[dir]();
      }

      return false;

      /*
       this was the old way but it would break the history system..
      _this = $(this);
      _anim = $.extend({}, {
  			  leaveTransforms : true,
    			useTranslate3d : true
      });
      

      // var posDiff = _this.position().left - offset.prevX;
      dir = offset.diffX >= 40 ? "left" : offset.diffX <= -40 ? "right" : false;

      parentWidth = _this.parents(selector).eq(0).width();
      x = dir === 'right' ? parentWidth + 1 : dir === 'left' ? 0 : offset.prevX;
         
      //dragging from left to right
  		_anim.left = x;
  		_this.addClass('sliding').animate(_anim, 500, "easeOutCirc",function(){
        var classMethod = dir === 'left' ? 'add' : 'remove';
  			//add or remove class depedning on direction	
  			_this[classMethod+"Class"]('closed').removeClass('sliding');
    	});
       */
    };
  
  
    this
      .on('touchstart', _selector, start)
      .on("touchmove", _selector, move) 
      .on('touchend', _selector, end);
  };
  

  /**
   * Testing helper method, 
   * trigger the desired click or test method
   * 
   * @param  {[bool]} Override Modernizr
   */
  $.fn.tapIt = function(useClick){
    
    if(useClick || !Modernizr.touchy){
      return this.trigger('click');
    }

    return this.trigger('touchstart').trigger('touchend');
  };


  $.fn.tap = function(selector, cb){
    
    var nav, _moved, _start, _end, ua, androidChrome;

    ua = window.navigator.userAgent.toLowerCase();
    androidChrome = (ua.indexOf('android') !== -1 && ua.indexOf('chrome') !== -1);
    
    if( !Modernizr.touchy || androidChrome){
      return this.on('click', selector, cb);
    }
    
    if(typeof selector === 'function' && !cb) {
      cb = selector;
      selector = '';
    }

    _moved = false;
    
    //TODO namespace this.. 
    this
    .on('touchstart.tappable', selector, function(e){
      _start = this;
    })
    .on('touchmove.tappable', selector, function(e){
      _moved = true;
    })
    .on('touchend.tappable', selector, function(e){
      if(_moved === false && _start === this){
       cb.apply(this, arguments)  
      }
      
      _moved = false;
      _start = undefined;
      _end = undefined;
    });
    
    return this;
  }
  
  

  
}(window);

