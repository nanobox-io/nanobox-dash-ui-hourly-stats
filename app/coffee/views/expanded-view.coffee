Face            = require 'misc/face'
StatsUtils      = require 'misc/stats-utils'

#
expandedView    = require 'jade/expanded-view'

#
module.exports = class ExpandedView

  #
  barSize: 5

  #
  constructor: ($el, id, @stats) ->
    @$node = $(expandedView({stats:@stats}))
    $el.append @$node

    @build()
    @subscribeToStatData id

  # build svgs
  build : () ->

    # add histroical stats svg
    @historicStats = d3.select($(".historical-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  200
          height: @stats.length*(40+@stats.length)

    # add live stats svg
    @liveStats = d3.select($(".live-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  10
          height: @stats.length*(40+@stats.length)

    # add face
    @face = new Face $(".face", @$node), "true"

  # updates live stats, percentages, and face
  updateLiveStats : (data) =>

    self = @

    #
    y = d3.scale.linear().range([40, 0])

    # create background bars
    background = @liveStats.selectAll(".background").data(data)
    background.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            width: 10
            height: 40
            class: "background"
            transform: "translate(0, #{(40 + 10)*i})" # a bars distances between each metric

    # create foreground bars
    foreground = @liveStats.selectAll(".stat").data(data)
    foreground.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            y:         y(d.value)
            width:     10
            height:    40 - y(d.value)
            class:     "stat #{StatsUtils.getTemperature(d.value)}"
            transform: "translate(0, #{(40 + 10)*i})" # a bars distances between each metric

    # update foreground bars
    foreground.data(data)
      .each (d) ->
        d3.select(@)
          .transition().delay(0).duration(500)
          .attr
            y:      y(d.value)
            height: 40 - y(d.value)
            class:  "stat #{StatsUtils.getTemperature(d.value)}"

    # update percentages
    for d in data
      stat = $(".stats", @$node).find(".#{d.metric}")
      stat.removeClass("sleep cold warm hot").addClass(StatsUtils.getTemperature(d.value))
      stat.find(".percent").text "#{Math.round(d.value*100)}%"

    # update face
    @face.update StatsUtils.getOverallTemperature(data)

  # updates historic stats
  updateHistoricStats : (data) =>

    self = @

    #
    y = d3.scale.linear().range([40, 0])

    # add metric groups
    groups = @historicStats.selectAll("g").data(data)

    # create metrics
    groups.enter()
      .append("svg:g")
        .each (gd, i) ->

          # metric group
          group = d3.select(@).attr
            class: gd.metric
            transform: "translate(0, #{(40 + 10)*i})" # a bars distances between each metric

          # background bars
          background = group.selectAll(".background").data(gd.data)
          background.enter()
            .append("svg:rect")
              .each (bd, j) ->
                d3.select(@).attr
                  x:      (self.barSize+3)*j
                  width:  5
                  height: 40
                  class:  "background"

          # foreground bars
          foreground = group.selectAll(".stat").data(gd.data)
          foreground.enter()
            .append("svg:rect")
              .each (bd, j) ->
                d3.select(@).attr
                  x:      (self.barSize+3)*j
                  y:      y(bd.value)
                  width:  5
                  height: 40 - y(bd.value)
                  class:  "stat #{StatsUtils.getTemperature(bd.value)}"

    # update metrics
    groups.data(data)
      .each (gd) ->

        # foreground bars
        foreground = self.historicStats.select(".#{gd.metric}").selectAll(".stat").data(gd.data)
        foreground.data(gd.data)
          .each (bd, j) ->
            d3.select(@)
              .transition().delay(0).duration(500)
              .attr
                y:      y(bd.value)
                height: 40 - y(bd.value)
                class:  "stat #{StatsUtils.getTemperature(bd.value)}"

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
