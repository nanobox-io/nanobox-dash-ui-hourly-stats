module.exports = class TestData

  constructor: (@statTypes) ->
    @happy = true

    if !@statTypes?
      @statTypes       = [
        {id:"cpu_used",  nickname: "CPU",  name:"CPU Used"}
        {id:"ram_used",  nickname: "RAM",  name:"RAM Used"}
        {id:"swap_used", nickname: "SWAP", name:"Swap Used"}
        {id:"disk_used", nickname: "DISK", name:"Disk Used"}
      ]

    @thresholds =
      cpu_used_thresholds:     [.35, .7]
      ram_used_thresholds:     [.25, .5]
      swap_used_thresholds:    [.15, .8]


  generateFakeLiveStats : () ->
    obj = {}

    # 20% chance of being 0 usage
    if Math.random() < 0.2
      for statType in @statTypes
        obj[statType.id] = 0

    else
      for statType in @statTypes
        obj[statType.id] = Math.random()

    return obj

  generateAlternatingFaceStats: () ->
    if @happy
      data =
        cpu_used     : .3
        ram_used     : .3
        swap_used    : .3
        disk_io_wait : .3
        disk_used    : .3
    else
      data =
        cpu_used     : .95
        ram_used     : .95
        swap_used    : .95
        disk_io_wait : .95
        disk_used    : .95

    @happy = !@happy
    data

  generateFakeHistoricalStats : (is24hrs=true)->

    totalHrs = if is24hrs then 25 else 24*7


    now  = new Date()
    # last hour
    now.setHours(now.getHours() - 1)
    now.setMinutes(0)
    now.setSeconds(0)

    # console.log "START TIME : #{now}"

    time = now.getTime()
    last = Math.random()
    totalHrs = 24*7

    ar = []
    # Add a value for each hour for the last 7 days starting 1 hour ago
    for i in [1..totalHrs]
      val = @getModdedVal(last)
      if val > 0
        ar.push {time:time, value:val}
      time-=3600000

    # console.log "END TIME   : #{new Date(time)}"

    ar


  generateFakeDiskStats : () -> Math.random()

  forceIntoRange : (number, min, max) ->
    if      number < min then return min
    else if number > max then return max
    else                      return number

  generateFakeHourlyStats : () ->
    obj = {}
    last = Math.random()
    for hour in [0...24]
      for quarter in [0, 15, 30, 45]
        if Math.random() > .1
          obj["#{@padNumber(hour,2)}:#{@padNumber(quarter,2)}"] = @getModdedVal(last)
    obj

  padNumber : (number, size) ->
    string = "#{number}"
    while (string.length < size)
      string = "0" + string
    string

  getModdedVal : (last) ->
    mod = if Math.random() < 0.5 then 1 else -1
    last += Math.random() * 0.2 * mod
    last = 0 if last < 0
    last = 1 if last > 1
    return last.toFixed(2)

  getRangeTestRange : (hoursAgo) ->
    now  = new Date()
    now.setHours(now.getHours() - 1)
    now.setMinutes(0)
    now.setSeconds(0)

    now.setHours(now.getHours() - hoursAgo)
    end   = now.getTime()
    now.setHours(now.getHours() - 23)
    start   = now.getTime()

    [start, end]
