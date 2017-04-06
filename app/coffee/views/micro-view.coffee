Face        = require 'utils/face-utils'
StatsUtils  = require 'utils/stats-utils'
LiveStats   = require 'views/stats/live-stats'

#
microView = require 'jade/micro-view'

#
module.exports = class MicroView

  #
  constructor: ($el, @options={}, @main) ->
    @$node = $(microView({classes: @options.classes}))
    $el.append @$node

  #
  build : () ->

    #
    $node = $(".micro-view", @$node)

    # add a live stats
    @liveStats ||= new LiveStats($node, @main)

    # add a face
    @face = new Face $node.find(".face"), "true"

    # seed data and subscribe to updates
    @_seedData()
    @_subscribeToUpdates()

  # update live stats
  updateLiveStats : (data) =>
    @liveStats.updateData(data)
    @face.update StatsUtils.getOverallTemperature(data)

  # we need to populate the component with an initial set of empty data
  _seedData: () ->
    @updateLiveStats()

  # publish that we're interested in live updates
  _subscribeToUpdates: () ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      entity   : @options.entity
      entityId : @options.entityId
      metrics  : @options.metrics
      callback : @updateLiveStats
      uid      : @main.uid
    }
