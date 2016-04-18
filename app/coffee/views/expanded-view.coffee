Face            = require 'misc/face'
StatsUtils      = require 'misc/stats-utils'

#
expandedView    = require 'jade/expanded-view'

#
module.exports = class ExpandedView

  numMetrics:   24 # figure out a better way to know this rather than just happening to know it's 24...
  metricHeight: 35
  metricWidth:  5
  liveWidth:    12
  vPadding:     10
  hPadding:     5

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
          width:  @numMetrics*(@metricWidth+@hPadding)
          height: @stats.length*(@metricHeight + @vPadding) - @vPadding

    # add live stats svg
    @liveStats = d3.select($(".live-stats", @$node).get(0))
      .append("svg")
        .attr
          width:  @liveWidth
          height: @stats.length*(@metricHeight + @vPadding) - @vPadding

    # add timeline
    @timeline = d3.select($(".timeline", @$node).get(0))
      .append("svg")
        .attr
          width  : @numMetrics*(@metricWidth + @hPadding) - @hPadding
          height : @metricHeight

    #
    @updateTimeline(new Date())

  # gets the array ENDING in hour
  getTimeArray : (hour, hours=25) ->
    timeline = []
    for i in [0...hours]
      timeline.unshift @getTimeObject hour--
      hour = 23 if hour == -1
    timeline

  getTimeObject : (hour) ->
    switch
      when hour == 0  then {hour: 12, period: "am", military: hour}
      when hour < 12  then {hour: hour, period: "am", military: hour}
      when hour == 12 then {hour: 12, period: "pm", military: hour}
      when hour > 12  then {hour: (hour - 12), period: "pm", military: hour}

  getNextHour : (hr) ->
    newHour = hr + 1
    return if newHour > 12 then newHour-12 else newHour

  #
  # build backwards 24 hours starting at 'hour'
  # currentHour = -1
  updateTimeline : (endingDate) ->

    self = @

    #
    hour = endingDate.getHours()

    # it's "now" if a new Date's time - endingDates time is <= 3600 milliseconds (1 hour)
    isNow = (new Date().getTime() - endingDate.getTime()) <= 3600

    #
    timeline = @getTimeArray hour

    #
    time = @timeline.selectAll(".time")
      .data timeline, (d, i) -> d.military
      .enter()
        .append("svg:g")
          .attr
            class: "time"

    #
    time.each (d, i) ->

      #
      group = d3.select(@)
      # group.selectAll('*').remove() # remove old stuff

      diff = hour - d.military
      type = "primary"

      switch
        when (hour - d.military - 6) % 6 == 0 && diff != 0 then type = "secondary";

        # When hour is on the right side of the range
        when diff == 0 || diff == -23
          if diff == -23
            i++
          if isNow
            d.hour   = '24hrs'
            d.period = "ago"

        # When hour is on the right side of the range
        when diff == 1
          i++;
          if isNow
            d.hour   = '1hr'
            d.period = "ago"
          else
            d.hour = self.getNextHour d.hour
        else return

      #
      group.attr(class: "time #{type}", transform: "translate(#{7*i+2}, 0)")

      # add tick, hour, and period
      group.append("svg:rect").attr(width: 1, height: 4, class: "tick")
      group.append("svg:text").text(d.hour).attr(y: 15)
      group.append("svg:text").text(d.period).attr(y: 23, class: "period")

  # updates live stats, percentages, and face
  updateLiveStats : (data) =>

    self = @

    #
    y = d3.scale.linear().range([self.metricHeight, 0])

    # create background bars
    background = @liveStats.selectAll(".background").data(data)
    background.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            width:     self.liveWidth
            height:    self.metricHeight
            class:     "background"
            transform: "translate(0, #{(self.metricHeight + (self.metricWidth*2))*i})" # a bars distances between each metric

    # create foreground bars
    foreground = @liveStats.selectAll(".stat").data(data)
    foreground.enter()
      .append("svg:rect")
        .each (d, i) ->
          d3.select(@).attr
            y:         y(d.value)
            width:     self.liveWidth
            height:    self.metricHeight - y(d.value)
            class:     "stat #{StatsUtils.getTemperature(d.value)}"
            transform: "translate(0, #{(self.metricHeight + (self.metricWidth*2))*i})" # a bars distances between each metric

    # update foreground bars
    foreground.data(data)
      .each (d) ->
        d3.select(@)
          .transition().delay(0).duration(500)
          .attr
            y:      y(d.value)
            height: self.metricHeight - y(d.value)
            class:  "stat #{StatsUtils.getTemperature(d.value)}"

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
    y = d3.scale.linear().range([self.metricHeight, 0])

    # add metric groups
    groups = @historicStats.selectAll("g").data(data)

    # create metrics
    groups.enter()
      .append("svg:g")
        .each (gd, i) ->

          # metric group
          group = d3.select(@).attr
            class: gd.metric
            transform: "translate(0, #{(self.metricHeight + 10)*i})" # a bars distances between each metric

          # background bars
          background = group.selectAll(".background").data(gd.data)
          background.enter()
            .append("svg:rect")
              .each (bd, j) ->
                d3.select(@).attr
                  x:      (self.metricWidth + self.hPadding)*j
                  width:  self.metricWidth
                  height: self.metricHeight
                  class:  "background"

          # foreground bars
          foreground = group.selectAll(".stat").data(gd.data)
          foreground.enter()
            .append("svg:rect")
              .each (bd, j) ->
                d3.select(@).attr
                  x:      (self.metricWidth + self.hPadding)*j
                  y:      y(bd.value)
                  width:  self.metricWidth
                  height: self.metricHeight - y(bd.value)
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
                height: self.metricHeight - y(bd.value)
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
