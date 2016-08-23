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

    # create the slider and add toggle
    @slider ||= new Slider(@$node, @)
    @$node.find(".toggle-slider").click (e) =>
      console.log "CLICK!"
      @slider.open()

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

    # update timeline
    @timeline.selectAll(".time").data(timeline)
      .each (d)  ->

        thing = d3.select(@)

        diff = now.diff(d, "hours")

        #
        switch

          # one hour ago (if the date matches todays date); we need to catch this
          # before the mod
          when diff == 1 && d.date() == moment().date()
            thing.select(".hour").text("1hr")
            thing.select(".period").text("ago")

          # 24 hours from 1 hour ago (if the date matches yesterdays date); we need
          # to catch this before the mod
          when diff == 25 && d.date() == moment().subtract(1, "day").date()
            thing.select(".hour").text("24hrs")
            thing.select(".period").text("ago")

          # every 6 hours; we want the diff to be 1 because we're going from 1 hour
          # ago (not right now)
          else
            thing.select(".hour").text(d.format("h"))
            thing.select(".period").text(d.format("a"))

    ## CREATE

    #
    timeEnter = @timeline.selectAll("div").data(timeline)
      .enter()
        .append("div")
          .attr(class: "time")

      #
      .each (d) ->
        # group = d3.select(@)

        #
        diff = now.diff(d, "hours")

        # not really happy about this because 10 and 11 are just arbitrary numbers
        # that happen to make it work...
        # pos = (10*i+1)+11

        thing = d3.select(@)

        switch

          # one hour ago; we need to catch this before the mod
          when diff == 1
            thing.attr(class: "time primary")
            thing.append("div").text("1hr").attr(class: "hour")
            thing.append("div").text("ago").attr(class: "period")

          # 24 hours from 1 hour ago; we need to catch this before the mod
          when diff == 25
            thing.attr(class: "time primary")
            thing.append("div").text("24hrs").attr(class: "hour")
            thing.append("div").text("ago").attr(class: "period")

          # every 6 hours; we want the diff to be 1 because we're going from 1
          # hour ago (not right now)
          when diff % 6 == 1
            thing.attr(class: "time secondary")
            thing.append("div").text(d.format("h")).attr(class: "hour")
            thing.append("div").text(d.format("a")).attr(class: "period")
          else return

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
      .text (d) -> "#{Math.round(d.value*100)}%"
      .attr("class", (d) -> "percent color-temp #{StatsUtils.getTemperature(d.value)}")
    @view.select(".stats .metas").selectAll(".metric").data(data)
      .text (d) -> d.metric
      .attr("class", (d) -> "metric color-temp #{StatsUtils.getTemperature(d.value)}")

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
    metaEnter.append("div").attr(class: "percent")
      .text (d) -> "#{Math.round(d.value*100)}%"
      .attr("class", (d) -> "color-temp #{StatsUtils.getTemperature(d.value)}")
    metaEnter.append("div").attr(class: "metric")
      .text (d) -> d.metric
      .attr("class", (d) -> "color-temp #{StatsUtils.getTemperature(d.value)}")

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
  _subscribeToStatData : () ->

    #
    PubSub.publish 'STATS.SUBSCRIBE.LIVE', {
      start          : @options.start
      end            : @options.end
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
