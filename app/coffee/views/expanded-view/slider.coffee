StatsUtils = require 'utils/stats-utils'

#
module.exports = class Slider

  #
  numData: 168 # the number of hours in 7 days (24*7); we only show 7 days worth of data
  numTicks: 192 # the number of hours in 8 days (24*8); "today" and a week from today

  #
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
  open : () =>

    #
    now = moment()

    # display slider and dropshield
    @$slider.addClass 'open'
    @$shield.addClass 'open'

    # the formula for calculating this ties directly to the corresponding CSS:
    # (currentHour * tick_style_offset) + extra_style_offset
    # currentHours        = the current hour of the day (number of ticks)
    # tick_style_offset   = the styles for tick width (1), margin (1), and position (1)
    # extra_style_offset  = the .first and .full ticks have some additonal margin
    @leftLimit = (now.hours()*3) + 3

    # the formula for calculating this ties directly to the corresponding CSS:
    # (number_of_data_points * data_style_offset) + (day_gap_offset) + left_limit - .handle.width
    # number_of_data_points   = 168 (above); the number of data points shown (7 days)
    # data_style_offset       = the width (1) and position (2) of each data point
    # day_gap_offset          = "day gaps" have some additionl position (3) added for each day (7)
    # started from the leftLimit minus the width of the handle
    @rightLimit = (@numData*3) + (7*3) + @leftLimit - @$handle.width()

    # set the initial position of the slider at "right now"
    if !@hasOpened
      @$handle.css(left: @rightLimit)
      @_buildRangeTag @$right, now.subtract(1, "hour")
      @_buildRangeTag @$left, now.subtract(24, "hours")

      # the slider has been opened so we don't need to "initialize" the handle
      @hasOpened = true

  # hide the slider and dropshield and reset data back to "now"
  close : () =>
    @$slider.removeClass 'open'
    @$shield.removeClass 'open'

    # update data to "right now"
    # now = moment()
    # @parent.updateTimeline(now)
    # @parent.updateHistoricStats(@_getSlideSection(now.subtract(24, "hours")))

  #
  updateCollection: (dataArray) ->
    @updateData(data) for data in dataArray

  #
  updateData : (@data) =>
    self = @

    # takes a single data point and returns an entire data set (array)
    @data = @parent.main.updateStoredWeekData(@data)

    #
    selector = d3.select(@$range.get(0))

    ## UPDATE

    #
    selector.select(".data").selectAll(".stat").data(@data)
      .each (d) ->
        d3.select(@).selectAll(".foreground").data(d.data)
          .attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")

    ## CREATE

    #
    selector.select(".data").selectAll("div").data(@data)
      .enter()
        .append("div").attr(class: "stat")
          .each (d) ->

            # start positioning data points from the left limit
            pos = self.leftLimit

            # historic stats; we reverse the values because we want index 0 to be
            # on the right side of the timeline and not the left
            statEnter = d3.select(@).selectAll("div").data(d.data.reverse())
              .enter()
                .append("div")
                  .each (d, i) ->

                    #
                    d3.select(@)
                      .style(left: "#{pos+i}px")
                      .attr(class: "value")

                    #
                    pos += (if (d.time.hour() == 0) then 5 else 2)

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

    #
    for i in [0..@numTicks]

      #
      classes = ["tick"]

      # calculate tick size
      switch

        # 24 hour ticks
        when count == 0 then classes.push "full"

        # 6 hours ticks; also, count != 0, but the first case handles that
        when count % 6 == 0 then classes.push "half"

        # hour ticks
        else classes.push "hour"

      # calculate tick position
      switch
        when i == 0 then classes.push "first"
        when i == 192 then classes.push "last"

      # build tick
      d3.select(@$range.find(".rule").get(0))
        .append("div").attr(class: classes.join(" ")).style(left: "#{i}px")

      # increment count and reset count every "day"
      count++
      if count == 24 then count = 0

  #
  _buildRangeTag : ($el, time) =>
    $el.html $("
      <div class='slider-label'>
        <div class='day'>#{time.format("ddd")}</div>
        <div class='hour'>#{time.format("h")}</div>
        <div class='period'>#{time.format("a")}</div>
      </div>")

  #
  _getSlideSection : (start, end) ->
    data = []
    for d in @data
      data.push {metric: d.metric, data: d.data[end..start]}
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

    # percent moved across the timeline FROM LEFT TO RIGHT (now == 100%)
    percent = (newPosition - @leftLimit) / (@rightLimit - @leftLimit)

    # subract 1 from now because we only have stats up to the last complete hour
    now = moment().subtract(1, "hour")

    # because our data is arranged from oldest to newest (left to right) we need
    # to reverse the percentage calculate here so that as we travel left across
    # the timeline we're subracting larger and larger amounts from the current
    # time
    [start, end] = [Math.floor(144*(1-percent))+24, Math.floor(144*(1-percent))]
    @_buildRangeTag @$left, moment(now).subtract(start, "hours")
    @_buildRangeTag @$right, moment(now).subtract(end, "hours")

    # we need to add one hour to "end" when updating the timeline because it shows
    # a 25 hours range not 24; it shows the last hour AND 24 hours from that hour
    # meaning it shows that same hour twice (once at each end). We need to use
    # the end value from above for the same reason; we're moving right to left
    # across the timeline, thus we need to be subtracting larger numbers from the
    # time calculation
    @parent.timeline.updateData(moment(now).subtract(end, "hours").add(1, "hour"))

    # the data on the timeline is ordered by index 168 at the right to 0 index on
    # the left. We have 7 days worth of data (168 indecies) so we find the end
    # by taking 6 days (144 hours) and multiplying that by the percent across the
    # timeline we've traveled. The start time is calculated the same way adding
    # 24 for the additional day (144 + 24 = 168) giving us our start and end
    # indicies that we'll use to pull the data to update the historical view
    [start, end] = [Math.floor(144*percent)+24, Math.floor(144*percent)]
    @parent.updateHistoricCollection(@_getSlideSection(start, end))
