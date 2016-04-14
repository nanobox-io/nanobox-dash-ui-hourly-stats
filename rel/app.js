var pxSvgIconString=pxSvgIconString||"";pxSvgIconString+='<g id="face-cool" data-size="22x22" class="hourly-stats-svg-svg ">	<g>		<circle class="st0" cx="10.533" cy="10.533" r="10.533"/></g>	<path class="st1" d="M3.856,13.935c1.242,2.43,3.762,4.097,6.678,4.097s5.436-1.667,6.676-4.097"/><circle class="st2" cx="17.615" cy="7.437" r="1.273"/><circle class="st2" cx="3.416" cy="7.437" r="1.273"/></g><g id="face-warm" data-size="22x22" class="hourly-stats-svg-svg ">	<g>		<circle class="st3" cx="10.533" cy="10.533" r="10.533"/></g>	<line class="st1" x1="5.024" y1="15.286" x2="16.091" y2="15.286"/><circle class="st2" cx="17.614" cy="7.437" r="1.273"/><circle class="st2" cx="3.416" cy="7.437" r="1.273"/></g><g id="face-hot" data-size="22x22" class="hourly-stats-svg-svg ">	<g>		<circle class="st4" cx="10.533" cy="10.533" r="10.533"/></g>	<path class="st1" d="M3.856,16.032c1.242-2.43,3.762-4.097,6.678-4.097s5.436,1.667,6.676,4.097"/><circle class="st2" cx="17.615" cy="7.437" r="1.273"/><circle class="st2" cx="3.416" cy="7.437" r="1.273"/></g>';var pxSvgIconString=pxSvgIconString||"";pxSvgIconString+="",function t(e,s,a){function i(n,c){if(!s[n]){if(!e[n]){var l="function"==typeof require&&require;if(!c&&l)return l(n,!0);if(r)return r(n,!0);var u=new Error("Cannot find module '"+n+"'");throw u.code="MODULE_NOT_FOUND",u}var d=s[n]={exports:{}};e[n][0].call(d.exports,function(t){var s=e[n][1][t];return i(s?s:t)},d,d.exports,t,e,s,a)}return s[n].exports}for(var r="function"==typeof require&&require,n=0;n<a.length;n++)i(a[n]);return i}({1:[function(t,e,s){var a,i;i=t("misc/stats-utils"),e.exports=a=function(){function t(t,e){var s;this.$target=t,s=this,this.svg=d3.select(this.$target.get(0)).append("svg").attr({height:e.length*(s.barSize+e.length)})}return t.prototype.barSize=5,t.prototype.update=function(t){var e,s;return s=this,e=this.svg.selectAll("g").data(t),e.enter().append("svg:g").each(function(t,e){var a,r;return r=d3.select(this).attr({"class":t.metric,transform:"translate(0, "+2*s.barSize*e+")"}),a=r.selectAll("rect").data(t.data).enter().append("svg:rect").each(function(t,e){var a;return a=d3.select(this).attr({x:s.barSize*(1.25*e),width:s.barSize,height:s.barSize,"class":i.getTemperature(t.value)})})}),e.data(t).each(function(t){var e;return e=s.svg.select("."+t.metric).selectAll("rect").data(t.data).each(function(t){return d3.select(this).attr({"class":i.getTemperature(t.value)})})})},t}()},{"misc/stats-utils":5}],2:[function(t,e,s){var a,i;i=t("misc/stats-utils"),e.exports=a=function(){function t(t,e){var s,a;this.$target=t,a=this,this.svg=d3.select(this.$target.get(0)).append("svg").attr({height:e.length*(a.barHeight+e.length)}),s=this.svg.append("svg:g"),this.stats=this.svg.append("svg:g"),s.selectAll("rect").data(e).enter().append("svg:rect").each(function(t,e){var s;return s=d3.select(this).attr({width:a.maxWidth,height:a.barHeight,"class":"background",transform:"translate(0, "+2*a.barHeight*e+")"})})}return t.prototype.maxWidth=40,t.prototype.barHeight=5,t.prototype.update=function(t){var e,s;return s=this,e=this.stats.selectAll("rect").data(t),e.enter().append("svg:rect").each(function(t,e){var a;return a=d3.select(this).attr({width:s.maxWidth,height:s.barHeight,"class":"stat "+t.metric,transform:"translate(0, "+2*s.barHeight*e+")"})}),e.data(t).each(function(t){var e;return e=d3.select(this).transition().delay(0).duration(500).attr({width:t.value*s.maxWidth-t.value,"class":i.getTemperature(t.value)})})},t}()},{"misc/stats-utils":5}],3:[function(t,e,s){var a,i,r,n;r=t("views/micro-view"),n=t("views/standard-view"),a=t("views/expanded-view"),i=function(){function t(t,e,s){var a;this.view=t,this.$el=e,this.id=s,this.stats=[{metric:"cpu",value:0},{metric:"ram",value:0},{metric:"swap",value:0},{metric:"disk",value:0}],a=new pxicons.ShadowIcons}return t.prototype.build=function(){switch(this.view){case"micro":return this.component=new r(this.$el,this.id,this.stats);case"standard":return this.component=new n(this.$el,this.id,this.stats);case"expanded":return this.component=new a(this.$el,this.id,this.stats)}},t}(),window.nanobox||(window.nanobox={}),nanobox.HourlyStats=i},{"views/expanded-view":6,"views/micro-view":7,"views/standard-view":8}],4:[function(t,e,s){var a,i;i=t("jade/face"),e.exports=a=function(){function t(t,e){this.$el=t,this.scalable=e}return t.prototype.temperature="sleep",t.prototype.update=function(t){var e;if(this.temperature!==t)return this.temperature=t,this.$el.empty(),e=$(i({temperature:t,scalable:this.scalable})),this.$el.append(e),shadowIconsInstance.svgReplaceWithString(pxSvgIconString,e)},t}()},{"jade/face":10}],5:[function(t,e,s){var a;e.exports=a=function(){function t(){}return t.getTemperature=function(t){return 0>t?"sleep":.75>t?"cool":.9>t?"warm":"hot"},t.getOverallTemperature=function(t){var e,s,a,i;for(s=0,a=0,i=t.length;i>a;a++)e=t[a],e.value>s&&(s=e.value);return this.getTemperature(s)},t}()},{}],6:[function(t,e,s){var a,i,r,n,c,l,u=function(t,e){return function(){return t.apply(e,arguments)}};i=t("misc/face"),r=t("d3/historical-stats"),n=t("d3/live-stats"),c=t("misc/stats-utils"),l=t("jade/expanded-view"),e.exports=a=function(){function t(t,e,s){this.stats=s,this.updateHistoricStats=u(this.updateHistoricStats,this),this.updateLiveStats=u(this.updateLiveStats,this),this.$node=$(l({stats:this.stats})),t.append(this.$node),this.build(),this.subscribeToStatData(e)}return t.prototype.build=function(){return this._buildHistoricalStats(),this._buildLiveStats(),this.face=new i($(".face",this.$node),"true")},t.prototype._buildHistoricalStats=function(){return this.historicalStats=d3.select($(".historical-stats",this.$node).get(0)).append("svg").attr({height:this.stats.length*(40+this.stats.length)})},t.prototype._buildLiveStats=function(){return this.liveStats=d3.select($(".live-stats",this.$node).get(0)).append("svg").attr({height:this.stats.length*(40+this.stats.length)})},t.prototype.updateLiveStats=function(t){var e,s,a,i,r,n;for(r=this,e=this.liveStats.selectAll("rect").data(t),e.enter().append("svg:rect").each(function(t,e){var s;return s=d3.select(this).attr({width:10,height:40,"class":"stat "+t.metric,transform:"translate(0, "+50*e+")"})}),e.data(t).each(function(t){var e;return e=d3.select(this).transition().delay(0).duration(500).attr({height:40*t.value-t.value,"class":c.getTemperature(t.value)})}),a=0,i=t.length;i>a;a++)s=t[a],n=$(".stats",this.$node).find("."+s.metric),n.removeClass("sleep cold warm hot").addClass(c.getTemperature(s.value)),n.find(".percent").text(Math.round(100*s.value)+"%");return this.face.update(c.getOverallTemperature(t))},t.prototype.updateHistoricStats=function(t){var e,s;return s=this,e=this.historicalStats.selectAll("g").data(t),e.enter().append("svg:g").each(function(t,e){var s,a;return a=d3.select(this).attr({"class":t.metric,transform:"translate(0, "+50*e+")"}),s=a.selectAll("rect").data(t.data).enter().append("svg:rect").each(function(t,e){var s;return s=d3.select(this).attr({x:5*(1.25*e),width:5,height:40,"class":c.getTemperature(t.value)})})}),e.data(t).each(function(t){var e;return e=s.historicalStats.select("."+t.metric).selectAll("rect").data(t.data).each(function(t){return d3.select(this).transition().delay(0).duration(500).attr({height:40*t.value-t.value,"class":c.getTemperature(t.value)})})})},t.prototype.subscribeToStatData=function(t){return PubSub.publish("STATS.SUBSCRIBE.LIVE",{statProviderId:t,callback:this.updateLiveStats}),PubSub.publish("STATS.SUBSCRIBE.HISTORIC",{statProviderId:t,callback:this.updateHistoricStats})},t}()},{"d3/historical-stats":1,"d3/live-stats":2,"jade/expanded-view":9,"misc/face":4,"misc/stats-utils":5}],7:[function(t,e,s){var a,i,r,n,c,l=function(t,e){return function(){return t.apply(e,arguments)}};a=t("misc/face"),i=t("d3/live-stats"),n=t("misc/stats-utils"),c=t("jade/micro-view"),e.exports=r=function(){function t(t,e,s){this.stats=s,this.updateLiveStats=l(this.updateLiveStats,this),this.$node=$(c({labels:this.stats})),t.append(this.$node),this.build(),this.subscribeToStatData(e)}return t.prototype.build=function(){return this.liveStats=new i($(".live-stats",this.$node),this.stats),this.face=new a($(".face",this.$node),"true")},t.prototype.updateLiveStats=function(t){return this.face.update(n.getOverallTemperature(t)),this.liveStats.update(t)},t.prototype.subscribeToStatData=function(t){return PubSub.publish("STATS.SUBSCRIBE.LIVE",{statProviderId:t,callback:this.updateLiveStats})},t}()},{"d3/live-stats":2,"jade/micro-view":11,"misc/face":4,"misc/stats-utils":5}],8:[function(t,e,s){var a,i,r,n,c,l,u=function(t,e){return function(){return t.apply(e,arguments)}};a=t("misc/face"),i=t("d3/historical-stats"),r=t("d3/live-stats"),c=t("misc/stats-utils"),l=t("jade/standard-view"),e.exports=n=function(){function t(t,e,s){this.stats=s,this.updateHistoricStats=u(this.updateHistoricStats,this),this.updateLiveStats=u(this.updateLiveStats,this),this.$node=$(l({stats:this.stats})),t.append(this.$node),this.build(),this.subscribeToStatData(e)}return t.prototype.build=function(){return this.histroicalStats=new i($(".historical-stats",this.$node),this.stats),this.liveStats=new r($(".live-stats",this.$node),this.stats),this.face=new a($(".face",this.$node),"true")},t.prototype.updateLiveStats=function(t){var e,s,a;for(this.liveStats.update(t),s=0,a=t.length;a>s;s++)e=t[s],$(".percentages",this.$node).find("."+e.metric).text(Math.round(100*e.value)+"%");return this.face.update(c.getOverallTemperature(t))},t.prototype.updateHistoricStats=function(t){return this.histroicalStats.update(t)},t.prototype.subscribeToStatData=function(t){return PubSub.publish("STATS.SUBSCRIBE.LIVE",{statProviderId:t,callback:this.updateLiveStats}),PubSub.publish("STATS.SUBSCRIBE.HISTORIC",{statProviderId:t,callback:this.updateHistoricStats})},t}()},{"d3/historical-stats":1,"d3/live-stats":2,"jade/standard-view":12,"misc/face":4,"misc/stats-utils":5}],9:[function(t,e,s){e.exports=function(t){var e,s=[],a=t||{};return function(t,a){s.push('<div class="expanded-view"><div class="historical-stats"></div><div class="live-stats"></div><div class="stats">'),function(){var a=t;if("number"==typeof a.length)for(var i=0,r=a.length;r>i;i++){var n=a[i];s.push("<div"+jade.cls(["stat",n.metric],[null,!0])+'><div class="percent">'+jade.escape(null==(e=n.value)?"":e)+'%</div><div class="label">'+jade.escape(null==(e=n.metric)?"":e)+"</div></div>")}else{var r=0;for(var i in a){r++;var n=a[i];s.push("<div"+jade.cls(["stat",n.metric],[null,!0])+'><div class="percent">'+jade.escape(null==(e=n.value)?"":e)+'%</div><div class="label">'+jade.escape(null==(e=n.metric)?"":e)+"</div></div>")}}}.call(this),s.push('</div><div class="face"></div></div>')}.call(this,"stats"in a?a.stats:"undefined"!=typeof stats?stats:void 0,"undefined"in a?a.undefined:void 0),s.join("")}},{}],10:[function(t,e,s){e.exports=function(t){var e=[],s=t||{};return function(t,s){e.push('<div class="shadow-parent"><img'+jade.attr("scalable",""+t,!0,!1)+jade.attr("data-src","face-"+s,!0,!1)+' class="shadow-icon"/></div>')}.call(this,"scalable"in s?s.scalable:"undefined"!=typeof scalable?scalable:void 0,"temperature"in s?s.temperature:"undefined"!=typeof temperature?temperature:void 0),e.join("")}},{}],11:[function(t,e,s){e.exports=function(t){var e,s=[],a=t||{};return function(t,a){s.push('<div class="micro-view"><div class="labels">'),function(){var a=t;if("number"==typeof a.length)for(var i=0,r=a.length;r>i;i++){var n=a[i];s.push('<div class="label">'+jade.escape(null==(e=n.metric)?"":e)+"</div>")}else{var r=0;for(var i in a){r++;var n=a[i];s.push('<div class="label">'+jade.escape(null==(e=n.metric)?"":e)+"</div>")}}}.call(this),s.push('</div><div class="live-stats"></div><div class="face"></div></div>')}.call(this,"labels"in a?a.labels:"undefined"!=typeof labels?labels:void 0,"undefined"in a?a.undefined:void 0),s.join("")}},{}],12:[function(t,e,s){e.exports=function(t){var e,s=[],a=t||{};return function(t,a){s.push('<div class="standard-view"><div class="labels">'),function(){var a=t;if("number"==typeof a.length)for(var i=0,r=a.length;r>i;i++){var n=a[i];s.push('<div class="label">'+jade.escape(null==(e=n.metric)?"":e)+"</div>")}else{var r=0;for(var i in a){r++;var n=a[i];s.push('<div class="label">'+jade.escape(null==(e=n.metric)?"":e)+"</div>")}}}.call(this),s.push('</div><div class="historical-stats"></div><div class="divider"></div><div class="live-stats"></div><div class="percentages">'),function(){var a=t;if("number"==typeof a.length)for(var i=0,r=a.length;r>i;i++){var n=a[i];s.push("<div"+jade.cls(["percent",n.metric],[null,!0])+">"+jade.escape(null==(e=n.value)?"":e)+"%</div>")}else{var r=0;for(var i in a){r++;var n=a[i];s.push("<div"+jade.cls(["percent",n.metric],[null,!0])+">"+jade.escape(null==(e=n.value)?"":e)+"%</div>")}}}.call(this),s.push('</div><div class="face"></div></div>')}.call(this,"stats"in a?a.stats:"undefined"!=typeof stats?stats:void 0,"undefined"in a?a.undefined:void 0),s.join("")}},{}]},{},[3]);