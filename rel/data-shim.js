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
    PubSub.subscribe('STATS.SUBSCRIBE', (function(_this) {
      return function(m, data) {
        var j, len, ref, results, stat;
        data.subscriber.updateLiveStats(statsDataSimultor.generateFakeLiveStats());
        if (data.historicStats) {
          ref = data.historicStats;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            stat = ref[j];
            results.push(data.subscriber.updateHistoricStat(stat, statsDataSimultor.generateFakeHistoricalStats()));
          }
          return results;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic2hpbS90ZXN0LWRhdGEuY29mZmVlIiwic3RhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBUZXN0RGF0YTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXN0RGF0YSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVGVzdERhdGEoc3RhdFR5cGVzKSB7XG4gICAgdGhpcy5zdGF0VHlwZXMgPSBzdGF0VHlwZXM7XG4gICAgdGhpcy5oYXBweSA9IHRydWU7XG4gICAgaWYgKHRoaXMuc3RhdFR5cGVzID09IG51bGwpIHtcbiAgICAgIHRoaXMuc3RhdFR5cGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6IFwiY3B1X3VzZWRcIixcbiAgICAgICAgICBuaWNrbmFtZTogXCJDUFVcIixcbiAgICAgICAgICBuYW1lOiBcIkNQVSBVc2VkXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIGlkOiBcInJhbV91c2VkXCIsXG4gICAgICAgICAgbmlja25hbWU6IFwiUkFNXCIsXG4gICAgICAgICAgbmFtZTogXCJSQU0gVXNlZFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBpZDogXCJzd2FwX3VzZWRcIixcbiAgICAgICAgICBuaWNrbmFtZTogXCJTV0FQXCIsXG4gICAgICAgICAgbmFtZTogXCJTd2FwIFVzZWRcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgaWQ6IFwiZGlza191c2VkXCIsXG4gICAgICAgICAgbmlja25hbWU6IFwiRElTS1wiLFxuICAgICAgICAgIG5hbWU6IFwiRGlzayBVc2VkXCJcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9XG4gIH1cblxuICBUZXN0RGF0YS5wcm90b3R5cGUuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIgPSBmdW5jdGlvbigpIHtcbiAgICBQdWJTdWIuc3Vic2NyaWJlKCdTVEFUUy5TVUJTQ1JJQkUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7XG4gICAgICAgIHZhciBqLCBsZW4sIHJlZiwgcmVzdWx0cywgc3RhdDtcbiAgICAgICAgZGF0YS5zdWJzY3JpYmVyLnVwZGF0ZUxpdmVTdGF0cyhzdGF0c0RhdGFTaW11bHRvci5nZW5lcmF0ZUZha2VMaXZlU3RhdHMoKSk7XG4gICAgICAgIGlmIChkYXRhLmhpc3RvcmljU3RhdHMpIHtcbiAgICAgICAgICByZWYgPSBkYXRhLmhpc3RvcmljU3RhdHM7XG4gICAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgc3RhdCA9IHJlZltqXTtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChkYXRhLnN1YnNjcmliZXIudXBkYXRlSGlzdG9yaWNTdGF0KHN0YXQsIHN0YXRzRGF0YVNpbXVsdG9yLmdlbmVyYXRlRmFrZUhpc3RvcmljYWxTdGF0cygpKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gUHViU3ViLnN1YnNjcmliZSgnU1RBVFMuVU5TVUJTQ1JJQkUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihtLCBkYXRhKSB7fTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlRmFrZUxpdmVTdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBqLCBrLCBsZW4sIGxlbjEsIG9iaiwgcmVmLCByZWYxLCBzdGF0VHlwZTtcbiAgICBvYmogPSB7fTtcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuMikge1xuICAgICAgcmVmID0gdGhpcy5zdGF0VHlwZXM7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgc3RhdFR5cGUgPSByZWZbal07XG4gICAgICAgIG9ialtzdGF0VHlwZS5pZF0gPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWYxID0gdGhpcy5zdGF0VHlwZXM7XG4gICAgICBmb3IgKGsgPSAwLCBsZW4xID0gcmVmMS5sZW5ndGg7IGsgPCBsZW4xOyBrKyspIHtcbiAgICAgICAgc3RhdFR5cGUgPSByZWYxW2tdO1xuICAgICAgICBvYmpbc3RhdFR5cGUuaWRdID0gTWF0aC5yYW5kb20oKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVBbHRlcm5hdGluZ0ZhY2VTdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRhO1xuICAgIGlmICh0aGlzLmhhcHB5KSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBjcHVfdXNlZDogLjMsXG4gICAgICAgIHJhbV91c2VkOiAuMyxcbiAgICAgICAgc3dhcF91c2VkOiAuMyxcbiAgICAgICAgZGlza19pb193YWl0OiAuMyxcbiAgICAgICAgZGlza191c2VkOiAuM1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgY3B1X3VzZWQ6IC45NSxcbiAgICAgICAgcmFtX3VzZWQ6IC45NSxcbiAgICAgICAgc3dhcF91c2VkOiAuOTUsXG4gICAgICAgIGRpc2tfaW9fd2FpdDogLjk1LFxuICAgICAgICBkaXNrX3VzZWQ6IC45NVxuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5oYXBweSA9ICF0aGlzLmhhcHB5O1xuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZW5lcmF0ZUZha2VIaXN0b3JpY2FsU3RhdHMgPSBmdW5jdGlvbihpczI0aHJzKSB7XG4gICAgdmFyIGFyLCBpLCBqLCBsYXN0LCBub3csIHJlZiwgdGltZSwgdG90YWxIcnMsIHZhbDtcbiAgICBpZiAoaXMyNGhycyA9PSBudWxsKSB7XG4gICAgICBpczI0aHJzID0gdHJ1ZTtcbiAgICB9XG4gICAgdG90YWxIcnMgPSBpczI0aHJzID8gMjUgOiAyNCAqIDc7XG4gICAgbm93ID0gbmV3IERhdGUoKTtcbiAgICBub3cuc2V0SG91cnMobm93LmdldEhvdXJzKCkgLSAxKTtcbiAgICBub3cuc2V0TWludXRlcygwKTtcbiAgICBub3cuc2V0U2Vjb25kcygwKTtcbiAgICB0aW1lID0gbm93LmdldFRpbWUoKTtcbiAgICBsYXN0ID0gTWF0aC5yYW5kb20oKTtcbiAgICB0b3RhbEhycyA9IDI0ICogNztcbiAgICBhciA9IFtdO1xuICAgIGZvciAoaSA9IGogPSAxLCByZWYgPSB0b3RhbEhyczsgMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmOyBpID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIHZhbCA9IHRoaXMuZ2V0TW9kZGVkVmFsKGxhc3QpO1xuICAgICAgaWYgKHZhbCA+IDApIHtcbiAgICAgICAgYXIucHVzaCh7XG4gICAgICAgICAgdGltZTogdGltZSxcbiAgICAgICAgICB2YWx1ZTogdmFsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGltZSAtPSAzNjAwMDAwO1xuICAgIH1cbiAgICByZXR1cm4gYXI7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLmdlbmVyYXRlRmFrZURpc2tTdGF0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5mb3JjZUludG9SYW5nZSA9IGZ1bmN0aW9uKG51bWJlciwgbWluLCBtYXgpIHtcbiAgICBpZiAobnVtYmVyIDwgbWluKSB7XG4gICAgICByZXR1cm4gbWluO1xuICAgIH0gZWxzZSBpZiAobnVtYmVyID4gbWF4KSB7XG4gICAgICByZXR1cm4gbWF4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH1cbiAgfTtcblxuICBUZXN0RGF0YS5wcm90b3R5cGUuZ2VuZXJhdGVGYWtlSG91cmx5U3RhdHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaG91ciwgaiwgaywgbGFzdCwgbGVuLCBvYmosIHF1YXJ0ZXIsIHJlZjtcbiAgICBvYmogPSB7fTtcbiAgICBsYXN0ID0gTWF0aC5yYW5kb20oKTtcbiAgICBmb3IgKGhvdXIgPSBqID0gMDsgaiA8IDI0OyBob3VyID0gKytqKSB7XG4gICAgICByZWYgPSBbMCwgMTUsIDMwLCA0NV07XG4gICAgICBmb3IgKGsgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBrIDwgbGVuOyBrKyspIHtcbiAgICAgICAgcXVhcnRlciA9IHJlZltrXTtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAuMSkge1xuICAgICAgICAgIG9ialsodGhpcy5wYWROdW1iZXIoaG91ciwgMikpICsgXCI6XCIgKyAodGhpcy5wYWROdW1iZXIocXVhcnRlciwgMikpXSA9IHRoaXMuZ2V0TW9kZGVkVmFsKGxhc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgVGVzdERhdGEucHJvdG90eXBlLnBhZE51bWJlciA9IGZ1bmN0aW9uKG51bWJlciwgc2l6ZSkge1xuICAgIHZhciBzdHJpbmc7XG4gICAgc3RyaW5nID0gXCJcIiArIG51bWJlcjtcbiAgICB3aGlsZSAoc3RyaW5nLmxlbmd0aCA8IHNpemUpIHtcbiAgICAgIHN0cmluZyA9IFwiMFwiICsgc3RyaW5nO1xuICAgIH1cbiAgICByZXR1cm4gc3RyaW5nO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZXRNb2RkZWRWYWwgPSBmdW5jdGlvbihsYXN0KSB7XG4gICAgdmFyIG1vZDtcbiAgICBtb2QgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IC0xO1xuICAgIGxhc3QgKz0gTWF0aC5yYW5kb20oKSAqIDAuMiAqIG1vZDtcbiAgICBpZiAobGFzdCA8IDApIHtcbiAgICAgIGxhc3QgPSAwO1xuICAgIH1cbiAgICBpZiAobGFzdCA+IDEpIHtcbiAgICAgIGxhc3QgPSAxO1xuICAgIH1cbiAgICByZXR1cm4gbGFzdC50b0ZpeGVkKDIpO1xuICB9O1xuXG4gIFRlc3REYXRhLnByb3RvdHlwZS5nZXRSYW5nZVRlc3RSYW5nZSA9IGZ1bmN0aW9uKGhvdXJzQWdvKSB7XG4gICAgdmFyIGVuZCwgbm93LCBzdGFydDtcbiAgICBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIG5vdy5zZXRIb3Vycyhub3cuZ2V0SG91cnMoKSAtIDEpO1xuICAgIG5vdy5zZXRNaW51dGVzKDApO1xuICAgIG5vdy5zZXRTZWNvbmRzKDApO1xuICAgIG5vdy5zZXRIb3Vycyhub3cuZ2V0SG91cnMoKSAtIGhvdXJzQWdvKTtcbiAgICBlbmQgPSBub3cuZ2V0VGltZSgpO1xuICAgIG5vdy5zZXRIb3Vycyhub3cuZ2V0SG91cnMoKSAtIDIzKTtcbiAgICBzdGFydCA9IG5vdy5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIFtzdGFydCwgZW5kXTtcbiAgfTtcblxuICByZXR1cm4gVGVzdERhdGE7XG5cbn0pKCk7XG4iLCJ2YXIgVGVzdERhdGE7XG5cblRlc3REYXRhID0gcmVxdWlyZSgnLi9zaGltL3Rlc3QtZGF0YScpO1xuXG53aW5kb3cuc3RhdHNEYXRhU2ltdWx0b3IgPSBuZXcgVGVzdERhdGEoKTtcblxud2luZG93LmluaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1pY3JvLCBzdHJpcDtcbiAgc3RhdHNEYXRhU2ltdWx0b3IuY3JlYXRlRmFrZVN0YXREYXRhUHJvdmlkZXIoKTtcbiAgbWljcm8gPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiLm1pY3JvXCIpLCBuYW5vYm94LkhvdXJseVN0YXRzLm1pY3JvKTtcbiAgbWljcm8uYnVpbGQoKTtcbiAgc3RyaXAgPSBuZXcgbmFub2JveC5Ib3VybHlTdGF0cygkKFwiLnN0cmlwXCIpLCBuYW5vYm94LkhvdXJseVN0YXRzLnN0cmlwKTtcbiAgcmV0dXJuIHN0cmlwLmJ1aWxkKCk7XG59O1xuIl19
