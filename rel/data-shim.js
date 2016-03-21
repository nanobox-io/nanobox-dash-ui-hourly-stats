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
    this.thresholds = {
      cpu_used_thresholds: [.35, .7],
      ram_used_thresholds: [.25, .5],
      swap_used_thresholds: [.15, .8]
    };
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
  micro = new nanobox.HourlyStats($(".micro"), nanobox.HourlyStats.micro);
  micro.initStats(statsDataSimultor.statTypes, statsDataSimultor.thresholds);
  micro.build();
  micro.updateLiveStats(statsDataSimultor.generateFakeLiveStats());
  strip = new nanobox.HourlyStats($(".strip"), nanobox.HourlyStats.strip);
  strip.initStats(statsDataSimultor.statTypes, statsDataSimultor.thresholds);
  strip.build();
  strip.updateLiveStats(statsDataSimultor.generateFakeLiveStats());
  strip.updateHistoricStat("disk_used", statsDataSimultor.generateFakeHistoricalStats());
  strip.updateHistoricStat("ram_used", statsDataSimultor.generateFakeHistoricalStats());
  strip.updateHistoricStat("cpu_used", statsDataSimultor.generateFakeHistoricalStats());
  return strip.updateHistoricStat("swap_used", statsDataSimultor.generateFakeHistoricalStats());
};

},{"./shim/test-data":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUZXN0RGF0YTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXN0RGF0YSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVGVzdERhdGEoc3RhdFR5cGVzKSB7XG4gICAgdGhpcy5zdGF0VHlwZXMgPSBzdGF0VHlwZXM7XG4gICAgdGhpcy5oYXBweSA9IHRydWU7XG4gICAgaWYgKHRoaXMuc3RhdFR5cGVzID09IG51bGwpIHtcbiAgICAgIHRoaXMuc3RhdFR5cGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6IFwiY3B1X3VzZWRcIixcbiAgICAgICAgICBuaWNrbmFtZTogXCJDUFVcIixcbiAgICAgICAgICBuYW1lOiBcIkNQVSBVc2VkXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcInJhbV91c2VkXCIsXG4gICAgICAgICAgbmlja25hbWU6IFwiUkFNXCIsXG4gICAgICAgICAgbmFtZTogXCJSQU0gVXNlZFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJzd2FwX3VzZWRcIixcbiAgICAgICAgICBuaWNrbmFtZTogXCJTV0FQXCIsXG4gICAgICAgICAgbmFtZTogXCJTd2FwIFVzZWRcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgaWQ6IFwiZGlza191c2VkXCIsXG4gICAgICAgICAgbmlja25hbWU6IFwiRElTS1wiLFxuICAgICAgICAgIG5hbWU6IFwiRGlzayBVc2VkXCJcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9XG4gICAgdGhpcy50aHJlc2hvbGRzID0ge1xuICAgICAgY3B1X3VzZWRfdGhyZXNob2xkczogWy4zNSwgLjddLFxuICAgICAgcmFtX3VzZWRfdGhyZXNob2xkczogWy4yNSwgLjVdLFxuICAgICAgc3dhcF91c2VkX3RocmVzaG9sZHM6IFsuMTUsIC44XVxuICAgIH07XG4gIH1cblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVGYWtlTGl2ZVN0YXRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGosIGssIGxlbiwgbGVuMSwgb2JqLCByZWYsIHJlZjEsIHN0YXRUeXBlO1xuICAgIG9iaiA9IHt9O1xuICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC4yKSB7XG4gICAgICByZWYgPSB0aGlzLnN0YXRUeXBlcztcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBzdGF0VHlwZSA9IHJlZltqXTtcbiAgICAgICAgb2JqW3N0YXRUeXBlLmlkXSA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZjEgPSB0aGlzLnN0YXRUeXBlcztcbiAgICAgIGZvciAoayA9IDAsIGxlbjEgPSByZWYxLmxlbmd0aDsgayA8IGxlbjE7IGsrKykge1xuICAgICAgICBzdGF0VHlwZSA9IHJlZjFba107XG4gICAgICAgIG9ialtzdGF0VHlwZS5pZF0gPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUFsdGVybmF0aW5nRmFjZVN0YXRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhdGE7XG4gICAgaWYgKHRoaXMuaGFwcHkpIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIGNwdV91c2VkOiAuMyxcbiAgICAgICAgcmFtX3VzZWQ6IC4zLFxuICAgICAgICBzd2FwX3VzZWQ6IC4zLFxuICAgICAgICBkaXNrX2lvX3dhaXQ6IC4zLFxuICAgICAgICBkaXNrX3VzZWQ6IC4zXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBjcHVfdXNlZDogLjk1LFxuICAgICAgICByYW1fdXNlZDogLjk1LFxuICAgICAgICBzd2FwX3VzZWQ6IC45NSxcbiAgICAgICAgZGlza19pb193YWl0OiAuOTUsXG4gICAgICAgIGRpc2tfdXNlZDogLjk1XG4gICAgICB9O1xuICAgIH1cbiAgICB0aGlzLmhhcHB5ID0gIXRoaXMuaGFwcHk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlRmFrZUhpc3RvcmljYWxTdGF0cyA9IGZ1bmN0aW9uKGlzMjRocnMpIHtcbiAgICB2YXIgYXIsIGksIGosIGxhc3QsIG5vdywgcmVmLCB0aW1lLCB0b3RhbEhycywgdmFsO1xuICAgIGlmIChpczI0aHJzID09IG51bGwpIHtcbiAgICAgIGlzMjRocnMgPSB0cnVlO1xuICAgIH1cbiAgICB0b3RhbEhycyA9IGlzMjRocnMgPyAyNSA6IDI0ICogNztcbiAgICBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIG5vdy5zZXRIb3Vycyhub3cuZ2V0SG91cnMoKSAtIDEpO1xuICAgIG5vdy5zZXRNaW51dGVzKDApO1xuICAgIG5vdy5zZXRTZWNvbmRzKDApO1xuICAgIHRpbWUgPSBub3cuZ2V0VGltZSgpO1xuICAgIGxhc3QgPSBNYXRoLnJhbmRvbSgpO1xuICAgIHRvdGFsSHJzID0gMjQgKiA3O1xuICAgIGFyID0gW107XG4gICAgZm9yIChpID0gaiA9IDEsIHJlZiA9IHRvdGFsSHJzOyAxIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWY7IGkgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgdmFsID0gdGhpcy5nZXRNb2RkZWRWYWwobGFzdCk7XG4gICAgICBpZiAodmFsID4gMCkge1xuICAgICAgICBhci5wdXNoKHtcbiAgICAgICAgICB0aW1lOiB0aW1lLFxuICAgICAgICAgIHZhbHVlOiB2YWxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aW1lIC09IDM2MDAwMDA7XG4gICAgfVxuICAgIHJldHVybiBhcjtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVGYWtlRGlza1N0YXRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCk7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmZvcmNlSW50b1JhbmdlID0gZnVuY3Rpb24obnVtYmVyLCBtaW4sIG1heCkge1xuICAgIGlmIChudW1iZXIgPCBtaW4pIHtcbiAgICAgIHJldHVybiBtaW47XG4gICAgfSBlbHNlIGlmIChudW1iZXIgPiBtYXgpIHtcbiAgICAgIHJldHVybiBtYXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudW1iZXI7XG4gICAgfVxuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUZha2VIb3VybHlTdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBob3VyLCBqLCBrLCBsYXN0LCBsZW4sIG9iaiwgcXVhcnRlciwgcmVmO1xuICAgIG9iaiA9IHt9O1xuICAgIGxhc3QgPSBNYXRoLnJhbmRvbSgpO1xuICAgIGZvciAoaG91ciA9IGogPSAwOyBqIDwgMjQ7IGhvdXIgPSArK2opIHtcbiAgICAgIHJlZiA9IFswLCAxNSwgMzAsIDQ1XTtcbiAgICAgIGZvciAoayA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGsgPCBsZW47IGsrKykge1xuICAgICAgICBxdWFydGVyID0gcmVmW2tdO1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IC4xKSB7XG4gICAgICAgICAgb2JqWyh0aGlzLnBhZE51bWJlcihob3VyLCAyKSkgKyBcIjpcIiArICh0aGlzLnBhZE51bWJlcihxdWFydGVyLCAyKSldID0gdGhpcy5nZXRNb2RkZWRWYWwobGFzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUucGFkTnVtYmVyID0gZnVuY3Rpb24obnVtYmVyLCBzaXplKSB7XG4gICAgdmFyIHN0cmluZztcbiAgICBzdHJpbmcgPSBcIlwiICsgbnVtYmVyO1xuICAgIHdoaWxlIChzdHJpbmcubGVuZ3RoIDwgc2l6ZSkge1xuICAgICAgc3RyaW5nID0gXCIwXCIgKyBzdHJpbmc7XG4gICAgfVxuICAgIHJldHVybiBzdHJpbmc7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdldE1vZGRlZFZhbCA9IGZ1bmN0aW9uKGxhc3QpIHtcbiAgICB2YXIgbW9kO1xuICAgIG1vZCA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAxIDogLTE7XG4gICAgbGFzdCArPSBNYXRoLnJhbmRvbSgpICogMC4yICogbW9kO1xuICAgIGlmIChsYXN0IDwgMCkge1xuICAgICAgbGFzdCA9IDA7XG4gICAgfVxuICAgIGlmIChsYXN0ID4gMSkge1xuICAgICAgbGFzdCA9IDE7XG4gICAgfVxuICAgIHJldHVybiBsYXN0LnRvRml4ZWQoMik7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdldFJhbmdlVGVzdFJhbmdlID0gZnVuY3Rpb24oaG91cnNBZ28pIHtcbiAgICB2YXIgZW5kLCBub3csIHN0YXJ0O1xuICAgIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgbm93LnNldEhvdXJzKG5vdy5nZXRIb3VycygpIC0gMSk7XG4gICAgbm93LnNldE1pbnV0ZXMoMCk7XG4gICAgbm93LnNldFNlY29uZHMoMCk7XG4gICAgbm93LnNldEhvdXJzKG5vdy5nZXRIb3VycygpIC0gaG91cnNBZ28pO1xuICAgIGVuZCA9IG5vdy5nZXRUaW1lKCk7XG4gICAgbm93LnNldEhvdXJzKG5vdy5nZXRIb3VycygpIC0gMjMpO1xuICAgIHN0YXJ0ID0gbm93LmdldFRpbWUoKTtcbiAgICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xuICB9O1xuXG4gIHJldHVybiBUZXN0RGF0YTtcblxufSkoKTtcbiIsInZhciBUZXN0RGF0YTtcblxuVGVzdERhdGEgPSByZXF1aXJlKCcuL3NoaW0vdGVzdC1kYXRhJyk7XG5cbndpbmRvdy5zdGF0c0RhdGFTaW11bHRvciA9IG5ldyBUZXN0RGF0YSgpO1xuXG53aW5kb3cuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbWljcm8sIHN0cmlwO1xuICBtaWNybyA9IG5ldyBuYW5vYm94LkhvdXJseVN0YXRzKCQoXCIubWljcm9cIiksIG5hbm9ib3guSG91cmx5U3RhdHMubWljcm8pO1xuICBtaWNyby5pbml0U3RhdHMoc3RhdHNEYXRhU2ltdWx0b3Iuc3RhdFR5cGVzLCBzdGF0c0RhdGFTaW11bHRvci50aHJlc2hvbGRzKTtcbiAgbWljcm8uYnVpbGQoKTtcbiAgbWljcm8udXBkYXRlTGl2ZVN0YXRzKHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUxpdmVTdGF0cygpKTtcbiAgc3RyaXAgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiLnN0cmlwXCIpLCBuYW5vYm94LkhvdXJseVN0YXRzLnN0cmlwKTtcbiAgc3RyaXAuaW5pdFN0YXRzKHN0YXRzRGF0YVNpbXVsdG9yLnN0YXRUeXBlcywgc3RhdHNEYXRhU2ltdWx0b3IudGhyZXNob2xkcyk7XG4gIHN0cmlwLmJ1aWxkKCk7XG4gIHN0cmlwLnVwZGF0ZUxpdmVTdGF0cyhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUZha2VMaXZlU3RhdHMoKSk7XG4gIHN0cmlwLnVwZGF0ZUhpc3RvcmljU3RhdChcImRpc2tfdXNlZFwiLCBzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUZha2VIaXN0b3JpY2FsU3RhdHMoKSk7XG4gIHN0cmlwLnVwZGF0ZUhpc3RvcmljU3RhdChcInJhbV91c2VkXCIsIHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUhpc3RvcmljYWxTdGF0cygpKTtcbiAgc3RyaXAudXBkYXRlSGlzdG9yaWNTdGF0KFwiY3B1X3VzZWRcIiwgc3RhdHNEYXRhU2ltdWx0b3IuZ2VuZXJhdGVGYWtlSGlzdG9yaWNhbFN0YXRzKCkpO1xuICByZXR1cm4gc3RyaXAudXBkYXRlSGlzdG9yaWNTdGF0KFwic3dhcF91c2VkXCIsIHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUhpc3RvcmljYWxTdGF0cygpKTtcbn07XG4iXX0=
