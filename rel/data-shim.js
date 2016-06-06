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
          var i, j, results;
          if (window.enableUpdates) {
            results = [];
            for (i = j = 0; j <= 4; i = ++j) {
              results.push(setTimeout(function() {
                return data.callback(statsDataSimultor.generateHistoricalStat());
              }, Math.floor((Math.random() * 1000) + 250)));
            }
            return results;
          }
        }, 5000);
      };
    })(this));
    return PubSub.subscribe('STATS.UNSUBSCRIBE', (function(_this) {
      return function(m, data) {};
    })(this));
  };

  TestData.prototype.generateLiveStats = function(isContainer) {
    var j, len, metric, ref, stats;
    stats = [];
    ref = this.getMetrics(isContainer);
    for (j = 0, len = ref.length; j < len; j++) {
      metric = ref[j];
      stats.push({
        metric: metric,
        value: (Math.random() * 1.00) + 0.00
      });
    }
    return stats;
  };

  TestData.prototype.generateHistoricalStats = function(isContainer) {
    var data, hour, j, k, len, metric, ref, stats;
    stats = [];
    ref = this.getMetrics(isContainer);
    for (j = 0, len = ref.length; j < len; j++) {
      metric = ref[j];
      data = [];
      for (hour = k = 0; k <= 24; hour = ++k) {
        data.push({
          time: "" + (("0" + hour).slice(-2)),
          value: (Math.random() * 1.00) + 0.00
        });
      }
      stats.push({
        metric: metric,
        data: data
      });
    }
    return stats;
  };

  TestData.prototype.generateHistoricalStat = function(isContainer) {
    var data, hour, j, metric, metrics;
    metrics = this.getMetrics(isContainer);
    metric = metrics[Math.floor(Math.random() * metrics.length)];
    data = [];
    for (hour = j = 0; j <= 24; hour = ++j) {
      data.push({
        time: "" + (("0" + hour).slice(-2)),
        value: (Math.random() * 1.00) + 0.00
      });
    }
    return [
      {
        metric: metric,
        data: data
      }
    ];
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
  var expanded, expanded2, micro, micro2, standard, standard2, standard3;
  statsDataSimultor.createFakeStatDataProvider();
  micro = new nanobox.HourlyStats($("#micro1"), {
    view: "micro",
    isContainer: false
  });
  micro.build();
  micro2 = new nanobox.HourlyStats($("#micro2  "), {
    view: "micro",
    isContainer: true,
    metrics: ['cpu', 'ram']
  });
  micro2.build();
  standard = new nanobox.HourlyStats($("#standard1"), {
    view: "standard",
    isContainer: false
  });
  standard.build();
  standard2 = new nanobox.HourlyStats($("#standard2"), {
    view: "standard",
    isContainer: true,
    metrics: ['cpu', 'ram']
  });
  standard2.build();
  standard3 = new nanobox.HourlyStats($("#standard3"), {
    view: "standard",
    isContainer: true,
    compressView: true
  });
  standard3.build();
  expanded = new nanobox.HourlyStats($("#expanded1"), {
    view: "expanded",
    isContainer: false
  });
  expanded.build();
  expanded2 = new nanobox.HourlyStats($("#expanded2"), {
    view: "expanded",
    isContainer: true,
    metrics: ['cpu', 'ram']
  });
  return expanded2.build();
};

},{"./shim/test-data":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVGVzdERhdGE7XG5cbm1vZHVsZS5leHBvcnRzID0gVGVzdERhdGEgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRlc3REYXRhKCkge31cblxuICBUZXN0RGF0YS5wcm90b3R5cGUuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIgPSBmdW5jdGlvbigpIHtcbiAgICBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5TVUJTQ1JJQkUuTElWRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUxpdmVTdGF0cygpKTtcbiAgICAgICAgcmV0dXJuIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh3aW5kb3cuZW5hYmxlVXBkYXRlcykge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEuY2FsbGJhY2soc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVMaXZlU3RhdHMoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCA1MDAwKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlNVQlNDUklCRS5ISVNUT1JJQycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0cygpKTtcbiAgICAgICAgcmV0dXJuIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBpLCBqLCByZXN1bHRzO1xuICAgICAgICAgIGlmICh3aW5kb3cuZW5hYmxlVXBkYXRlcykge1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gaiA9IDA7IGogPD0gNDsgaSA9ICsraikge1xuICAgICAgICAgICAgICByZXN1bHRzLnB1c2goc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0KCkpO1xuICAgICAgICAgICAgICB9LCBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTAwMCkgKyAyNTApKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDUwMDApO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgcmV0dXJuIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlVOU1VCU0NSSUJFJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge307XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUxpdmVTdGF0cyA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgdmFyIGosIGxlbiwgbWV0cmljLCByZWYsIHN0YXRzO1xuICAgIHN0YXRzID0gW107XG4gICAgcmVmID0gdGhpcy5nZXRNZXRyaWNzKGlzQ29udGFpbmVyKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG1ldHJpYyA9IHJlZltqXTtcbiAgICAgIHN0YXRzLnB1c2goe1xuICAgICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgICAgdmFsdWU6IChNYXRoLnJhbmRvbSgpICogMS4wMCkgKyAwLjAwXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRzO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0cyA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgdmFyIGRhdGEsIGhvdXIsIGosIGssIGxlbiwgbWV0cmljLCByZWYsIHN0YXRzO1xuICAgIHN0YXRzID0gW107XG4gICAgcmVmID0gdGhpcy5nZXRNZXRyaWNzKGlzQ29udGFpbmVyKTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG1ldHJpYyA9IHJlZltqXTtcbiAgICAgIGRhdGEgPSBbXTtcbiAgICAgIGZvciAoaG91ciA9IGsgPSAwOyBrIDw9IDI0OyBob3VyID0gKytrKSB7XG4gICAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICAgdGltZTogXCJcIiArICgoXCIwXCIgKyBob3VyKS5zbGljZSgtMikpLFxuICAgICAgICAgIHZhbHVlOiAoTWF0aC5yYW5kb20oKSAqIDEuMDApICsgMC4wMFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHN0YXRzLnB1c2goe1xuICAgICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0cztcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVIaXN0b3JpY2FsU3RhdCA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgdmFyIGRhdGEsIGhvdXIsIGosIG1ldHJpYywgbWV0cmljcztcbiAgICBtZXRyaWNzID0gdGhpcy5nZXRNZXRyaWNzKGlzQ29udGFpbmVyKTtcbiAgICBtZXRyaWMgPSBtZXRyaWNzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1ldHJpY3MubGVuZ3RoKV07XG4gICAgZGF0YSA9IFtdO1xuICAgIGZvciAoaG91ciA9IGogPSAwOyBqIDw9IDI0OyBob3VyID0gKytqKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICB0aW1lOiBcIlwiICsgKChcIjBcIiArIGhvdXIpLnNsaWNlKC0yKSksXG4gICAgICAgIHZhbHVlOiAoTWF0aC5yYW5kb20oKSAqIDEuMDApICsgMC4wMFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIG1ldHJpYzogbWV0cmljLFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9XG4gICAgXTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2V0TWV0cmljcyA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgaWYgKGlzQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gW1wiY3B1XCIsIFwicmFtXCJdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW1wiY3B1XCIsIFwicmFtXCIsIFwic3dhcFwiLCBcImRpc2tcIl07XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBUZXN0RGF0YTtcblxufSkoKTtcbiIsInZhciBUZXN0RGF0YTtcblxuVGVzdERhdGEgPSByZXF1aXJlKCcuL3NoaW0vdGVzdC1kYXRhJyk7XG5cbndpbmRvdy5zdGF0c0RhdGFTaW11bHRvciA9IG5ldyBUZXN0RGF0YSgpO1xuXG53aW5kb3cuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZXhwYW5kZWQsIGV4cGFuZGVkMiwgbWljcm8sIG1pY3JvMiwgc3RhbmRhcmQsIHN0YW5kYXJkMiwgc3RhbmRhcmQzO1xuICBzdGF0c0RhdGFTaW11bHRvci5jcmVhdGVGYWtlU3RhdERhdGFQcm92aWRlcigpO1xuICBtaWNybyA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIjbWljcm8xXCIpLCB7XG4gICAgdmlldzogXCJtaWNyb1wiLFxuICAgIGlzQ29udGFpbmVyOiBmYWxzZVxuICB9KTtcbiAgbWljcm8uYnVpbGQoKTtcbiAgbWljcm8yID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNtaWNybzIgIFwiKSwge1xuICAgIHZpZXc6IFwibWljcm9cIixcbiAgICBpc0NvbnRhaW5lcjogdHJ1ZSxcbiAgICBtZXRyaWNzOiBbJ2NwdScsICdyYW0nXVxuICB9KTtcbiAgbWljcm8yLmJ1aWxkKCk7XG4gIHN0YW5kYXJkID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNzdGFuZGFyZDFcIiksIHtcbiAgICB2aWV3OiBcInN0YW5kYXJkXCIsXG4gICAgaXNDb250YWluZXI6IGZhbHNlXG4gIH0pO1xuICBzdGFuZGFyZC5idWlsZCgpO1xuICBzdGFuZGFyZDIgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiI3N0YW5kYXJkMlwiKSwge1xuICAgIHZpZXc6IFwic3RhbmRhcmRcIixcbiAgICBpc0NvbnRhaW5lcjogdHJ1ZSxcbiAgICBtZXRyaWNzOiBbJ2NwdScsICdyYW0nXVxuICB9KTtcbiAgc3RhbmRhcmQyLmJ1aWxkKCk7XG4gIHN0YW5kYXJkMyA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIjc3RhbmRhcmQzXCIpLCB7XG4gICAgdmlldzogXCJzdGFuZGFyZFwiLFxuICAgIGlzQ29udGFpbmVyOiB0cnVlLFxuICAgIGNvbXByZXNzVmlldzogdHJ1ZVxuICB9KTtcbiAgc3RhbmRhcmQzLmJ1aWxkKCk7XG4gIGV4cGFuZGVkID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNleHBhbmRlZDFcIiksIHtcbiAgICB2aWV3OiBcImV4cGFuZGVkXCIsXG4gICAgaXNDb250YWluZXI6IGZhbHNlXG4gIH0pO1xuICBleHBhbmRlZC5idWlsZCgpO1xuICBleHBhbmRlZDIgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiI2V4cGFuZGVkMlwiKSwge1xuICAgIHZpZXc6IFwiZXhwYW5kZWRcIixcbiAgICBpc0NvbnRhaW5lcjogdHJ1ZSxcbiAgICBtZXRyaWNzOiBbJ2NwdScsICdyYW0nXVxuICB9KTtcbiAgcmV0dXJuIGV4cGFuZGVkMi5idWlsZCgpO1xufTtcbiJdfQ==
