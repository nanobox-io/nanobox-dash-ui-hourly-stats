TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->

  # Micro View
  micro = new nanobox.HourlyStats $(".micro"), nanobox.HourlyStats.micro
  micro.initStats statsDataSimultor.statTypes, statsDataSimultor.thresholds
  micro.build()
  micro.updateLiveStats statsDataSimultor.generateFakeLiveStats()

  # Standard Strip View
  strip = new nanobox.HourlyStats $(".strip"), nanobox.HourlyStats.strip
  strip.initStats statsDataSimultor.statTypes, statsDataSimultor.thresholds
  strip.build()
  strip.updateLiveStats statsDataSimultor.generateFakeLiveStats()
  strip.updateHistoricStat "disk_used", statsDataSimultor.generateFakeHistoricalStats()
  strip.updateHistoricStat "ram_used", statsDataSimultor.generateFakeHistoricalStats()
  strip.updateHistoricStat "cpu_used", statsDataSimultor.generateFakeHistoricalStats()
  strip.updateHistoricStat "swap_used", statsDataSimultor.generateFakeHistoricalStats()
