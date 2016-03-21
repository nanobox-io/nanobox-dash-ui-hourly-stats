module.exports = class StatsUtils

  # Set the health borders used to know what color / face a stat should show EX:
  # { ram:[.75, 0.9] }
  # A ram balue less than 0 would rturn 'sleep'
  # A ram value between 0 and 0.75 would return 'cool'
  # A ram value between 0.76 and 0.9 would return 'warm'
  # A ram value greater than 0.9 would return 'hot'
  # Note, any metric that doesn't have a threshold set will use the default - [.75, 0.9]
  @setThresholds: (thresholds={}) -> StatsUtils.thresholds = thresholds

  # An array of info concerning the stat metrics. (Note, The order of the array
  # is used to order the visueal display of the stats). EX:
  # statTypes = [
  #   {id:"cpu_used",  nickname: "CPU",  name:"CPU Used"}
  #   {id:"ram_used",  nickname: "RAM",  name:"RAM Used"}
  #   {id:"swap_used", nickname: "SWAP", name:"Swap Used"}
  #   {id:"disk_used", nickname: "DISK", name:"Disk Used"}
  # ]
  # StatUtils.setTypes(statTypes)
  @setTypes:      (statTypes=[])  -> StatsUtils.statTypes  = statTypes

  @getIndexOfMetric : (metric) ->
    for statType, i in StatsUtils.statTypes
      if metric == statType.id
        return i

    return -1

  @getTemperature : (val, stat) ->
    return 'sleep' if !StatsUtils.thresholds?

    # Check to see if there is a custom threshold range for this metric
    # If there is none, use a default.
    if StatsUtils.thresholds["#{stat}_thresholds"]?
      threshold = StatsUtils.thresholds["#{stat}_thresholds"]
    else
      threshold = [.75, 0.9]

    switch
      when val < 0 then "sleep"
      when val < threshold[0] then "cool"
      when val < threshold[1] then "warm"
      else "hot"

  # Finds the hottest temperature and returns that
  @getOverallTemperature : (data) ->
    # Grab all the values and push them into an array
    ar = []
    for key, val of data when key != 'swap'
      if !isNaN(val)
        ar.push @getTemperature(val, key)

    return null if !ar.length

    overall = 'sleep'
    for temp in ['cool', 'warm', 'hot']
      overall = temp if temp in ar

    overall

  # gets the array ENDING in hour
  @getTimeArray : (hour, hours=25) ->
    timeline = []
    # get the array
    for i in [ 0 ... hours ]
      timeline.unshift @getTimeObject hour--
      hour = 23 if hour == -1
    timeline

  @getTimeObject : (hour) ->
    switch
      when hour == 0
        hour     : 12
        period   : "am"
        military : hour
      when hour < 12
        hour   : hour
        period : "am"
        military : hour
      when hour == 12
        hour   : 12
        period : "pm"
        military : hour
      when hour > 12
        hour   : hour - 12
        period : "pm"
        military : hour

  @padNumber : (number, size) ->
    string = "#{number}"
    while (string.length < size)
      string = "0" + string
    string

  @getTimeStampsFromPercentage : (perc) ->
    perc = 1 - perc
    now = @getLastWholeHour()

    b = now.setHours now.getHours() - Math.round(144*perc)
    a = now.setHours now.getHours() - 24

    [a,b]

  @get24hrRangeStartingLastHour : () ->
    @getTimeStampsFromPercentage(1)

  @getLastWholeHour : () ->
    now = new Date()
    now.setHours now.getHours() - 1
    now.setMinutes 0
    now.setSeconds 0
    now.setMilliseconds 0
    now

  @getNextHour : (hr) ->
    newHour = hr + 1
    return if newHour > 12 then newHour-12 else newHour

  # ------------------------------------  Previously found in DataNormalizer!


  # This assumes the Raw Data array has no empty slots!
  @normalizeHistoricalData : (rawData, range) ->

    # Set "now" to one hour ago on the dot
    now = new Date()
    now.setHours(now.getHours() - 1)
    now.setMinutes(0)
    now.setSeconds(0)

    # Find how many hours ago this range of hours is
    hoursAgoStart = Math.round( ( now - new Date(range[0]) ) / 36e5 )
    hoursAgoEnd   = Math.round( ( now - new Date(range[1]) ) / 36e5 )
    # Translate that to a position in the raw data array
    startIndex    = hoursAgoStart
    endIndex      = hoursAgoEnd

    # Pull the 24 values between those dates into an array formulated for D3
    ar = []
    for i in [endIndex..startIndex] by 1
      if rawData[i]?
        dataPoint             = rawData[i]
        time                  = new Date(dataPoint.time).setMinutes(0)
        ar[ startIndex - i ]  = dataPoint.value

    return ar

  # { 00:15: 0.123, etc.} -> [0.123, etc.]
  @normalizeHourlyData : (rawData) ->
    ar = []
    for hour in [0...24]
      for quarter in [0, 15, 30, 45]
        key = "#{StatsUtils.padNumber(hour,2)}:#{StatsUtils.padNumber(quarter,2)}"
        ar.push rawData[key] || 0

    ar

  @fillGapsInHistoricalData : (rawData, is24Hrs=true) ->
    # Is this 24 hour data, or 7 day data
    if is24Hrs
      hrs = 25
    else
      hrs = 168

    now = new Date()
    now.setHours(now.getHours() - 1)
    now.setMinutes(0)
    now.setSeconds(0)
    utc = now.getTime()

    # Fill all the spaces with -1's (app sleeping)
    ar = []
    for i in [0...hrs]
      ar[i] = {time:utc, value:-1}
      utc -= 3600000

    # Loop through the real data placing each data in it's chronological slot (replacing the -1)
    for data in rawData
      hoursAgo = Math.round( ( now - new Date(data.time) ) / 36e5 )
      ar[hoursAgo] = data

    ar
