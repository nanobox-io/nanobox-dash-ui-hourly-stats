MicroView  = require 'views/micro-view'
StandardView  = require 'views/standard-view'
ExpandedView  = require 'views/expanded-view'

#
class HourlyStats

  # this is a global data object for this instance. The idea is that we're going
  # to store the most recent updated data then update it with any incoming values
  # and use that object to update the D3

  #
  constructor: (@$el, @options={}) ->

    # set defaults
    if !@options.metrics then @options.metrics = ["cpu", "ram", "swap", "disk"]

    #
    @storedLiveData     = @_seedLiveData()
    @storedHistoricData = @_seedHistoricData()
    @storedWeekData     = @_seedWeekData()

  # build creates a new component based on the @view that is passed in when
  # instantiated
  build : () ->
    view = switch @options.view
      when "micro"    then new MicroView @$el, @options, @
      when "standard" then new StandardView @$el, @options, @
      when "expanded" then new ExpandedView @$el, @options, @

    #
    view.build()

  # the following methods take a data update and look for the corresponding node
  # in the stored data set and replace it (leaving the rest of the previous data
  # in tact). This is done so that a complete set of data will always be passed
  # to D3
  updateStoredLiveData: (data) ->
    for d, i in @storedLiveData
      (@storedLiveData[i] = data) if (d.metric == data.metric)
    return @storedLiveData

  updateStoredHistoricData: (data) ->
    for d, i in @storedHistoricData
      (@storedHistoricData[i] = data) if (d.metric == data.metric)
    return @storedHistoricData

  updateStoredWeekData: (data) ->
    for d, i in @storedWeekData
      (@storedWeekData[i] = data) if (d.metric == data.metric)
    return @storedWeekData

  # the following methods seed data for each type for D3
  _seedLiveData: () ->
    seed = []
    seed.push {metric: metric, value: 0} for metric in @options.metrics
    seed

  _seedHistoricData: () ->
    seed = []
    for metric in @options.metrics
      data = []
      for hour in [0..24]
        data.push {time: "#{("0" + hour).slice(-2)}", value: 0}
      seed.push {metric: metric, data: data}
    seed

  _seedWeekData: () ->
    seed = []
    for metric in @options.metrics
      data = []
      for stat in [0...168]
        data.push {date: moment().subtract(stat, "hours"), value: 0}
      seed.push {metric: metric, data: data}
    seed

#
window.nanobox ||= {}
nanobox.HourlyStats = HourlyStats
