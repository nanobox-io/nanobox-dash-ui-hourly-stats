(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TestData;

module.exports = TestData = (function() {
  function TestData() {}

  TestData.prototype.createFakeStatDataProvider = function() {
    PubSub.subscribe('STATS.SUBSCRIBE.LIVE', (function(_this) {
      return function(m, data) {
        data.callback(statsDataSimultor.generateLiveStats());
        return setInterval(function() {
          if (window.enableUpdates) {
            return data.callback(statsDataSimultor.generateLiveStats());
          }
        }, 5000);
      };
    })(this));
    PubSub.subscribe('STATS.SUBSCRIBE.HISTORIC', (function(_this) {
      return function(m, data) {
        data.callback(statsDataSimultor.generateHistoricalStats());
        return setInterval(function() {
          if (window.enableUpdates) {
            return data.callback(statsDataSimultor.generateHistoricalStat());
          }
        }, 5000);
      };
    })(this));
    return PubSub.subscribe('STATS.UNSUBSCRIBE', (function(_this) {
      return function(m, data) {};
    })(this));
  };

  TestData.prototype.generateLiveStats = function(isContainer) {
    var metric, metrics;
    metrics = this.getMetrics(isContainer);
    metric = metrics[Math.floor(Math.random() * metrics.length)];
    return {
      metric: metric,
      value: (Math.random() * 1.00) + 0.00
    };
  };

  TestData.prototype.generateHistoricalStats = function(isContainer) {
    var data, hour, i, metric, metrics;
    metrics = this.getMetrics(isContainer);
    metric = metrics[Math.floor(Math.random() * metrics.length)];
    data = [];
    for (hour = i = 0; i <= 24; hour = ++i) {
      data.push({
        time: "" + (("0" + hour).slice(-2)),
        value: (Math.random() * 1.00) + 0.00
      });
    }
    return {
      metric: metric,
      data: data
    };
  };

  TestData.prototype.generateHistoricalStat = function(isContainer) {
    var data, hour, i, metric, metrics;
    metrics = this.getMetrics(isContainer);
    metric = metrics[Math.floor(Math.random() * metrics.length)];
    data = [];
    for (hour = i = 0; i <= 24; hour = ++i) {
      data.push({
        time: "" + (("0" + hour).slice(-2)),
        value: (Math.random() * 1.00) + 0.00
      });
    }
    return {
      metric: metric,
      data: data
    };
  };

  TestData.prototype.getMetrics = function(isContainer) {
    if (isContainer) {
      return ["cpu", "ram"];
    } else {
      return ["cpu", "ram", "swap", "disk"];
    }
  };

  return TestData;

})();

},{}],2:[function(require,module,exports){
var TestData;

TestData = require('./shim/test-data');

window.statsDataSimultor = new TestData();

window.init = function() {
  var expanded, expandedData, micro, microData, standard, standardData;
  statsDataSimultor.createFakeStatDataProvider();
  microData = {
    view: "micro",
    isContainer: false,
    entity: "host",
    entityId: "asdf2312341"
  };
  micro = new nanobox.HourlyStats($("#micro1"), microData);
  micro.build();
  standardData = {
    view: "standard",
    isContainer: false,
    entity: "host",
    entityId: "asdf2312343"
  };
  standard = new nanobox.HourlyStats($("#standard1"), standardData);
  standard.build();
  expandedData = {
    view: "expanded",
    isContainer: false,
    entity: "host",
    entityId: "asdf2312346"
  };
  expanded = new nanobox.HourlyStats($("#expanded1"), expandedData);
  return expanded.build();
};

},{"./shim/test-data":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUZXN0RGF0YTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXN0RGF0YSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVGVzdERhdGEoKSB7fVxuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5jcmVhdGVGYWtlU3RhdERhdGFQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlNVQlNDUklCRS5MSVZFJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICBkYXRhLmNhbGxiYWNrKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlTGl2ZVN0YXRzKCkpO1xuICAgICAgICByZXR1cm4gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHdpbmRvdy5lbmFibGVVcGRhdGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUxpdmVTdGF0cygpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDUwMDApO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuU1VCU0NSSUJFLkhJU1RPUklDJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICBkYXRhLmNhbGxiYWNrKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlSGlzdG9yaWNhbFN0YXRzKCkpO1xuICAgICAgICByZXR1cm4gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHdpbmRvdy5lbmFibGVVcGRhdGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgNTAwMCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuVU5TVUJTQ1JJQkUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7fTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlTGl2ZVN0YXRzID0gZnVuY3Rpb24oaXNDb250YWluZXIpIHtcbiAgICB2YXIgbWV0cmljLCBtZXRyaWNzO1xuICAgIG1ldHJpY3MgPSB0aGlzLmdldE1ldHJpY3MoaXNDb250YWluZXIpO1xuICAgIG1ldHJpYyA9IG1ldHJpY3NbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWV0cmljcy5sZW5ndGgpXTtcbiAgICByZXR1cm4ge1xuICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgICB2YWx1ZTogKE1hdGgucmFuZG9tKCkgKiAxLjAwKSArIDAuMDBcbiAgICB9O1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0cyA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgdmFyIGRhdGEsIGhvdXIsIGksIG1ldHJpYywgbWV0cmljcztcbiAgICBtZXRyaWNzID0gdGhpcy5nZXRNZXRyaWNzKGlzQ29udGFpbmVyKTtcbiAgICBtZXRyaWMgPSBtZXRyaWNzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1ldHJpY3MubGVuZ3RoKV07XG4gICAgZGF0YSA9IFtdO1xuICAgIGZvciAoaG91ciA9IGkgPSAwOyBpIDw9IDI0OyBob3VyID0gKytpKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICB0aW1lOiBcIlwiICsgKChcIjBcIiArIGhvdXIpLnNsaWNlKC0yKSksXG4gICAgICAgIHZhbHVlOiAoTWF0aC5yYW5kb20oKSAqIDEuMDApICsgMC4wMFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9O1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0ID0gZnVuY3Rpb24oaXNDb250YWluZXIpIHtcbiAgICB2YXIgZGF0YSwgaG91ciwgaSwgbWV0cmljLCBtZXRyaWNzO1xuICAgIG1ldHJpY3MgPSB0aGlzLmdldE1ldHJpY3MoaXNDb250YWluZXIpO1xuICAgIG1ldHJpYyA9IG1ldHJpY3NbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWV0cmljcy5sZW5ndGgpXTtcbiAgICBkYXRhID0gW107XG4gICAgZm9yIChob3VyID0gaSA9IDA7IGkgPD0gMjQ7IGhvdXIgPSArK2kpIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHRpbWU6IFwiXCIgKyAoKFwiMFwiICsgaG91cikuc2xpY2UoLTIpKSxcbiAgICAgICAgdmFsdWU6IChNYXRoLnJhbmRvbSgpICogMS4wMCkgKyAwLjAwXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldHJpYzogbWV0cmljLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH07XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdldE1ldHJpY3MgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIGlmIChpc0NvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIFtcImNwdVwiLCBcInJhbVwiXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtcImNwdVwiLCBcInJhbVwiLCBcInN3YXBcIiwgXCJkaXNrXCJdO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gVGVzdERhdGE7XG5cbn0pKCk7XG4iLCJ2YXIgVGVzdERhdGE7XG5cblRlc3REYXRhID0gcmVxdWlyZSgnLi9zaGltL3Rlc3QtZGF0YScpO1xuXG53aW5kb3cuc3RhdHNEYXRhU2ltdWx0b3IgPSBuZXcgVGVzdERhdGEoKTtcblxud2luZG93LmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGV4cGFuZGVkLCBleHBhbmRlZERhdGEsIG1pY3JvLCBtaWNyb0RhdGEsIHN0YW5kYXJkLCBzdGFuZGFyZERhdGE7XG4gIHN0YXRzRGF0YVNpbXVsdG9yLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyKCk7XG4gIG1pY3JvRGF0YSA9IHtcbiAgICB2aWV3OiBcIm1pY3JvXCIsXG4gICAgaXNDb250YWluZXI6IGZhbHNlLFxuICAgIGVudGl0eTogXCJob3N0XCIsXG4gICAgZW50aXR5SWQ6IFwiYXNkZjIzMTIzNDFcIlxuICB9O1xuICBtaWNybyA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIjbWljcm8xXCIpLCBtaWNyb0RhdGEpO1xuICBtaWNyby5idWlsZCgpO1xuICBzdGFuZGFyZERhdGEgPSB7XG4gICAgdmlldzogXCJzdGFuZGFyZFwiLFxuICAgIGlzQ29udGFpbmVyOiBmYWxzZSxcbiAgICBlbnRpdHk6IFwiaG9zdFwiLFxuICAgIGVudGl0eUlkOiBcImFzZGYyMzEyMzQzXCJcbiAgfTtcbiAgc3RhbmRhcmQgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiI3N0YW5kYXJkMVwiKSwgc3RhbmRhcmREYXRhKTtcbiAgc3RhbmRhcmQuYnVpbGQoKTtcbiAgZXhwYW5kZWREYXRhID0ge1xuICAgIHZpZXc6IFwiZXhwYW5kZWRcIixcbiAgICBpc0NvbnRhaW5lcjogZmFsc2UsXG4gICAgZW50aXR5OiBcImhvc3RcIixcbiAgICBlbnRpdHlJZDogXCJhc2RmMjMxMjM0NlwiXG4gIH07XG4gIGV4cGFuZGVkID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNleHBhbmRlZDFcIiksIGV4cGFuZGVkRGF0YSk7XG4gIHJldHVybiBleHBhbmRlZC5idWlsZCgpO1xufTtcbiJdfQ==
