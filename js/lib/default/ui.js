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
    dom.container = dom.wrapper.find('#content-container');
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
    $.publish('init.pages');
  }
  
  
  function init(){
    cache();
    addEvents();
    pagesInit();
  }

  
  function addEvents(){
    var w, resizer;

    w = dom.win.width();

    dom.win.resize(function(){
      
      if(resizer) clearTimeout(resizer);

      resizer = setTimeout(function(){
        var _w = dom.win.width();
        if(w === _w){
          return true;
        }
        return $.pages('repaint');
      }, 200);

    });

    dom.history.click(function(){
      var html = "";
      $.pages('names').forEach(function(name){
        html += "<li><a href='#' data-route='"+name+"'>"+name+"</a></li>";
      });
        dom.historyList.html(html);
    });

  }
  

  $(init);
  
}(window);