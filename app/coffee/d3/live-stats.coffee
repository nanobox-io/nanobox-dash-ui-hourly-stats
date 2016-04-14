StatsUtils = require 'misc/stats-utils'

#
module.exports = class LiveStats

  # options
  maxWidth:  50
  barHeight: 5

  #
  constructor: (@$target, data) ->

    self = @

    # create container svg
    @svg = d3.select(@$target.get(0))
      .append("svg")
        .attr
          width: self.maxWidth
          height: data.length*(self.barHeight+data.length) # length of data * (height of each bar + length of data); this accounts

    # add background group
    background = @svg.append("svg:g")

    # add stats group
    @stats = @svg.append("svg:g")

    # add "background" bars
    background.selectAll("rect")
      .data(data).enter()
        .append("svg:rect")
          .each (d, i) ->
            rect = d3.select(@)
              .attr
                width: self.maxWidth
                height: self.barHeight
                class: "background"
                transform: "translate(0, #{(self.barHeight*2)*i})" # a bars distances between each metric

  # update
  update : (data) ->

    self = @

    # add "stat" bars
    bars = @stats.selectAll("rect").data(data)

    # create stats
    bars.enter()
      .append("svg:rect")
        .each (d, i) ->
          rect = d3.select(@)
            .attr
              width: self.maxWidth
              height: self.barHeight
              class: "stat #{d.metric}"
              transform: "translate(0, #{(self.barHeight*2)*i})" # a bars distances between each metric

    # update stats
    bars.data(data)
      .each (d) ->
        stat = d3.select(@)
          .transition().delay(0).duration(500)
          .attr
            width: ((d.value*self.maxWidth)-d.value) # (value*max) - value (so as never to go over 100%)
            class: StatsUtils.getTemperature d.value
