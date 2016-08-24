StatsUtils = require 'utils/stats-utils'

#
module.exports = class LiveStats

  # this needs to correspond with the value in CSS so that the ratio is correct
  maxWidth: 50

  #
  constructor: (@view, @main) -> # do nothing...

  #
  updateCollection : (dataArray) ->
    @updateData(data) for data in dataArray

  #
  updateData : (data) =>

    # takes a single data point and returns an entire data set (array)
    data = @main.updateStoredLiveData(data)

    ## UPDATE

    # metrics
    @view.select(".metrics").selectAll(".metric").data(data).text (d) -> d.metric

    # values
    @view.select(".current-stats").selectAll(".foreground").data(data)
      .style("width", (d) => "#{(d.value*@maxWidth) - d.value}px")
      .attr("class", (d) => "foreground background-temp #{StatsUtils.getTemperature(d.value)}")

    # percent
    @view.select(".percents").selectAll(".percent").data(data).text (d) -> "#{Math.round(d.value*100)}%"

    ## CREATE

    # metrics
    @view.select(".metrics").selectAll("div").data(data)
      .enter().append("div").attr(class: "metric").text (d) -> d.metric

    # values
    valueEnter = @view.select(".current-stats").selectAll("div").data(data)
      .enter().append("div").attr(class: "value")
    valueEnter.append("div")
      .attr("class", (d) => "foreground background-temp #{StatsUtils.getTemperature(d.value)}")
      .style("width", (d) => "#{(d.value*@maxWidth) - d.value}px")
    valueEnter.append("div").attr(class: "background")

    # percent
    @view.select(".percents").selectAll("div").data(data)
      .enter().append("div").attr(class: "percent").text (d) -> "#{Math.round(d.value*100)}%"
