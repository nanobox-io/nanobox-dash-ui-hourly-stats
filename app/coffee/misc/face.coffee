jadeFaceTemplate = require 'jade/face'

#
module.exports = class Face

  #
  temperature: "sleep"

  #
  constructor: (@$el, @scalable) ->

  #
  update : (temp) ->

    # don't update if it's already showing the right temperature
    return if @temperature == temp

    @temperature = temp

    @$el.empty()
    $face = $ jadeFaceTemplate( {temperature:temp, scalable:@scalable } )
    @$el.append $face
    shadowIconsInstance.svgReplaceWithString pxSvgIconString, $face
