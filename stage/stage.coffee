TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->
  statsDataSimultor.createFakeStatDataProvider()

  # Micro View
  micro = new nanobox.HourlyStats $(".micro"), {view: "micro"}
  micro.build()

  # Standard View
  standard = new nanobox.HourlyStats $(".standard"), {view: "standard"}
  standard.build()

  # Expanded View
  expanded = new nanobox.HourlyStats $(".expanded"), {view: "expanded"}
  expanded.build()
