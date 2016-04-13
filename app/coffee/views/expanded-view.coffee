Face            = require 'misc/face'
HistoricalStats = require 'd3/historical-stats'
LiveStats       = require 'd3/live-stats'
StatsUtils      = require 'misc/stats-utils'

#
expandedView    = require 'jade/expanded-view'

#
module.exports = class ExpandedView

  #
  constructor: ($el, id, @stats) ->
    @$node = $(expandedView({stats:@stats}))
    $el.append @$node

    @build()
    @subscribeToStatData id

  # build the svg
  build : () ->

    # add histroical stats
    @_buildHistoricalStats()
    # @histroicalStats = new HistoricalStats($(".historical-stats", @$node), @stats, {barWidth:5, barHeight:40})

    # add live stats
    @_buildLiveStats()
    # @liveStats = new LiveStats($(".live-stats", @$node), @stats, {barWidth:10, barHeight:40})

    # add face
    @face = new Face $(".face", @$node), "true"

  #
  _buildHistoricalStats : () ->
    @historicalStats = d3.select($(".historical-stats", @$node).get(0))
      .append("svg")
        .attr(height: @stats.length*(40+@stats.length)) # length of data * (height of each bar + length of data); this makes it tall enough to accomodate each bar with a bars space inbetween

    # add background group
    # background = @svg.append("svg:g")

    # add stats group
    # stats = @svg.append("svg:g")

    # add "background" bars
    # background.selectAll("rect")
    #   .data(@stats).enter()
    #     .append("svg:rect")
    #       .each (d, i) ->
    #         rect = d3.select(@)
    #           .attr
    #             width: self.maxWidth
    #             height: self.barHeight
    #             class: "background"
    #             transform: "translate(0, #{(self.barHeight*2)*i})" # a bars distances between each metric

  _buildLiveStats : () ->
    @liveStats = d3.select($(".live-stats", @$node).get(0))
      .append("svg")
        .attr(height: @stats.length*(40+@stats.length)) # length of data * (height of each bar + length of data); this makes it tall enough to accomodate each bar with a bars space inbetween

    # add background group
    # background = @svg.append("svg:g")

    # add stats group
    # stats = @svg.append("svg:g")

    # add "background" bars
    # background.selectAll("rect")
    #   .data(@stats).enter()
    #     .append("svg:rect")
    #       .each (d, i) ->
    #         rect = d3.select(@)
    #           .attr
    #             width: self.maxWidth
    #             height: self.barHeight
    #             class: "background"
    #             transform: "translate(0, #{(self.barHeight*2)*i})" # a bars distances between each metric


  # updates stats, percentages, and face
  updateLiveStats : (data) =>

    self = @

    # add "stat" bars
    bars = @liveStats.selectAll("rect").data(data)

    # create stats
    bars.enter()
      .append("svg:rect")
        .each (d, i) ->
          rect = d3.select(@)
            .attr
              width: 10
              height: 40
              class: "stat #{d.metric}"
              transform: "translate(0, #{(40 + 10)*i})" # a bars distances between each metric

    # update stats
    bars.data(data)
      .each (d) ->
        stat = d3.select(@)
          .transition().delay(0).duration(500)
          .attr
            height: ((d.value*40)-d.value) # (value*max) - value (so as never to go over 100%)
            class: StatsUtils.getTemperature d.value

    #
    for d in data
      stat = $(".stats", @$node).find(".#{d.metric}")
      stat.removeClass("sleep cold warm hot").addClass(StatsUtils.getTemperature(d.value))
      stat.find(".percent").text "#{Math.round(d.value*100)}%"

    @face.update StatsUtils.getOverallTemperature(data)

  # updates historic stats
  updateHistoricStats : (data) =>

    self = @

    # add stat groups
    groups = @historicalStats.selectAll("g").data(data)

    # create stats
    groups.enter()
      .append("svg:g")
        .each (gd, i) ->

          #
          group = d3.select(@)
            .attr
              class: gd.metric
              transform: "translate(0, #{(40 + 10)*i})" # a bars distances between each metric

          #
          boxes = group.selectAll("rect").data(gd.data).enter()
            .append("svg:rect")
              .each (bd, j) ->
                box = d3.select(@)
                  .attr
                    x:      5*(j*1.25)
                    width:  5
                    height: 40
                    class:  StatsUtils.getTemperature(bd.value)

    # update stats
    groups.data(data)
      .each (gd) ->
        box = self.historicalStats.select(".#{gd.metric}").selectAll("rect").data(gd.data)
          .each (bd) ->
            d3.select(@)
              .transition().delay(0).duration(500)
              .attr
                height: ((bd.value*40)-bd.value)
                class: StatsUtils.getTemperature(bd.value)

  #
  subscribeToStatData : (id) ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      statProviderId : id
      callback       : @updateLiveStats
    }

    PubSub.publish 'STATS.SUBSCRIBE.HISTORIC', {
      statProviderId : id
      callback       : @updateHistoricStats
    }
