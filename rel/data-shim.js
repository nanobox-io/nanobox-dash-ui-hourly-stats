(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TestData;

module.exports = TestData = (function() {
  function TestData(statTypes) {
    this.statTypes = statTypes;
    this.happy = true;
    if (this.statTypes == null) {
      this.statTypes = [
        {
          id: "cpu_used",
          nickname: "CPU",
          name: "CPU Used"
        }, {
          id: "ram_used",
          nickname: "RAM",
          name: "RAM Used"
        }, {
          id: "swap_used",
          nickname: "SWAP",
          name: "Swap Used"
        }, {
          id: "disk_used",
          nickname: "DISK",
          name: "Disk Used"
        }
      ];
    }
  }

  TestData.prototype.createFakeStatDataProvider = function() {
    PubSub.subscribe('STATS.SUBSCRIBE.LIVE', (function(_this) {
      return function(m, data) {
        return data.callback(statsDataSimultor.generateFakeLiveStats());
      };
    })(this));
    PubSub.subscribe('STATS.SUBSCRIBE.HISTORIC', (function(_this) {
      return function(m, data) {
        var j, len, ref, results, stat;
        ref = data.historicStats;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          stat = ref[j];
          results.push(data.callback(stat, statsDataSimultor.generateFakeHistoricalStats()));
        }
        return results;
      };
    })(this));
    return PubSub.subscribe('STATS.UNSUBSCRIBE', (function(_this) {
      return function(m, data) {};
    })(this));
  };

  TestData.prototype.generateFakeLiveStats = function() {
    var j, k, len, len1, obj, ref, ref1, statType;
    obj = {};
    if (Math.random() < 0.2) {
      ref = this.statTypes;
      for (j = 0, len = ref.length; j < len; j++) {
        statType = ref[j];
        obj[statType.id] = 0;
      }
    } else {
      ref1 = this.statTypes;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        statType = ref1[k];
        obj[statType.id] = Math.random();
      }
    }
    return obj;
  };

  TestData.prototype.generateAlternatingFaceStats = function() {
    var data;
    if (this.happy) {
      data = {
        cpu_used: .3,
        ram_used: .3,
        swap_used: .3,
        disk_io_wait: .3,
        disk_used: .3
      };
    } else {
      data = {
        cpu_used: .95,
        ram_used: .95,
        swap_used: .95,
        disk_io_wait: .95,
        disk_used: .95
      };
    }
    this.happy = !this.happy;
    return data;
  };

  TestData.prototype.generateFakeHistoricalStats = function(is24hrs) {
    var ar, i, j, last, now, ref, time, totalHrs, val;
    if (is24hrs == null) {
      is24hrs = true;
    }
    totalHrs = is24hrs ? 25 : 24 * 7;
    now = new Date();
    now.setHours(now.getHours() - 1);
    now.setMinutes(0);
    now.setSeconds(0);
    time = now.getTime();
    last = Math.random();
    totalHrs = 24 * 7;
    ar = [];
    for (i = j = 1, ref = totalHrs; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      val = this.getModdedVal(last);
      if (val > 0) {
        ar.push({
          time: time,
          value: val
        });
      }
      time -= 3600000;
    }
    return ar;
  };

  TestData.prototype.generateFakeDiskStats = function() {
    return Math.random();
  };

  TestData.prototype.forceIntoRange = function(number, min, max) {
    if (number < min) {
      return min;
    } else if (number > max) {
      return max;
    } else {
      return number;
    }
  };

  TestData.prototype.generateFakeHourlyStats = function() {
    var hour, j, k, last, len, obj, quarter, ref;
    obj = {};
    last = Math.random();
    for (hour = j = 0; j < 24; hour = ++j) {
      ref = [0, 15, 30, 45];
      for (k = 0, len = ref.length; k < len; k++) {
        quarter = ref[k];
        if (Math.random() > .1) {
          obj[(this.padNumber(hour, 2)) + ":" + (this.padNumber(quarter, 2))] = this.getModdedVal(last);
        }
      }
    }
    return obj;
  };

  TestData.prototype.padNumber = function(number, size) {
    var string;
    string = "" + number;
    while (string.length < size) {
      string = "0" + string;
    }
    return string;
  };

  TestData.prototype.getModdedVal = function(last) {
    var mod;
    mod = Math.random() < 0.5 ? 1 : -1;
    last += Math.random() * 0.2 * mod;
    if (last < 0) {
      last = 0;
    }
    if (last > 1) {
      last = 1;
    }
    return last.toFixed(2);
  };

  TestData.prototype.getRangeTestRange = function(hoursAgo) {
    var end, now, start;
    now = new Date();
    now.setHours(now.getHours() - 1);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setHours(now.getHours() - hoursAgo);
    end = now.getTime();
    now.setHours(now.getHours() - 23);
    start = now.getTime();
    return [start, end];
  };

  return TestData;

})();

},{}],2:[function(require,module,exports){
var TestData;

TestData = require('./shim/test-data');

window.statsDataSimultor = new TestData();

window.init = function() {
  var micro, strip;
  statsDataSimultor.createFakeStatDataProvider();
  micro = new nanobox.HourlyStats($(".micro"), nanobox.HourlyStats.micro);
  micro.build();
  strip = new nanobox.HourlyStats($(".strip"), nanobox.HourlyStats.strip);
  return strip.build();
};

},{"./shim/test-data":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVGVzdERhdGE7XG5cbm1vZHVsZS5leHBvcnRzID0gVGVzdERhdGEgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRlc3REYXRhKHN0YXRUeXBlcykge1xuICAgIHRoaXMuc3RhdFR5cGVzID0gc3RhdFR5cGVzO1xuICAgIHRoaXMuaGFwcHkgPSB0cnVlO1xuICAgIGlmICh0aGlzLnN0YXRUeXBlcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLnN0YXRUeXBlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBcImNwdV91c2VkXCIsXG4gICAgICAgICAgbmlja25hbWU6IFwiQ1BVXCIsXG4gICAgICAgICAgbmFtZTogXCJDUFUgVXNlZFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJyYW1fdXNlZFwiLFxuICAgICAgICAgIG5pY2tuYW1lOiBcIlJBTVwiLFxuICAgICAgICAgIG5hbWU6IFwiUkFNIFVzZWRcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgaWQ6IFwic3dhcF91c2VkXCIsXG4gICAgICAgICAgbmlja25hbWU6IFwiU1dBUFwiLFxuICAgICAgICAgIG5hbWU6IFwiU3dhcCBVc2VkXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcImRpc2tfdXNlZFwiLFxuICAgICAgICAgIG5pY2tuYW1lOiBcIkRJU0tcIixcbiAgICAgICAgICBuYW1lOiBcIkRpc2sgVXNlZFwiXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfVxuICB9XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuU1VCU0NSSUJFLkxJVkUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmNhbGxiYWNrKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUxpdmVTdGF0cygpKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlNVQlNDUklCRS5ISVNUT1JJQycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgICAgdmFyIGosIGxlbiwgcmVmLCByZXN1bHRzLCBzdGF0O1xuICAgICAgICByZWYgPSBkYXRhLmhpc3RvcmljU3RhdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgc3RhdCA9IHJlZltqXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goZGF0YS5jYWxsYmFjayhzdGF0LCBzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUZha2VIaXN0b3JpY2FsU3RhdHMoKSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgcmV0dXJuIFB1YlN1Yi5zdWJzY3JpYmUoJ1NUQVRTLlVOU1VCU0NSSUJFJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge307XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUZha2VMaXZlU3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaiwgaywgbGVuLCBsZW4xLCBvYmosIHJlZiwgcmVmMSwgc3RhdFR5cGU7XG4gICAgb2JqID0ge307XG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjIpIHtcbiAgICAgIHJlZiA9IHRoaXMuc3RhdFR5cGVzO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHN0YXRUeXBlID0gcmVmW2pdO1xuICAgICAgICBvYmpbc3RhdFR5cGUuaWRdID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVmMSA9IHRoaXMuc3RhdFR5cGVzO1xuICAgICAgZm9yIChrID0gMCwgbGVuMSA9IHJlZjEubGVuZ3RoOyBrIDwgbGVuMTsgaysrKSB7XG4gICAgICAgIHN0YXRUeXBlID0gcmVmMVtrXTtcbiAgICAgICAgb2JqW3N0YXRUeXBlLmlkXSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlQWx0ZXJuYXRpbmdGYWNlU3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0YTtcbiAgICBpZiAodGhpcy5oYXBweSkge1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgY3B1X3VzZWQ6IC4zLFxuICAgICAgICByYW1fdXNlZDogLjMsXG4gICAgICAgIHN3YXBfdXNlZDogLjMsXG4gICAgICAgIGRpc2tfaW9fd2FpdDogLjMsXG4gICAgICAgIGRpc2tfdXNlZDogLjNcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIGNwdV91c2VkOiAuOTUsXG4gICAgICAgIHJhbV91c2VkOiAuOTUsXG4gICAgICAgIHN3YXBfdXNlZDogLjk1LFxuICAgICAgICBkaXNrX2lvX3dhaXQ6IC45NSxcbiAgICAgICAgZGlza191c2VkOiAuOTVcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMuaGFwcHkgPSAhdGhpcy5oYXBweTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVGYWtlSGlzdG9yaWNhbFN0YXRzID0gZnVuY3Rpb24oaXMyNGhycykge1xuICAgIHZhciBhciwgaSwgaiwgbGFzdCwgbm93LCByZWYsIHRpbWUsIHRvdGFsSHJzLCB2YWw7XG4gICAgaWYgKGlzMjRocnMgPT0gbnVsbCkge1xuICAgICAgaXMyNGhycyA9IHRydWU7XG4gICAgfVxuICAgIHRvdGFsSHJzID0gaXMyNGhycyA/IDI1IDogMjQgKiA3O1xuICAgIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgbm93LnNldEhvdXJzKG5vdy5nZXRIb3VycygpIC0gMSk7XG4gICAgbm93LnNldE1pbnV0ZXMoMCk7XG4gICAgbm93LnNldFNlY29uZHMoMCk7XG4gICAgdGltZSA9IG5vdy5nZXRUaW1lKCk7XG4gICAgbGFzdCA9IE1hdGgucmFuZG9tKCk7XG4gICAgdG90YWxIcnMgPSAyNCAqIDc7XG4gICAgYXIgPSBbXTtcbiAgICBmb3IgKGkgPSBqID0gMSwgcmVmID0gdG90YWxIcnM7IDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZjsgaSA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICB2YWwgPSB0aGlzLmdldE1vZGRlZFZhbChsYXN0KTtcbiAgICAgIGlmICh2YWwgPiAwKSB7XG4gICAgICAgIGFyLnB1c2goe1xuICAgICAgICAgIHRpbWU6IHRpbWUsXG4gICAgICAgICAgdmFsdWU6IHZhbFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRpbWUgLT0gMzYwMDAwMDtcbiAgICB9XG4gICAgcmV0dXJuIGFyO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUZha2VEaXNrU3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZm9yY2VJbnRvUmFuZ2UgPSBmdW5jdGlvbihudW1iZXIsIG1pbiwgbWF4KSB7XG4gICAgaWYgKG51bWJlciA8IG1pbikge1xuICAgICAgcmV0dXJuIG1pbjtcbiAgICB9IGVsc2UgaWYgKG51bWJlciA+IG1heCkge1xuICAgICAgcmV0dXJuIG1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICB9XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlRmFrZUhvdXJseVN0YXRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhvdXIsIGosIGssIGxhc3QsIGxlbiwgb2JqLCBxdWFydGVyLCByZWY7XG4gICAgb2JqID0ge307XG4gICAgbGFzdCA9IE1hdGgucmFuZG9tKCk7XG4gICAgZm9yIChob3VyID0gaiA9IDA7IGogPCAyNDsgaG91ciA9ICsraikge1xuICAgICAgcmVmID0gWzAsIDE1LCAzMCwgNDVdO1xuICAgICAgZm9yIChrID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgayA8IGxlbjsgaysrKSB7XG4gICAgICAgIHF1YXJ0ZXIgPSByZWZba107XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gLjEpIHtcbiAgICAgICAgICBvYmpbKHRoaXMucGFkTnVtYmVyKGhvdXIsIDIpKSArIFwiOlwiICsgKHRoaXMucGFkTnVtYmVyKHF1YXJ0ZXIsIDIpKV0gPSB0aGlzLmdldE1vZGRlZFZhbChsYXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5wYWROdW1iZXIgPSBmdW5jdGlvbihudW1iZXIsIHNpemUpIHtcbiAgICB2YXIgc3RyaW5nO1xuICAgIHN0cmluZyA9IFwiXCIgKyBudW1iZXI7XG4gICAgd2hpbGUgKHN0cmluZy5sZW5ndGggPCBzaXplKSB7XG4gICAgICBzdHJpbmcgPSBcIjBcIiArIHN0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2V0TW9kZGVkVmFsID0gZnVuY3Rpb24obGFzdCkge1xuICAgIHZhciBtb2Q7XG4gICAgbW9kID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IDEgOiAtMTtcbiAgICBsYXN0ICs9IE1hdGgucmFuZG9tKCkgKiAwLjIgKiBtb2Q7XG4gICAgaWYgKGxhc3QgPCAwKSB7XG4gICAgICBsYXN0ID0gMDtcbiAgICB9XG4gICAgaWYgKGxhc3QgPiAxKSB7XG4gICAgICBsYXN0ID0gMTtcbiAgICB9XG4gICAgcmV0dXJuIGxhc3QudG9GaXhlZCgyKTtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2V0UmFuZ2VUZXN0UmFuZ2UgPSBmdW5jdGlvbihob3Vyc0Fnbykge1xuICAgIHZhciBlbmQsIG5vdywgc3RhcnQ7XG4gICAgbm93ID0gbmV3IERhdGUoKTtcbiAgICBub3cuc2V0SG91cnMobm93LmdldEhvdXJzKCkgLSAxKTtcbiAgICBub3cuc2V0TWludXRlcygwKTtcbiAgICBub3cuc2V0U2Vjb25kcygwKTtcbiAgICBub3cuc2V0SG91cnMobm93LmdldEhvdXJzKCkgLSBob3Vyc0Fnbyk7XG4gICAgZW5kID0gbm93LmdldFRpbWUoKTtcbiAgICBub3cuc2V0SG91cnMobm93LmdldEhvdXJzKCkgLSAyMyk7XG4gICAgc3RhcnQgPSBub3cuZ2V0VGltZSgpO1xuICAgIHJldHVybiBbc3RhcnQsIGVuZF07XG4gIH07XG5cbiAgcmV0dXJuIFRlc3REYXRhO1xuXG59KSgpO1xuIiwidmFyIFRlc3REYXRhO1xuXG5UZXN0RGF0YSA9IHJlcXVpcmUoJy4vc2hpbS90ZXN0LWRhdGEnKTtcblxud2luZG93LnN0YXRzRGF0YVNpbXVsdG9yID0gbmV3IFRlc3REYXRhKCk7XG5cbndpbmRvdy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtaWNybywgc3RyaXA7XG4gIHN0YXRzRGF0YVNpbXVsdG9yLmNyZWF0ZUZha2VTdGF0RGF0YVByb3ZpZGVyKCk7XG4gIG1pY3JvID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIi5taWNyb1wiKSwgbmFub2JveC5Ib3VybHlTdGF0cy5taWNybyk7XG4gIG1pY3JvLmJ1aWxkKCk7XG4gIHN0cmlwID0gbmV3IG5hbm9ib3guSG91cmx5U3RhdHMoJChcIi5zdHJpcFwiKSwgbmFub2JveC5Ib3VybHlTdGF0cy5zdHJpcCk7XG4gIHJldHVybiBzdHJpcC5idWlsZCgpO1xufTtcbiJdfQ==
