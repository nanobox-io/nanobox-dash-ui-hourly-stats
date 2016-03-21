StatsUtils = require 'misc/stats-utils'
MicroView  = require 'views/micro-view'
StripView  = require 'views/strip-view'

class HourlyStats

  constructor: (@$el, @viewId) ->
    shadowIcons = new pxicons.ShadowIcons()

  setState : (state) ->
    switch state
      when "micro" then @component = new MicroView @$el
      when "strip" then @component = new StripView @$el

  initStats : (statTypes, thresholds) ->
    StatsUtils.setTypes statTypes
    StatsUtils.setThresholds thresholds

  # ------------ API

  updateLiveStats : (data) -> @component.updateLiveStats data
  updateHistoricStat : (metric, data) -> @component.updateHistoricStats metric, data

  build : () -> @setState @viewId

  # ------------ Constants

  @micro : "micro"
  @strip : "strip"


window.nanobox ||= {}
nanobox.HourlyStats = HourlyStats
