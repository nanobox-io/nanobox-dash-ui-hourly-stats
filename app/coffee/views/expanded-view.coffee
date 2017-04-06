StatsUtils  = require 'utils/stats-utils'
Slider      = require 'views/expanded-view/slider'
Timeline    = require 'views/expanded-view/timeline'

#
expandedView = require 'jade/expanded-view'

#
module.exports = class ExpandedView

  #
  constructor: ($el, @options={}, @main) ->
    @$node = $(expandedView({classes: @options.classes}))
    $el.append @$node

  #
  build : () ->
    @view = d3.select($(".expanded-view", @$node).get(0))

    # create a timeline and set it to "now"
    timeline = d3.select($(".timeline", @$node).get(0))
    @timeline ||= new Timeline(timeline)
    @timeline.updateData(moment())

    # create the slider and add toggle
    @slider ||= new Slider(@$node, @)
    @$node.find(".toggle-slider").click (e) =>

      # open slider
      @slider.open()

      # update slider width seed data
      @slider.updateCollection(@main.storedWeekData)

      # request actual data
      PubSub.publish 'STATS.SUBSCRIBE.HISTORIC', {
        start          : "7d"
        end            : "0d"
        entity         : @options.entity
        entityId       : @options.entityId
        metrics        : @options.metrics
        callback       : @slider.updateData
      }

    # seed data and subscribe to udpates
    @_seedData()
    @_subscribeToUpdates()

  #
  updateLiveCollection : (dataArray) ->
    @updateLiveStats(data) for data in dataArray

  # we build this one manually (vs using the stats/live-view) because it's layout
  # is completely different
  updateLiveStats : (data) =>

    # takes a single data point and returns an entire data set (array)
    data = @main.updateStoredLiveData(data)

    # this needs to correspond with the value in CSS so that the ratio is correct
    maxHeight = 50

    ## UPDATE

    # values
    @view.select(".stats .current-stats").selectAll(".foreground").data(data)
      .style("height", (d) -> "#{(d.value*maxHeight) - d.value}px")
      .attr("class", (d) -> "#{StatsUtils.getStatClasses(d.value)}")

    # metas; percents & metrics
    @view.select(".stats .metas").selectAll(".percent").data(data)
      .attr("class", (d) -> "#{StatsUtils.getPercentClasses(d.value)}")
      .text (d) -> "#{Math.round(d.value*100)}%"
    @view.select(".stats .metas").selectAll(".metric").data(data)
      .attr("class", (d) -> "#{StatsUtils.getMetricClasses(d.value)}")
      .text (d) -> d.metric

    ## CREATE

    # values
    valueEnter = @view.select(".stats .current-stats").selectAll("div").data(data)
      .enter().append("div").attr(class: "value")
    valueEnter.append("div")
      .style("height", (d) -> "#{(d.value*maxHeight) - d.value}px")
      .attr("class", (d) -> "#{StatsUtils.getStatClasses(d.value)}")
    valueEnter.append("div").attr(class: "background")

    # metas; percents & metrcis
    metaEnter = @view.select(".stats .metas").selectAll("div").data(data)
      .enter().append("div").attr(class: "meta")
    metaEnter.append("div")
      .attr("class", (d) -> "#{StatsUtils.getPercentClasses(d.value)}")
      .text (d) -> "#{Math.round(d.value*100)}%"
    metaEnter.append("div")
      .attr("class", (d) -> "#{StatsUtils.getMetricClasses(d.value)}")
      .text (d) -> d.metric

  #
  updateHistoricCollection : (dataArray) ->
    @updateHistoricStats(data) for data in dataArray

  # we build this one manually (vs using the stats/historic-view) because it's
  # layout is completely different
  updateHistoricStats : (data) =>

    # takes a single data point and returns an entire data set (array)
    data = @main.updateStoredHistoricData(data)

    # this needs to correspond with the value in CSS so that the ratio is correct
    maxHeight = 50

    ## UPDATE
    @view.select(".stats .historic-stats").selectAll(".stat").data(data)
      .each (d) ->
        d3.select(@).selectAll(".foreground").data(d.data)
          .style("height", (d) -> "#{(d.value*maxHeight) - d.value}px")
          .attr("class", (d) -> "#{StatsUtils.getStatClasses(d.value)}")

    ## CREATE

    # historic stat container
    @view.select(".stats .historic-stats").selectAll("div").data(data)
      .enter()
      .append("div").attr(class: "stat")
        .each (d) ->

          # historic stats
          statEnter = d3.select(@).selectAll("div").data(d.data)
            .enter().append("div").attr(class: "value")
          statEnter.append("div")
            .style("height", (d) -> "#{(d.value*maxHeight) - d.value}px")
            .attr("class", (d) -> "#{StatsUtils.getStatClasses(d.value)}")
          statEnter.append("div").attr(class: "background")

  # we need to populate the component with an initial set of empty data
  _seedData: () ->
    @updateLiveStats()
    @updateHistoricStats()

  # publish that we're interested in live and historic updates
  _subscribeToUpdates: () ->

    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      entity         : @options.entity
      entityId       : @options.entityId
      metrics        : @options.metrics
      callback       : @updateLiveStats
      uid            : @main.uid
    }

    PubSub.publish 'STATS.SUBSCRIBE.HISTORIC', {
      start          : @options.start
      stop           : @options.stop
      entity         : @options.entity
      entityId       : @options.entityId
      metrics        : @options.metrics
      callback       : @updateHistoricStats
    }
