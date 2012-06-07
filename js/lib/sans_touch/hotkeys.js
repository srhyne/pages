$(document)
  .bind("keydown","alt+left",function(){
    window.history.back();
  })
  .bind('keydown',"alt+right",function(){
    window.history.forward();
  });
