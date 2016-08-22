Face            = require 'misc/face'
StatsUtils      = require 'misc/stats-utils'

#
view = require 'jade/standard-view'

#
module.exports = class StandardView

  # options; I'd love to figure out a way to calculate these rather than just
  # having them hard coded...
  _numMetrics:   25 # figure out a better way to know this rather than just happening to know it's 24...
  _metricHeight: 5
  _metricWidth:  5
  _vPadding:     5
  _hPadding:     4
  _maxWidth:     50

  #
  constructor: ($el, @options={}) ->

    #
    @stats = @options.stats

    xtraClasses = ''
    if @options.compressView
      @_vPadding   = 3
      xtraClasses = 'compressed'

    #
    @$node = $(view({stats:@stats, xtraClasses:xtraClasses}))
    $el.append @$node

  # build svgs
  build : () ->

    # add histroical stats
    @historicStats = d3.select($(".historical-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  @_numMetrics*(@_metricWidth+@_hPadding)
          height: @stats.length*(@_metricHeight + @_vPadding) - @_vPadding

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

  # updates live stats, percentages, and face
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
            transform: "translate(0, #{(self._metricHeight+self._vPadding)*i})" # a bars distances between each metric

    # create foreground bars
    foreground = @liveStats.selectAll(".stat").data(data)
    foreground.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            width:     0
            height:    self._metricHeight
            class:     "stat fill-temp #{StatsUtils.getTemperature(d.value)}"
            transform: "translate(0, #{(self._metricHeight+self._vPadding)*i})" # a bars distances between each metric

    # update foreground bars
    foreground.data(data)
      .each (d) ->
        d3.select(@)
          .transition().delay(0).duration(500)
          .attr
            width: (d.value*self._maxWidth) - d.value
            class: "stat fill-temp #{StatsUtils.getTemperature(d.value)}"

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
            transform: "translate(0, #{(self._metricHeight+self._vPadding)*i})" # a bars distances between each metric

          # foreground
          foreground = group.selectAll(".stat").data(gd.data)
          foreground.enter()
            .append("svg:rect")
              .each (bd, j) ->
                d3.select(@).attr
                  x:      (self._metricWidth + self._hPadding)*j
                  width:  self._metricWidth
                  height: self._metricHeight
                  class:  "stat fill-temp #{StatsUtils.getTemperature(bd.value)}"

    # update stats
    groups.data(data)
      .each (gd) ->

        # foreground
        foreground = self.historicStats.select(".#{gd.metric}").selectAll(".stat").data(gd.data)
        foreground.data(gd.data)
          .each (bd) ->
            d3.select(@).attr
              class:  "stat fill-temp #{StatsUtils.getTemperature(bd.value)}"

  #
  _subscribeToStatData : (id) ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      statProviderId : id
      callback       : @updateLiveStats
    }


    # TODO : Add these additional parameters when publishing the need for stats
    PubSub.publish 'STATS.SUBSCRIBE.HISTORIC', {
      statProviderId : id
      callback       : @updateHistoricStats
      # entity      (Provided on instantiation)
      # entityId    (Provided on instantiation)
      # metric      (ram, cpu, disk, swap)
    }
