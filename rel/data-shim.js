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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFRlc3REYXRhO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRlc3REYXRhID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBUZXN0RGF0YSgpIHt9XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuU1VCU0NSSUJFLkxJVkUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIGRhdGEuY2FsbGJhY2soc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVMaXZlU3RhdHMoKSk7XG4gICAgICAgIHJldHVybiBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAod2luZG93LmVuYWJsZVVwZGF0ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLmNhbGxiYWNrKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlTGl2ZVN0YXRzKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgNTAwMCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5TVUJTQ1JJQkUuSElTVE9SSUMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIGRhdGEuY2FsbGJhY2soc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVIaXN0b3JpY2FsU3RhdHMoKSk7XG4gICAgICAgIHJldHVybiBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgaSwgaiwgcmVzdWx0cztcbiAgICAgICAgICBpZiAod2luZG93LmVuYWJsZVVwZGF0ZXMpIHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaSA9IGogPSAwOyBqIDw9IDQ7IGkgPSArK2opIHtcbiAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuY2FsbGJhY2soc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVIaXN0b3JpY2FsU3RhdCgpKTtcbiAgICAgICAgICAgICAgfSwgTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwMDApICsgMjUwKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgfVxuICAgICAgICB9LCA1MDAwKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIHJldHVybiBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5VTlNVQlNDUklCRScsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHt9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVMaXZlU3RhdHMgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIHZhciBqLCBsZW4sIG1ldHJpYywgcmVmLCBzdGF0cztcbiAgICBzdGF0cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMuZ2V0TWV0cmljcyhpc0NvbnRhaW5lcik7XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBtZXRyaWMgPSByZWZbal07XG4gICAgICBzdGF0cy5wdXNoKHtcbiAgICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgICAgIHZhbHVlOiAoTWF0aC5yYW5kb20oKSAqIDEuMDApICsgMC4wMFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0cztcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVIaXN0b3JpY2FsU3RhdHMgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIHZhciBkYXRhLCBob3VyLCBqLCBrLCBsZW4sIG1ldHJpYywgcmVmLCBzdGF0cztcbiAgICBzdGF0cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMuZ2V0TWV0cmljcyhpc0NvbnRhaW5lcik7XG4gICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBtZXRyaWMgPSByZWZbal07XG4gICAgICBkYXRhID0gW107XG4gICAgICBmb3IgKGhvdXIgPSBrID0gMDsgayA8PSAyNDsgaG91ciA9ICsraykge1xuICAgICAgICBkYXRhLnB1c2goe1xuICAgICAgICAgIHRpbWU6IFwiXCIgKyAoKFwiMFwiICsgaG91cikuc2xpY2UoLTIpKSxcbiAgICAgICAgICB2YWx1ZTogKE1hdGgucmFuZG9tKCkgKiAxLjAwKSArIDAuMDBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBzdGF0cy5wdXNoKHtcbiAgICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdHM7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlSGlzdG9yaWNhbFN0YXQgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIHZhciBkYXRhLCBob3VyLCBqLCBtZXRyaWMsIG1ldHJpY3M7XG4gICAgbWV0cmljcyA9IHRoaXMuZ2V0TWV0cmljcyhpc0NvbnRhaW5lcik7XG4gICAgbWV0cmljID0gbWV0cmljc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtZXRyaWNzLmxlbmd0aCldO1xuICAgIGRhdGEgPSBbXTtcbiAgICBmb3IgKGhvdXIgPSBqID0gMDsgaiA8PSAyNDsgaG91ciA9ICsraikge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgdGltZTogXCJcIiArICgoXCIwXCIgKyBob3VyKS5zbGljZSgtMikpLFxuICAgICAgICB2YWx1ZTogKE1hdGgucmFuZG9tKCkgKiAxLjAwKSArIDAuMDBcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfVxuICAgIF07XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdldE1ldHJpY3MgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIGlmIChpc0NvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIFtcImNwdVwiLCBcInJhbVwiXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtcImNwdVwiLCBcInJhbVwiLCBcInN3YXBcIiwgXCJkaXNrXCJdO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gVGVzdERhdGE7XG5cbn0pKCk7XG4iLCJ2YXIgVGVzdERhdGE7XG5cblRlc3REYXRhID0gcmVxdWlyZSgnLi9zaGltL3Rlc3QtZGF0YScpO1xuXG53aW5kb3cuc3RhdHNEYXRhU2ltdWx0b3IgPSBuZXcgVGVzdERhdGEoKTtcblxud2luZG93LmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGV4cGFuZGVkLCBleHBhbmRlZDIsIG1pY3JvLCBtaWNybzIsIHN0YW5kYXJkLCBzdGFuZGFyZDIsIHN0YW5kYXJkMztcbiAgc3RhdHNEYXRhU2ltdWx0b3IuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIoKTtcbiAgbWljcm8gPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiI21pY3JvMVwiKSwge1xuICAgIHZpZXc6IFwibWljcm9cIixcbiAgICBpc0NvbnRhaW5lcjogZmFsc2VcbiAgfSk7XG4gIG1pY3JvLmJ1aWxkKCk7XG4gIG1pY3JvMiA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIjbWljcm8yICBcIiksIHtcbiAgICB2aWV3OiBcIm1pY3JvXCIsXG4gICAgaXNDb250YWluZXI6IHRydWUsXG4gICAgbWV0cmljczogWydjcHUnLCAncmFtJ11cbiAgfSk7XG4gIG1pY3JvMi5idWlsZCgpO1xuICBzdGFuZGFyZCA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIjc3RhbmRhcmQxXCIpLCB7XG4gICAgdmlldzogXCJzdGFuZGFyZFwiLFxuICAgIGlzQ29udGFpbmVyOiBmYWxzZVxuICB9KTtcbiAgc3RhbmRhcmQuYnVpbGQoKTtcbiAgc3RhbmRhcmQyID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNzdGFuZGFyZDJcIiksIHtcbiAgICB2aWV3OiBcInN0YW5kYXJkXCIsXG4gICAgaXNDb250YWluZXI6IHRydWUsXG4gICAgbWV0cmljczogWydjcHUnLCAncmFtJ11cbiAgfSk7XG4gIHN0YW5kYXJkMi5idWlsZCgpO1xuICBzdGFuZGFyZDMgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiI3N0YW5kYXJkM1wiKSwge1xuICAgIHZpZXc6IFwic3RhbmRhcmRcIixcbiAgICBjb21wcmVzc1ZpZXc6IHRydWVcbiAgfSk7XG4gIHN0YW5kYXJkMy5idWlsZCgpO1xuICBleHBhbmRlZCA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIjZXhwYW5kZWQxXCIpLCB7XG4gICAgdmlldzogXCJleHBhbmRlZFwiLFxuICAgIGlzQ29udGFpbmVyOiBmYWxzZVxuICB9KTtcbiAgZXhwYW5kZWQuYnVpbGQoKTtcbiAgZXhwYW5kZWQyID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNleHBhbmRlZDJcIiksIHtcbiAgICB2aWV3OiBcImV4cGFuZGVkXCIsXG4gICAgaXNDb250YWluZXI6IHRydWUsXG4gICAgbWV0cmljczogWydjcHUnLCAncmFtJ11cbiAgfSk7XG4gIHJldHVybiBleHBhbmRlZDIuYnVpbGQoKTtcbn07XG4iXX0=
