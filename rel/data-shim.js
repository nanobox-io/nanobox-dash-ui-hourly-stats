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
              value: (Math.random() * 1.00) + 0.00
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
  var expanded, expandedData;
  statsDataSimultor.createFakeStatDataProvider();
  expandedData = {
    view: "expanded",
    entity: "host",
    entityId: "0006"
  };
  expanded = new nanobox.HourlyStats($("#expanded1"), expandedData);
  expanded.build();
  return console.log("STUFF?", expanded.getLiveStats());
};

},{"./shim/test-data":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVGVzdERhdGE7XG5cbm1vZHVsZS5leHBvcnRzID0gVGVzdERhdGEgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRlc3REYXRhKCkge31cblxuICBUZXN0RGF0YS5wcm90b3R5cGUuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIgPSBmdW5jdGlvbigpIHtcbiAgICBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5TVUJTQ1JJQkUuTElWRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUxpdmVTdGF0KCkpO1xuICAgICAgICByZXR1cm4gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHdpbmRvdy5lbmFibGVVcGRhdGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUxpdmVTdGF0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMzAwMCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuU1VCU0NSSUJFLkhJU1RPUklDJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge1xuICAgICAgICB2YXIgaG91ciwgaSwgaiwgbGVuLCBtZXRyaWMsIHJlZiwgcmVzdWx0cywgc3RhdHM7XG4gICAgICAgIHJlZiA9IF90aGlzLmdldE1ldHJpY3MoZmFsc2UpO1xuICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG1ldHJpYyA9IHJlZltpXTtcbiAgICAgICAgICBzdGF0cyA9IFtdO1xuICAgICAgICAgIGZvciAoaG91ciA9IGogPSAwOyBqIDw9IDE7IGhvdXIgPSArK2opIHtcbiAgICAgICAgICAgIHN0YXRzLnB1c2goe1xuICAgICAgICAgICAgICB0aW1lOiBtb21lbnQoKS5zdWJ0cmFjdChob3VyLCBcImhcIiksXG4gICAgICAgICAgICAgIHZhbHVlOiAoTWF0aC5yYW5kb20oKSAqIDEuMDApICsgMC4wMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdHMucHVzaChkYXRhLmNhbGxiYWNrKHtcbiAgICAgICAgICAgIG1ldHJpYzogbWV0cmljLFxuICAgICAgICAgICAgZGF0YTogc3RhdHNcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVMaXZlU3RhdHMgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIHZhciBpLCBsZW4sIG1ldHJpYywgcmVmLCBzdGF0cztcbiAgICBzdGF0cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMuZ2V0TWV0cmljcyhpc0NvbnRhaW5lcik7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtZXRyaWMgPSByZWZbaV07XG4gICAgICBzdGF0cy5wdXNoKHRoaXMuZ2VuZXJhdGVMaXZlU3RhdCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRzO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUxpdmVTdGF0ID0gZnVuY3Rpb24oaXNDb250YWluZXIpIHtcbiAgICB2YXIgbWV0cmljLCBtZXRyaWNzO1xuICAgIG1ldHJpY3MgPSB0aGlzLmdldE1ldHJpY3MoaXNDb250YWluZXIpO1xuICAgIG1ldHJpYyA9IG1ldHJpY3NbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWV0cmljcy5sZW5ndGgpXTtcbiAgICByZXR1cm4ge1xuICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgICB2YWx1ZTogKE1hdGgucmFuZG9tKCkgKiAxLjAwKSArIDAuMDBcbiAgICB9O1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0cyA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgdmFyIGRhdGEsIGhvdXIsIGksIGosIGxlbiwgbWV0cmljLCByZWYsIHN0YXRzO1xuICAgIHN0YXRzID0gW107XG4gICAgcmVmID0gdGhpcy5nZXRNZXRyaWNzKGlzQ29udGFpbmVyKTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG1ldHJpYyA9IHJlZltpXTtcbiAgICAgIGRhdGEgPSBbXTtcbiAgICAgIGZvciAoaG91ciA9IGogPSAwOyBqIDw9IDI0OyBob3VyID0gKytqKSB7XG4gICAgICAgIGRhdGEucHVzaCh0aGlzLmdlbmVyYXRlSGlzdG9yaWNhbFN0YXQoaXNDb250YWluZXIpKTtcbiAgICAgIH1cbiAgICAgIHN0YXRzLnB1c2goe1xuICAgICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0cztcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVIaXN0b3JpY2FsU3RhdCA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgdmFyIGRhdGEsIGhvdXIsIGksIG1ldHJpYywgbWV0cmljcztcbiAgICBtZXRyaWNzID0gdGhpcy5nZXRNZXRyaWNzKGlzQ29udGFpbmVyKTtcbiAgICBtZXRyaWMgPSBtZXRyaWNzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1ldHJpY3MubGVuZ3RoKV07XG4gICAgZGF0YSA9IFtdO1xuICAgIGZvciAoaG91ciA9IGkgPSAwOyBpIDw9IDI0OyBob3VyID0gKytpKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICB0aW1lOiBtb21lbnQoKS5zdWJ0cmFjdChob3VyLCBcImhcIiksXG4gICAgICAgIHZhbHVlOiAoTWF0aC5yYW5kb20oKSAqIDEuMDApICsgMC4wMFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9O1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZXRNZXRyaWNzID0gZnVuY3Rpb24oaXNDb250YWluZXIpIHtcbiAgICBpZiAoaXNDb250YWluZXIpIHtcbiAgICAgIHJldHVybiBbXCJjcHVcIiwgXCJyYW1cIl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbXCJjcHVcIiwgXCJyYW1cIiwgXCJzd2FwXCIsIFwiZGlza1wiXTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFRlc3REYXRhO1xuXG59KSgpO1xuIiwidmFyIFRlc3REYXRhO1xuXG5UZXN0RGF0YSA9IHJlcXVpcmUoJy4vc2hpbS90ZXN0LWRhdGEnKTtcblxud2luZG93LnN0YXRzRGF0YVNpbXVsdG9yID0gbmV3IFRlc3REYXRhKCk7XG5cbndpbmRvdy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBleHBhbmRlZCwgZXhwYW5kZWREYXRhO1xuICBzdGF0c0RhdGFTaW11bHRvci5jcmVhdGVGYWtlU3RhdERhdGFQcm92aWRlcigpO1xuICBleHBhbmRlZERhdGEgPSB7XG4gICAgdmlldzogXCJleHBhbmRlZFwiLFxuICAgIGVudGl0eTogXCJob3N0XCIsXG4gICAgZW50aXR5SWQ6IFwiMDAwNlwiXG4gIH07XG4gIGV4cGFuZGVkID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNleHBhbmRlZDFcIiksIGV4cGFuZGVkRGF0YSk7XG4gIGV4cGFuZGVkLmJ1aWxkKCk7XG4gIHJldHVybiBjb25zb2xlLmxvZyhcIlNUVUZGP1wiLCBleHBhbmRlZC5nZXRMaXZlU3RhdHMoKSk7XG59O1xuIl19
