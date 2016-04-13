TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->
  statsDataSimultor.createFakeStatDataProvider()

  # Micro View
  micro = new nanobox.HourlyStats "micro", $(".micro")
  micro.build()

  # Standard View
  standard = new nanobox.HourlyStats "standard", $(".standard")
  standard.build()

  # Expanded View
  expanded = new nanobox.HourlyStats "expanded", $(".expanded")
  expanded.build()
