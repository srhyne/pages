!function($){
	
	//option obj, $ window, "div."+ns
	var _opts, _window, _content, selector, currentPage,
	
		//private methods
    _collapse, _fb, _open, _pushHistory, _popHistory,
		
		//exported methods
		expand, find, init, add, drop, back, forward,
		
		//public methods object
		methods, 
		
		//plugin namespace
		ns = 'pages',
		
		//options
	_opts = {
		cls : "page", 
		minWidth : 1,
		topPos : 40,
		pageSpacing : 0.5, 
    twoPageMinWidth : 767, //change to 768 to go 1 page on ipad in portrait
		//animate 
		css3 : {
			leaveTransforms : true,
			useTranslate3d : true	
		},
		time :  1000	
	};
	
	//closes all pages that aren't currently animated
	//TODO return object
	_collapse = function(pages, time, cb){
	  var _anim, notClosed, _selector;
	  
    _anim = $.extend({}, _opts.css3, {left : 0});
    _selector = "."+ns+"-0, .closed";
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
		var _pages = _content.find(selector), 
			method = dir === 'back' ? "parents" : "children"; 
			toOpen = _pages.filter("."+ns+"-0, .closed").last()[method](selector).eq(0); 	
		return open(toOpen, cb);
	};
	
	_open2 = function(){
		var _this, _pages, o;
		_this = _open2._this;
		//don't use children here. We want all not the last one
		_pages = _this.find(selector);
						
		if(!_pages[0]){
			return false;
		}
		
		o = _pages.last().data()[ns].offset;
		
		_open2._this = null;
		return _pages
				.removeClass('closed')
				//TODO firefox support needed
				.css("-webkit-transform", "translate3d("+o+"px, 0px, 0px)");
	
	};
	
	_open = function(){
		var toClose = this.parents(selector).andSelf();
		_open2._this = this;
		_collapse(toClose, _opts.time,  _open2); 
	};
	
	_pushHistory = function(){
    var name = (this.data(ns) || {}).name || "First Page";
    history.pushState({ name : name }, name);
	};
	
	//----------------------------------------------private methods exported----------------------------//

	//check for animate
	//TODO check for double init
	init = function(customOpts, callback){
		//holds namspaced events
		var pageEvents = {};
		
		//set closure vars (See TOP);
		_window = $(window), 
		selector = "div."+_opts.cls;
		
		//TODO I don't think you need to re-assign that here. 
		_opts = $.extend(_opts, typeof customOpts === 'object' ? customOpts : {}, true);	
		// add opts data to scope
	
		
	  Modernizr.load([
      {
        test : Modernizr.touch, 
        nope : ['pages/js/min/sans_touch.min.js'], 
        yep :['pages/js/min/touch.min.js']
	    }
	  ]);
	  
	
	  Modernizr.touch && _content.swipe(selector);
	
	
		//TODO remove this
		_window.bind("hashchange", function(){
			var hash = this.location.hash, 
				method = hash.split(":")[1];
			if(method && methods.hasOwnProperty(method)){
				$[ns](method);						
			}	
			this.location.hash = "";
		});
			
		return $[ns];
	};
	
	//@param el $ object or html that's being i	nserted into the new page
	// this in callback refers to the el being added NOT .page (TODO change this?)
	add = function(el, name, callback){
		var _el, w, pages, pageCount, lastPage, 
		    container, wHeight, wWidth, singlePage, 
		    offset, _anim, pageContent, _page;
		
		//make a jquery collection even if it is already
		_el = $(el);
		
		//window for calcs
		w = _window,
		 
		//get all pages
		pages = _content.find(selector);
		
		pageCount = pages.size();
		
		//close pages before adding
		if(pageCount !== 0){
			_collapse(pages);
		}
		
		//get last div.page if their is one
		lastPage = pages.last();
		
		//if there is a current div.page this will be our container NOT our scope this object
		container = lastPage[0] ? lastPage : this;
		
		//get get height of container
		wHeight = w.height();
		
		//get width of container //cache this?
		wWidth = w.width();
    singlePage = wWidth <= _opts.twoPageMinWidth ? true : false;

		
		offset = pageCount === 0 
					? wWidth - (wWidth * _opts.minWidth) 
					: wWidth * _opts.minWidth * (_opts.pageSpacing);
										
		offset = Math.round(offset);
		
		
		_anim = {
			left : offset + "px"
		};
		
		_anim = $.extend({}, _opts.css3, _anim);
		
    pageContent = $('<div/>', { 
		    'class' : 'page-content',
		    html : _el
		});
		  
    _page = $("<div/>",{
      id : ns+"-"+pageCount,
			'class' : _opts.cls +" "+ ns+"-"+pageCount, //dont take off index class!
			html : pageContent, 
		})
		.data({
			pages : { 
				offset : singlePage ? wWidth : offset,  
				name : name ? name : ns+"_"+pageCount
			} 	
		})
		.css({
			width : wWidth * _opts.minWidth * _opts.pageSpacing,
			right : 0, 
			left : 0,
			"-webkit-transform" : "translate3d("+wWidth+"px,0,0)",
			//TODO get rid of this have just one
			"-moz-transform" : "translate("+wWidth+"px,0)",
      height : wHeight - _opts.topPos,
      top : pageCount === 0 ? _opts.topPos : 0,
			"z-index" : 2
		})
		.appendTo(container)
		.animate(_anim, _opts.time, "easeOutCirc", function(){
		  
		  Modernizr.touch && iScroll && new iScroll(pageContent[0],{
		    vScrollbar : false
		  });
		  
			return typeof callback === 'function' && callback.call(_el);
		});
		
		_pushHistory.call(_page);
    
		return singlePage ? $[ns]('expand', ':last') : $[ns];
	};
	
	
	//@param s mixed selector int index, string searches for $(selector).data('key'+ns);
	find = function(s, callback){
		var _pages, _page;
		//no page or number passed
		if(typeof s === 'undefined'){
			console.log('no element or selector passed for selection');
			return $[ns];
		}
		_pages = _content.find(selector);
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
	
	expand = function(s){
		return find(s, function(){
			this.css({
				width : _window.width() * _opts.minWidth
			});
			_open.call(this);
		})
	};
	
	back = function(cb){
		return _fb('back', cb);
	};
	
	forward = function(cb){
		return _fb('forward', cb);	
	};
	
	names = function(cb){
		var _names = [];
		_content.find(selector).each(function(i){
			var data = $(this).data(ns) || {};
			_names.push(data.name || ns + " " + i);
		});
		return _names;
	};
			
	methods = {
		init : init, 
		add : add, 
		drop : drop, 
		find : find, 
		open : open, 
		expand : expand,
		back : back, 
		forward : forward, 
		names : names
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
	
	$[ns] = function( method ) {
		_content = _content === undefined ? $('#content') : _content;
	    if(methods[method]){
	      return methods[method].apply( _content, Array.prototype.slice.call( arguments, 1 ));
	    } 
		return $.error( 'Method ' +  method + ' does not exist on jQuery.' + ns );
	};
	
	window.addEventListener('popstate',function(e){
    var name = (e.state || {}).name || false;
    name && open(":"+ns+"('"+name+"')");
	})

}(window.jQuery);