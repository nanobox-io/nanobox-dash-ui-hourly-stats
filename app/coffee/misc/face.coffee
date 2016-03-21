module.exports = class Face

  constructor: (@$el, @scalable) ->

  update : (temperature) ->
    return if @temperature == temperature
    @temperature = temperature
    @$el.empty()
    $face = $ jadeTemplate['face']( {temperature:temperature, scalable:@scalable } )
    @$el.append $face
    shadowIconsInstance.svgReplaceWithString pxSvgIconString, $face
