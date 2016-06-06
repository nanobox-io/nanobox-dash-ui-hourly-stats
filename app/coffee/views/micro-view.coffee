Face        = require 'misc/face'
StatsUtils  = require 'misc/stats-utils'

#
view = require 'jade/micro-view'

#
module.exports = class MicroView

  # options; I'd love to figure out a way to calculate these rather than just
  # having them hard coded...
  _metricHeight: 5
  _vPadding:     3
  _maxWidth:     42

  #
  constructor: ($el, @options={}) ->

    #
    @stats = @options.stats

    #
    @$node = $(view({labels:@stats}))
    $el.append @$node

  # build the svg
  build : () ->

    # add live stats
    @liveStats = d3.select($(".live-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  @_maxWidth
          height: @stats.length*(@_metricHeight + @_vPadding) - @_vPadding

    # add face
    @face = new Face $(".face", @$node), "true"

    #
    @_subscribeToStatData(@options.id)

  # updates live stats, and face
  updateLiveStats : (data) =>

    self = @

    # create background bars
    background = @liveStats.selectAll(".background").data(data)
    background.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            width:     (self._maxWidth)
            height:    self._metricHeight
            class:     "background"
            transform: "translate(0, #{(self._metricHeight + self._vPadding)*i})" # a bars distances between each metric

    # create foreground bars
    foreground = @liveStats.selectAll(".stat").data(data)
    foreground.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            width:     0
            height:    self._metricHeight
            class:     "stat fill-temp #{StatsUtils.getTemperature(d.value)}"
            transform: "translate(0, #{(self._metricHeight + self._vPadding)*i})" # a bars distances between each metric

    # update foreground bars
    foreground.data(data)
      .each (d) ->
        d3.select(@)
          .transition().delay(0).duration(500)
          .attr
            width: (d.value*self._maxWidth) - d.value
            class: "stat fill-temp #{StatsUtils.getTemperature(d.value)}"

    # update face
    @face.update StatsUtils.getOverallTemperature(data)

  #
  _subscribeToStatData : (id) ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      statProviderId : id
      callback       : @updateLiveStats
    }
