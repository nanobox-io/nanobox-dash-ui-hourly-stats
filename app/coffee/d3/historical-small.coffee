StatsUtils      = require 'misc/stats-utils'

module.exports = class HistoricalSmall

  constructor: (el, @height, @vertPadding, @horizPadding=8) ->
    totalBars = 4
    @totalHeight = (@height * totalBars) + (@vertPadding*(totalBars-1))
    @svg = d3.select(el).append("svg").attr
      width  : 200
      height : @totalHeight
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
        transform : (d, i)=> "translate(0, #{ d.index * (@height+@vertPadding)  })"

    # Each Hour...
    box = group.selectAll("rect")
      .data (d)-> d.val

    #  Add a box for each data element. Set dimensions / position
    box
      .enter()
      .append("rect")
      .attr
        width : @height
        height: @height
        x : (d, i) => i * @horizPadding

    # Set the temperarure based on the value
    box.attr
      class: (d, i, j)=>
        StatsUtils.getTemperature d, dataAr[j].metric
