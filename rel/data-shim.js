(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TestData;

module.exports = TestData = (function() {
  function TestData() {}

  TestData.prototype.createFakeStatDataProvider = function() {
    PubSub.subscribe('STATS.SUBSCRIBE.LIVE', (function(_this) {
      return function(m, data) {
        data.callback(statsDataSimultor.generateLiveStat());
        return setInterval(function() {
          if (window.enableUpdates) {
            return data.callback(statsDataSimultor.generateLiveStat());
          }
        }, 5000);
      };
    })(this));
    PubSub.subscribe('STATS.SUBSCRIBE.HISTORIC', (function(_this) {
      return function(m, data) {
        data.callback(statsDataSimultor.generateHistoricalStat());
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
    var i, len, metric, ref, stats;
    stats = [];
    ref = this.getMetrics(isContainer);
    for (i = 0, len = ref.length; i < len; i++) {
      metric = ref[i];
      stats.push(this.generateLiveStat());
    }
    return stats;
  };

  TestData.prototype.generateLiveStat = function(isContainer) {
    var metric, metrics;
    metrics = this.getMetrics(isContainer);
    metric = metrics[Math.floor(Math.random() * metrics.length)];
    return {
      metric: metric,
      value: (Math.random() * 1.00) + 0.00
    };
  };

  TestData.prototype.generateHistoricalStats = function(isContainer) {
    var data, hour, i, j, len, metric, ref, stats;
    stats = [];
    ref = this.getMetrics(isContainer);
    for (i = 0, len = ref.length; i < len; i++) {
      metric = ref[i];
      data = [];
      for (hour = j = 0; j <= 24; hour = ++j) {
        data.push(this.generateHistoricalStat(isContainer));
      }
      stats.push({
        metric: metric,
        data: data
      });
    }
    return stats;
  };

  TestData.prototype.generateHistoricalStat = function(isContainer) {
    var data, hour, i, metric, metrics;
    metrics = this.getMetrics(isContainer);
    metric = metrics[Math.floor(Math.random() * metrics.length)];
    data = [];
    for (hour = i = 0; i <= 24; hour = ++i) {
      data.push({
        time: moment().subtract(hour, "h"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUZXN0RGF0YTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXN0RGF0YSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVGVzdERhdGEoKSB7fVxuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5jcmVhdGVGYWtlU3RhdERhdGFQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlNVQlNDUklCRS5MSVZFJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICBkYXRhLmNhbGxiYWNrKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlTGl2ZVN0YXQoKSk7XG4gICAgICAgIHJldHVybiBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAod2luZG93LmVuYWJsZVVwZGF0ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLmNhbGxiYWNrKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlTGl2ZVN0YXQoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCA1MDAwKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlNVQlNDUklCRS5ISVNUT1JJQycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0KCkpO1xuICAgICAgICByZXR1cm4gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHdpbmRvdy5lbmFibGVVcGRhdGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgNTAwMCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuVU5TVUJTQ1JJQkUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7fTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlTGl2ZVN0YXRzID0gZnVuY3Rpb24oaXNDb250YWluZXIpIHtcbiAgICB2YXIgaSwgbGVuLCBtZXRyaWMsIHJlZiwgc3RhdHM7XG4gICAgc3RhdHMgPSBbXTtcbiAgICByZWYgPSB0aGlzLmdldE1ldHJpY3MoaXNDb250YWluZXIpO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbWV0cmljID0gcmVmW2ldO1xuICAgICAgc3RhdHMucHVzaCh0aGlzLmdlbmVyYXRlTGl2ZVN0YXQoKSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0cztcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVMaXZlU3RhdCA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgdmFyIG1ldHJpYywgbWV0cmljcztcbiAgICBtZXRyaWNzID0gdGhpcy5nZXRNZXRyaWNzKGlzQ29udGFpbmVyKTtcbiAgICBtZXRyaWMgPSBtZXRyaWNzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1ldHJpY3MubGVuZ3RoKV07XG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldHJpYzogbWV0cmljLFxuICAgICAgdmFsdWU6IChNYXRoLnJhbmRvbSgpICogMS4wMCkgKyAwLjAwXG4gICAgfTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVIaXN0b3JpY2FsU3RhdHMgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIHZhciBkYXRhLCBob3VyLCBpLCBqLCBsZW4sIG1ldHJpYywgcmVmLCBzdGF0cztcbiAgICBzdGF0cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMuZ2V0TWV0cmljcyhpc0NvbnRhaW5lcik7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtZXRyaWMgPSByZWZbaV07XG4gICAgICBkYXRhID0gW107XG4gICAgICBmb3IgKGhvdXIgPSBqID0gMDsgaiA8PSAyNDsgaG91ciA9ICsraikge1xuICAgICAgICBkYXRhLnB1c2godGhpcy5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0KGlzQ29udGFpbmVyKSk7XG4gICAgICB9XG4gICAgICBzdGF0cy5wdXNoKHtcbiAgICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdHM7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlSGlzdG9yaWNhbFN0YXQgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIHZhciBkYXRhLCBob3VyLCBpLCBtZXRyaWMsIG1ldHJpY3M7XG4gICAgbWV0cmljcyA9IHRoaXMuZ2V0TWV0cmljcyhpc0NvbnRhaW5lcik7XG4gICAgbWV0cmljID0gbWV0cmljc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtZXRyaWNzLmxlbmd0aCldO1xuICAgIGRhdGEgPSBbXTtcbiAgICBmb3IgKGhvdXIgPSBpID0gMDsgaSA8PSAyNDsgaG91ciA9ICsraSkge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgdGltZTogbW9tZW50KCkuc3VidHJhY3QoaG91ciwgXCJoXCIpLFxuICAgICAgICB2YWx1ZTogKE1hdGgucmFuZG9tKCkgKiAxLjAwKSArIDAuMDBcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2V0TWV0cmljcyA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgaWYgKGlzQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gW1wiY3B1XCIsIFwicmFtXCJdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1wiY3B1XCIsIFwicmFtXCIsIFwic3dhcFwiLCBcImRpc2tcIl07XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBUZXN0RGF0YTtcblxufSkoKTtcbiIsInZhciBUZXN0RGF0YTtcblxuVGVzdERhdGEgPSByZXF1aXJlKCcuL3NoaW0vdGVzdC1kYXRhJyk7XG5cbndpbmRvdy5zdGF0c0RhdGFTaW11bHRvciA9IG5ldyBUZXN0RGF0YSgpO1xuXG53aW5kb3cuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZXhwYW5kZWQsIGV4cGFuZGVkRGF0YSwgbWljcm8sIG1pY3JvRGF0YSwgc3RhbmRhcmQsIHN0YW5kYXJkRGF0YTtcbiAgc3RhdHNEYXRhU2ltdWx0b3IuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIoKTtcbiAgbWljcm9EYXRhID0ge1xuICAgIHZpZXc6IFwibWljcm9cIixcbiAgICBpc0NvbnRhaW5lcjogZmFsc2UsXG4gICAgZW50aXR5OiBcImhvc3RcIixcbiAgICBlbnRpdHlJZDogXCJhc2RmMjMxMjM0MVwiXG4gIH07XG4gIG1pY3JvID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNtaWNybzFcIiksIG1pY3JvRGF0YSk7XG4gIG1pY3JvLmJ1aWxkKCk7XG4gIHN0YW5kYXJkRGF0YSA9IHtcbiAgICB2aWV3OiBcInN0YW5kYXJkXCIsXG4gICAgaXNDb250YWluZXI6IGZhbHNlLFxuICAgIGVudGl0eTogXCJob3N0XCIsXG4gICAgZW50aXR5SWQ6IFwiYXNkZjIzMTIzNDNcIlxuICB9O1xuICBzdGFuZGFyZCA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIjc3RhbmRhcmQxXCIpLCBzdGFuZGFyZERhdGEpO1xuICBzdGFuZGFyZC5idWlsZCgpO1xuICBleHBhbmRlZERhdGEgPSB7XG4gICAgdmlldzogXCJleHBhbmRlZFwiLFxuICAgIGlzQ29udGFpbmVyOiBmYWxzZSxcbiAgICBlbnRpdHk6IFwiaG9zdFwiLFxuICAgIGVudGl0eUlkOiBcImFzZGYyMzEyMzQ2XCJcbiAgfTtcbiAgZXhwYW5kZWQgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiI2V4cGFuZGVkMVwiKSwgZXhwYW5kZWREYXRhKTtcbiAgcmV0dXJuIGV4cGFuZGVkLmJ1aWxkKCk7XG59O1xuIl19
