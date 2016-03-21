StatsUtils     = require 'misc/stats-utils'

module.exports = class HorizLiveGraphs

  ###
    holder      : Element to attach svg to
    barWidth    : Width of the graph bar
    barHeight   : Height of the graph bar
    padding     : Space between the bars
    totalHeight : Total Height of the svg
  ###
  constructor: ( options ) ->
    options.padding     || = 3
    options.totalHeight || = 30
    options.cssClass    || = ""


    @width   = options.barWidth
    @height  = options.barHeight
    @padding = options.padding

    @svg = d3.select( options.holder ).append("svg").attr
      width  : options.barWidth
      height : options.totalHeight
      class  : "livesvg #{options.cssClass}"

  update : (data) ->
    that = this
    dataAr = []
    for key, val of data
      if !val? then val = -1
      dataAr.push { metric:key, val:val }

    group = @svg.selectAll("g")
      .data dataAr

    group
      .enter()
        # Create a group to hold all the sub elements
        .append("g")
        .attr
          # Position each group
          "transform" : (d,i)-> "translate(0,#{ i * (that.height + that.padding )})"
        .each (d, inc)->
          # Create all the blocks...
          @trackWidth  = that.width
          @trackHeight = that.height
          # Background Bar
          d3.select(this).append("svg:rect").attr
            width  : @trackWidth
            height : @trackHeight
            class  : "bg"
          # Colored Bar
          d3.select(this).append("svg:rect").attr
            width  : @trackWidth
            height : @trackHeight
            id     : "colored"
          # # Middle Stripe
          # d3.select(this).append("svg:rect").attr
          #   width  : @trackWidth
          #   height : 1
          #   "y"    : 2
          #   class  : "lines"
          # # Create the White space between the Boxes
          # i = 0
          # while i++ < totalBoxes
          #   d3.select(this).append("svg:rect").attr
          #     x      : 3 * i - 1
          #     width  : 1
          #     height : @trackHeight
          #     class  : "lines"

          # Add the trailing percentage text..
          # d3.select(this).append("text").attr
          #   "x" : totalBoxes*3+3
          #   "y" : 6
    # UPDATES #
    group
      .each (d, inc) ->
        color = StatsUtils.getTemperature d.val, d.metric
        #
        # txt = d3.select(this).select("text")
        # if d.val == -1
        #   val = 0
        #   txt.text "sleep"
        # else
        #   val = d.val
        #   txt.text(Math.round(d.val*100)+"%")

        if d.val == -1
          perc = 0
        else if d.val < 0.05  # If was 0 because of low usage, not because it was shut down
          perc = 0.05
        else if d.val < 1
          perc = d.val.toFixed(4)
        else
          perc = 1

        bar = d3.select(this).select("#colored")
        bar.transition()
          .duration( 800 )
          .attr
            # toFixed removed scientific notation
            width : @trackWidth * perc
            class : color
