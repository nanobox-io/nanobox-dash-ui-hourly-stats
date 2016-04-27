module.exports = class StatsUtils

  #
  @getTemperature : (val) ->
    if      val < 0   then "sleep"
    else if val < .75 then "cool"
    else if val < 0.9 then "warm"
    else                   "hot"

  # Finds the hottest temperature and returns that
  @getOverallTemperature : (data) ->

    # find the highest temp
    highTemp = 0
    for d in data
      if d.value > highTemp then highTemp = d.value

    # return overall temp
    @getTemperature(highTemp)

  #
  @getTimeStampsFromPercentage : (perc) ->

    # reverse the percent because we're sliding backwards into the week
    perc = (1 - perc)

    # "now" is now - 1 hour because we only have a full hours stats up to the last
    # complete hour
    now = moment().subtract(1, "hour")

    # end is 12x12*percent that happens to be some number that works...
    end = moment(now).subtract(Math.round(144*perc), "hours")

    # start is 24 hours ago from "end"
    start = moment(end).subtract(24, "hours")

    [start, end]

  #
  # @getLastWholeHour : () ->
  #   now = new Date()
  #   now.setHours now.getHours() - 1
  #   now.setMinutes 0
  #   now.setSeconds 0
  #   now.setMilliseconds 0
  #   now

  #
  # @get24hrRangeStartingLastHour : () -> @getTimeStampsFromPercentage(1)

  #
  # @getDay : (i, short=false) ->
  #   day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'][i]
  #   if short then day[0...3] else day

  # gets the array ENDING in hour
  # @getTimeArray : (hour, hours=25) ->
  #   timeline = []
  #   for i in [0...hours]
  #     timeline.unshift @getTimeObject hour--
  #     hour = 23 if hour == -1
  #   timeline

  # @getTimeObject : (hour) ->
  #   switch
  #     when hour == 0  then {hour: 12, period: "am", military: hour}
  #     when hour < 12  then {hour: hour, period: "am", military: hour}
  #     when hour == 12 then {hour: 12, period: "pm", military: hour}
  #     when hour > 12  then {hour: (hour - 12), period: "pm", military: hour}

  # @getNextHour : (hr) ->
  #   newHour = hr + 1
  #   return if newHour > 12 then newHour-12 else newHour
