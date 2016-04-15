MicroView  = require 'views/micro-view'
StandardView  = require 'views/standard-view'
ExpandedView  = require 'views/expanded-view'

#
class HourlyStats

  # constructor
  constructor: (@view, @$el, @id, metrics=["cpu", "ram", "swap", "disk"]) ->

    # provide default data
    @stats = []
    for metric in metrics
      @stats.push {metric: metric, value: 0}

    # provide default data
    # @expandedStats = []
    # for metric in metrics
    #   data = []
    #   for hour in [0...24]
    #     data.push {time: "#{("0" + hour).slice(-2)}", value: 0}
    #   @expandedStats.push {metric: metric, data: data}

    #
    shadowIcons = new pxicons.ShadowIcons()

  # build creates a new component based on the @view that is passed in when
  # instantiated
  build : () ->
    switch @view
      when "micro"    then @component = new MicroView @$el, @id, @stats
      when "standard" then @component = new StandardView @$el, @id, @stats
      when "expanded" then @component = new ExpandedView @$el, @id, @stats

#
window.nanobox ||= {}
nanobox.HourlyStats = HourlyStats
