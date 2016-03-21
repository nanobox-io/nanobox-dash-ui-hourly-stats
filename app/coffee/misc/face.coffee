jadeFaceTemplate = require 'jade/face'

module.exports = class Face

  constructor: (@$el, @scalable) ->

  update : (temperature) ->
    return if @temperature == temperature
    @temperature = temperature
    @$el.empty()
    $face = $ jadeFaceTemplate( {temperature:temperature, scalable:@scalable } )
    @$el.append $face
    shadowIconsInstance.svgReplaceWithString pxSvgIconString, $face
