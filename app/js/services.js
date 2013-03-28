// Demonstrate how to register services
// In this case it is a simple value service.
HN.value('version', '0.1');


/**
 * shodown implementation for markdown parser
 * https://github.com/coreyti/showdown
 */
HN.factory('$showdown',[function(){
  var Showdown = window.Showdown,
      converter = new Showdown.converter();
  return converter.makeHtml;
}]);


/**
 * marked implementation for markdown parser
 * https://github.com/chjj/marked/
 */
HN.factory('$marked', [function(){
  var marked = window.marked;
  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true
  });

  function trim (value) { return value.replace(/^\s+|\s+$/g, ''); }

  //wrap marked to escape extran final empty space generated by the marked library
  return function(markdown){ return trim(marked(markdown)); };
}]);


/**
 * $markdown abstration ( $showdon | $marked )
 */
HN.service('$markdown', ['$showdown', '$marked', function($showdown, $marked){
  //currently using $marked
  this.makeHtml = $marked;
}]);

HN.service('loading', ['$dialog', function($dialog){
  var _dialog;
  var _opts = {
    backdrop: true,
    keyboard: false,
    backdropClick: false,
    backdropFade: true,
    dialogClass: 'modal modal-loading',
    backdropClass: 'modal-backdrop modal-backdrop-loading',
    template: '<div class="loading"><i class="icon-spin1 animate-spin"></i><b>Loading</b> </div>'
  };

  this.show = function(){
    if(_dialog) this.hide();

    _dialog = $dialog.dialog(_opts);
    _dialog.open();
  };

  this.hide = function(){
    _dialog.close();
  };
}]);
/**
 * $slides service
 */
HN.service('$slides',['$markdown', function($markdown){
  function mapEachSlide(slides, mapperFunction){
    var mapResult = [];
    angular.forEach(slides, function(slide){
      mapResult.push(mapperFunction(slide));
    });
    return mapResult;
  }
  function breakToSlides(markdown){
    return markdown.split("\n\n\n");
  }
  function toObject(slideContent){
    return { html: $markdown.makeHtml(slideContent) };
  }

  this.fromMarkdown = function(markdown) {
    var slides = breakToSlides(markdown);
    return mapEachSlide(slides, toObject);
  };

}]);

