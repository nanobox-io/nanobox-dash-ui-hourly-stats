Face          = require 'utils/face-utils'
StatsUtils    = require 'utils/stats-utils'
LiveStats     = require 'views/stats/live-stats'
HistoricStats = require 'views/stats/historic-stats'

#
standardView = require 'jade/standard-view'

#
module.exports = class StandardView

  #
  constructor: ($el, @options={}, @main) ->
    @$node = $ standardView({classes: @options.classes})
    $el.append @$node

  #
  build : () ->

    #
    $node = $(".standard-view", @$node)

    # add a live and historic stats
    @liveStats ||= new LiveStats($node, @main)
    @historicStats ||= new HistoricStats($node, @main)

    # add a face
    @face = new Face $node.find(".face"), "true"

    # seed data and subscribe to updates
    @_seedData()
    @_subscribeToUpdates()

  # update live stats
  updateLiveStats : (data) =>
    @liveStats.updateData(data)
    @face.update StatsUtils.getOverallTemperature(data)

  # updateHistoricStats
  updateHistoricStats : (data) => @historicStats.updateData(data)

  # we need to populate the component with an initial set of empty data
  _seedData: () ->
    @updateLiveStats()
    @updateHistoricStats()

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
      stop     : @options.stop
      entity   : @options.entity
      entityId : @options.entityId
      metrics  : @options.metrics
      callback : @updateHistoricStats
    }
