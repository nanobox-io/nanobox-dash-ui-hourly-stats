TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->
  statsDataSimultor.createFakeStatDataProvider()

    # params =
    #   view     : "expanded"
    #   metrics  : ['cpu', 'ram']
    #   entity   : kind
    #   entityId : entityId

  # Micro View
  microData =
    view        : "micro"
    isContainer : false
    entity      : "host"
    entityId    : "asdf2312341"

  micro = new nanobox.HourlyStats $("#micro1"), microData
  micro.build()

  # micro2Data =
  #   view        : "micro"
  #   isContainer : true
  #   metrics     : ['cpu', 'ram']
  #   entity      : "host"
  #   entityId    : "asdf2312342"
  #
  # micro2 = new nanobox.HourlyStats $("#micro2  "), micro2Data
  # micro2.build()

  # Standard View
  standardData =
    view        : "standard"
    isContainer : false
    entity      : "host"
    entityId    : "asdf2312343"

  standard = new nanobox.HourlyStats $("#standard1"), standardData
  standard.build()

  # standard2Data =
  #   view        : "standard"
  #   isContainer : true
  #   metrics     : ['cpu', 'ram']
  #   entity      : "host",
  #   entityId    : "asdf2312344"
  #
  # standard2 = new nanobox.HourlyStats $("#standard2"), standard2Data
  # standard2.build()

  # standard3Data =
  #   view         : "standard"
  #   compressView : true
  #   entity       : "host"
  #   entityId     : "asdf2312345"
  #
  # standard3 = new nanobox.HourlyStats $("#standard3"), standard3Data
  # standard3.build()

  # Expanded View
  expandedData =
    view        : "expanded"
    isContainer : false
    entity      : "host"
    entityId    : "asdf2312346"

  expanded = new nanobox.HourlyStats $("#expanded1"), expandedData
  expanded.build()

  # expanded2Data =
  #   view        : "expanded"
  #   isContainer : true
  #   metrics     : ['cpu', 'ram']
  #   entity      : "host"
  #   entityId    : "asdf2312347"
  #
  # expanded2 = new nanobox.HourlyStats $("#expanded2"), expanded2Data
  # expanded2.build()
