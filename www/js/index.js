var Application = function(listContainer) {
  this.listContainer = listContainer;
};

Application.prototype.init = function() {
  this.testContainer = new TestContainer(this.listContainer);
  $.ajax("http://norm.hookdevz.com/projects/ad-tester/tests.json").done(function(data) {
    console.log(data);
    for(var i = 0; i < data.urls.length; i++) {
      var test = Test.createTest(data.urls[i]);
      this.testContainer.addTest(test);
    }
  }.bind(this));
};

var TestContainer = function(domElement) {
  this.element = domElement;
};

TestContainer.prototype.addTest = function(test) {
  var testView = new TestView(test);
  this.element.append(testView.element);
};

TestContainer.prototype.addTests = function(tests) {
  for(var i = 0; i < tests.length; i++) {
    var test = tests[i];
    this.addTest(test);
  }
};

var TestView = function(test) {
  this.test = test;
  this.anchor = $("<a/>");
  this.anchor.attr("href", this.test.href);
  this.anchor.text(test.name);
  this.element = $("<div/>");
  this.element.append(this.anchor);
};

var Test = function() {

};

Test.prototype.url = null;
Test.prototype.name = null;
Test.createTest = function(data) {
  var test = new Test();
  test.href = data.href;
  test.name = data.name;
  return test;
};
