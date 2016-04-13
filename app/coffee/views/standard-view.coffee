Face            = require 'misc/face'
HistoricalStats = require 'd3/historical-stats'
LiveStats       = require 'd3/live-stats'
StatsUtils      = require 'misc/stats-utils'

#
standardView    = require 'jade/standard-view'

#
module.exports = class StandardView

  #
  constructor: ($el, id, @stats) ->
    @$node = $(standardView({stats:@stats}))
    $el.append @$node

    @build()
    @subscribeToStatData id

  # build the svg
  build : () ->

    # add histroical stats
    @histroicalStats = new HistoricalStats($(".historical-stats", @$node), @stats)

    # add live stats
    @liveStats = new LiveStats($(".live-stats", @$node), @stats)

    # add face
    @face = new Face $(".face", @$node), "true"

  # updates stats, percentages, and face
  updateLiveStats : (data) =>
    @liveStats.update(data)

    #
    for d in data
      $(".percentages", @$node).find(".#{d.metric}").text "#{Math.round(d.value*100)}%"

    @face.update StatsUtils.getOverallTemperature(data)

  # updates historic stats
  updateHistoricStats : (data) => @histroicalStats.update(data)

  #
  subscribeToStatData : (id) ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      statProviderId : id
      callback       : @updateLiveStats
    }

    PubSub.publish 'STATS.SUBSCRIBE.HISTORIC', {
      statProviderId : id
      callback       : @updateHistoricStats
    }
