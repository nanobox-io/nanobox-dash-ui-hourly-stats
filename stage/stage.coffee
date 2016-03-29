TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->

  PubSub.subscribe 'STATS.SUBSCRIBE'  , (m, data)=>
    data.subscriber.updateLiveStats statsDataSimultor.generateFakeLiveStats()
    if data.historicStats
      for stat in data.historicStats
        data.subscriber.updateHistoricStat stat, statsDataSimultor.generateFakeHistoricalStats()

  PubSub.subscribe 'STATS.UNSUBSCRIBE', (m, data)=>


  # Micro View
  micro = new nanobox.HourlyStats $(".micro"), nanobox.HourlyStats.micro
  micro.build()

  # Standard Strip View
  strip = new nanobox.HourlyStats $(".strip"), nanobox.HourlyStats.strip
  strip.build()
