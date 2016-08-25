face = require 'jade/face'

#
module.exports = class Face

  #
  temperature: "wait"

  #
  constructor: (@$el, @scalable) -> # do nothing...

  #
  update : (temp) ->

    # don't update if it's already showing the right temperature
    return if @temperature == temp

    @temperature = temp

    @$el.empty()
    $face = $ face( {temperature:temp, scalable:@scalable } )
    @$el.append $face
    castShadows $face
