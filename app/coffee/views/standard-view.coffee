Face       = require 'misc/face'
StatsUtils = require 'misc/stats-utils'

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
    @view = d3.select($(".standard-view", @$node).get(0))
    @face = new Face $(".standard-view .face", @$node), "true"
    @_subscribeToStatData()

  #
  updateLiveStats : (data) =>

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

    # percent
    @view.select(".percents").selectAll(".percent").data(data).text (d) -> "#{Math.round(d.value*100)}%"

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
      .style("width", (d) -> "#{(d.value*maxWidth) - d.value}px")
      .attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")
    valueEnter.append("div").attr(class: "background")

    # percent
    @view.select(".percents").selectAll("div").data(data)
      .enter().append("div").attr(class: "percent").text (d) -> "#{Math.round(d.value*100)}%"

  #
  updateLiveCollection : (dataArray) ->
    @updateLiveStats(data) for data in dataArray

  # updateHistoricStats
  updateHistoricStats : (data) =>

    #
    data = @main.updateStoredHistoricalStats(data)

    ## UPDATE

    @view.select(".historic-stats").selectAll(".stat").data(data)
      .each (d) ->
        d3.select(@).selectAll(".foreground").data(d.data)
          .attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")

    ## CREATE

    # historic stat container
    @view.select(".historic-stats").selectAll("div").data(data)
      .enter()
        .append("div").attr(class: "stat")
          .each (d) ->

            # historic stats
            statEnter = d3.select(@).selectAll("div").data(d.data)
              .enter().append("div").attr(class: "value")
            statEnter.append("div").attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")
            statEnter.append("div").attr(class: "background")

  #
  updateHistoricCollection : (dataArray) ->
    @updateHistoricStats(data) for data in dataArray

  #
  _subscribeToStatData : () ->

    #
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      entity         : @options.entity
      entityId       : @options.entityId
      metrics        : @options.metrics
      callback       : @updateLiveStats
    }

    #
    PubSub.publish 'STATS.SUBSCRIBE.HISTORIC', {
      start          : @options.start
      end            : @options.end
      entity         : @options.entity
      entityId       : @options.entityId
      metrics        : @options.metrics
      callback       : @updateHistoricStats
    }
