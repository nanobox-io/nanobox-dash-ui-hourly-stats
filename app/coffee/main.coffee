StatsUtils = require 'misc/stats-utils'
MicroView  = require 'views/micro-view'
StripView  = require 'views/strip-view'

class HourlyStats

  ### Constructor:
  @el        : The jquery element to attach the stats to
  @viewKind  : The kind of view to show - micro, strip, etc..
  @statTypes : An array noting the stats we will be loading and their display order
  ###
  constructor: (@$el, @viewKind, statTypes=['cpu','ram','swap','disk']) ->
    @statTypes = {}

    # Add stat meta data into an array for later use
    # when creating labels and other tasks
    for stat, i in statTypes
      @statTypes[stat] =
        index    : i
        nickname : HourlyStats[stat].nickname
        name     : HourlyStats[stat].name

    shadowIcons = new pxicons.ShadowIcons()


  # ------------ API

  # Start the ball rolling
  build : () -> @setState @viewKind

  # Update all the live stats in one fell swoop, do we need to
  # break this out per metric like historical stats?
  updateLiveStats : (data) ->
    @component.updateLiveStats data

  # Update the data for a single metric of historical stats
  updateHistoricStat : (metric, data) ->
    @component.updateHistoricStat metric, data, @statTypes


  # ------------ Methods

  setState : (viewKind) ->
    switch viewKind
      when "micro" then @component = new MicroView @$el, @statTypes
      when "strip" then @component = new StripView @$el, @statTypes

  # ------------ Constants

  @micro : "micro"
  @strip : "strip"

  # List all of the stat types we'll ever display anywhere in the dashboard here:
  @cpu   : { nickname: "CPU",  name:"CPU Used" }
  @ram   : { nickname: "RAM",  name:"RAM Used" }
  @swap  : { nickname: "SWAP", name:"Swap Used" }
  @disk  : { nickname: "DISK", name:"Disk Used" }


window.nanobox ||= {}
nanobox.HourlyStats = HourlyStats
