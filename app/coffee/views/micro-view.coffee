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

    #
    @_subscribeToUpdates()

  # update live stats
  updateLiveStats : (data) =>
    @liveStats.updateData(data)
    @face.update StatsUtils.getOverallTemperature(data)

  # publish that we're interested in live updates
  _subscribeToUpdates: () ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      entity   : @options.entity
      entityId : @options.entityId
      metrics  : @options.metrics
      callback : @updateLiveStats
    }
