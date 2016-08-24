StatsUtils  = require 'misc/stats-utils'
Slider      = require 'views/expanded-view/slider'

#
view = require 'jade/expanded-view'

#
module.exports = class ExpandedView

  #
  constructor: ($el, @options={}, @main) ->
    @$node = $(view({classes: @options.classes}))
    $el.append @$node

  #
  build : () ->

    @view = d3.select($(".expanded-view", @$node).get(0))
    @_subscribeToStatData()

    # add timeline; we need to add a little to the width to account for the beginning
    # and ending values which can't get cut off
    @timeline = d3.select($(".timeline", @$node).get(0))

    # add the timeline and set to "right now"
    @updateTimeline(moment())

    # NOTE: this will be replaced with actual data that is either passed in (most
    # likely) or fetched at this point
    # test data
    @data = []
    for metric in ["cpu", "ram", "swap", "disk"]
      m = {metric: metric, data: []}

      # we only want 7 days worth of data (not 8) because one of the days will
      # be split across 2 days (making 8)
      for stat in [0...168]
        m.data.push {date: moment().subtract(stat, "hours"), value: ((Math.random() * 1.00) + 0.00)}
      @data.push m

    # create the slider and add toggle
    @slider ||= new Slider(@$node, @)
    @$node.find(".toggle-slider").click (e) => @slider.open(@data)

  #
  updateTimeline : (endDate) ->

    #
    now = moment()

    # build the 24 hour timeline; load them in backwards since the timeline is
    # displayed desc. from right to left. we go from 1 to 25 because we're trying
    # to calculate from 1 hour ago to 24 hours ago (from that hour) so we're showing
    # the first and last hour, which is the same, twice.
    timeline = []
    for i in [1..25]
      timeline.unshift moment(endDate).subtract(i, "hours")

    ## UPDATE

    #
    @timeline.selectAll(".time").data(timeline)
      .each (d)  ->

        #
        diff = now.diff(d, "hours")

        #
        switch

          # one hour ago (if the date matches todays date); we need to catch this
          # before the mod
          when diff == 1 && d.date() == moment().date()
            [hour, period] = ["1hr", "ago"]

          # 24 hours from 1 hour ago (if the date matches yesterdays date); we need
          # to catch this before the mod
          when diff == 25 && d.date() == moment().subtract(1, "day").date()
            [hour, period] = ["24hrs", "ago"]

          # every 6 hours; we want the diff to be 1 because we're going from 1 hour
          # ago (not right now)
          else
            [hour, period] = [d.format("h"), d.format("a")]

        #
        d3.select(@).select(".hour").text(hour)
        d3.select(@).select(".period").text(period)

    ## CREATE

    #
    timeEnter = @timeline.selectAll("div").data(timeline)
      .enter()
        .append("div")
          .attr(class: "time")
      .each (d) ->

        #
        diff = now.diff(d, "hours")

        #
        classes = ["time"]

        #
        switch

          # one hour ago; we need to catch this before the mod
          when diff == 1
            classes.push "primary"
            [hour, period] = ["1hr", "ago"]

          # 24 hours from 1 hour ago; we need to catch this before the mod
          when diff == 25
            classes.push "primary"
            [hour, period] = ["24hrs", "ago"]

          # every 6 hours; we want the diff to be 1 because we're going from 1
          # hour ago (not right now)
          when diff % 6 == 1
            classes.push "secondary"
            [hour, period] = [d.format("h"), d.format("a")]
          else return

        #
        d3.select(@).attr(class: classes.join(" "))
        d3.select(@).append("div").text(hour).attr(class: "hour")
        d3.select(@).append("div").text(period).attr(class: "period")

  #
  updateLiveStats : (data) =>

    #
    data = @main.updateStoredLiveStats(data)

    # this needs to correspond with the value in CSS so that the ratio is correct
    maxHeight = 50

    ## UPDATE

    # values
    @view.select(".stats .current-stats").selectAll(".foreground").data(data)
      .style("height", (d) -> "#{(d.value*maxHeight) - d.value}px")
      .attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")

    # metas; percents & metrics
    @view.select(".stats .metas").selectAll(".percent").data(data)
      .attr("class", (d) -> "percent color-temp #{StatsUtils.getTemperature(d.value)}")
      .text (d) -> "#{Math.round(d.value*100)}%"
    @view.select(".stats .metas").selectAll(".metric").data(data)
      .attr("class", (d) -> "metric color-temp #{StatsUtils.getTemperature(d.value)}")
      .text (d) -> d.metric

    ## CREATE

    # values
    valueEnter = @view.select(".stats .current-stats").selectAll("div").data(data)
      .enter().append("div").attr(class: "value")
    valueEnter.append("div")
      .style("height", (d) -> "#{(d.value*maxHeight) - d.value}px")
      .attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")
    valueEnter.append("div").attr(class: "background")

    # metas; percents & metrcis
    metaEnter = @view.select(".stats .metas").selectAll("div").data(data)
      .enter().append("div").attr(class: "meta")
    metaEnter.append("div")
      .attr("class", (d) -> "percent color-temp #{StatsUtils.getTemperature(d.value)}")
      .text (d) -> "#{Math.round(d.value*100)}%"
    metaEnter.append("div")
      .attr("class", (d) -> "metric color-temp #{StatsUtils.getTemperature(d.value)}")
      .text (d) -> d.metric

  #
  updateLiveCollection : (dataArray) ->
    @updateLiveStats(data) for data in dataArray

  #
  updateHistoricStats : (data) =>

    #
    data = @main.updateStoredHistoricalStats(data)

    # this needs to correspond with the value in CSS so that the ratio is correct
    maxHeight = 50

    ## UPDATE

    @view.select(".stats .historic-stats").selectAll(".stat").data(data)
      .each (d) ->
        d3.select(@).selectAll(".foreground").data(d.data)
          .style("height", (d) -> "#{(d.value*maxHeight) - d.value}px")
          .attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")

    ## CREATE

    # historic stat container
    @view.select(".stats .historic-stats").selectAll("div").data(data)
      .enter()
        .append("div").attr(class: "stat")
          .each (d) ->

            # historic stats
            statEnter = d3.select(@).selectAll("div").data(d.data)
              .enter()
                .append("div").attr(class: "value")
            statEnter.append("div")
              .style("height", (d) -> "#{(d.value*maxHeight) - d.value}px")
              .attr("class", (d) -> "foreground background-temp #{StatsUtils.getTemperature(d.value)}")
            statEnter.append("div").attr(class: "background")

  #
  updateHistoricCollection : (dataArray) ->
    @updateHistoricStats(data) for data in dataArray

  #
  _subscribeToStatData : () ->

    #
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      entity         : @options.entity
      entityId       : @options.entityId
      metrics        : @options.metrics
      callback       : @updateLiveStats
    }

    #
    PubSub.publish 'STATS.SUBSCRIBE.HISTORIC', {
      start          : @options.start
      end            : @options.end
      entity         : @options.entity
      entityId       : @options.entityId
      metrics        : @options.metrics
      callback       : @updateHistoricStats
    }
