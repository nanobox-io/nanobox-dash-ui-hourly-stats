StatsUtils      = require 'misc/stats-utils'

#
expandedView    = require 'jade/expanded-view'

#
module.exports = class ExpandedView

  numMetrics:   25 # figure out a better way to know this rather than just happening to know it's 24...
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

    # add timeline; we need to add a little to the width to account for the beginning
    # and ending values which can't get cut off
    @timeline = d3.select($(".timeline", @$node).get(0))
      .append("svg")
        .attr
          width  : @numMetrics*(@metricWidth + @hPadding) + 15
          height : @metricHeight

    #
    @updateTimeline(moment())

    #
    @slider ||= new ExpandedView.Slider($(".slider-container"), @)

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

#
class ExpandedView.Slider

  constructor : (@$node, @parent) ->
    @$modal   = @$node.find('.modal')
    @$shield  = @$node.find('.stats-dropshield')
    @$range   = @$node.find('.slide-range')
    @$slider  = @$node.find('.slider')
    @$days    = @$node.find('.days')
    @$left    = @$slider.find('.left')
    @$right   = @$slider.find('.right')

    @$node.find('.close').click @close
    @$shield.click @close








    # test data
    @data = []
    for metric in ["cpu", "ram", "swap", "disk"]
      m = {metric: metric, values: []}

      # we only want 7 days worth of data (not 8) because one of the days will
      # be split across 2 days (making 8)
      for stat in [0...168]
        m.values.push {date: moment().subtract(stat, "hours"), value: ((Math.random() * 1.00) + 0.00)}
      @data.push m







    #
    maxWidth  = 640
    maxHeight = 50
    numLines  = 193 # 0 - 23 hours * 7 days + 7 days (dividers) + 2 (ends); 23*7+9 = 193

    #
    @buildDates()
    @createSlider()
    @drawTimeline()
    @drawData(@data)
    @open()

  #
  buildDates : () =>

    # iterate from 7 down to 0 (7 times for 7 days), building the "days track"
    # across the top of the slider
    for i in [7..0]

      # today minus "i" gives each day of the week
      day = moment().subtract(i, "day")

      # the day differences between today and "day"
      diff = moment().diff(day, "day")

      # determine day display based on "diff"; 0 is "today", 1 is "yesterday", any
      # other day is displayed by name
      display = switch
        when diff <= 0 then "Today"
        when diff == 1 then "Yesterday"
        else day.format("ddd")

      # add each day to the "days track"
      @$days.append("<div class='day'>#{display}</div>")

  #
  createSlider : () =>
    @$slider.mousedown =>
      $(window).mousemove @drag
      $(window).mouseup =>
        $(window).unbind 'mousemove'
        $(window).unbind 'mouseup'
        delete @firstDragDone

  #
  open : () =>
    @$modal.addClass 'open'
    @$shield.addClass 'open'

    #
    now = moment()

    # this is the current hour (number of ticks) times the spacing between ticks
    @leftLimit = now.hours()*3

    # I would like to find a way to calculate this rather than just using the
    # apparently magical 530 that just happens to work...?
    # @rightLimit = (@leftLimit + (193*3)) - @$slider.width()
    @rightLimit = (@leftLimit + 530) - @$slider.width()

    # set the initial position of the slider at "right now"
    @$slider.css(left: @rightLimit)
    @buildRangeTag @$right, now.subtract(1, "hour")
    @buildRangeTag @$left, now.subtract(24, "hours")

  #
  buildRangeTag : ($el, time) =>
    $el.html $("
      <div class='slider-label'>
        <div class='day'>#{time.format("ddd")}</div>
        <div class='hour'>#{time.format("h")}</div>
        <div class='period'>#{time.format("a")}</div>
      </div>")

  #
  drag : (e) =>

    # what is this?
    if !@firstDragDone
      @firstDragDone = true
      @startMousePosition = e.clientX
      @startSliderPosition = @$slider.position().left

    #
    calulcatedPosition = @startSliderPosition + (e.clientX - @startMousePosition)

    #
    newPosition = switch
      when calulcatedPosition < @leftLimit then @leftLimit
      when calulcatedPosition > @rightLimit then @rightLimit
      else Math.round calulcatedPosition

    #
    @$slider.css left: newPosition

    #
    percent = (newPosition - @leftLimit) / (@rightLimit - @leftLimit)
    [start, end] = StatsUtils.getTimeStampsFromPercentage(percent)

    @buildRangeTag @$left, start
    @buildRangeTag @$right, end

    # we need to add one hour to "end" when updating the timeline because it shows
    # a 25 hours range not 24; it shows the last hour AND 24 hours from that hour
    # meaning it shows that same hour twice (once at each end)
    @parent.updateTimeline(end.add(1, "hour"))
    @parent.updateHistoricStats(@getSlideSet(start))

  #
  getSlideSet: (date) ->
    data = []
    for d in @data

      # if the value is the same as the end value, then take that index and the
      # next 24
      values = []
      for v, i in d.values
        if v.date.isSame(date, "hour")
          values = d.values[i..i+24]

      metric = {metric: d.metric, data: values}

      data.push metric

    data

  #
  drawData: (data) ->

    #
    @svg = d3.select($(".slide-range").get(0))
      .append("svg")
        .attr
          class: "data"
          width:  640
          height: 10

    #
    for metric, i in data
      metricg = @svg.append("svg:g").attr(transform: "translate(0, #{2*i})")

      # pos starts at leftLimit
      # pos = @leftLimit
      pos = moment().hours()*3

      # reverse the values because we're bulding it from left to right and the
      # vales come in desc. from left to right and we want asc.
      metric.values.reverse()

      #
      for stat, j in metric.values
        metricg.append("svg:rect")
          .attr
            class:   StatsUtils.getTemperature(stat.value),
            x:      pos+j,
            y:      0,
            width:  1,
            height: 1

        # set next position
        pos += 2

        # if the stat hour is a "day" add an extra space
        pos += 4 if stat.date.hour() == 0

  #
  drawTimeline: () =>

    #
    @svg = d3.select($(".slide-range").get(0))
      .append("svg")
        .attr
          class: "lines"
          width:  640
          height: 50

    #
    [count, posx] = [0, 0.5]

    #
    for i in [0...193]

      # calculate tick size
      switch

        # 24 hour ticks
        when count == 0 then [y1, y2] = [5, 50]

        # 6 hours ticks; also, count != 0, but the first case handles that
        when count % 6 == 0 then [y1, y2] = [16, 34]

        # hour ticks
        else [y1, y2] = [20, 32]

      # draw tick
      @svg.append("line")
        .attr
          x1: posx
          x2: posx
          y1: y1
          y2: y2
          "stroke-width": 1
          stroke: "#005A7D"

      # increment count per "hour"
      count++

      # set next tick position
      posx += 3

      # if count is an "day" (24 hours) then add a little padding to the front and back of
      # the tick placement
      switch count
        when 1, 24 then posx += 2

      # reset count every "day"
      if count == 24 then count = 0

  #
  close : () =>
    @$modal.removeClass 'open'
    @$shield.removeClass 'open'
