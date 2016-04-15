Face            = require 'misc/face'
StatsUtils      = require 'misc/stats-utils'

#
standardView    = require 'jade/standard-view'

#
module.exports = class StandardView

  # options
  maxWidth:  50
  barHeight: 5
  barSize:   5

  #
  constructor: ($el, id, @stats) ->
    @$node = $(standardView({stats:@stats}))
    $el.append @$node

    @build()
    @subscribeToStatData id

  # build svgs
  build : () ->

    # add histroical stats
    @historicStats = d3.select($(".historical-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  200
          height: @stats.length*(5+@stats.length)

    # add live stats
    @liveStats = d3.select($(".live-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  50
          height: @stats.length*(5+@stats.length)

    # add face
    @face = new Face $(".face", @$node), "true"

  # updates live stats, percentages, and face
  updateLiveStats : (data) =>

    self = @

    # create foreground
    foreground = @liveStats.selectAll(".stat").data(data)
    foreground.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            width:     40
            height:    5
            class:     "stat #{StatsUtils.getTemperature(d.value)}"
            transform: "translate(0, #{10*i})"

    # update foreground
    foreground.data(data)
      .each (d) ->
        d3.select(@)
          .transition().delay(0).duration(500)
          .attr
            width: ((d.value*self.maxWidth)-d.value) # (value*max) - value (so as never to go over 100%)
            class: "stat #{StatsUtils.getTemperature(d.value)}"

    # update percentages
    for d in data
      $(".percentages", @$node).find(".#{d.metric}").text "#{Math.round(d.value*100)}%"

    # update face
    @face.update StatsUtils.getOverallTemperature(data)

  # updateHistoricStats
  updateHistoricStats : (data) =>

    self = @

    # add stat groups
    groups = @historicStats.selectAll("g").data(data)

    # create stats
    groups.enter()
      .append("svg:g")
        .each (gd, i) ->

          #
          group = d3.select(@).attr
            class: gd.metric
            transform: "translate(0, #{(self.barSize*2)*i})" # a bars distances between each metric

          # foreground
          foreground = group.selectAll(".stat").data(gd.data)
          foreground.enter()
            .append("svg:rect")
              .each (bd, j) ->
                d3.select(@).attr
                  x:      (self.barSize+3)*j
                  width:  5
                  height: 5
                  class:  "stat #{StatsUtils.getTemperature(bd.value)}"

    # update stats
    groups.data(data)
      .each (gd) ->

        # foreground
        foreground = self.historicStats.select(".#{gd.metric}").selectAll(".stat").data(gd.data)
        foreground.data(gd.data)
          .each (bd) ->
            d3.select(@).attr
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
