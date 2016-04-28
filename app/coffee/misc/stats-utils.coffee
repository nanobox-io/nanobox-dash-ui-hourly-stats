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

    # end is 12x12*percent that happens to be some number that works...?
    end = moment(now).subtract(Math.round(144*perc), "hours")

    # start is 24 hours ago from "end"
    start = moment(end).subtract(24, "hours")

    #
    [start, end]
