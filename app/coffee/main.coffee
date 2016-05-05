MicroView  = require 'views/micro-view'
StandardView  = require 'views/standard-view'
ExpandedView  = require 'views/expanded-view'

#
class HourlyStats

  # constructor
  constructor: (@$el, @options) ->

    # provide default data
    @stats = []
    for metric in @options.metrics
      @stats.push {metric: metric, value: 0}

    #
    shadowIcons = new pxicons.ShadowIcons()

  # build creates a new component based on the @view that is passed in when
  # instantiated
  build : () ->
    switch @options.view
      when "micro"    then @component = new MicroView @$el, @stats, @options.id
      when "standard" then @component = new StandardView @$el, @stats, @options.id
      when "expanded" then @component = new ExpandedView @$el, @stats, @options.id

#
window.nanobox ||= {}
nanobox.HourlyStats = HourlyStats
