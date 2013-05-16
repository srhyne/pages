;(function($){
	
	//option obj, $ window, "div."+ns
	var _opts, _window, _content, selector, currentPage, useiScroll,
	
		//private methods
    _collapse, _fb, _open, _all, _onBeforeScrollStart,
		
		//exported methods
		find, init, repaint, add, drop, back, forward, names, has, isSinglePage, 
		
		//public methods object
		methods, 
		
		//plugin namespace
		ns = 'pages';
		
		//options
	_opts = {
		cls : "page", 
		//animate 
		css3 : {
			leaveTransforms : true,
			useTranslate3d : true	
		},
    twoPageMinWidth : 767, //change to 768 to go 1 page on ipad in portrait
		time :  1000	
	};
	
	//closes all pages that aren't currently animated
	//TODO return object
	_collapse = function(pages, time, cb){
	  var _anim, notClosed, _selector;
	  
    _anim = $.extend({}, _opts.css3, {left : 0});
    _selector = ":first, .closed";
			//took out :animated from filter because it was causing problems inside the profile.
    notClosed = pages.not(_selector); 
    
		cb = typeof cb === 'function' ? cb : function(){ return false; };	
		time = time <= _opts.time ? time : _opts.time;
		
		!notClosed[0] && cb();

		notClosed && notClosed.animate(_anim, time, 'easeOutCirc',function(){
      notClosed.addClass('closed');
			cb();
		});

		return pages;
	
	};
	
	
	_fb = function(dir, cb){
		var _pages = _all(),
			method = dir === 'back' ? "parents" : "children"; 
			toOpen = _pages.filter("."+ns+":first, .closed").last()[method](selector).eq(0); 	
		return open(toOpen, cb);
	};
	
	_open2 = function(){
		var o, _this, _pages;
		
		o = _open2;
		_this = o._this;
	
		//don't use children here. We want all not the last one
		_pages = _this.find(selector);
    
		if(!_pages[0]){
			return false;
		}

		if(o.timer) clearTimeout(o.timer)

		o.timer = setTimeout(function(){
    	$.publish( ns + '.opening');    
    }, 1);

		o._this = null;					
		return _pages.removeClass('closed').updateX();
	};
	
	_open = function(){
		var toClose = this.parents(selector).andSelf();
		_open2._this = this;
		_collapse(toClose, _opts.time,  _open2); 
	};
	
  _all = function(){
    return _content.find(selector);
  };
  
  
	//----------------------------------------------private methods exported----------------------------//
	//check for animate
	//TODO check for double init
	init = function(customOpts, callback){
		var og = window.location.origin + '/';

		//set closure vars (See TOP);
		_window = $(window);
		selector = "div."+_opts.cls;
		
		//TODO I don't think you need to re-assign that here. 
		_opts = $.extend(_opts, customOpts || {}, true);	
		// add opts data to scope
	
	
		//testing this
	  Modernizr.load([
      {
      	//load them regardless
        test : Modernizr.touch,
        //sans touch is prety much JUST hotkeys
        nope : [og + 'pages/js/min/sans_touch.min.js']
	    }
	  ]);
	  
	  //even though iScroll is in touch/sans_touch interfaces, don't add swipe 
	  //to desktop.
    // Modernizr.touch && _content.swipe(selector);
		
		Modernizr.addTest('overflowscrolling', function(){
  		return Modernizr.testAllProps("overflowScrolling");
		});	

		useiScroll = (!Modernizr.overflowscrolling && iScroll);

		return $[ns];
	};
	
	
	isSinglePage = function(){
    return (_window.width() <= _opts.twoPageMinWidth ? true : false);    
  };
  
  //repaint the animation offsets of the panels..
	repaint = function(){
    var pages;
    
	  pages = _all();
	  
	  if(pages.length === 0){
	    return false;
	  }
	  
    pages.filter(':not(.closed)').updateX();
    
    if( isSinglePage() ){
      return _open.call( pages.last() );
    }
    

    (pages.length >= 2) && _open.call( pages.slice(-2, -1) );
    return true;

	};
	

	function t() { return new Date().getTime(); }
	
	//@param el $ object or html that's being i	nserted into the new page
	// this in callback refers to the el being added NOT .page (TODO change this?)
	add = function(el, name, callback, extraClasses){
		var _el, w, pages, pageCount, lastPage,
		    container, singlePage, offset, _anim, 
		    pageContent, _page;
		
		extraClasses = extraClasses || '';

		//make a jquery collection even if it is already
		_el = $(el); 
		//get all pages
		pages = _all(); 
		pageCount = pages.size();
		//close pages before adding
		if(pageCount !== 0){
			_collapse(pages);
		}
		
		//get last div.page if their is one
		lastPage = pages.last();
		//if there is a current div.page this will be our container NOT our scope this object
		container = lastPage[0] ? lastPage : this;
		
		//get width of container //cache this?
		singlePage = isSinglePage();
		offset = (pageCount === 0 || singlePage || extraClasses.indexOf('expanded') !== -1) 
							? 0 
							: lastPage.width();
										
		// offset = Math.round(offset);
		
		_anim = {
			left : offset
		};
		
		//testing
		
		_anim = $.extend({}, _opts.css3, _anim);
		
    pageContent = $('<div/>', { 
		    'class' : 'page-content ' + (!useiScroll ? 'scroller' : ''),
		    html : _el
		});
		  
    _page = $("<div/>",{
      id : ns + "-" + t(),
			'class' : _opts.cls + ' ' + extraClasses, //dont take off index class!
			html : pageContent
		})
		.data({
			pages : { 
				offset : singlePage ? 0 : offset,  
				name : name ? name : ns+"_"+pageCount
			} 	
		})
		.slide(this.width(), {
		  right : 0, 
			left : 0,
			"z-index" : 2
		})
		.appendTo(container)
		.animate(_anim, _opts.time, "easeOutCirc", function(){ 
			var scrollers, scrollSettings, _iScroll;

		  scrollers = _el.find('.scroller');
		  scrollSettings = { 
		  	vScrollbar : false, 
		  	onBeforeScrollStart : _onBeforeScrollStart
		  };
		  _iScroll = iScroll;

		  if(useiScroll){
		  	if(scrollers[0]){
		  		scrollers.each(function(){
            _iScroll[ 'scroller-' + t() ] = new _iScroll(this, scrollSettings);
          });
		  	}
		  	else if( extraClasses.indexOf('no-scrolling') === -1 ){
		  		_iScroll[ 'default-' + t() ] = new _iScroll(pageContent[0], scrollSettings);
		  	}
		  }

      return typeof callback === 'function' && callback.call(_el);
		});
		
  	$.publish(ns + '.opening');
    //this could faster instead of using selector..
		return $[ns]; //singlePage ? $[ns]('expand', ':last') : $[ns];
	};

	
	
  _onBeforeScrollStart = function(e){
  	var _target = $(e.target);
  	
  	if(_target.is(':input, [draggable], option')){
  		return false;
  	}
  	
		//this is not an input so let's prevent default and return true
		e.preventDefault();
  	return true;
  };


	//@param s mixed selector int index, string searches for $(selector).data('key'+ns);
	find = function(s, callback){
		var _pages, _page;
		//no page or number passed
		if(typeof s === 'undefined'){
			console.log('no element or selector passed for selection');
			return $[ns];
		}
		_pages = _all();
		_page = typeof s === 'number' 
				? _pages.eq(s) 
					: s instanceof jQuery ? s : _pages.filter(s);
					
		//call with page as context			
		typeof callback === 'function' && callback.call(_page);			
		return $[ns];			
	};
	
	
	drop = function(s, callback){
		return find(s,function(){
			this.remove();
			typeof callback === 'function' && callback();
		});
	};
	
	//TODO you need a cb here!
	open = function(s){
		return find(s, _open);
	};
	
	back = function(cb){
		return _fb('back', cb);
	};
	
	forward = function(cb){
		return _fb('forward', cb);	
	};
	
	names = function(cb){
		var _names = [];
    _all().each(function(i){
			var data = $(this).data(ns) || {};
			_names.push(data.name || ns + " " + i);
		});
		return _names;
	};

	has = function(name){
		return names().indexOf(name) !== -1;
	};

	function promote () {
		var pages, parent, child;

		pages = _all();
		
		if(pages.length < 2){
			return $[ns];
		}

		parent = pages.eq(0);
		//first.children(selector).detach();
		child =  pages.eq(1).detach(); 
		parent.replaceWith(child);

		return $[ns];
	}

	function each (cb) {
		_all().each(cb);
	}
			
	methods = {
		init : init, 
		repaint : repaint,
		add : add, 
		drop : drop, 
		find : find, 
		each : each,
		open : open, 
		back : back, 
		forward : forward, 
		names : names, 
		has : has, 
		isSinglePage : isSinglePage, 
		promote : promote
	};
	
	
	//:pages(name)
	$.expr[':'][ns] = function(a, i, m){
		var pageData = $(a).data(ns) || {};
		return pageData.name === m[3];
	};

  $.fn.log = function(){
    console.log(this);
    return this;
  };
	
	//apply a x transform..
	$.fn.slide = function(x, css){
	  var styles;
	  
    styles = $.extend({
      "-webkit-transform" : "translate3d("+x+"px,0,0)",
			"-moz-transform" : "translate("+x+"px,0)",
    }, css || {})
    
	  return this.css(styles);
	 
	}
	
	//reposition x tranform based on parent
  $.fn.updateX = function(){
    
    this.each(function(){
      var _this, pWidth;
      _this = $(this);
      pWidth = _this.parents(selector).eq(0).width();
      _this.slide(pWidth);
    });
    
   
    return this;
  }

	
  
	
	$[ns] = function( method ) {
		_content = _content === undefined ? $('#content') : _content;
	    if(methods[method]){
	      return methods[method].apply( _content, Array.prototype.slice.call( arguments, 1 ));
	    } 
		return $.error( 'Method ' +  method + ' does not exist on jQuery.' + ns );
	};
	
	
})(window.jQuery);