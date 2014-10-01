var Application = function(testContainerView, historyContainerView) {
  this.testContainerView = testContainerView;
  this.historyContainerView = historyContainerView;
};

Application.prototype.init = function() {
  this.testContainer = new TestContainer(this.testContainerView);
  this.historyContainer = new HistoryContainer(this.historyContainerView);

  this.loadHistory();

  $.ajax("http://norm.hookdevz.com/projects/ad-tester/tests.json").done(function(data) {
    console.log(data);
    for(var i = 0; i < data.urls.length; i++) {
      var test = Test.createTest(data.urls[i]);
      this.testContainer.addTest(test);
    }
  }.bind(this));
};

Application.prototype.loadHistory = function(url) {
  if(window.localStorage.getItem('historyItems') == null) {
    window.localStorage.setItem('historyItems', JSON.stringify(new Array()))
  }
  var historyItems = window.localStorage.getItem('historyItems');
  this.historyItems = new Array();
  for(var i = 0; i < historyItems.length; i++) {
    var historyItem = historyItems[i];
    var history = new History();
    history.href = historyItem;
    this.historyItems.push(history);
  }

  for(var i = 0; i < this.historyItems.length; i++) {
    var historyItem = this.historyItems[i];
    this.historyContainer.addHistory(historyItem);
  }
};

Application.prototype.save = function(url) {
  var historyItems = JSON.parse(window.localStorage.getItem('historyItems'));
  historyItems.push(url);
  if(historyItems.length > 10) {
    historyItems.shift();
  }
  window.localStorage.setItem('historyItems', JSON.stringify(historyItems));
};

Application.prototype.goto = function(url) {
  this.save(url);
  window.location.href = url;
};

var HistoryContainer = function(domElement) {
  this.element = domElement;
};

HistoryContainer.prototype.addHistory = function(history) {
  var historyView = new HistoryView(history);
  this.element.append(historyView.element);
};

var HistoryView = function(test) {
  this.history = history;
  this.anchor = $("<a/>");
  this.anchor.attr("href", this.history.href);
  this.anchor.text(history.href);
  this.element = $("<div/>");
  this.element.append(this.anchor);
};

var History = function() {

};
History.prototype.href = null;
History.createHistory = function(data) {
  var history = new History();
  history.href = data.href;
  return history;
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
