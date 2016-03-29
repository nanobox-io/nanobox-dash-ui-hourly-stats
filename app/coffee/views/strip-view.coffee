View            = require 'views/view'
StatsUtils      = require 'misc/stats-utils'
HorizLiveGraphs = require 'd3/now-horizontal'
HistoricalSmall = require 'd3/historical-small'
Face            = require 'misc/face'
stripView       = require 'jade/strip-view'
percentages     = require 'jade/percentages'

module.exports = class StripView extends View

  constructor: ($el, id, @statTypes) ->
    @$node = $ stripView( {stats:@statTypes} )
    @$percentages = $ ".percentages", @$node
    $el.append @$node

    barHeight  = 5
    barPadding = 5
    @addHistoricStats barHeight, barPadding
    @addLiveStats barHeight, barPadding
    @addFace()
    @subscribeToStatData id

  addHistoricStats : (barHeight, barPadding) ->
    @historicStats = new HistoricalSmall $(".historic", @$node)[0], barHeight, barPadding

  addLiveStats : (barHeight, barPadding) ->
    config =
      barWidth    : 50
      barHeight   : barHeight
      padding     : barPadding
      totalHeight : barHeight*4 + barPadding*3
      holder      : $(".graphs", @$node)[0]

    @liveStats   = new HorizLiveGraphs config

  addFace : () ->
    @face = new Face $(".face", @$node), "true"

  updateLiveStats : (data) ->
    @face.update StatsUtils.getOverallTemperature(data)
    @liveStats.update data
    @updateLivePercentages data

  updateHistoricStat : (metric, data) ->
    obj = {}
    range = StatsUtils.get24hrRangeStartingLastHour()
    data  = StatsUtils.fillGapsInHistoricalData data
    obj[metric] = StatsUtils.normalizeHistoricalData data, range
    @historicStats.update obj, @statTypes

  updateLivePercentages : (data) ->
    ar = []
    for key, val of data
      ar.push Math.round(val*100)
    @$percentages.empty()
    @$percentages.append $( percentages( {percentages:ar} ) )

  subscribeToStatData : (id) ->
    # Based on what stats this component is interested in, create
    # an array of metric names, and subscribe
    # ex : ['ram', 'cpu', etc..]
    ar = []
    for key, val of @statTypes
      ar.push key

    PubSub.publish 'STATS.SUBSCRIBE', {
      statProviderId : id
      subscriber     : @
      liveStats      : ar
      historicStats  : ar
    }
