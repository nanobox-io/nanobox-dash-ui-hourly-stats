TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->
  statsDataSimultor.createFakeStatDataProvider()

  # Micro View
  micro = new nanobox.HourlyStats $(".micro"), nanobox.HourlyStats.micro
  micro.build()

  # Standard Strip View
  strip = new nanobox.HourlyStats $(".strip"), nanobox.HourlyStats.strip
  strip.build()
