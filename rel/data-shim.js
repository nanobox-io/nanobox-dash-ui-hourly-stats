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
        }, 3000);
      };
    })(this));
    return PubSub.subscribe('STATS.SUBSCRIBE.HISTORIC', (function(_this) {
      return function(m, data) {
        var hour, i, j, len, metric, ref, results, stats;
        ref = _this.getMetrics(false);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          metric = ref[i];
          stats = [];
          for (hour = j = 0; j <= 1; hour = ++j) {
            stats.push({
              time: moment().subtract(hour, "h"),
              value: (Math.random() * 2.00) + 0.00
            });
          }
          results.push(data.callback({
            metric: metric,
            data: stats
          }));
        }
        return results;
      };
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
    entity: "host",
    entityId: "0001"
  };
  micro = new nanobox.HourlyStats($("#micro1"), microData);
  micro.build();
  standardData = {
    view: "standard",
    entity: "host",
    entityId: "0003"
  };
  standard = new nanobox.HourlyStats($("#standard1"), standardData);
  standard.build();
  expandedData = {
    view: "expanded",
    entity: "host",
    entityId: "0006"
  };
  expanded = new nanobox.HourlyStats($("#expanded1"), expandedData);
  return expanded.build();
};

},{"./shim/test-data":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUZXN0RGF0YTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXN0RGF0YSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVGVzdERhdGEoKSB7fVxuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5jcmVhdGVGYWtlU3RhdERhdGFQcm92aWRlciA9IGZ1bmN0aW9uKCkge1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlNVQlNDUklCRS5MSVZFJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICBkYXRhLmNhbGxiYWNrKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlTGl2ZVN0YXQoKSk7XG4gICAgICAgIHJldHVybiBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAod2luZG93LmVuYWJsZVVwZGF0ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLmNhbGxiYWNrKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlTGl2ZVN0YXQoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAzMDAwKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIHJldHVybiBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5TVUJTQ1JJQkUuSElTVE9SSUMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIHZhciBob3VyLCBpLCBqLCBsZW4sIG1ldHJpYywgcmVmLCByZXN1bHRzLCBzdGF0cztcbiAgICAgICAgcmVmID0gX3RoaXMuZ2V0TWV0cmljcyhmYWxzZSk7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgbWV0cmljID0gcmVmW2ldO1xuICAgICAgICAgIHN0YXRzID0gW107XG4gICAgICAgICAgZm9yIChob3VyID0gaiA9IDA7IGogPD0gMTsgaG91ciA9ICsraikge1xuICAgICAgICAgICAgc3RhdHMucHVzaCh7XG4gICAgICAgICAgICAgIHRpbWU6IG1vbWVudCgpLnN1YnRyYWN0KGhvdXIsIFwiaFwiKSxcbiAgICAgICAgICAgICAgdmFsdWU6IChNYXRoLnJhbmRvbSgpICogMi4wMCkgKyAwLjAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKGRhdGEuY2FsbGJhY2soe1xuICAgICAgICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgICAgICAgICBkYXRhOiBzdGF0c1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUxpdmVTdGF0cyA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgdmFyIGksIGxlbiwgbWV0cmljLCByZWYsIHN0YXRzO1xuICAgIHN0YXRzID0gW107XG4gICAgcmVmID0gdGhpcy5nZXRNZXRyaWNzKGlzQ29udGFpbmVyKTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG1ldHJpYyA9IHJlZltpXTtcbiAgICAgIHN0YXRzLnB1c2godGhpcy5nZW5lcmF0ZUxpdmVTdGF0KCkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdHM7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlTGl2ZVN0YXQgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIHZhciBtZXRyaWMsIG1ldHJpY3M7XG4gICAgbWV0cmljcyA9IHRoaXMuZ2V0TWV0cmljcyhpc0NvbnRhaW5lcik7XG4gICAgbWV0cmljID0gbWV0cmljc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtZXRyaWNzLmxlbmd0aCldO1xuICAgIHJldHVybiB7XG4gICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgIHZhbHVlOiAoTWF0aC5yYW5kb20oKSAqIDEuMDApICsgMC4wMFxuICAgIH07XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlSGlzdG9yaWNhbFN0YXRzID0gZnVuY3Rpb24oaXNDb250YWluZXIpIHtcbiAgICB2YXIgZGF0YSwgaG91ciwgaSwgaiwgbGVuLCBtZXRyaWMsIHJlZiwgc3RhdHM7XG4gICAgc3RhdHMgPSBbXTtcbiAgICByZWYgPSB0aGlzLmdldE1ldHJpY3MoaXNDb250YWluZXIpO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbWV0cmljID0gcmVmW2ldO1xuICAgICAgZGF0YSA9IFtdO1xuICAgICAgZm9yIChob3VyID0gaiA9IDA7IGogPD0gMjQ7IGhvdXIgPSArK2opIHtcbiAgICAgICAgZGF0YS5wdXNoKHRoaXMuZ2VuZXJhdGVIaXN0b3JpY2FsU3RhdChpc0NvbnRhaW5lcikpO1xuICAgICAgfVxuICAgICAgc3RhdHMucHVzaCh7XG4gICAgICAgIG1ldHJpYzogbWV0cmljLFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRzO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0ID0gZnVuY3Rpb24oaXNDb250YWluZXIpIHtcbiAgICB2YXIgZGF0YSwgaG91ciwgaSwgbWV0cmljLCBtZXRyaWNzO1xuICAgIG1ldHJpY3MgPSB0aGlzLmdldE1ldHJpY3MoaXNDb250YWluZXIpO1xuICAgIG1ldHJpYyA9IG1ldHJpY3NbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWV0cmljcy5sZW5ndGgpXTtcbiAgICBkYXRhID0gW107XG4gICAgZm9yIChob3VyID0gaSA9IDA7IGkgPD0gMjQ7IGhvdXIgPSArK2kpIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHRpbWU6IG1vbWVudCgpLnN1YnRyYWN0KGhvdXIsIFwiaFwiKSxcbiAgICAgICAgdmFsdWU6IChNYXRoLnJhbmRvbSgpICogMS4wMCkgKyAwLjAwXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldHJpYzogbWV0cmljLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH07XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdldE1ldHJpY3MgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIGlmIChpc0NvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIFtcImNwdVwiLCBcInJhbVwiXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtcImNwdVwiLCBcInJhbVwiLCBcInN3YXBcIiwgXCJkaXNrXCJdO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gVGVzdERhdGE7XG5cbn0pKCk7XG4iLCJ2YXIgVGVzdERhdGE7XG5cblRlc3REYXRhID0gcmVxdWlyZSgnLi9zaGltL3Rlc3QtZGF0YScpO1xuXG53aW5kb3cuc3RhdHNEYXRhU2ltdWx0b3IgPSBuZXcgVGVzdERhdGEoKTtcblxud2luZG93LmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGV4cGFuZGVkLCBleHBhbmRlZERhdGEsIG1pY3JvLCBtaWNyb0RhdGEsIHN0YW5kYXJkLCBzdGFuZGFyZERhdGE7XG4gIHN0YXRzRGF0YVNpbXVsdG9yLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyKCk7XG4gIG1pY3JvRGF0YSA9IHtcbiAgICB2aWV3OiBcIm1pY3JvXCIsXG4gICAgZW50aXR5OiBcImhvc3RcIixcbiAgICBlbnRpdHlJZDogXCIwMDAxXCJcbiAgfTtcbiAgbWljcm8gPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiI21pY3JvMVwiKSwgbWljcm9EYXRhKTtcbiAgbWljcm8uYnVpbGQoKTtcbiAgc3RhbmRhcmREYXRhID0ge1xuICAgIHZpZXc6IFwic3RhbmRhcmRcIixcbiAgICBlbnRpdHk6IFwiaG9zdFwiLFxuICAgIGVudGl0eUlkOiBcIjAwMDNcIlxuICB9O1xuICBzdGFuZGFyZCA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIjc3RhbmRhcmQxXCIpLCBzdGFuZGFyZERhdGEpO1xuICBzdGFuZGFyZC5idWlsZCgpO1xuICBleHBhbmRlZERhdGEgPSB7XG4gICAgdmlldzogXCJleHBhbmRlZFwiLFxuICAgIGVudGl0eTogXCJob3N0XCIsXG4gICAgZW50aXR5SWQ6IFwiMDAwNlwiXG4gIH07XG4gIGV4cGFuZGVkID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNleHBhbmRlZDFcIiksIGV4cGFuZGVkRGF0YSk7XG4gIHJldHVybiBleHBhbmRlZC5idWlsZCgpO1xufTtcbiJdfQ==
