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
    @storedLiveStats = []
    @storedHistoricStats = []

    #
    data = []
    for hour in [0..24]
      data.push {time: "#{("0" + hour).slice(-2)}", value: 0}

    # we need to create an empty storedLiveStats and storedHistoricStats
    for metric in @options.metrics
      @storedLiveStats.push {metric: metric, value: 0}
      @storedHistoricStats.push {metric: metric, data: data}

  # build creates a new component based on the @view that is passed in when
  # instantiated
  build : () ->
    view = switch @options.view
      when "micro"    then new MicroView @$el, @options, @
      when "standard" then new StandardView @$el, @options, @
      when "expanded" then new ExpandedView @$el, @options, @

    #
    view.build()

  # updateStoredLiveStats will take a data update and only update the node received
  # with the new data and then pass the entire thing back into the component; it
  # will create a stored data object if one doesn't already exist
  updateStoredLiveStats: (data) ->
    for d, i in @storedLiveStats
      (@storedLiveStats[i] = data) if (d.metric == data.metric)
    return @storedLiveStats

  # updateStoredHistoricStats will take a data update and only update the node
  # received with the new data and then pass the entire thing back into the component;
  # it will create a stored data object if one doesn't already exist
  updateStoredHistoricalStats: (data) ->
    for d, i in @storedHistoricStats
      (@storedHistoricStats[i] = data) if (d.metric == data.metric)
    return @storedHistoricStats

#
window.nanobox ||= {}
nanobox.HourlyStats = HourlyStats
