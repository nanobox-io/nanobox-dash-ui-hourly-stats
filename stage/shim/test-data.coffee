module.exports = class TestData

  #
  constructor: () ->

  #
  createFakeStatDataProvider : ()->

    #
    PubSub.subscribe 'STATS.SUBSCRIBE.LIVE', (m, data)=>
      data.callback statsDataSimultor.generateLiveStats()
      setInterval () ->

        # disable updates by default
        if window.enableUpdates
          data.callback statsDataSimultor.generateLiveStats()
      , 5000

    #
    PubSub.subscribe 'STATS.SUBSCRIBE.HISTORIC', (m, data)=>
      data.callback statsDataSimultor.generateHistoricalStats()
      setInterval () ->

        # disable updates by default
        if window.enableUpdates
          for i in [0..4]
            setTimeout () ->
              data.callback statsDataSimultor.generateHistoricalStat()
            , Math.floor((Math.random()*1000) + 250)
      , 5000

    #
    PubSub.subscribe 'STATS.UNSUBSCRIBE', (m, data)=>

  # generate data for each metric
  generateLiveStats : () ->
    stats = []
    for metric in ["cpu", "ram", "swap", "disk"]
      stats.push {metric: metric, value: (Math.random() * 1.00) + 0.00}
    stats

  # generate hourly data for each metric
  generateHistoricalStats : () ->
    stats = []
    for metric in ["cpu", "ram", "swap", "disk"]
      data = []
      for hour in [0..24]
        data.push {time: "#{("0" + hour).slice(-2)}", value: ((Math.random() * 1.00) + 0.00)}
      stats.push {metric: metric, data: data}
    stats

  # generate hourly data for a single metric
  generateHistoricalStat : () ->

    # generate a random number between 0 and the length of the available metrics,
    # selecting a random one from the array
    metric = ["cpu", "ram", "swap", "disk"][(Math.floor(Math.random() * 4) + 0)]

    data = []
    for hour in [0..24]
      data.push {time: "#{("0" + hour).slice(-2)}", value: ((Math.random() * 1.00) + 0.00)}

    # return the single metric with its data
    [{metric: metric, data: data}]
