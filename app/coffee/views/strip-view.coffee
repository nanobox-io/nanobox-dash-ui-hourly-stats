View            = require 'views/view'
StatsUtils      = require 'misc/stats-utils'
HorizLiveGraphs = require 'd3/now-horizontal'
HistoricalSmall = require 'd3/historical-small'
Face            = require 'misc/face'
stripView       = require 'jade/strip-view'
percentages     = require 'jade/percentages'

module.exports = class StripView extends View

  constructor: ($el) ->
    @$node = $ stripView( {stats:StatsUtils.statTypes} )
    @$percentages = $ ".percentages", @$node
    $el.append @$node

    barHeight  = 5
    barPadding = 5
    @addHistoricStats barHeight, barPadding
    @addLiveStats barHeight, barPadding
    @addFace()


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

  updateHistoricStats : (metric, data) ->
    obj = {}
    range = StatsUtils.get24hrRangeStartingLastHour()
    data  = StatsUtils.fillGapsInHistoricalData data
    obj[metric] = StatsUtils.normalizeHistoricalData data, range
    @historicStats.update obj

  updateLivePercentages : (data) ->
    ar = []
    for key, val of data
      ar.push Math.round(val*100)
    console.log ar
    @$percentages.empty()
    @$percentages.append $( percentages( {percentages:ar} ) )
