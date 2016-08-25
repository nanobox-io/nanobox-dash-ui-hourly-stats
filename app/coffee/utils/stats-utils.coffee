module.exports = class StatsUtils

  #
  @getTemperature : (val) ->
    if      val <= 0  then "wait"
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
