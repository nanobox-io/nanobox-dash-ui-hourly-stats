TestData = require './shim/test-data'
window.statsDataMachine = new TestData()

window.init = () ->

  # Micro View
  micro = new nanobox.HourlyStats $(".micro"), nanobox.HourlyStats.micro
  micro.initStats statsDataMachine.statTypes, statsDataMachine.thresholds
  micro.build()
  micro.updateLiveStats statsDataMachine.generateFakeLiveStats()

  # Standard Strip View
  strip = new nanobox.HourlyStats $(".strip"), nanobox.HourlyStats.strip
  strip.initStats statsDataMachine.statTypes, statsDataMachine.thresholds
  strip.build()
  strip.updateLiveStats statsDataMachine.generateFakeLiveStats()
  strip.updateHistoricStat "disk_used", statsDataMachine.generateFakeHistoricalStats()
  strip.updateHistoricStat "ram_used", statsDataMachine.generateFakeHistoricalStats()
  strip.updateHistoricStat "cpu_used", statsDataMachine.generateFakeHistoricalStats()
  strip.updateHistoricStat "swap_used", statsDataMachine.generateFakeHistoricalStats()
