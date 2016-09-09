module.exports = class StatsUtils

  #
  @getTemperature: (val) ->
    switch
      when val <= 0    then "wait"
      when val <= 0.75 then "cool"
      when val <= 0.90 then "warm"
      else                  "hot"

  # Finds the hottest temperature and returns that
  @getOverallTemperature: (data) ->

    #
    temp = 0

    # find the highest temp; if there is no data to use finding the highe temp
    # we'll just pass back the seed temp (0)
    unless data == undefined
      for d in data
        if d.value > temp then temp = d.value

    # return overall temp
    @getTemperature(temp)
