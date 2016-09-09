TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->
  statsDataSimultor.createFakeStatDataProvider()

  # Micro View
  microData =
    view        : "micro"
    entity      : "host"
    entityId    : "0001"

  micro = new nanobox.HourlyStats $("#micro1"), microData
  micro.build()

  # micro2Data =
  #   view        : "micro"
  #   metrics     : ['cpu', 'ram']
  #   entity      : "host"
  #   entityId    : "0002"
  #
  # micro2 = new nanobox.HourlyStats $("#micro2"), micro2Data
  # micro2.build()

  # Standard View
  standardData =
    view        : "standard"
    entity      : "host"
    entityId    : "0003"

  standard = new nanobox.HourlyStats $("#standard1"), standardData
  standard.build()

  # standard2Data =
  #   view        : "standard"
  #   metrics     : ['cpu', 'ram']
  #   entity      : "host",
  #   entityId    : "0004"
  #
  # standard2 = new nanobox.HourlyStats $("#standard2"), standard2Data
  # standard2.build()

  # standard3Data =
  #   view         : "standard"
  #   entity       : "host"
  #   entityId     : "0005"
  #
  # standard3 = new nanobox.HourlyStats $("#standard3"), standard3Data
  # standard3.build()

  # Expanded View
  expandedData =
    view        : "expanded"
    entity      : "host"
    entityId    : "0006"

  expanded = new nanobox.HourlyStats $("#expanded1"), expandedData
  expanded.build()

  # expanded2Data =
  #   view        : "expanded"
  #   metrics     : ['cpu', 'ram']
  #   entity      : "host"
  #   entityId    : "0007"
  #
  # expanded2 = new nanobox.HourlyStats $("#expanded2"), expanded2Data
  # expanded2.build()
