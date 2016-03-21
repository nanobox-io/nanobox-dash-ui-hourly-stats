StatsUtils      = require 'misc/stats-utils'

module.exports = class HistoricalSmall

  constructor: (el) ->
    @svg    = d3.select(el).append("svg").attr
      width  : 200
      height : 32
      class  : "historicsvg small"

  update : (data) ->
    dataAr = []
    indexes = {}
    for key, val of data
      dataAr.push {metric:key, val:val, index:StatsUtils.getIndexOfMetric(key)}
      indexes[key] = dataAr.length - 1

    # Metric as a group...
    group = @svg.selectAll(".small")
      .data dataAr, (d)-> d.metric
      .enter()
      .append("g") # Add a group for positioning
      .attr
        transform : (d, i)-> "translate(0, #{ d.index * 9  })"

    # Each Hour...
    box = group.selectAll("rect")
      .data (d)-> d.val

    #  Add a box for each data element. Set dimensions / position
    box
      .enter()
      .append("rect")
      .attr
        width : 5
        height: 5
        x : (d, i) -> i * 8

    # Set the temperarure based on the value
    box.attr
      class: (d, i, j)=>
        StatsUtils.getTemperature d, dataAr[j].metric
