var Application = function() {
  this.
};

Application.prototype.init = function() {
  $.ajax("http://norm.hookdevz.com/projects/ad-tester/tests.json").done(function(data) {
    console.log(data);
  });
};
