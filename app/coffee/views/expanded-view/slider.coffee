StatsUtils = require 'misc/stats-utils'

#
module.exports = class Slider

  # these aren't being used yet, but they should
  maxWidth  = 640
  maxHeight = 50
  numLines  = 193 # 0 - 23 hours * 7 days + 7 days (dividers) + 2 (ends); 23*7+9 = 193

  constructor : (@$node, @parent) ->

    # slider and dropshield
    @$slider  = @$node.find('#slider')
    @$shield  = @$node.find('#slidershield')

    #
    @$range  = @$slider.find('.range')

    # slide control (handle)
    @$handle  = @$range.find('.handle')
    @$left    = @$handle.find('.left')
    @$right   = @$handle.find('.right')

    # add close events
    @$slider.find('.close').click @close
    @$shield.click @close

    # add drag events
    @$handle.mousedown =>
      $(window).mousemove @_drag
      $(window).mouseup =>
        $(window).unbind 'mousemove'
        $(window).unbind 'mouseup'
        delete @firstDragDone

    # indicate that the slider has never been opened
    @hasOpened = false

    #
    @_drawDays()
    @_drawTimeline()

  #
  open : (@data) =>

    # display slider and dropshield
    @$slider.addClass 'open'
    @$shield.addClass 'open'

    #
    now = moment()

    # this is the current hour (number of ticks) times the spacing between ticks
    @leftLimit = (now.hours()*3) + 3

    # I would like to find a way to calculate this rather than just using the
    # apparently magical 530 that just happens to work...?
    # @rightLimit = (@leftLimit + (193*3)) - @$handle.width()
    @rightLimit = (@leftLimit + 532) - @$handle.width()

    # set the initial position of the slider at "right now"
    if !@hasOpened
      @$handle.css(left: @rightLimit)
      @_buildRangeTag @$right, now.subtract(1, "hour")
      @_buildRangeTag @$left, now.subtract(24, "hours")

      # the slider has been opened so we don't need to "initialize" the handle
      @hasOpened = true

    #
    @updateData(@data)

  # hide the slider and dropshield and reset data back to "now"
  close : () =>
    @$slider.removeClass 'open'
    @$shield.removeClass 'open'

    # update data to "right now"
    # now = moment()
    # @parent.updateTimeline(now)
    # @parent.updateHistoricStats(@_getSlideSet(now.subtract(24, "hours")))

  #
  updateData : (data) =>

    console.log "DATA?", data

    self = @

    #
    selector = d3.select(@$range.get(0))

    ## UPDATE

    #
    selector.select(".data").selectAll(".stat").data(data)
      .each (d) ->
        console.log "D?"
        d3.select(@).selectAll(".foreground").data(d.data)
          .attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")

    ## CREATE

    #
    selector.select(".data").selectAll("div").data(data)
      .enter()
        .append("div").attr(class: "stat")
          .each (d) ->

            # start positioning data points from the left limit
            pos = self.leftLimit

            # historic stats; we reverse the values because we're bulding it from
            # left to right and the vales come in desc. from left to right and we
            # want asc.
            statEnter = d3.select(@).selectAll("div").data(d.data.reverse())
              .enter()
                .append("div")
                  .each (d, i) ->

                    #
                    d3.select(@)
                      .style(left: "#{pos+i}px")
                      .attr(class: "value")

                    #
                    pos += (if (d.date.hour() == 0) then 5 else 2)

            statEnter.append("div").attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")
            statEnter.append("div").attr(class: "background")

  #
  _drawDays : () =>

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
      @$slider.find('.days').append("<div class='day'>#{display}</div>")

  #
  _drawTimeline : () =>

    #
    count = 0
    pos = 0

    # this is the number of hours in 8 days (24*8); we're showing "today" and a
    # week from today (8 days)
    hours = 192

    #
    for i in [0..hours]

      console.log "HERE?", i

      classes = ["tick"]

      # calculate tick size
      switch

        # 24 hour ticks
        when count == 0
          classes.push "full"

        # 6 hours ticks; also, count != 0, but the first case handles that
        when count % 6 == 0
          classes.push "half"

        # hour ticks
        else
          classes.push "hour"

      # calculate tick position
      switch

        #
        when i == 0
          classes.push "first"

        #
        when i == 192
          classes.push "last"

      # increment count per "hour"
      count++

      # if count is an "day" (24 hours) then add a little extra padding to the
      # front and back of the tick placement
      # switch count
        # when 1, 24 then classes.push ["mark"]

      # reset count every "day"
      if count == 24 then count = 0

      # pos += (if (d.date.hour() == 0) then 5 else 2)

      #
      d3.select(@$range.find(".rule").get(0))
        .append("div").attr(class: classes.join(" ")).style(left: "#{pos+i}px")

  #
  _buildRangeTag : ($el, time) =>
    $el.html $("
      <div class='slider-label'>
        <div class='day'>#{time.format("ddd")}</div>
        <div class='hour'>#{time.format("h")}</div>
        <div class='period'>#{time.format("a")}</div>
      </div>")

  #
  _getSlideSet : (date) ->
    data = []
    for d in @data

      # if the value is the same as the end value, then take that index and the
      # next 24
      values = []
      for v, i in d.data
        if v.date.isSame(date, "hour")
          values = d.data[i..i+24]

      data.push {metric: d.metric, data: values}

    data

  #
  _drag : (e) =>

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
    @_buildRangeTag @$left, start
    @_buildRangeTag @$right, end

    # we need to add one hour to "end" when updating the timeline because it shows
    # a 25 hours range not 24; it shows the last hour AND 24 hours from that hour
    # meaning it shows that same hour twice (once at each end)
    @parent.updateTimeline(end.add(1, "hour"))
    @parent.updateHistoricCollection(@_getSlideSet(start))
