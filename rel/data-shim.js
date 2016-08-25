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
    return PubSub.subscribe('STATS.SUBSCRIBE.HISTORIC', (function(_this) {
      return function(m, data) {
        data.callback(statsDataSimultor.generateHistoricalStat());
        return setInterval(function() {
          if (window.enableUpdates) {
            return data.callback(statsDataSimultor.generateHistoricalStat());
          }
        }, 5000);
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
  var expanded, expanded2, expanded2Data, expandedData, micro, micro2, micro2Data, microData, standard, standard2, standard2Data, standard3, standard3Data, standardData;
  statsDataSimultor.createFakeStatDataProvider();
  microData = {
    view: "micro",
    entity: "host",
    entityId: "0001"
  };
  micro = new nanobox.HourlyStats($("#micro1"), microData);
  micro.build();
  micro2Data = {
    view: "micro",
    metrics: ['cpu', 'ram'],
    entity: "host",
    entityId: "0002"
  };
  micro2 = new nanobox.HourlyStats($("#micro2"), micro2Data);
  micro2.build();
  standardData = {
    view: "standard",
    entity: "host",
    entityId: "0003"
  };
  standard = new nanobox.HourlyStats($("#standard1"), standardData);
  standard.build();
  standard2Data = {
    view: "standard",
    metrics: ['cpu', 'ram'],
    entity: "host",
    entityId: "0004"
  };
  standard2 = new nanobox.HourlyStats($("#standard2"), standard2Data);
  standard2.build();
  standard3Data = {
    view: "standard",
    entity: "host",
    entityId: "0005"
  };
  standard3 = new nanobox.HourlyStats($("#standard3"), standard3Data);
  standard3.build();
  expandedData = {
    view: "expanded",
    entity: "host",
    entityId: "0006"
  };
  expanded = new nanobox.HourlyStats($("#expanded1"), expandedData);
  expanded.build();
  expanded2Data = {
    view: "expanded",
    metrics: ['cpu', 'ram'],
    entity: "host",
    entityId: "0007"
  };
  expanded2 = new nanobox.HourlyStats($("#expanded2"), expanded2Data);
  return expanded2.build();
};

},{"./shim/test-data":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFRlc3REYXRhO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRlc3REYXRhID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBUZXN0RGF0YSgpIHt9XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuU1VCU0NSSUJFLkxJVkUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIGRhdGEuY2FsbGJhY2soc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVMaXZlU3RhdCgpKTtcbiAgICAgICAgcmV0dXJuIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh3aW5kb3cuZW5hYmxlVXBkYXRlcykge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEuY2FsbGJhY2soc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVMaXZlU3RhdCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDUwMDApO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgcmV0dXJuIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlNVQlNDUklCRS5ISVNUT1JJQycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0KCkpO1xuICAgICAgICByZXR1cm4gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHdpbmRvdy5lbmFibGVVcGRhdGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5jYWxsYmFjayhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgNTAwMCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVMaXZlU3RhdHMgPSBmdW5jdGlvbihpc0NvbnRhaW5lcikge1xuICAgIHZhciBpLCBsZW4sIG1ldHJpYywgcmVmLCBzdGF0cztcbiAgICBzdGF0cyA9IFtdO1xuICAgIHJlZiA9IHRoaXMuZ2V0TWV0cmljcyhpc0NvbnRhaW5lcik7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtZXRyaWMgPSByZWZbaV07XG4gICAgICBzdGF0cy5wdXNoKHRoaXMuZ2VuZXJhdGVMaXZlU3RhdCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRzO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUxpdmVTdGF0ID0gZnVuY3Rpb24oaXNDb250YWluZXIpIHtcbiAgICB2YXIgbWV0cmljLCBtZXRyaWNzO1xuICAgIG1ldHJpY3MgPSB0aGlzLmdldE1ldHJpY3MoaXNDb250YWluZXIpO1xuICAgIG1ldHJpYyA9IG1ldHJpY3NbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWV0cmljcy5sZW5ndGgpXTtcbiAgICByZXR1cm4ge1xuICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgICB2YWx1ZTogKE1hdGgucmFuZG9tKCkgKiAxLjAwKSArIDAuMDBcbiAgICB9O1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUhpc3RvcmljYWxTdGF0cyA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgdmFyIGRhdGEsIGhvdXIsIGksIGosIGxlbiwgbWV0cmljLCByZWYsIHN0YXRzO1xuICAgIHN0YXRzID0gW107XG4gICAgcmVmID0gdGhpcy5nZXRNZXRyaWNzKGlzQ29udGFpbmVyKTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG1ldHJpYyA9IHJlZltpXTtcbiAgICAgIGRhdGEgPSBbXTtcbiAgICAgIGZvciAoaG91ciA9IGogPSAwOyBqIDw9IDI0OyBob3VyID0gKytqKSB7XG4gICAgICAgIGRhdGEucHVzaCh0aGlzLmdlbmVyYXRlSGlzdG9yaWNhbFN0YXQoaXNDb250YWluZXIpKTtcbiAgICAgIH1cbiAgICAgIHN0YXRzLnB1c2goe1xuICAgICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0cztcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVIaXN0b3JpY2FsU3RhdCA9IGZ1bmN0aW9uKGlzQ29udGFpbmVyKSB7XG4gICAgdmFyIGRhdGEsIGhvdXIsIGksIG1ldHJpYywgbWV0cmljcztcbiAgICBtZXRyaWNzID0gdGhpcy5nZXRNZXRyaWNzKGlzQ29udGFpbmVyKTtcbiAgICBtZXRyaWMgPSBtZXRyaWNzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1ldHJpY3MubGVuZ3RoKV07XG4gICAgZGF0YSA9IFtdO1xuICAgIGZvciAoaG91ciA9IGkgPSAwOyBpIDw9IDI0OyBob3VyID0gKytpKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICB0aW1lOiBtb21lbnQoKS5zdWJ0cmFjdChob3VyLCBcImhcIiksXG4gICAgICAgIHZhbHVlOiAoTWF0aC5yYW5kb20oKSAqIDEuMDApICsgMC4wMFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9O1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZXRNZXRyaWNzID0gZnVuY3Rpb24oaXNDb250YWluZXIpIHtcbiAgICBpZiAoaXNDb250YWluZXIpIHtcbiAgICAgIHJldHVybiBbXCJjcHVcIiwgXCJyYW1cIl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbXCJjcHVcIiwgXCJyYW1cIiwgXCJzd2FwXCIsIFwiZGlza1wiXTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFRlc3REYXRhO1xuXG59KSgpO1xuIiwidmFyIFRlc3REYXRhO1xuXG5UZXN0RGF0YSA9IHJlcXVpcmUoJy4vc2hpbS90ZXN0LWRhdGEnKTtcblxud2luZG93LnN0YXRzRGF0YVNpbXVsdG9yID0gbmV3IFRlc3REYXRhKCk7XG5cbndpbmRvdy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBleHBhbmRlZCwgZXhwYW5kZWQyLCBleHBhbmRlZDJEYXRhLCBleHBhbmRlZERhdGEsIG1pY3JvLCBtaWNybzIsIG1pY3JvMkRhdGEsIG1pY3JvRGF0YSwgc3RhbmRhcmQsIHN0YW5kYXJkMiwgc3RhbmRhcmQyRGF0YSwgc3RhbmRhcmQzLCBzdGFuZGFyZDNEYXRhLCBzdGFuZGFyZERhdGE7XG4gIHN0YXRzRGF0YVNpbXVsdG9yLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyKCk7XG4gIG1pY3JvRGF0YSA9IHtcbiAgICB2aWV3OiBcIm1pY3JvXCIsXG4gICAgZW50aXR5OiBcImhvc3RcIixcbiAgICBlbnRpdHlJZDogXCIwMDAxXCJcbiAgfTtcbiAgbWljcm8gPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiI21pY3JvMVwiKSwgbWljcm9EYXRhKTtcbiAgbWljcm8uYnVpbGQoKTtcbiAgbWljcm8yRGF0YSA9IHtcbiAgICB2aWV3OiBcIm1pY3JvXCIsXG4gICAgbWV0cmljczogWydjcHUnLCAncmFtJ10sXG4gICAgZW50aXR5OiBcImhvc3RcIixcbiAgICBlbnRpdHlJZDogXCIwMDAyXCJcbiAgfTtcbiAgbWljcm8yID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNtaWNybzJcIiksIG1pY3JvMkRhdGEpO1xuICBtaWNybzIuYnVpbGQoKTtcbiAgc3RhbmRhcmREYXRhID0ge1xuICAgIHZpZXc6IFwic3RhbmRhcmRcIixcbiAgICBlbnRpdHk6IFwiaG9zdFwiLFxuICAgIGVudGl0eUlkOiBcIjAwMDNcIlxuICB9O1xuICBzdGFuZGFyZCA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIjc3RhbmRhcmQxXCIpLCBzdGFuZGFyZERhdGEpO1xuICBzdGFuZGFyZC5idWlsZCgpO1xuICBzdGFuZGFyZDJEYXRhID0ge1xuICAgIHZpZXc6IFwic3RhbmRhcmRcIixcbiAgICBtZXRyaWNzOiBbJ2NwdScsICdyYW0nXSxcbiAgICBlbnRpdHk6IFwiaG9zdFwiLFxuICAgIGVudGl0eUlkOiBcIjAwMDRcIlxuICB9O1xuICBzdGFuZGFyZDIgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiI3N0YW5kYXJkMlwiKSwgc3RhbmRhcmQyRGF0YSk7XG4gIHN0YW5kYXJkMi5idWlsZCgpO1xuICBzdGFuZGFyZDNEYXRhID0ge1xuICAgIHZpZXc6IFwic3RhbmRhcmRcIixcbiAgICBlbnRpdHk6IFwiaG9zdFwiLFxuICAgIGVudGl0eUlkOiBcIjAwMDVcIlxuICB9O1xuICBzdGFuZGFyZDMgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiI3N0YW5kYXJkM1wiKSwgc3RhbmRhcmQzRGF0YSk7XG4gIHN0YW5kYXJkMy5idWlsZCgpO1xuICBleHBhbmRlZERhdGEgPSB7XG4gICAgdmlldzogXCJleHBhbmRlZFwiLFxuICAgIGVudGl0eTogXCJob3N0XCIsXG4gICAgZW50aXR5SWQ6IFwiMDAwNlwiXG4gIH07XG4gIGV4cGFuZGVkID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIiNleHBhbmRlZDFcIiksIGV4cGFuZGVkRGF0YSk7XG4gIGV4cGFuZGVkLmJ1aWxkKCk7XG4gIGV4cGFuZGVkMkRhdGEgPSB7XG4gICAgdmlldzogXCJleHBhbmRlZFwiLFxuICAgIG1ldHJpY3M6IFsnY3B1JywgJ3JhbSddLFxuICAgIGVudGl0eTogXCJob3N0XCIsXG4gICAgZW50aXR5SWQ6IFwiMDAwN1wiXG4gIH07XG4gIGV4cGFuZGVkMiA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIjZXhwYW5kZWQyXCIpLCBleHBhbmRlZDJEYXRhKTtcbiAgcmV0dXJuIGV4cGFuZGVkMi5idWlsZCgpO1xufTtcbiJdfQ==
