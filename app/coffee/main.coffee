MicroView  = require 'views/micro-view'
StandardView  = require 'views/standard-view'
ExpandedView  = require 'views/expanded-view'

#
class HourlyStats

  #
  constructor: (@$el, @options={}) ->

    # set defaults
    @options.metrics ||= ["cpu", "ram", "swap", "disk"]

    # these are global data stores. The idea is that we're going to store the most
    # recent updated data then update it with any incoming values and use that
    # object to update the D3
    @storedLiveData     = @_seedLiveData()
    @storedHistoricData = @_seedHistoricData()
    @storedWeekData     = @_seedWeekData()

  # build creates a new component based on the @view that is passed in when
  # instantiated
  build: () ->
    @uid   = "#{@options.entityId}/#{new Date().getTime()}"
    view = switch @options.view
      when "micro"    then new MicroView    @$el, @options, @
      when "standard" then new StandardView @$el, @options, @
      when "expanded" then new ExpandedView @$el, @options, @

    #
    view.build()

  # Unsubscribe from live updates on destroy
  destroy : () -> PubSub.publish 'STATS.UNSUBSCRIBE.LIVE', {uid:@uid}


  # getLiveStats returns the current set of storedLiveData; this is used as an
  # api for valkrie to pull this data to pass into other components (namely the
  # usage breakdown component)
  getLiveStats: () ->
    stats = {}
    for data in @storedLiveData
      stats[data.metric] = data.value
    stats

  # the following methods take a data update and look for the corresponding node
  # in the stored data set and replace it (leaving the rest of the previous data
  # in tact). This is done so that a complete set of data will always be passed
  # to D3
  updateStoredLiveData: (data) ->

    # return the current stored data if there is no data being updated
    return @storedLiveData if data == undefined

    # replace the corresponding metric with the data provided
    for d, i in @storedLiveData
      (@storedLiveData[i] = data) if (d.metric == data.metric)
    return @storedLiveData

  updateStoredHistoricData: (data) ->

    # return the current stored data if there is no data being updated
    return @storedHistoricData if data == undefined

    # replace the corresponding metric with the data provided
    for d, i in @storedHistoricData
      # d.time = moment(d.time) # convert the time into a moment object
      (@storedHistoricData[i] = data) if (d.metric == data.metric)
    return @storedHistoricData

  updateStoredWeekData: (data) ->

    # return the current stored data if there is no data being updated
    return @storedHistoricData if data == undefined

    # replace the corresponding metric with the data provided
    for d, i in @storedWeekData
      # d.time = moment(d.time) # convert the time into a moment object
      (@storedWeekData[i] = data) if (d.metric == data.metric)
    return @storedWeekData

  # the following methods seed data for each type for D3
  _seedLiveData: () ->
    seed = []
    seed.push {metric: metric, value: -1} for metric in @options.metrics
    seed

  _seedHistoricData: () ->
    seed = []
    for metric in @options.metrics
      data = []
      for hour in [0..24]
        data.push {time: moment().subtract(hour, "h"), value: -1}
      seed.push {metric: metric, data: data}
    seed

  _seedWeekData: () ->
    seed = []
    for metric in @options.metrics
      data = []
      for hour in [0...168]
        data.push {time: moment().subtract(hour, "h"), value: -1}
      seed.push {metric: metric, data: data}
    seed

#
window.nanobox ||= {}
nanobox.HourlyStats = HourlyStats
