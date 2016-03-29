View            = require 'views/view'
StatsUtils      = require 'misc/stats-utils'
HorizLiveGraphs = require 'd3/now-horizontal'
Face            = require 'misc/face'
microView       = require 'jade/micro-view'

module.exports = class MicroView extends View

  constructor: ($el, statTypes) ->
    @$node = $ microView( {stats:statTypes} )
    $el.append @$node
    @addLiveStats()
    @addFace()
    PubSub.publish 'STATS.SUBSCRIBE', {
      subscriber : @
      liveStats  : ['ram', 'cpu', 'swap', 'disk']
    }

  addLiveStats : () ->
    @liveStats   = new HorizLiveGraphs
      barWidth    : 40
      barHeight   : 5
      padding     : 3
      totalHeight : 29
      holder      : $(".graphs", @$node)[  0]

  addFace : () ->
    @face = new Face $(".face", @$node), "true"

  updateLiveStats : (data) ->
    @face.update StatsUtils.getOverallTemperature(data)
    @liveStats.update data
