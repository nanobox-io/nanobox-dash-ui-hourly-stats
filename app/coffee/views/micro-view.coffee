Face       = require 'misc/face'
StatsUtils = require 'misc/stats-utils'

#
view = require 'jade/micro-view'

#
module.exports = class MicroView

  #
  constructor: ($el, @options={}, @main) ->
    @$node = $(view(classes: @options.classes))
    $el.append @$node

  #
  build : () ->
    @view = d3.select($(".micro-view", @$node).get(0))
    @face = new Face $(".micro-view .face", @$node), "true"
    @_subscribeToStatData()

  #
  updateStats : (data) =>

    #
    data = @main.updateStoredLiveStats(data)

    # this needs to correspond with the value in CSS so that the ratio is correct
    maxWidth = 50

    ## UPDATE

    # metrics
    @view.select(".metrics").selectAll(".metric").data(data).text (d) -> d.metric

    # values
    @view.select(".current-stats").selectAll(".foreground").data(data)
      .style("width", (d) -> "#{(d.value*maxWidth) - d.value}px")
      .attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")

    # face
    @face.update StatsUtils.getOverallTemperature(data)

    ## CREATE

    # metrics
    @view.select(".metrics").selectAll("div").data(data)
      .enter().append("div").attr(class: "metric").text (d) -> d.metric

    # values
    valueEnter = @view.select(".current-stats").selectAll("div").data(data)
      .enter().append("div").attr(class: "value")
    valueEnter.append("div")
      .attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")
      .style("width", (d) -> "#{(d.value*maxWidth) - d.value}px")
    valueEnter.append("div").attr(class: "background")

  #
  _subscribeToStatData : () ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      entity         : @options.entity
      entityId       : @options.entityId
      metrics        : @options.metrics
      callback       : @updateStats
    }
