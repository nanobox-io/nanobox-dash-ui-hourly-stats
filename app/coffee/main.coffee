MicroView  = require 'views/micro-view'
StandardView  = require 'views/standard-view'
ExpandedView  = require 'views/expanded-view'

#
class HourlyStats

  # constructor
  # @view    : The kind of view to show (micro, standard, expanded)
  # @el      : The jquery element to attach the stats to
  # @stats   : An array noting the stats we will be loading and their display order
  constructor: (@view, @$el, @id) ->

    # set default metrics; we'll need to do this same thing (provide default data)
    # when used in production
    @stats = [
      {metric: "cpu",  value: 0},
      {metric: "ram",  value: 0},
      {metric: "swap", value: 0},
      {metric: "disk", value: 0}
    ]

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
