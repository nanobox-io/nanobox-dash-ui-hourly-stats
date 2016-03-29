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
  PubSub.subscribe('STATS.SUBSCRIBE', (function(_this) {
    return function(m, data) {
      var i, len, ref, results, stat;
      data.subscriber.updateLiveStats(statsDataSimultor.generateFakeLiveStats());
      if (data.historicStats) {
        ref = data.historicStats;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          stat = ref[i];
          results.push(data.subscriber.updateHistoricStat(stat, statsDataSimultor.generateFakeHistoricalStats()));
        }
        return results;
      }
    };
  })(this));
  PubSub.subscribe('STATS.UNSUBSCRIBE', (function(_this) {
    return function(m, data) {};
  })(this));
  micro = new nanobox.HourlyStats($(".micro"), nanobox.HourlyStats.micro);
  micro.build();
  strip = new nanobox.HourlyStats($(".strip"), nanobox.HourlyStats.strip);
  return strip.build();
};

},{"./shim/test-data":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVGVzdERhdGE7XG5cbm1vZHVsZS5leHBvcnRzID0gVGVzdERhdGEgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRlc3REYXRhKHN0YXRUeXBlcykge1xuICAgIHRoaXMuc3RhdFR5cGVzID0gc3RhdFR5cGVzO1xuICAgIHRoaXMuaGFwcHkgPSB0cnVlO1xuICAgIGlmICh0aGlzLnN0YXRUeXBlcyA9PSBudWxsKSB7XG4gICAgICB0aGlzLnN0YXRUeXBlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBcImNwdV91c2VkXCIsXG4gICAgICAgICAgbmlja25hbWU6IFwiQ1BVXCIsXG4gICAgICAgICAgbmFtZTogXCJDUFUgVXNlZFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJyYW1fdXNlZFwiLFxuICAgICAgICAgIG5pY2tuYW1lOiBcIlJBTVwiLFxuICAgICAgICAgIG5hbWU6IFwiUkFNIFVzZWRcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgaWQ6IFwic3dhcF91c2VkXCIsXG4gICAgICAgICAgbmlja25hbWU6IFwiU1dBUFwiLFxuICAgICAgICAgIG5hbWU6IFwiU3dhcCBVc2VkXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcImRpc2tfdXNlZFwiLFxuICAgICAgICAgIG5pY2tuYW1lOiBcIkRJU0tcIixcbiAgICAgICAgICBuYW1lOiBcIkRpc2sgVXNlZFwiXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfVxuICB9XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlRmFrZUxpdmVTdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBqLCBrLCBsZW4sIGxlbjEsIG9iaiwgcmVmLCByZWYxLCBzdGF0VHlwZTtcbiAgICBvYmogPSB7fTtcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMikge1xuICAgICAgcmVmID0gdGhpcy5zdGF0VHlwZXM7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3RhdFR5cGUgPSByZWZbal07XG4gICAgICAgIG9ialtzdGF0VHlwZS5pZF0gPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWYxID0gdGhpcy5zdGF0VHlwZXM7XG4gICAgICBmb3IgKGsgPSAwLCBsZW4xID0gcmVmMS5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgICAgc3RhdFR5cGUgPSByZWYxW2tdO1xuICAgICAgICBvYmpbc3RhdFR5cGUuaWRdID0gTWF0aC5yYW5kb20oKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVBbHRlcm5hdGluZ0ZhY2VTdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhO1xuICAgIGlmICh0aGlzLmhhcHB5KSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBjcHVfdXNlZDogLjMsXG4gICAgICAgIHJhbV91c2VkOiAuMyxcbiAgICAgICAgc3dhcF91c2VkOiAuMyxcbiAgICAgICAgZGlza19pb193YWl0OiAuMyxcbiAgICAgICAgZGlza191c2VkOiAuM1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgY3B1X3VzZWQ6IC45NSxcbiAgICAgICAgcmFtX3VzZWQ6IC45NSxcbiAgICAgICAgc3dhcF91c2VkOiAuOTUsXG4gICAgICAgIGRpc2tfaW9fd2FpdDogLjk1LFxuICAgICAgICBkaXNrX3VzZWQ6IC45NVxuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5oYXBweSA9ICF0aGlzLmhhcHB5O1xuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUZha2VIaXN0b3JpY2FsU3RhdHMgPSBmdW5jdGlvbihpczI0aHJzKSB7XG4gICAgdmFyIGFyLCBpLCBqLCBsYXN0LCBub3csIHJlZiwgdGltZSwgdG90YWxIcnMsIHZhbDtcbiAgICBpZiAoaXMyNGhycyA9PSBudWxsKSB7XG4gICAgICBpczI0aHJzID0gdHJ1ZTtcbiAgICB9XG4gICAgdG90YWxIcnMgPSBpczI0aHJzID8gMjUgOiAyNCAqIDc7XG4gICAgbm93ID0gbmV3IERhdGUoKTtcbiAgICBub3cuc2V0SG91cnMobm93LmdldEhvdXJzKCkgLSAxKTtcbiAgICBub3cuc2V0TWludXRlcygwKTtcbiAgICBub3cuc2V0U2Vjb25kcygwKTtcbiAgICB0aW1lID0gbm93LmdldFRpbWUoKTtcbiAgICBsYXN0ID0gTWF0aC5yYW5kb20oKTtcbiAgICB0b3RhbEhycyA9IDI0ICogNztcbiAgICBhciA9IFtdO1xuICAgIGZvciAoaSA9IGogPSAxLCByZWYgPSB0b3RhbEhyczsgMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmOyBpID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIHZhbCA9IHRoaXMuZ2V0TW9kZGVkVmFsKGxhc3QpO1xuICAgICAgaWYgKHZhbCA+IDApIHtcbiAgICAgICAgYXIucHVzaCh7XG4gICAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgICB2YWx1ZTogdmFsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGltZSAtPSAzNjAwMDAwO1xuICAgIH1cbiAgICByZXR1cm4gYXI7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlRmFrZURpc2tTdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5mb3JjZUludG9SYW5nZSA9IGZ1bmN0aW9uKG51bWJlciwgbWluLCBtYXgpIHtcbiAgICBpZiAobnVtYmVyIDwgbWluKSB7XG4gICAgICByZXR1cm4gbWluO1xuICAgIH0gZWxzZSBpZiAobnVtYmVyID4gbWF4KSB7XG4gICAgICByZXR1cm4gbWF4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH1cbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVGYWtlSG91cmx5U3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaG91ciwgaiwgaywgbGFzdCwgbGVuLCBvYmosIHF1YXJ0ZXIsIHJlZjtcbiAgICBvYmogPSB7fTtcbiAgICBsYXN0ID0gTWF0aC5yYW5kb20oKTtcbiAgICBmb3IgKGhvdXIgPSBqID0gMDsgaiA8IDI0OyBob3VyID0gKytqKSB7XG4gICAgICByZWYgPSBbMCwgMTUsIDMwLCA0NV07XG4gICAgICBmb3IgKGsgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgICAgcXVhcnRlciA9IHJlZltrXTtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAuMSkge1xuICAgICAgICAgIG9ialsodGhpcy5wYWROdW1iZXIoaG91ciwgMikpICsgXCI6XCIgKyAodGhpcy5wYWROdW1iZXIocXVhcnRlciwgMikpXSA9IHRoaXMuZ2V0TW9kZGVkVmFsKGxhc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLnBhZE51bWJlciA9IGZ1bmN0aW9uKG51bWJlciwgc2l6ZSkge1xuICAgIHZhciBzdHJpbmc7XG4gICAgc3RyaW5nID0gXCJcIiArIG51bWJlcjtcbiAgICB3aGlsZSAoc3RyaW5nLmxlbmd0aCA8IHNpemUpIHtcbiAgICAgIHN0cmluZyA9IFwiMFwiICsgc3RyaW5nO1xuICAgIH1cbiAgICByZXR1cm4gc3RyaW5nO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZXRNb2RkZWRWYWwgPSBmdW5jdGlvbihsYXN0KSB7XG4gICAgdmFyIG1vZDtcbiAgICBtb2QgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IC0xO1xuICAgIGxhc3QgKz0gTWF0aC5yYW5kb20oKSAqIDAuMiAqIG1vZDtcbiAgICBpZiAobGFzdCA8IDApIHtcbiAgICAgIGxhc3QgPSAwO1xuICAgIH1cbiAgICBpZiAobGFzdCA+IDEpIHtcbiAgICAgIGxhc3QgPSAxO1xuICAgIH1cbiAgICByZXR1cm4gbGFzdC50b0ZpeGVkKDIpO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZXRSYW5nZVRlc3RSYW5nZSA9IGZ1bmN0aW9uKGhvdXJzQWdvKSB7XG4gICAgdmFyIGVuZCwgbm93LCBzdGFydDtcbiAgICBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIG5vdy5zZXRIb3Vycyhub3cuZ2V0SG91cnMoKSAtIDEpO1xuICAgIG5vdy5zZXRNaW51dGVzKDApO1xuICAgIG5vdy5zZXRTZWNvbmRzKDApO1xuICAgIG5vdy5zZXRIb3Vycyhub3cuZ2V0SG91cnMoKSAtIGhvdXJzQWdvKTtcbiAgICBlbmQgPSBub3cuZ2V0VGltZSgpO1xuICAgIG5vdy5zZXRIb3Vycyhub3cuZ2V0SG91cnMoKSAtIDIzKTtcbiAgICBzdGFydCA9IG5vdy5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIFtzdGFydCwgZW5kXTtcbiAgfTtcblxuICByZXR1cm4gVGVzdERhdGE7XG5cbn0pKCk7XG4iLCJ2YXIgVGVzdERhdGE7XG5cblRlc3REYXRhID0gcmVxdWlyZSgnLi9zaGltL3Rlc3QtZGF0YScpO1xuXG53aW5kb3cuc3RhdHNEYXRhU2ltdWx0b3IgPSBuZXcgVGVzdERhdGEoKTtcblxud2luZG93LmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1pY3JvLCBzdHJpcDtcbiAgUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuU1VCU0NSSUJFJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG0sIGRhdGEpIHtcbiAgICAgIHZhciBpLCBsZW4sIHJlZiwgcmVzdWx0cywgc3RhdDtcbiAgICAgIGRhdGEuc3Vic2NyaWJlci51cGRhdGVMaXZlU3RhdHMoc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVGYWtlTGl2ZVN0YXRzKCkpO1xuICAgICAgaWYgKGRhdGEuaGlzdG9yaWNTdGF0cykge1xuICAgICAgICByZWYgPSBkYXRhLmhpc3RvcmljU3RhdHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgc3RhdCA9IHJlZltpXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goZGF0YS5zdWJzY3JpYmVyLnVwZGF0ZUhpc3RvcmljU3RhdChzdGF0LCBzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUZha2VIaXN0b3JpY2FsU3RhdHMoKSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG4gIH0pKHRoaXMpKTtcbiAgUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuVU5TVUJTQ1JJQkUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obSwgZGF0YSkge307XG4gIH0pKHRoaXMpKTtcbiAgbWljcm8gPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiLm1pY3JvXCIpLCBuYW5vYm94LkhvdXJseVN0YXRzLm1pY3JvKTtcbiAgbWljcm8uYnVpbGQoKTtcbiAgc3RyaXAgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiLnN0cmlwXCIpLCBuYW5vYm94LkhvdXJseVN0YXRzLnN0cmlwKTtcbiAgcmV0dXJuIHN0cmlwLmJ1aWxkKCk7XG59O1xuIl19
