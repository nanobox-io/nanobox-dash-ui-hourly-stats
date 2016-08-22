StatsUtils  = require 'misc/stats-utils'
Slider      = require 'views/expanded-view/slider'

#
view = require 'jade/expanded-view'

#
module.exports = class ExpandedView

  # options; I'd love to figure out a way to calculate these rather than just
  # having them hard coded...
  _numMetrics:   25 # figure out a better way to know this rather than just happening to know it's 24...
  _metricHeight: 35
  _metricWidth:  5
  _liveWidth:    12
  _vPadding:     10
  _hPadding:     5

  #
  constructor: ($el, @options={}) ->

    #
    @stats = @options.stats

    #
    @$node = $(view({stats:@stats}))
    $el.append @$node

  # build svgs
  build : () ->

    # add histroical stats svg
    @historicStats = d3.select($(".historical-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  @_numMetrics*(@_metricWidth+@_hPadding)
          height: @stats.length*(@_metricHeight + @_vPadding) - @_vPadding

    # add live stats svg
    @liveStats = d3.select($(".live-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  @_liveWidth
          height: @stats.length*(@_metricHeight + @_vPadding) - @_vPadding

    # add timeline; we need to add a little to the width to account for the beginning
    # and ending values which can't get cut off
    @timeline = d3.select($(".timeline", @$node).get(0))
      .append("svg")
        .attr
          width  : @_numMetrics*(@_metricWidth + @_hPadding) + 15
          height : @_metricHeight

    # add the timeline and set to "right now"
    @updateTimeline(moment())

    # create the slider and add toggle
    @slider ||= new Slider(@$node, @)
    @$node.find(".toggle-slider").click (e) => @slider.open()

    #
    @_subscribeToStatData(@options.id)


  #
  updateTimeline : (endDate) ->

    self = @

    #
    now = moment()

    # build the 24 hour timeline; load them in backwards since the timeline is
    # displayed desc. from right to left. we go from 1 to 25 because we're trying
    # to calculate from 1 hour ago to 24 hours ago (from that hour) so we're showing
    # the first and last hour, which is the same, twice.
    timeline = []
    for i in [1..25]
      timeline.unshift moment(endDate).subtract(i, "hours")

    # create timeline
    time = @timeline.selectAll(".time").data(timeline)
    time.enter()
      .append("svg:g")
        .attr
          class: "time"
          transform: "translate(0, 0)"

      .each (d, i) ->
        group = d3.select(@)

        #
        diff = now.diff(d, "hours")

        # not really happy about this because 10 and 11 are just arbitrary numbers
        # that happen to make it work...
        pos = (10*i+1)+11

        switch

          # one hour ago; we need to catch this before the mod
          when diff == 1
            group.attr(class: "time primary", transform: "translate(#{pos}, 0)")
            group.append("svg:rect").attr(width: 1, height: 4, class: "tick")
            group.append("svg:text").text("1hr").attr(y: 15, class: "hour")
            group.append("svg:text").text("ago").attr(y: 23, class: "period")

          # 24 hours from 1 hour ago; we need to catch this before the mod
          when diff == 25
            group.attr(class: "time primary", transform: "translate(#{pos}, 0)")
            group.append("svg:rect").attr(width: 1, height: 4, class: "tick")
            group.append("svg:text").text("24hrs").attr(y: 15, class: "hour")
            group.append("svg:text").text("ago").attr(y: 23, class: "period")

          # every 6 hours; we want the diff to be 1 because we're going from 1
          # hour ago (not right now)
          when diff % 6 == 1
            group.attr(class: "time secondary", transform: "translate(#{pos}, 0)")
            group.append("svg:rect").attr(width: 1, height: 4, class: "tick")
            group.append("svg:text").text(d.format("h")).attr(y: 15, class: "hour")
            group.append("svg:text").text(d.format("a")).attr(y: 23, class: "period")
          else return

    # update timeline
    time.data(timeline).each (d, i) ->
      group = d3.select(@)

      #
      diff = now.diff(d, "hours")

      #
      switch

        # one hour ago (if the date matches todays date); we need to catch this
        # before the mod
        when diff == 1 && d.date() == moment().date()
          group.select(".hour").text("1hr")
          group.select(".period").text("ago")

        # 24 hours from 1 hour ago (if the date matches yesterdays date); we need
        # to catch this before the mod
        when diff == 25 && d.date() == moment().subtract(1, "day").date()
          group.select(".hour").text("24hrs")
          group.select(".period").text("ago")

        # every 6 hours; we want the diff to be 1 because we're going from 1 hour
        # ago (not right now)
        else
          group.select(".hour").text(d.format("h"))
          group.select(".period").text(d.format("a"))

  # updates live stats, and percentages
  updateLiveStats : (data) =>

    self = @

    #
    y = d3.scale.linear().range([self._metricHeight, 0])

    # create background bars
    background = @liveStats.selectAll(".background").data(data)
    background.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            width:     self._liveWidth
            height:    self._metricHeight
            class:     "background"
            transform: "translate(0, #{(self._metricHeight + (self._metricWidth*2))*i})" # a bars distances between each metric

    # create foreground bars
    foreground = @liveStats.selectAll(".stat").data(data)
    foreground.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            y:         y(d.value)
            width:     self._liveWidth
            height:    self._metricHeight - y(d.value)
            class:     "stat fill-temp #{StatsUtils.getTemperature(d.value)}"
            transform: "translate(0, #{(self._metricHeight + (self._metricWidth*2))*i})" # a bars distances between each metric

    # update foreground bars
    foreground.data(data)
      .each (d) ->
        d3.select(@)
          .transition().delay(0).duration(500)
          .attr
            y:      y(d.value)
            height: self._metricHeight - y(d.value)
            class:  "stat fill-temp #{StatsUtils.getTemperature(d.value)}"

    # update percentages
    for d in data
      stat = $(".stats", @$node).find(".#{d.metric}")
      stat.removeClass("sleep cold warm hot")
      stat.addClass(StatsUtils.getTemperature(d.value))
      stat.find(".percent").text "#{Math.round(d.value*100)}%"

  # updates historic stats
  updateHistoricStats : (data) =>

    self = @

    #
    y = d3.scale.linear().range([self._metricHeight, 0])

    # add metric groups
    groups = @historicStats.selectAll("g").data(data)

    # create metrics
    groups.enter()
      .append("svg:g")
        .each (gd, i) ->

          # metric group
          group = d3.select(@).attr
            class: gd.metric
            transform: "translate(0, #{(self._metricHeight + 10)*i})" # a bars distances between each metric

          # background bars
          background = group.selectAll(".background").data(gd.data)
          background.enter()
            .append("svg:rect")
              .each (bd, j) ->
                d3.select(@).attr
                  x:      (self._metricWidth + self._hPadding)*j
                  width:  self._metricWidth
                  height: self._metricHeight
                  class:  "background"

          # foreground bars
          foreground = group.selectAll(".stat").data(gd.data)
          foreground.enter()
            .append("svg:rect")
              .each (bd, j) ->
                d3.select(@).attr
                  x:      (self._metricWidth + self._hPadding)*j
                  y:      y(bd.value)
                  width:  self._metricWidth
                  height: self._metricHeight - y(bd.value)
                  class:  "stat fill-temp #{StatsUtils.getTemperature(bd.value)}"

    # update metrics
    groups.data(data)
      .each (gd) ->

        # foreground bars
        foreground = self.historicStats.select(".#{gd.metric}").selectAll(".stat").data(gd.data)
        foreground.data(gd.data)
          .each (bd, j) ->
            d3.select(@)
              # pulling this for now because it looks weird with the slider
              # .transition().delay(0).duration(250)
              .attr
                y:      y(bd.value)
                height: self._metricHeight - y(bd.value)
                class:  "stat fill-temp #{StatsUtils.getTemperature(bd.value)}"

  #
  _subscribeToStatData : (id) ->
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      statProviderId : id
      callback       : @updateLiveStats
    }

    PubSub.publish 'STATS.SUBSCRIBE.HISTORIC', {
      statProviderId : id
      callback       : @updateHistoricStats
    }
