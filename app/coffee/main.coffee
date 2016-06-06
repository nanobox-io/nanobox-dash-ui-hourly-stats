MicroView  = require 'views/micro-view'
StandardView  = require 'views/standard-view'
ExpandedView  = require 'views/expanded-view'

#
class HourlyStats

  # constructor
  constructor: (@$el, @options={}) ->

    # set defaults
    if !@options.metrics      then @options.metrics     = ["cpu", "ram", "swap", "disk"]
    if !@options.logsEnabled  then @options.logsEnabled = false
    if !@options.loglevel     then @options.logLevel    = "INFO"

    # provide default data
    @options.stats = []
    for metric in @options.metrics
      @options.stats.push {metric: metric, value: 0}

    #
    shadowIcons = new pxicons.ShadowIcons()

  # build creates a new component based on the @view that is passed in when
  # instantiated
  build : () ->
    switch @options.view
      when "micro"    then new MicroView @$el, @options
      when "standard" then new StandardView @$el, @options
      when "expanded" then new ExpandedView @$el, @options

#
window.nanobox ||= {}
nanobox.HourlyStats = HourlyStats
