TestData = require './shim/test-data'

dataMachine = new TestData()

# Micro View
micro = new nanobox.HourlyStats $(".micro"), nanobox.HourlyStats.micro
micro.initStats dataMachine.statTypes, dataMachine.thresholds
micro.build()
micro.updateLiveStats dataMachine.generateFakeLiveStats()

# Standard Strip View
strip = new nanobox.HourlyStats $(".strip"), nanobox.HourlyStats.strip
strip.initStats dataMachine.statTypes, dataMachine.thresholds
strip.build()
strip.updateLiveStats dataMachine.generateFakeLiveStats()
strip.updateHistoricStat "disk_used", dataMachine.generateFakeHistoricalStats()
strip.updateHistoricStat "ram_used", dataMachine.generateFakeHistoricalStats()
strip.updateHistoricStat "cpu_used", dataMachine.generateFakeHistoricalStats()
strip.updateHistoricStat "swap_used", dataMachine.generateFakeHistoricalStats()
