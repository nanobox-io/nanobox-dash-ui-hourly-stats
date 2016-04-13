Face        = require 'misc/face'
LiveStats   = require 'd3/live-stats'
StatsUtils  = require 'misc/stats-utils'

#
microView = require 'jade/micro-view'

#
module.exports = class MicroView

  #
  constructor: ($el, id, @stats) ->
    @$node = $(microView({labels:@stats}))
    $el.append @$node

    @build()
    @subscribeToStatData(id)

  # build the svg
  build : () ->

    # add live stats
    @liveStats = new LiveStats($(".live-stats", @$node), @stats)

    # add face
    @face = new Face $(".face", @$node), "true"

  #
  updateLiveStats : (data) =>
    @face.update StatsUtils.getOverallTemperature(data)
    @liveStats.update(data)

  #
  subscribeToStatData : (id) ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      statProviderId : id
      callback       : @updateLiveStats
    }
