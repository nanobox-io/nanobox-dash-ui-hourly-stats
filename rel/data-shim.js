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

  TestData.prototype.generateLiveStats = function() {
    var j, len, metric, ref, stats;
    stats = [];
    ref = ["cpu", "ram", "swap", "disk"];
    for (j = 0, len = ref.length; j < len; j++) {
      metric = ref[j];
      stats.push({
        metric: metric,
        value: (Math.random() * 1.00) + 0.00
      });
    }
    return stats;
  };

  TestData.prototype.generateHistoricalStats = function() {
    var data, hour, j, k, len, metric, ref, stats;
    stats = [];
    ref = ["cpu", "ram", "swap", "disk"];
    for (j = 0, len = ref.length; j < len; j++) {
      metric = ref[j];
      data = [];
      for (hour = k = 0; k < 24; hour = ++k) {
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

  TestData.prototype.generateHistoricalStat = function() {
    var data, hour, j, metric;
    metric = ["cpu", "ram", "swap", "disk"][Math.floor(Math.random() * 4) + 0];
    data = [];
    for (hour = j = 0; j < 24; hour = ++j) {
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

  return TestData;

})();

},{}],2:[function(require,module,exports){
var TestData;

TestData = require('./shim/test-data');

window.statsDataSimultor = new TestData();

window.init = function() {
  var expanded, micro, standard;
  statsDataSimultor.createFakeStatDataProvider();
  micro = new nanobox.HourlyStats("micro", $(".micro"));
  micro.build();
  standard = new nanobox.HourlyStats("standard", $(".standard"));
  standard.build();
  expanded = new nanobox.HourlyStats("expanded", $(".expanded"));
  return expanded.build();
};

},{"./shim/test-data":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVGVzdERhdGE7XG5cbm1vZHVsZS5leHBvcnRzID0gVGVzdERhdGEgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRlc3REYXRhKCkge31cblxuICBUZXN0RGF0YS5wcm90b3R5cGUuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIgPSBmdW5jdGlvbigpIHtcbiAgICBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5TVUJTQ1JJQkUuTElWRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUxpdmVTdGF0cygpKTtcbiAgICAgICAgcmV0dXJuIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh3aW5kb3cuZW5hYmxlVXBkYXRlcykge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEuY2FsbGJhY2soc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVMaXZlU3RhdHMoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCA1MDAwKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlNVQlNDUklCRS5ISVNUT1JJQycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0cygpKTtcbiAgICAgICAgcmV0dXJuIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBpLCBqLCByZXN1bHRzO1xuICAgICAgICAgIGlmICh3aW5kb3cuZW5hYmxlVXBkYXRlcykge1xuICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gaiA9IDA7IGogPD0gNDsgaSA9ICsraikge1xuICAgICAgICAgICAgICByZXN1bHRzLnB1c2goc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0KCkpO1xuICAgICAgICAgICAgICB9LCBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTAwMCkgKyAyNTApKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDUwMDApO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgcmV0dXJuIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlVOU1VCU0NSSUJFJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge307XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUxpdmVTdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBqLCBsZW4sIG1ldHJpYywgcmVmLCBzdGF0cztcbiAgICBzdGF0cyA9IFtdO1xuICAgIHJlZiA9IFtcImNwdVwiLCBcInJhbVwiLCBcInN3YXBcIiwgXCJkaXNrXCJdO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbWV0cmljID0gcmVmW2pdO1xuICAgICAgc3RhdHMucHVzaCh7XG4gICAgICAgIG1ldHJpYzogbWV0cmljLFxuICAgICAgICB2YWx1ZTogKE1hdGgucmFuZG9tKCkgKiAxLjAwKSArIDAuMDBcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdHM7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlSGlzdG9yaWNhbFN0YXRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhdGEsIGhvdXIsIGosIGssIGxlbiwgbWV0cmljLCByZWYsIHN0YXRzO1xuICAgIHN0YXRzID0gW107XG4gICAgcmVmID0gW1wiY3B1XCIsIFwicmFtXCIsIFwic3dhcFwiLCBcImRpc2tcIl07XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBtZXRyaWMgPSByZWZbal07XG4gICAgICBkYXRhID0gW107XG4gICAgICBmb3IgKGhvdXIgPSBrID0gMDsgayA8IDI0OyBob3VyID0gKytrKSB7XG4gICAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICAgdGltZTogXCJcIiArICgoXCIwXCIgKyBob3VyKS5zbGljZSgtMikpLFxuICAgICAgICAgIHZhbHVlOiAoTWF0aC5yYW5kb20oKSAqIDEuMDApICsgMC4wMFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHN0YXRzLnB1c2goe1xuICAgICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0cztcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVIaXN0b3JpY2FsU3RhdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhLCBob3VyLCBqLCBtZXRyaWM7XG4gICAgbWV0cmljID0gW1wiY3B1XCIsIFwicmFtXCIsIFwic3dhcFwiLCBcImRpc2tcIl1bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCkgKyAwXTtcbiAgICBkYXRhID0gW107XG4gICAgZm9yIChob3VyID0gaiA9IDA7IGogPCAyNDsgaG91ciA9ICsraikge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgdGltZTogXCJcIiArICgoXCIwXCIgKyBob3VyKS5zbGljZSgtMikpLFxuICAgICAgICB2YWx1ZTogKE1hdGgucmFuZG9tKCkgKiAxLjAwKSArIDAuMDBcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfVxuICAgIF07XG4gIH07XG5cbiAgcmV0dXJuIFRlc3REYXRhO1xuXG59KSgpO1xuIiwidmFyIFRlc3REYXRhO1xuXG5UZXN0RGF0YSA9IHJlcXVpcmUoJy4vc2hpbS90ZXN0LWRhdGEnKTtcblxud2luZG93LnN0YXRzRGF0YVNpbXVsdG9yID0gbmV3IFRlc3REYXRhKCk7XG5cbndpbmRvdy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBleHBhbmRlZCwgbWljcm8sIHN0YW5kYXJkO1xuICBzdGF0c0RhdGFTaW11bHRvci5jcmVhdGVGYWtlU3RhdERhdGFQcm92aWRlcigpO1xuICBtaWNybyA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKFwibWljcm9cIiwgJChcIi5taWNyb1wiKSk7XG4gIG1pY3JvLmJ1aWxkKCk7XG4gIHN0YW5kYXJkID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoXCJzdGFuZGFyZFwiLCAkKFwiLnN0YW5kYXJkXCIpKTtcbiAgc3RhbmRhcmQuYnVpbGQoKTtcbiAgZXhwYW5kZWQgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cyhcImV4cGFuZGVkXCIsICQoXCIuZXhwYW5kZWRcIikpO1xuICByZXR1cm4gZXhwYW5kZWQuYnVpbGQoKTtcbn07XG4iXX0=
