module.exports = class TestData

  #
  constructor: () ->

  #
  createFakeStatDataProvider : ()->

    #
    PubSub.subscribe 'STATS.SUBSCRIBE.LIVE', (m, data)=>
      # console.log "live stats:"
      # console.log JSON.stringify statsDataSimultor.generateLiveStats()

      data.callback statsDataSimultor.generateLiveStats()

      # auto updates; disabled by default
      setInterval () ->
        if window.enableUpdates
          data.callback statsDataSimultor.generateLiveStats()
      , 5000

    #
    PubSub.subscribe 'STATS.SUBSCRIBE.HISTORIC', (m, data)=>
      # console.log "live stats:"
      # console.log JSON.stringify statsDataSimultor.generateHistoricalStats()

      data.callback statsDataSimultor.generateHistoricalStats()

      # auto update; disabled by default
      setInterval () ->
        if window.enableUpdates
          data.callback statsDataSimultor.generateHistoricalStat()
      , 5000

    #
    PubSub.subscribe 'STATS.UNSUBSCRIBE', (m, data)=>

  # generate data for each metric
  generateLiveStats : (isContainer) ->

    # update all stats simultaniously
    #
    # stats = []
    #
    # for metric in @getMetrics(isContainer)
    #   stats.push {metric: metric, value: (Math.random() * 1.00) + 0.00}
    #
    # return stats

    # update a random single stat
    metrics = @getMetrics(isContainer)
    metric = metrics[Math.floor(Math.random()*metrics.length)]

    # console.log "LIVE METRIC!", metric

    #
    return {metric: metric, value: (Math.random() * 1.00) + 0.00}

  # generate hourly data for each metric
  generateHistoricalStats : (isContainer) ->

    # update all stats simultaniously
    #
    # stats = []
    #
    # for metric in @getMetrics(isContainer)
    #   data = []
    #   for hour in [0..24]
    #     data.push {time: "#{("0" + hour).slice(-2)}", value: ((Math.random() * 1.00) + 0.00)}
    #   stats.push {metric: metric, data: data}
    #
    # return stats

    # update a random single stat
    metrics = @getMetrics(isContainer)
    metric = metrics[Math.floor(Math.random()*metrics.length)]

    data = []
    for hour in [0..24]
      data.push {time: "#{("0" + hour).slice(-2)}", value: ((Math.random() * 1.00) + 0.00)}

    #
    return {metric: metric, data: data}

  # generate hourly data for a single metric
  generateHistoricalStat : (isContainer) ->

    # generate a random number between 0 and the length of the available metrics,
    # selecting a random one from the array
    metrics = @getMetrics(isContainer)
    metric  = metrics[ Math.floor( Math.random() * metrics.length ) ]

    data = []
    for hour in [0..24]
      data.push {time: "#{("0" + hour).slice(-2)}", value: ((Math.random() * 1.00) + 0.00)}

    # return the single metric with its data
    {metric: metric, data: data}

  #
  getMetrics : (isContainer) ->

    # It's a container
    if isContainer then ["cpu", "ram"]

    # It's a host
    else ["cpu", "ram", "swap", "disk"]
