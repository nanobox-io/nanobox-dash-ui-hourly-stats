TestData = require './shim/test-data'
window.statsDataSimultor = new TestData()

window.init = () ->
  statsDataSimultor.createFakeStatDataProvider()


    # params =
    #   view     : "expanded"
    #   metrics  : ['cpu', 'ram']
    #   entity   : kind
    #   entityId : entityId
    #   days     : "7"

  # Micro View
  microData =
    view        : "micro",
    isContainer : false,
    entity      : "host",
    entityId    : "asdf2312341"
    days        : 1
  micro = new nanobox.HourlyStats $("#micro1"), microData
  micro.build()

  micro2Data =
    view        : "micro"
    isContainer : true
    metrics     : ['cpu', 'ram']
    entity      : "host"
    entityId    : "asdf2312342"
    days        : 1

  micro2 = new nanobox.HourlyStats $("#micro2  ")
  micro2.build()

  # Standard View
  standardData =
    view        : "standard"
    isContainer : false
    entity      : "host"
    entityId    : "asdf2312343"
    days        : 1

  standard = new nanobox.HourlyStats $("#standard1")
  standard.build()

  standard2Data =
    view        : "standard"
    isContainer : true
    metrics     : ['cpu', 'ram']
    entity      : "host",
    entityId    : "asdf2312344"
    days        : 1

  standard2 = new nanobox.HourlyStats $("#standard2")
  standard2.build()

  standard3Data =
    view         : "standard"
    compressView : true
    entity       : "host"
    entityId     : "asdf2312345"
    days         : 1

  standard3 = new nanobox.HourlyStats $("#standard3")
  standard3.build()

  # Expanded View
  expandedData =
    view        : "expanded"
    isContainer : false
    entity      : "host"
    entityId    : "asdf2312346"
    days        : 7

  expanded = new nanobox.HourlyStats $("#expanded1")
  expanded.build()

  expanded2Data =
    view        : "expanded"
    isContainer : true
    metrics     : ['cpu', 'ram']
    entity      : "host"
    entityId    : "asdf2312347"
    days        : 7

  expanded2 = new nanobox.HourlyStats $("#expanded2")
  expanded2.build()
