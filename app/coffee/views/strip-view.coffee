View            = require 'views/view'
StatsUtils      = require 'misc/stats-utils'
HorizLiveGraphs = require 'd3/now-horizontal'
HistoricalSmall = require 'd3/historical-small'
Face            = require 'misc/face'
stripView       = require 'jade/strip-view'

module.exports = class StripView extends View

  constructor: ($el) ->
    @$node = $ stripView( {stats:StatsUtils.statTypes} )
    $el.append @$node

    @addHistoricStats()
    @addLiveStats()
    @addFace()


  addHistoricStats : () ->
    @historicStats = new HistoricalSmall $(".historic", @$node)[0]

  addLiveStats : () ->
    @liveStats   = new HorizLiveGraphs
      barWidth    : 50
      barHeight   : 5
      padding     : 4
      totalHeight : 32
      holder      : $(".graphs", @$node)[0]

  addFace : () ->
    @face = new Face $(".face", @$node), "true"

  updateLiveStats : (data) ->
    @face.update StatsUtils.getOverallTemperature(data)
    @liveStats.update data

  updateHistoricStats : (metric, data) ->
    obj = {}
    range = StatsUtils.get24hrRangeStartingLastHour()
    data  = StatsUtils.fillGapsInHistoricalData data
    obj[metric] = StatsUtils.normalizeHistoricalData data, range
    @historicStats.update obj
