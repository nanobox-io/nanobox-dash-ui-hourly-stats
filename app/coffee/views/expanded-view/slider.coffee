StatsUtils = require 'misc/stats-utils'

#
module.exports = class Slider

  constructor : (@$node, @parent) ->

    # slider and dropshield
    @$slider  = @$node.find('.slider')
    @$shield  = @$node.find('.stats-dropshield')

    # slide control (handle)
    @$handle  = @$node.find('.handle')
    @$left    = @$handle.find('.left')
    @$right   = @$handle.find('.right')

    #
    maxWidth  = 640
    maxHeight = 50
    numLines  = 193 # 0 - 23 hours * 7 days + 7 days (dividers) + 2 (ends); 23*7+9 = 193

    # add close events
    @$node.find('.close').click @close
    @$shield.click @close

    # add drag events
    @$handle.mousedown =>
      $(window).mousemove @drag
      $(window).mouseup =>
        $(window).unbind 'mousemove'
        $(window).unbind 'mouseup'
        delete @firstDragDone

    #
    @buildDates()
    @drawTimeline()

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
      @$node.find('.days').append("<div class='day'>#{display}</div>")

  #
  open : () =>

    # display slider and dropshield
    @$slider.addClass 'open'
    @$shield.addClass 'open'

    #
    now = moment()

    # this is the current hour (number of ticks) times the spacing between ticks
    @leftLimit = now.hours()*3

    # I would like to find a way to calculate this rather than just using the
    # apparently magical 530 that just happens to work...?
    # @rightLimit = (@leftLimit + (193*3)) - @$handle.width()
    @rightLimit = (@leftLimit + 530) - @$handle.width()

    # set the initial position of the slider at "right now"
    @$handle.css(left: @rightLimit)
    @buildRangeTag @$right, now.subtract(1, "hour")
    @buildRangeTag @$left, now.subtract(24, "hours")

    # NOTE: this will be replaced with actual data that is either passed in (most
    # likely) or fetched at this point
    # test data
    @data = []
    for metric in ["cpu", "ram", "swap", "disk"]
      m = {metric: metric, values: []}

      # we only want 7 days worth of data (not 8) because one of the days will
      # be split across 2 days (making 8)
      for stat in [0...168]
        m.values.push {date: moment().subtract(stat, "hours"), value: ((Math.random() * 1.00) + 0.00)}
      @data.push m

    # draw data points on slider
    @drawData(@data)

  #
  drag : (e) =>

    # what is this?
    if !@firstDragDone
      @firstDragDone = true
      @startMousePosition = e.clientX
      @startSliderPosition = @$handle.position().left

    #
    calulcatedPosition = @startSliderPosition + (e.clientX - @startMousePosition)

    #
    newPosition = switch
      when calulcatedPosition < @leftLimit then @leftLimit
      when calulcatedPosition > @rightLimit then @rightLimit
      else Math.round calulcatedPosition

    #
    @$handle.css left: newPosition

    #
    percent = (newPosition - @leftLimit) / (@rightLimit - @leftLimit)
    [start, end] = StatsUtils.getTimeStampsFromPercentage(percent)

    #
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
  buildRangeTag : ($el, time) =>
    $el.html $("
      <div class='slider-label'>
        <div class='day'>#{time.format("ddd")}</div>
        <div class='hour'>#{time.format("h")}</div>
        <div class='period'>#{time.format("a")}</div>
      </div>")

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

  # hide the slider and dropshield and reset data back to "now"
  close : () =>
    @$slider.removeClass 'open'
    @$shield.removeClass 'open'

    now = moment()

    # update data to "right now"
    @parent.updateTimeline(now)
    @parent.updateHistoricStats(@getSlideSet(now.subtract(24, "hours")))
