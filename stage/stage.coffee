TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->
  statsDataSimultor.createFakeStatDataProvider()

  # Micro View
  micro = new nanobox.HourlyStats $(".micro"), {view: "micro", metrics: ["cpu", "ram", "swap", "disk"]}
  micro.build()

  # Standard View
  standard = new nanobox.HourlyStats $(".standard"), {view: "standard", metrics: ["cpu", "ram", "swap", "disk"]}
  standard.build()

  # Expanded View
  expanded = new nanobox.HourlyStats $(".expanded"), {view: "expanded", metrics: ["cpu", "ram", "swap", "disk"]}
  expanded.build()
