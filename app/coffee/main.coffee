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
