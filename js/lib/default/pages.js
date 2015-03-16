;(function($, Modernizr){
	
	//option obj, $ window, "div."+ns
	var _opts, _window, _content, selector, currentPage, useiScroll,
	
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
			useTranslate3d : true, 
			leaveTransitions : true
		},
    twoPageMinWidth : 767, //change to 768 to go 1 page on ipad in portrait
		time :  1000	
	};


	//add easeOutCirc easing for fallback on non css3 animations
	$.extend( $.easing, {

		easeOutCirc: function (x, t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		}

	});


	/**
	 * Close all pages that aren't already closed, excluding the first page
	 * @param  {jQuery array}   pages a collection of pages
	 * @param  {int}   time how much time to spend animating
	 * @param  {Function} cb    callback to call after animating
	 * @return {$ Array}     return the pages that were just processed
	 */
	function _collapse(pages, time, cb){
	  var _anim, _selector, pagesToUpdate, isAnimLeft, animLeft;
	  
    _anim = $.extend({}, _opts.css3, {left : 0});
    _selector = ":first, .closed";
			//took out :animated from filter because it was causing problems inside the profile.
    pagesToUpdate = pages.not(_selector); 
    
		cb = typeof cb === 'function' ? cb : function(){ return false; };	
		time = time <= _opts.time ? time : _opts.time;
		
		if( !pagesToUpdate[0] ){
			cb();
			return pages;
		}

		isAnimLeft = $([]);
		animLeft = $([]);

		//todo is this going to be slow?
		pagesToUpdate.each(function(){
			var left, bucket;

			left = this.getBoundingClientRect().left;
			bucket =  left === 0 ? isAnimLeft : animLeft;
			bucket.push(this);
		});

		isAnimLeft[0] && isAnimLeft.addClass('closed');

		animLeft[0] && animLeft.animate(_anim, time, 'easeOutCirc',function(){
      animLeft.addClass('closed');
			cb();
		});

		return pages;
	
	}

	/**
	 * experimental way to get the next page not open
	 * @return {[type]} [description]
	 */
	function getNextNotVisible () {
		var width, page;

		width = _content.width();
		page = $([]);

		_all().each(function(){
			var _this = $(this);
			 if( _this.offset().left >= width){
			 	page = _this;
			 	return false;
			 }
		});

		return page;
	}


	/**
	 * Experimental! way to get the next one to open.
	 * @param  {[type]} dir [description]
	 * @return {[type]}     [description]
	 */
	function toOpen(dir, just_name) {
		var method, next, width;

		if(dir === 'back'){
			next = _all().filter("."+ns+":first, .closed").last().parents(selector).eq(0); 
		}
		else{
			next = getNextNotVisible();
		}

		if(!just_name){
			return next;
		}

		return getName(next[0]);
	}

	/**
	 * Experimental! helper for driving fb to go back a page
	 * @param  {Function} cb callback after opening
	 * @return {[type]}      [description]
	 */
	function back(cb){
		return open(toOpen('back'), cb);
	}
	
	/**
	 * Experimental! go forward a page (doesn't fire route)
	 * @param  {Function} cb callback to be called after opening
	 * @return {jquery collection}     pages
	 */
	function forward(cb){
		return open(toOpen('forward'), cb);
	}

	/**
	 * the very last open call
	 * @return {[mixed]} returns either false or the pages
	 * being opened
	 */
	function _open2(){
		var o, _this, _pages;
		
		o = _open2;
		_this = o._this;

		if(!_this){
			return false;
		}
	

		//don't use children here. We want all not the last one
		_pages = _this.find(selector);
    
		if(!_pages[0]){
			return false;
		}

		if(o.timer) clearTimeout(o.timer);

		// console.log('_this', _this);
		// console.log('pages', _pages);

		o.timer = setTimeout(function(){
			publish('opening', _pages);
    }, 1);

		o._this = null;					
		return _pages.removeClass('closed').updateX();
	}
	
	/**
	 * Sets up the open2 callback after collapsing the
	 * pages that need to close
	 * @return {[type]} [description]
	 */
	function _open(){
		var toClose = this.parents(selector).andSelf();
		_open2._this = this;
		_collapse(toClose, _opts.time,  _open2); 
	}
	
	/**
	 * get all _ops.cls 'pages'
	 * @return $ Array
	 */
  function _all(){
    return _content.find(selector);
  }
  
 	/**
 	 * Bootstrap function that sets up pages..
 	 * sets up caching, modernizr loads, and options
 	 * @param  {Object}   customOpts options to override defaults
 	 * @return {[type]}              [description]
 	 */
	function init(customOpts){
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
        test : Modernizr.touchy,
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

		//it's loaded, we are mobile and we have no overflow scrolling system
		useiScroll = canUseiScroll();

		return $[ns];
	}
	
	/**
	 * calculation function for checking whether or not
	 * the page should be in a single or two page layout
	 * @return {Boolean} [description]
	 */
	function isSinglePage(repaint){
		var self = isSinglePage;
		self._width = (!self._width || repaint) ? _window.width() : self._width;

    return (self._width <= _opts.twoPageMinWidth ? true : false);    
  }
  
  /**
   * restyles the pages when a change to the viewport is made
   * @return mixed bool or $ array
   */
	function repaint(){
    var pages;
    
	  pages = _all();
	  
	  if(pages.length === 0){
	    return false;
	  }
	  
    pages.filter(':not(.closed)').updateX();
    
    if( isSinglePage(true) ){
      return _open.call( pages.last() );
    }
    

    (pages.length >= 2) && _open.call( pages.slice(-2, -1) );
    return true;

	}
	
	/**
	 * get a timestamp for unique id's
	 * @return int timestamp
	 */
	function t() { 
		return new Date().getTime(); 
	}
	
	function publish (e, data) {
		$.publish(e + '.' + ns, [data]);
	}


	//@param el $ object or html that's being i	nserted into the new page
	// this in callback refers to the el being added NOT .page (TODO change this?)

	/**
	 * THE function for adding pages to the dom
	 * @param {Mixed}   el     Object, DOM element, or string html
	 * @param {String}   name  string name of page, for querying
	 *                         This is sort of a bad name for this param
	 *                         because it's usually the fragment of the
	 *                         route the page belongs to
	 *                         
	 * @param {Function} callback  executed after page animation
	 * @param {String}   extraClasses list of extra classes to add to page
	 * @param {String}   title would really be best passed in an Object
	 *                         with name but the use of title is new
	 *                         this is a bit of meta-data that is used
	 *                         to show a menu title in the UI 
	 */
	function add(el, name, callback, extraClasses, title){
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

				
		_anim = $.extend({}, _opts.css3, _anim);
		
    pageContent = $('<div/>', { 
		    'class' : 'page-content ' + (!useiScroll ? 'scroller' : ''),
		    html : _el
		});

    _page = $("<div/>",{
      id : ns + "-" + t(),
			'class' : _opts.cls + ' ' + extraClasses, //dont take off index class!
			html : pageContent
		});

		$.data(_page[0], {
			pages : { 
				offset : singlePage ? 0 : offset,  
				name : name === undefined ? (ns + "_" + pageCount) : name,
				title : title || ''
			}
		});

		_page.slide(this.width(), {
		  right : 0, 
			left : 0,
			"z-index" : 2
		})
		.appendTo(container)
		.animate(_anim, _opts.time, "easeOutCirc", function(){ 
			var scrollers, scrollSettings, _iScroll;

		  scrollers = _el.find('.scroller');
		  _iScroll = iScroll;

		  if(useiScroll){
		  	if(scrollers[0]){
          scrollers.useiScroll();
		  	}
		  	else if( extraClasses.indexOf('no-scrolling') === -1 ){
          pageContent.useiScroll();
		  	}
		  } else {
        _el.css('height', _el.height());
      }
		  publish('opened', _page);
      return typeof callback === 'function' && callback.call(_el, _page);
		});
		
		publish('opening', _page);
    //this could faster instead of using selector..
		return $[ns]; //singlePage ? $[ns]('expand', ':last') : $[ns];
	}

	
	
  function _onBeforeScrollStart(e){
  	var _target = $(e.target);
  	
  	if(_target.is(':input, [draggable], option') || _target.closest('[contenteditable]').size() > 0){
  		return false;
  	}
  	
		//this is not an input so let's prevent default and return true
		e.preventDefault();
  	return true;
  }


	//@param s mixed selector int index, string searches for $(selector).data('key'+ns);
	function find(s, callback){
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
		typeof callback === 'function' && _page && callback.call(_page);			
		return $[ns];			
	}
	
	
	function drop(s, callback){
		return find(s,function(){
			this.remove();
			typeof callback === 'function' && callback();
		});
	}
	
	//TODO you need a cb here!
	function open(s){
		return find(s, _open);
	}
	
	/**
	 * get the name of a page..
	 * @param div element page NOT jquery wrapped.
	 * @return string page name
	 */
	function getName (page, index) {

		if(!page){
			return false;
		}

		return _getDataKey(page, 'name', ns + "_" + ( index || t() ) );
	}

	/**
	 * get a data key bound to the jQuery.data(ns)
	 * @param  {String} key     the data key
	 * @param  {Mixed} default value if no key value foudn
	 * @return {Mixed} either data.key or default value;
	 */
	function _getDataKey (page, key, _default) {
		var data;

		data = _getData(page);

		return (data[key] === undefined) ? _default : data[key];
	}

	/**
	 * get the namespace data on a page
	 * @param  {Object} page DOM div or jQuery instace
	 * @return {Object} dictionary of values
	 */
	function _getData (page) {
		var data = {};

		page = is_jQuery(page) ? page[0] : page;

		if(!page){
			return data;
		}

		return $.data(page, ns) || data;
	}

	/**
   * set data key & value to the page
   * @param {Mixed} page  page selector
   * @param {string} key the ns for the pages dom data
   * @param {mixed} value the value for the data.key = 
   */
  function _setData (page, key, value) {
  	find(page, function(){
  		_getData(this)[key] = value;
  	});
  	return $[ns];
  }

	/**
	 * simple test to whether or not a variable
	 * is a jQuery instance
	 * @param  {Object}  el  DOM element or jQuery collection
	 * @return {Boolean}    [description]
	 */
	function is_jQuery(el) {
  	return (el instanceof jQuery);
  }

  /**
   * set the title of the page,
   * which can be used in the UI to change
   * the window or nav title
   * @param {Mixed} page  selector or page jQuery instance
   * @param {$.pages} returns this
   */
  function setTitle (page, title) {
  	return _setData(page, 'title', title);
  }

  /**
   * set the title of the page,
   * which can be used in the UI to change
   * the window or nav title
   * @param {Mixed} page  selector or page jQuery instance
   * @return {String} pages string
   */
  function getTitle (page) {
  	var t;

  	find(page, function(){
  		t = _getDataKey(this, 'title', '');
  	});

  	return t;
  }

  /**
   * set whether or not a page if fully loaded
   * with the correct module data.. 
   * @param {[type]} page [description]
   * @param {[type]} flag [description]
   */
  function setLoaded (page, flag) {
  	return _setData(page, 'loaded', flag);
  }

	/**
   * set whether the page is loaded or not
   * which can be used in the UI to change
   * the window or nav title
   * @param {Mixed} page  selector or page jQuery instance
   * @return {String} pages string
   */
  function getLoaded (page) {
  	var t;

  	find(page, function(){
  		t = _getDataKey(this, 'loaded', false);
  	});

  	return t;
  }

	/**
	 * get the routes/names of each page
	 * @return {array} list of names
	 */
	function names(){
		var _names = [];

		_all().each( function(i){
			_names.push( getName(this, i) );
		});
		
		return _names;
	}

	function has(name){
		return names().indexOf(name) !== -1;
	}

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
  
  function canUseiScroll() {
    return iScroll && (Modernizr.touchy && !Modernizr.overflowscrolling);
  }

	/**
   * Creates a first style setting
   * for slides & starting position when hitting add.
   * @return {[type]} [description]
   */
  function getTransformStyle () {
  	var agent, translate;

		agent = navigator.userAgent.toLowerCase();
		
		//no transitions then just use left/right
		if(!Modernizr.csstransitions || !Modernizr.csstransforms){
			return function( x ){
				return { 'left' : x };
			};
		}


		return function(x){
			var styles, transformAttr, translate;

			//setup a return style object
			styles = {};
			//setup the prefixed style attribute key
			transformAttr = Modernizr.prefixedAttrs('transform');

			//create the style values
			translate = 'translate';
			translate += Modernizr.csstransforms3d
										? '3d('+ x +'px, 0, 0)'
										: '('+ x +'px, 0)';
			styles[transformAttr] = translate;

			return styles;
		};

  }


	$.fn.slide = function slide(x, css){
		var styles;

		slide.style = slide.style || getTransformStyle();
		styles = $.extend(css || {}, slide.style(x) )
		
		return this.css(styles);
	}

	//reposition x tranform based on parent
  $.fn.updateX = function updateX(){

    updateX.each = updateX.each || function() {
    	var _this, pWidth;
      _this = $(this);
      pWidth = _this.parents(selector).eq(0).width();
      _this.slide(pWidth);
    };

    this.each(updateX.each);
    
    return this;
  };

  $.fn.log = function(){
    console.log(this);
    return this;
  };
  
  $.fn.useiScroll = function(options) {
    options = _.extend({ 
      vScrollbar : false, 
      onBeforeScrollStart : _onBeforeScrollStart
    }, options || {});
    
    return this.each(function() {
      iScroll[ 'scroller-' + t() ] = new iScroll(this, options);
    });
  };

  //:pages(name)
	$.expr[':'][ns] = function(a, i, m){
		var pageData = $.data(a, ns) || {};
		return pageData.name === m[3];
	};

	// $.single = $.single || function(a){return function(b){a[0]=b;return a}}($([1]));

	methods = {
		init : init, 
		repaint : repaint,
		add : add, 
		drop : drop, 
		find : find, 
		each : each,
		open : open,
		toOpen : toOpen,
		back : back, 
		forward : forward, 
		names : names, 
		name : getName,
		has : has, 
		isSinglePage : isSinglePage, 
		promote : promote, 
		getTitle : getTitle,
		setTitle : setTitle,
		getLoaded : getLoaded,
		setLoaded : setLoaded,
    canUseiScroll: canUseiScroll
	};

	$[ns] = function( method ) {
		_content = _content === undefined ? $('#content') : _content;
	    if(methods[method]){
	      return methods[method].apply( _content, Array.prototype.slice.call( arguments, 1 ));
	    } 
		return $.error( 'Method ' +  method + ' does not exist on jQuery.' + ns );
	};
	
	
})(window.jQuery, window.Modernizr);