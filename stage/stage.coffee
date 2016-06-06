TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->
  statsDataSimultor.createFakeStatDataProvider()

  # Micro View
  micro = new nanobox.HourlyStats $("#micro1"), {view: "micro", isContainer:false}
  micro.build()

  micro2 = new nanobox.HourlyStats $("#micro2  "), {view: "micro", isContainer:true, metrics:['cpu', 'ram']  }
  micro2.build()

  # Standard View
  standard = new nanobox.HourlyStats $("#standard1"), {view: "standard", isContainer:false}
  standard.build()

  standard2 = new nanobox.HourlyStats $("#standard2"), {view: "standard", isContainer:true, metrics:['cpu', 'ram']  }
  standard2.build()

  standard3 = new nanobox.HourlyStats $("#standard3"), {view: "standard", compressView:true  }
  standard3.build()

  # Expanded View
  expanded = new nanobox.HourlyStats $("#expanded1"), {view: "expanded", isContainer:false}
  expanded.build()

  expanded2 = new nanobox.HourlyStats $("#expanded2"), {view: "expanded", isContainer:true, metrics:['cpu', 'ram']  }
  expanded2.build()
