Face        = require 'misc/face'
StatsUtils  = require 'misc/stats-utils'

#
microView = require 'jade/micro-view'

#
module.exports = class MicroView

  # options
  metricHeight:     5
  vPadding:         3
  maxWidth:         42 # this is for the live stat only...

  #
  constructor: ($el, @stats, id) ->
    @$node = $(microView({labels:@stats}))
    $el.append @$node

    @build()
    @subscribeToStatData(id)

  # build the svg
  build : () ->

    # add live stats
    @liveStats = d3.select($(".live-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  @maxWidth
          height: @stats.length*(@metricHeight + @vPadding) - @vPadding

    # add face
    @face = new Face $(".face", @$node), "true"

  # updates live stats, and face
  updateLiveStats : (data) =>

    self = @

    # create background bars
    background = @liveStats.selectAll(".background").data(data)
    background.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            width:     (self.maxWidth)
            height:    self.metricHeight
            class:     "background"
            transform: "translate(0, #{(self.metricHeight + self.vPadding)*i})" # a bars distances between each metric

    # create foreground bars
    foreground = @liveStats.selectAll(".stat").data(data)
    foreground.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            width:     0
            height:    self.metricHeight
            class:     "stat fill-temp #{StatsUtils.getTemperature(d.value)}"
            transform: "translate(0, #{(self.metricHeight + self.vPadding)*i})" # a bars distances between each metric

    # update foreground bars
    foreground.data(data)
      .each (d) ->
        d3.select(@)
          .transition().delay(0).duration(500)
          .attr
            width: (d.value*self.maxWidth) - d.value
            class: "stat fill-temp #{StatsUtils.getTemperature(d.value)}"

    # update face
    @face.update StatsUtils.getOverallTemperature(data)

  #
  subscribeToStatData : (id) ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      statProviderId : id
      callback       : @updateLiveStats
    }
