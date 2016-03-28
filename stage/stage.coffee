TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->

  # Micro View
  micro = new nanobox.HourlyStats $(".micro"), nanobox.HourlyStats.micro
  micro.build()
  micro.updateLiveStats statsDataSimultor.generateFakeLiveStats()

  # Standard Strip View
  strip = new nanobox.HourlyStats $(".strip"), nanobox.HourlyStats.strip
  strip.build()
  strip.updateLiveStats statsDataSimultor.generateFakeLiveStats()
  strip.updateHistoricStat "disk", statsDataSimultor.generateFakeHistoricalStats()
  strip.updateHistoricStat "ram", statsDataSimultor.generateFakeHistoricalStats()
  strip.updateHistoricStat "cpu", statsDataSimultor.generateFakeHistoricalStats()
  strip.updateHistoricStat "swap", statsDataSimultor.generateFakeHistoricalStats()
