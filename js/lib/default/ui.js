!function(GLOBAL){
  var dom, $;
  
  dom = {};
  $ = GLOBAL.jQuery;

  //cache selectors
  function cache(){
    dom.body = $("body");
    dom.header = $("#header");
		dom.wrapper = dom.body.find("#wrapper");
    dom.menu = dom.wrapper.find('#menu');
		dom.content = dom.wrapper.find("#content");
		dom.history = dom.body.find('#history');
    dom.historyList = dom.history.next('#history-list');
		dom.win = $(window);
  }
  
  
  function pagesInit(){
    
    //start pages
		$.pages('init', {
		  time : dom.win.width() <= 320 ? 500 : 700
		});
		
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
    
    dom.win.resize(function(){
      $.pages('repaint');
    })
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
      
    dom
      .wrapper.find('ul.main-menu')
      .tap('li a', function(e){
        var _this = $(this), dir;
        dir = _this.parent().data('dir');
        
        //route base on the dir from the li
        $.publish('pages.route', [{ route : dir }]);
        // _sibs = 
        e.stopPropagation();
        e.preventDefault();


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