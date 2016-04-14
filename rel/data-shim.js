(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TestData;

module.exports = TestData = (function() {
  function TestData() {}

  TestData.prototype.createFakeStatDataProvider = function() {
    PubSub.subscribe('STATS.SUBSCRIBE.LIVE', (function(_this) {
      return function(m, data) {
        data.callback(statsDataSimultor.generateLiveStats());
        return setInterval(function() {
          return data.callback(statsDataSimultor.generateLiveStats());
        }, 5000);
      };
    })(this));
    PubSub.subscribe('STATS.SUBSCRIBE.HISTORIC', (function(_this) {
      return function(m, data) {
        data.callback(statsDataSimultor.generateHistoricalStats());
        return setInterval(function() {
          var i, j, results;
          results = [];
          for (i = j = 0; j <= 4; i = ++j) {
            results.push(setTimeout(function() {
              return data.callback(statsDataSimultor.generateHistoricalStat());
            }, Math.floor((Math.random() * 1000) + 250)));
          }
          return results;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFRlc3REYXRhO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRlc3REYXRhID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBUZXN0RGF0YSgpIHt9XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuU1VCU0NSSUJFLkxJVkUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIGRhdGEuY2FsbGJhY2soc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVMaXZlU3RhdHMoKSk7XG4gICAgICAgIHJldHVybiBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUxpdmVTdGF0cygpKTtcbiAgICAgICAgfSwgNTAwMCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5TVUJTQ1JJQkUuSElTVE9SSUMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIGRhdGEuY2FsbGJhY2soc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVIaXN0b3JpY2FsU3RhdHMoKSk7XG4gICAgICAgIHJldHVybiBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgaSwgaiwgcmVzdWx0cztcbiAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChpID0gaiA9IDA7IGogPD0gNDsgaSA9ICsraikge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkYXRhLmNhbGxiYWNrKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlSGlzdG9yaWNhbFN0YXQoKSk7XG4gICAgICAgICAgICB9LCBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTAwMCkgKyAyNTApKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9LCA1MDAwKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIHJldHVybiBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5VTlNVQlNDUklCRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHt9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVMaXZlU3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaiwgbGVuLCBtZXRyaWMsIHJlZiwgc3RhdHM7XG4gICAgc3RhdHMgPSBbXTtcbiAgICByZWYgPSBbXCJjcHVcIiwgXCJyYW1cIiwgXCJzd2FwXCIsIFwiZGlza1wiXTtcbiAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIG1ldHJpYyA9IHJlZltqXTtcbiAgICAgIHN0YXRzLnB1c2goe1xuICAgICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgICAgdmFsdWU6IChNYXRoLnJhbmRvbSgpICogMS4wMCkgKyAwLjAwXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRzO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhLCBob3VyLCBqLCBrLCBsZW4sIG1ldHJpYywgcmVmLCBzdGF0cztcbiAgICBzdGF0cyA9IFtdO1xuICAgIHJlZiA9IFtcImNwdVwiLCBcInJhbVwiLCBcInN3YXBcIiwgXCJkaXNrXCJdO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgbWV0cmljID0gcmVmW2pdO1xuICAgICAgZGF0YSA9IFtdO1xuICAgICAgZm9yIChob3VyID0gayA9IDA7IGsgPCAyNDsgaG91ciA9ICsraykge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIHRpbWU6IFwiXCIgKyAoKFwiMFwiICsgaG91cikuc2xpY2UoLTIpKSxcbiAgICAgICAgICB2YWx1ZTogKE1hdGgucmFuZG9tKCkgKiAxLjAwKSArIDAuMDBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBzdGF0cy5wdXNoKHtcbiAgICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdHM7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlSGlzdG9yaWNhbFN0YXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0YSwgaG91ciwgaiwgbWV0cmljO1xuICAgIG1ldHJpYyA9IFtcImNwdVwiLCBcInJhbVwiLCBcInN3YXBcIiwgXCJkaXNrXCJdW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpICsgMF07XG4gICAgZGF0YSA9IFtdO1xuICAgIGZvciAoaG91ciA9IGogPSAwOyBqIDwgMjQ7IGhvdXIgPSArK2opIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHRpbWU6IFwiXCIgKyAoKFwiMFwiICsgaG91cikuc2xpY2UoLTIpKSxcbiAgICAgICAgdmFsdWU6IChNYXRoLnJhbmRvbSgpICogMS4wMCkgKyAwLjAwXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH1cbiAgICBdO1xuICB9O1xuXG4gIHJldHVybiBUZXN0RGF0YTtcblxufSkoKTtcbiIsInZhciBUZXN0RGF0YTtcblxuVGVzdERhdGEgPSByZXF1aXJlKCcuL3NoaW0vdGVzdC1kYXRhJyk7XG5cbndpbmRvdy5zdGF0c0RhdGFTaW11bHRvciA9IG5ldyBUZXN0RGF0YSgpO1xuXG53aW5kb3cuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZXhwYW5kZWQsIG1pY3JvLCBzdGFuZGFyZDtcbiAgc3RhdHNEYXRhU2ltdWx0b3IuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIoKTtcbiAgbWljcm8gPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cyhcIm1pY3JvXCIsICQoXCIubWljcm9cIikpO1xuICBtaWNyby5idWlsZCgpO1xuICBzdGFuZGFyZCA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKFwic3RhbmRhcmRcIiwgJChcIi5zdGFuZGFyZFwiKSk7XG4gIHN0YW5kYXJkLmJ1aWxkKCk7XG4gIGV4cGFuZGVkID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoXCJleHBhbmRlZFwiLCAkKFwiLmV4cGFuZGVkXCIpKTtcbiAgcmV0dXJuIGV4cGFuZGVkLmJ1aWxkKCk7XG59O1xuIl19
