Face        = require 'misc/face'
StatsUtils  = require 'misc/stats-utils'

#
microView = require 'jade/micro-view'

#
module.exports = class MicroView

  # options
  maxWidth:  50
  barHeight: 5

  #
  constructor: ($el, id, @stats) ->
    @$node = $(microView({labels:@stats}))
    $el.append @$node

    @build()
    @subscribeToStatData(id)

  # build the svg
  build : () ->

    # add live stats svg
    @liveStats = d3.select($(".live-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  50
          height: 30

    # add face
    @face = new Face $(".face", @$node), "true"

  # updateLiveStats
  updateLiveStats : (data) =>

    self = @

    # create foreground
    foreground = @liveStats.selectAll(".stat").data(data)
    foreground.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            width:     40
            height:    5
            class:     "stat #{StatsUtils.getTemperature(d.value)}"
            transform: "translate(0, #{8*i})"

    # update foreground
    foreground.data(data)
      .each (d) ->
        d3.select(@)
          .transition().delay(0).duration(500)
          .attr
            width: ((d.value*self.maxWidth)-d.value) # (value*max) - value (so as never to go over 100%)
            class: "stat #{StatsUtils.getTemperature(d.value)}"

    # update face
    @face.update StatsUtils.getOverallTemperature(data)

  #
  subscribeToStatData : (id) ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      statProviderId : id
      callback       : @updateLiveStats
    }
