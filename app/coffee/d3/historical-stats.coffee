StatsUtils = require 'misc/stats-utils'

#
module.exports = class HistoricalStats

  # options
  barSize: 5

  #
  constructor: (@$target, data) ->

    self = @

    # create container svg
    @svg = d3.select(@$target.get(0))
      .append("svg")
        .attr
          width: 190
          height: data.length*(self.barSize+data.length) # length of data * (height of each bar + length of data); this makes it tall enough to accomodate each bar with a bars space inbetween

  # update
  update : (data) ->

    self = @

    # add stat groups
    groups = @svg.selectAll("g").data(data)

    # create stats
    groups.enter()
      .append("svg:g")
        .each (gd, i) ->

          #
          group = d3.select(@)
            .attr
              class: gd.metric
              transform: "translate(0, #{(self.barSize*2)*i})" # a bars distances between each metric

          #
          boxes = group.selectAll("rect").data(gd.data).enter()
            .append("svg:rect")
              .each (bd, j) ->
                box = d3.select(@)
                  .attr
                    x:      (self.barSize+3)*j
                    width:  self.barSize
                    height: self.barSize
                    class:  StatsUtils.getTemperature(bd.value)

    # update stats
    groups.data(data)
      .each (gd) ->
        box = self.svg.select(".#{gd.metric}").selectAll("rect").data(gd.data)
          .each (bd) ->
            d3.select(@).attr(class: StatsUtils.getTemperature(bd.value))

    # update stats (alternate method)
    # for d in data
    #   @svg.select(".#{d.metric}").selectAll("rect").data(d.data)
    #     .each (bd) ->
    #       d3.select(@).attr(class: StatsUtils.getTemperature(bd.value))
