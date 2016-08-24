Face          = require 'utils/face-utils'
StatsUtils    = require 'utils/stats-utils'
LiveStats     = require 'views/stats/live-stats'
HistoricStats = require 'views/stats/historic-stats'

#
view = require 'jade/standard-view'

#
module.exports = class StandardView

  #
  constructor: ($el, @options={}, @main) ->
    @$node = $(view({classes: @options.classes}))
    $el.append @$node

  #
  build : () ->

    #
    view = d3.select($(".standard-view", @$node).get(0))

    # add a live and historic stats
    @liveStats ||= new LiveStats(view, @main)
    @historicStats ||= new HistoricStats(view, @main)

    # add a face
    @face = new Face $(".standard-view .face", @$node), "true"

    #
    @_subscribeToUpdates()

  # update live stats
  updateLiveStats : (data) =>
    @liveStats.updateData(data)
    @face.update StatsUtils.getOverallTemperature(data)

  # updateHistoricStats
  updateHistoricStats : (data) => @historicStats.updateData(data)

  # publish that we're interested in live and historic updates
  _subscribeToUpdates: () ->

    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      entity   : @options.entity
      entityId : @options.entityId
      metrics  : @options.metrics
      callback : @updateLiveStats
    }

    PubSub.publish 'STATS.SUBSCRIBE.HISTORIC', {
      start    : @options.start
      end      : @options.end
      entity   : @options.entity
      entityId : @options.entityId
      metrics  : @options.metrics
      callback : @updateHistoricStats
    }
