MicroView  = require 'views/micro-view'
StandardView  = require 'views/standard-view'
ExpandedView  = require 'views/expanded-view'

#
class HourlyStats

  #
  constructor: (@$el, @options={}) ->

    # set defaults
    if !@options.logsEnabled then @options.logsEnabled = false
    if !@options.loglevel then @options.logLevel = "INFO"
    if !@options.metrics then @options.metrics = ["cpu", "ram", "swap", "disk"]

    # provide default data
    @options.stats = []
    for metric in @options.metrics
      @options.stats.push {metric: metric, value: 0}

  # build creates a new component based on the @view that is passed in when
  # instantiated
  build : () ->
    view = switch @options.view
      when "micro"    then new MicroView @$el, @options
      when "standard" then new StandardView @$el, @options
      when "expanded" then new ExpandedView @$el, @options

    # 
    view.build()

#
window.nanobox ||= {}
nanobox.HourlyStats = HourlyStats
