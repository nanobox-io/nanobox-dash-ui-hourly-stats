module.exports = class TestData

  #
  constructor: () ->

  #
  createFakeStatDataProvider : ()->

    #
    PubSub.subscribe 'STATS.SUBSCRIBE.LIVE', (m, data)=>
      data.callback statsDataSimultor.generateLiveStat()

      # auto updates; disabled by default
      setInterval () ->
        if window.enableUpdates
          data.callback statsDataSimultor.generateLiveStat()
      , 3000

    #
    PubSub.subscribe 'STATS.SUBSCRIBE.HISTORIC', (m, data)=>

      #
      for metric in @getMetrics(false)

        stats = []
        for hour in [0..1]
          stats.push {time: moment().subtract(hour, "h"), value: ((Math.random() * 1.00) + 0.00)}

        # console.log "PUSH", metric, JSON.stringify stats
        data.callback {metric: metric, data: stats}

      # data.callback statsDataSimultor.generateHistoricalStats()

      # # auto update; disabled by default
      # setInterval () ->
      #   if window.enableUpdates
      #     data.callback statsDataSimultor.generateHistoricalStat()
      # , 3000

    #
    # PubSub.subscribe 'STATS.UNSUBSCRIBE', (m, data) =>

  #
  generateLiveStats : (isContainer) ->
    stats = []
    for metric in @getMetrics(isContainer)
      stats.push @generateLiveStat()
    return stats

  #
  generateLiveStat : (isContainer) ->
    metrics = @getMetrics(isContainer)
    metric = metrics[Math.floor(Math.random()*metrics.length)]
    return {metric: metric, value: (Math.random() * 1.00) + 0.00}

  # generate hourly data for each metric
  generateHistoricalStats : (isContainer) ->
    stats = []
    for metric in @getMetrics(isContainer)
      data = []
      for hour in [0..24]
        data.push @generateHistoricalStat(isContainer)
      stats.push {metric: metric, data: data}
    return stats

  # generate hourly data for a single metric
  generateHistoricalStat : (isContainer) ->
    metrics = @getMetrics(isContainer)
    metric  = metrics[ Math.floor( Math.random() * metrics.length ) ]
    data = []
    for hour in [0..24]
      data.push {time: moment().subtract(hour, "h"), value: ((Math.random() * 1.00) + 0.00)}
    return {metric: metric, data: data}

  #
  getMetrics : (isContainer) ->
    if isContainer then ["cpu", "ram"]
    else ["cpu", "ram", "swap", "disk"]
