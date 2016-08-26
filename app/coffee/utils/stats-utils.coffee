module.exports = class StatsUtils

  #
  @getTemperature: (val) ->
    switch
      when val < 0     then "wait"
      when val <= 0.75 then "cool"
      when val <= 0.90 then "warm"
      else                  "hot"

  # Finds the hottest temperature and returns that
  @getOverallTemperature: (data) ->

    # find the highest temp
    highTemp = 0
    for d in data
      if d.value > highTemp then highTemp = d.value

    # return overall temp
    @getTemperature(highTemp)
