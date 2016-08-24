Face        = require 'utils/face-utils'
StatsUtils  = require 'utils/stats-utils'
LiveStats   = require 'views/stats/live-stats'

#
view = require 'jade/micro-view'

#
module.exports = class MicroView

  #
  constructor: ($el, @options={}, @main) ->
    @$node = $(view({classes: @options.classes}))
    $el.append @$node

  #
  build : () ->

    #
    view = d3.select($(".micro-view", @$node).get(0))

    # add a live stats
    @liveStats ||= new LiveStats(view, @main)

    # add a face
    @face = new Face $(".micro-view .face", @$node), "true"

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
