!function(GLOBAL){
  var dom, $;
  
  dom = {};
  $ = GLOBAL.jQuery;

  $.fn.log = function(){
    console.log( this );
    return this;
  };
  

  //cache selectors
  function cache(){
    dom.body = $("body");
		dom.wrapper = dom.body.find("#wrapper");
    dom.menu = dom.wrapper.find('#menu');
		dom.content = dom.wrapper.find("#content");
		dom.history = dom.body.find('#history');
    dom.historyList = dom.history.next('#history-list');
		dom.win = $(window);
  }
  
  function pagesInit(){
    var wWidth, menuWidth, opts;
    
    
    wWidth = dom.win.width();
    menuWidth = dom.menu.is(':visible') ? dom.menu.outerWidth() : 0;
    
    opts = { 
      minWidth : 1 - (menuWidth/wWidth), 
      topPos : $('#header').outerHeight(),
      time : wWidth <= 320 ? 500 : 700
      // time : 700
    };
    
    //start pages
		$.pages('init', opts);
		//export do
    $.pages.dom = dom;
    $.publish('pages.init');
  }
  
  
  function init(){
    cache();
    addEvents();
    pagesInit();
  }
  
  function addEvents(){
    
    //ugly nav code
    $("#nav")
    .tap('a[data-page]',function(e){
      var dir = $(this).data('page');
      window.history[dir]();
    });
        
    dom.history.click(function(){
  		var html = "";
  		$.pages('names').forEach(function(name){
  			html += "<li><a href='#' data-page='"+name+"'>"+name+"</a></li>";
  		});
      dom.historyList.html(html);
  	});

    dom.historyList.delegate("a", "click", function(e){
  		var page = $(this).data('page');
  		$.pages('open', ":pages("+page+")");
  		e.stopPropagation();
  	});
      
    dom.menu
      .delegate("li", "click",function(e){
        var _this = $(this), dir, _sibs;
  				dir = _this.data('dir');
  				_sibs = _this.siblings().removeClass('highlighted').end().addClass('highlighted');
  				e.stopPropagation();
      });
      
    dom.content
    .tap('tr[data-page]',function(e){
      var _this, data;
      
      _this = $(this);
      data = _this.data();
      
      //add selection
      _this.addClass('selected').siblings().removeClass('selected');
      
      $.publish('pages.new', [data])
      e.stopPropagation();
    });
    
  }
  

  $(init);
  
}(window);