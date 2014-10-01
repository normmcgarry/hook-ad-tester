Array.prototype.unique = function(comparisonFn) {

  var a = this;
  for(var i=0; i<a.length; i++) {
    for(var j=i+1; j<a.length; j++) {
      if(comparisonFn) {
        var result = comparisonFn(a[i], a[j]);
        if(result) {
          a.splice(j, 1);
        }
      }
      else {
        if(a[i] == a[j]) {
          a.splice(j, 1);
        }
      }
    }
  }
  return this;
};

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
  if(window.localStorage.getItem('historyItems') == null || window.localStorage.getItem('historyItems') == "") {
    window.localStorage.setItem('historyItems', JSON.stringify({urls:[]}))
  }
  var historyItems = JSON.parse(window.localStorage.getItem('historyItems'));
  console.log(historyItems);
  this.historyItems = new Array();
  for(var i = 0; i < historyItems.urls.length; i++) {
    var historyItem = historyItems.urls[i];
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
  historyItems.urls.push(url);
  historyItems.urls.unique();
  if(historyItems.urls.length > 10) {
    historyItems.urls.shift();
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

var HistoryView = function(history) {
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
