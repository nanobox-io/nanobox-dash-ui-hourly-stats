StatsUtils = require 'utils/stats-utils'

#
module.exports = class LiveStats

  # this needs to correspond with the value in CSS so that the ratio is correct
  maxWidth: 50

  #
  constructor: ($el, @main) ->
    @view = d3.select($el.get(0))

  #
  updateCollection : (dataArray) ->
    @updateData(data) for data in dataArray

  #
  updateData : (data) =>

    # takes a single data point and returns an entire data set (array)
    data = @main.updateStoredHistoricData(data)

    ## UPDATE
    @view.select(".historic-stats").selectAll(".stat").data(data)
      .each (d) ->
        d3.select(@).selectAll(".foreground").data(d.data)
          .attr("class", (d) -> "#{StatsUtils.getStatClasses(d.value)}")

    ## CREATE
    @view.select(".historic-stats").selectAll("div").data(data)
      .enter()
      .append("div").attr(class: "stat")
        .each (d) ->
          statEnter = d3.select(@).selectAll("div").data(d.data)
            .enter().append("div").attr(class: "value")
          statEnter.append("div").attr("class", (d) -> "#{StatsUtils.getStatClasses(d.value)}")
          statEnter.append("div").attr(class: "background")
