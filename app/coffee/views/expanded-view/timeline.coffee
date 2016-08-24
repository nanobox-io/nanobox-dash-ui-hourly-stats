module.exports = class Timeline

  #
  constructor : (@view) -> # do nothing...

  #
  updateData : (endDate) ->

    #
    now = moment()

    # build the 24 hour timeline; load them in backwards since the timeline is
    # displayed desc. from right to left. we go from 1 to 25 because we're trying
    # to calculate from 1 hour ago to 24 hours ago (from that hour) so we're showing
    # the first and last hour, which is the same, twice.
    data = []
    data.unshift moment(endDate).subtract(i, "hours") for i in [1..25]

    ## UPDATE

    #
    @view.selectAll(".time").data(data)
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
    @view.selectAll("div").data(data)
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
