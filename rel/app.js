var pxSvgIconString=pxSvgIconString||"";pxSvgIconString+='<g id="face-cool" data-size="22x22" class="hourly-stats-svg-svg ">	<g>		<circle class="st0" cx="10.533" cy="10.533" r="10.533"/></g>	<path class="st1" d="M3.856,13.935c1.242,2.43,3.762,4.097,6.678,4.097s5.436-1.667,6.676-4.097"/><circle class="st2" cx="17.615" cy="7.437" r="1.273"/><circle class="st2" cx="3.416" cy="7.437" r="1.273"/></g><g id="face-warm" data-size="22x22" class="hourly-stats-svg-svg ">	<g>		<circle class="st3" cx="10.533" cy="10.533" r="10.533"/></g>	<line class="st1" x1="5.024" y1="15.286" x2="16.091" y2="15.286"/><circle class="st2" cx="17.614" cy="7.437" r="1.273"/><circle class="st2" cx="3.416" cy="7.437" r="1.273"/></g><g id="face-hot" data-size="22x22" class="hourly-stats-svg-svg ">	<g>		<circle class="st4" cx="10.533" cy="10.533" r="10.533"/></g>	<path class="st1" d="M3.856,16.032c1.242-2.43,3.762-4.097,6.678-4.097s5.436,1.667,6.676,4.097"/><circle class="st2" cx="17.615" cy="7.437" r="1.273"/><circle class="st2" cx="3.416" cy="7.437" r="1.273"/></g>';var pxSvgIconString=pxSvgIconString||"";pxSvgIconString+="",function t(e,i,s){function r(a,o){if(!i[a]){if(!e[a]){var c="function"==typeof require&&require;if(!o&&c)return c(a,!0);if(n)return n(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var l=i[a]={exports:{}};e[a][0].call(l.exports,function(t){var i=e[a][1][t];return r(i?i:t)},l,l.exports,t,e,i,s)}return i[a].exports}for(var n="function"==typeof require&&require,a=0;a<s.length;a++)r(s[a]);return r}({1:[function(t,e,i){var s,r;r=t("misc/stats-utils"),e.exports=s=function(){function t(t,e,i,s){var r;this.height=e,this.vertPadding=i,this.horizPadding=null!=s?s:8,r=4,this.totalHeight=this.height*r+this.vertPadding*(r-1),this.svg=d3.select(t).append("svg").attr({width:200,height:this.totalHeight,"class":"historicsvg small"})}return t.prototype.update=function(t,e){var i,s,n,a,o,c;s=[],a={};for(o in t)c=t[o],s.push({metric:o,val:c,index:e[o].index}),a[o]=s.length-1;return n=this.svg.selectAll(".small").data(s,function(t){return t.metric}).enter().append("g").attr({transform:function(t){return function(e,i){return"translate(0, "+e.index*(t.height+t.vertPadding)+")"}}(this)}),i=n.selectAll("rect").data(function(t){return t.val}),i.enter().append("rect").attr({width:this.height,height:this.height,x:function(t){return function(e,i){return i*t.horizPadding}}(this)}),i.attr({"class":function(t){return function(t,e,i){return r.getTemperature(t,s[i].metric)}}(this)})},t}()},{"misc/stats-utils":5}],2:[function(t,e,i){var s,r;r=t("misc/stats-utils"),e.exports=s=function(){function t(t){t.padding||(t.padding=3),t.totalHeight||(t.totalHeight=30),t.cssClass||(t.cssClass=""),this.width=t.barWidth,this.height=t.barHeight,this.padding=t.padding,this.svg=d3.select(t.holder).append("svg").attr({width:t.barWidth,height:t.totalHeight,"class":"livesvg "+t.cssClass})}return t.prototype.update=function(t){var e,i,s,n,a;n=this,e=[];for(s in t)a=t[s],null==a&&(a=-1),e.push({metric:s,val:a});return i=this.svg.selectAll("g").data(e),i.enter().append("g").attr({transform:function(t,e){return"translate(0,"+e*(n.height+n.padding)+")"}}).each(function(t,e){return this.trackWidth=n.width,this.trackHeight=n.height,d3.select(this).append("svg:rect").attr({width:this.trackWidth,height:this.trackHeight,"class":"bg"}),d3.select(this).append("svg:rect").attr({width:this.trackWidth,height:this.trackHeight,id:"colored"})}),i.each(function(t,e){var i,s,n;return s=r.getTemperature(t.val,t.metric),n=-1===t.val?0:t.val<.05?.05:t.val<1?t.val.toFixed(4):1,i=d3.select(this).select("#colored"),i.transition().duration(800).attr({width:this.trackWidth*n,"class":s})})},t}()},{"misc/stats-utils":5}],3:[function(t,e,i){var s,r,n,a;n=t("misc/stats-utils"),r=t("views/micro-view"),a=t("views/strip-view"),s=function(){function t(e,i,s){var r,n,a,o,c;for(this.$el=e,this.viewKind=i,null==s&&(s=["cpu","ram","swap","disk"]),this.statTypes={},r=n=0,a=s.length;a>n;r=++n)c=s[r],this.statTypes[c]={index:r,nickname:t[c].nickname,name:t[c].name};o=new pxicons.ShadowIcons}return t.prototype.build=function(){return this.setState(this.viewKind)},t.prototype.updateLiveStats=function(t){return this.component.updateLiveStats(t)},t.prototype.updateHistoricStat=function(t,e){return this.component.updateHistoricStat(t,e,this.statTypes)},t.prototype.setState=function(t){switch(t){case"micro":return this.component=new r(this.$el,this.statTypes);case"strip":return this.component=new a(this.$el,this.statTypes)}},t.micro="micro",t.strip="strip",t.cpu={nickname:"CPU",name:"CPU Used"},t.ram={nickname:"RAM",name:"RAM Used"},t.swap={nickname:"SWAP",name:"Swap Used"},t.disk={nickname:"DISK",name:"Disk Used"},t}(),window.nanobox||(window.nanobox={}),nanobox.HourlyStats=s},{"misc/stats-utils":5,"views/micro-view":6,"views/strip-view":7}],4:[function(t,e,i){var s,r;r=t("jade/face"),e.exports=s=function(){function t(t,e){this.$el=t,this.scalable=e}return t.prototype.update=function(t){var e;if(this.temperature!==t)return this.temperature=t,this.$el.empty(),e=$(r({temperature:t,scalable:this.scalable})),this.$el.append(e),shadowIconsInstance.svgReplaceWithString(pxSvgIconString,e)},t}()},{"jade/face":9}],5:[function(t,e,i){var s,r=[].indexOf||function(t){for(var e=0,i=this.length;i>e;e++)if(e in this&&this[e]===t)return e;return-1};e.exports=s=function(){function t(){}return t.setThresholds=function(e){return null==e&&(e={}),t.thresholds=e},t.setTypes=function(e){return null==e&&(e=[]),t.statTypes=e},t.getIndexOfMetric=function(e){var i,s,r,n,a;for(n=t.statTypes,i=s=0,r=n.length;r>s;i=++s)if(a=n[i],e===a.id)return i;return-1},t.getTemperature=function(t,e){return 0>t?"sleep":.75>t?"cool":.9>t?"warm":"hot"},t.getOverallTemperature=function(t){var e,i,s,n,a,o,c,u;e=[];for(s in t)u=t[s],"swap"!==s&&(isNaN(u)||e.push(this.getTemperature(u,s)));if(!e.length)return null;for(a="sleep",o=["cool","warm","hot"],i=0,n=o.length;n>i;i++)c=o[i],r.call(e,c)>=0&&(a=c);return a},t.getTimeArray=function(t,e){var i,s,r,n;for(null==e&&(e=25),n=[],i=s=0,r=e;r>=0?r>s:s>r;i=r>=0?++s:--s)n.unshift(this.getTimeObject(t--)),-1===t&&(t=23);return n},t.getTimeObject=function(t){switch(!1){case 0!==t:return{hour:12,period:"am",military:t};case!(12>t):return{hour:t,period:"am",military:t};case 12!==t:return{hour:12,period:"pm",military:t};case!(t>12):return{hour:t-12,period:"pm",military:t}}},t.padNumber=function(t,e){var i;for(i=""+t;i.length<e;)i="0"+i;return i},t.getTimeStampsFromPercentage=function(t){var e,i,s;return t=1-t,s=this.getLastWholeHour(),i=s.setHours(s.getHours()-Math.round(144*t)),e=s.setHours(s.getHours()-24),[e,i]},t.get24hrRangeStartingLastHour=function(){return this.getTimeStampsFromPercentage(1)},t.getLastWholeHour=function(){var t;return t=new Date,t.setHours(t.getHours()-1),t.setMinutes(0),t.setSeconds(0),t.setMilliseconds(0),t},t.getNextHour=function(t){var e;return e=t+1,e>12?e-12:e},t.normalizeHistoricalData=function(t,e){var i,s,r,n,a,o,c,u,l,d,h,p;for(u=new Date,u.setHours(u.getHours()-1),u.setMinutes(0),u.setSeconds(0),a=Math.round((u-new Date(e[0]))/36e5),n=Math.round((u-new Date(e[1]))/36e5),h=a,r=n,i=[],o=c=l=r,d=h;d>=c;o=c+=1)null!=t[o]&&(s=t[o],p=new Date(s.time).setMinutes(0),i[h-o]=s.value);return i},t.normalizeHourlyData=function(e){var i,s,r,n,a,o,c,u;for(i=[],s=r=0;24>r;s=++r)for(u=[0,15,30,45],n=0,o=u.length;o>n;n++)c=u[n],a=t.padNumber(s,2)+":"+t.padNumber(c,2),i.push(e[a]||0);return i},t.fillGapsInHistoricalData=function(t,e){var i,s,r,n,a,o,c,u,l,d,h;for(null==e&&(e=!0),n=e?25:168,l=new Date,l.setHours(l.getHours()-1),l.setMinutes(0),l.setSeconds(0),h=l.getTime(),i=[],a=o=0,d=n;d>=0?d>o:o>d;a=d>=0?++o:--o)i[a]={time:h,value:-1},h-=36e5;for(c=0,u=t.length;u>c;c++)s=t[c],r=Math.round((l-new Date(s.time))/36e5),i[r]=s;return i},t}()},{}],6:[function(t,e,i){var s,r,n,a,o,c,u=function(t,e){function i(){this.constructor=t}for(var s in e)l.call(e,s)&&(t[s]=e[s]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},l={}.hasOwnProperty;o=t("views/view"),a=t("misc/stats-utils"),r=t("d3/now-horizontal"),s=t("misc/face"),c=t("jade/micro-view"),e.exports=n=function(t){function e(t,e){this.$node=$(c({stats:e})),t.append(this.$node),this.addLiveStats(),this.addFace(),PubSub.publish("STATS.SUBSCRIBE",{subscriber:this,liveStats:["ram","cpu","swap","disk"]})}return u(e,t),e.prototype.addLiveStats=function(){return this.liveStats=new r({barWidth:40,barHeight:5,padding:3,totalHeight:29,holder:$(".graphs",this.$node)[0]})},e.prototype.addFace=function(){return this.face=new s($(".face",this.$node),"true")},e.prototype.updateLiveStats=function(t){return this.face.update(a.getOverallTemperature(t)),this.liveStats.update(t)},e}(o)},{"d3/now-horizontal":2,"jade/micro-view":10,"misc/face":4,"misc/stats-utils":5,"views/view":8}],7:[function(t,e,i){var s,r,n,a,o,c,u,l,d=function(t,e){function i(){this.constructor=t}for(var s in e)h.call(e,s)&&(t[s]=e[s]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},h={}.hasOwnProperty;c=t("views/view"),a=t("misc/stats-utils"),n=t("d3/now-horizontal"),r=t("d3/historical-small"),s=t("misc/face"),l=t("jade/strip-view"),u=t("jade/percentages"),e.exports=o=function(t){function e(t,e){var i,s;this.statTypes=e,this.$node=$(l({stats:this.statTypes})),this.$percentages=$(".percentages",this.$node),t.append(this.$node),i=5,s=5,this.addHistoricStats(i,s),this.addLiveStats(i,s),this.addFace(),this.subscribeToStatData()}return d(e,t),e.prototype.addHistoricStats=function(t,e){return this.historicStats=new r($(".historic",this.$node)[0],t,e)},e.prototype.addLiveStats=function(t,e){var i;return i={barWidth:50,barHeight:t,padding:e,totalHeight:4*t+3*e,holder:$(".graphs",this.$node)[0]},this.liveStats=new n(i)},e.prototype.addFace=function(){return this.face=new s($(".face",this.$node),"true")},e.prototype.updateLiveStats=function(t){return this.face.update(a.getOverallTemperature(t)),this.liveStats.update(t),this.updateLivePercentages(t)},e.prototype.updateHistoricStat=function(t,e){var i,s;return i={},s=a.get24hrRangeStartingLastHour(),e=a.fillGapsInHistoricalData(e),i[t]=a.normalizeHistoricalData(e,s),this.historicStats.update(i,this.statTypes)},e.prototype.updateLivePercentages=function(t){var e,i,s;e=[];for(i in t)s=t[i],e.push(Math.round(100*s));return this.$percentages.empty(),this.$percentages.append($(u({percentages:e})))},e.prototype.subscribeToStatData=function(){var t,e,i,s;t=[],i=this.statTypes;for(e in i)s=i[e],t.push(e);return PubSub.publish("STATS.SUBSCRIBE",{subscriber:this,liveStats:t,historicStats:t})},e}(c)},{"d3/historical-small":1,"d3/now-horizontal":2,"jade/percentages":11,"jade/strip-view":12,"misc/face":4,"misc/stats-utils":5,"views/view":8}],8:[function(t,e,i){var s;e.exports=s=function(){function t(){}return t}()},{}],9:[function(t,e,i){e.exports=function(t){var e=[],i=t||{};return function(t,i){e.push('<div class="faceholder"><img'+jade.attr("scalable",""+t,!0,!1)+jade.attr("data-src","face-"+i,!0,!1)+' class="shadow-icon"/></div>')}.call(this,"scalable"in i?i.scalable:"undefined"!=typeof scalable?scalable:void 0,"temperature"in i?i.temperature:"undefined"!=typeof temperature?temperature:void 0),e.join("")}},{}],10:[function(t,e,i){e.exports=function(t){var e,i=[],s=t||{};return function(t,s){i.push('<div class="micro-view"><div class="labels">'),function(){var s=t;if("number"==typeof s.length)for(var r=0,n=s.length;n>r;r++){var a=s[r];i.push('<div class="stat">'+jade.escape(null==(e=a.nickname)?"":e)+"</div>")}else{var n=0;for(var r in s){n++;var a=s[r];i.push('<div class="stat">'+jade.escape(null==(e=a.nickname)?"":e)+"</div>")}}}.call(this),i.push('</div><div class="graphs"></div><div class="face"></div></div>')}.call(this,"stats"in s?s.stats:"undefined"!=typeof stats?stats:void 0,"undefined"in s?s.undefined:void 0),i.join("")}},{}],11:[function(t,e,i){e.exports=function(t){var e,i=[],s=t||{};return function(t,s){(function(){var s=t;if("number"==typeof s.length)for(var r=0,n=s.length;n>r;r++){var a=s[r];i.push('<div class="val">'+jade.escape(null==(e=a)?"":e)+"%</div>")}else{var n=0;for(var r in s){n++;var a=s[r];i.push('<div class="val">'+jade.escape(null==(e=a)?"":e)+"%</div>")}}}).call(this)}.call(this,"percentages"in s?s.percentages:"undefined"!=typeof percentages?percentages:void 0,"undefined"in s?s.undefined:void 0),i.join("")}},{}],12:[function(t,e,i){e.exports=function(t){var e,i=[],s=t||{};return function(t,s){i.push('<div class="strip-view"><div class="labels">'),function(){var s=t;if("number"==typeof s.length)for(var r=0,n=s.length;n>r;r++){var a=s[r];i.push('<div class="stat">'+jade.escape(null==(e=a.nickname)?"":e)+"</div>")}else{var n=0;for(var r in s){n++;var a=s[r];i.push('<div class="stat">'+jade.escape(null==(e=a.nickname)?"":e)+"</div>")}}}.call(this),i.push('</div><div class="historic"></div><div class="divider"></div><div class="graphs"></div><div class="percentages"></div><div class="face"></div></div>')}.call(this,"stats"in s?s.stats:"undefined"!=typeof stats?stats:void 0,"undefined"in s?s.undefined:void 0),i.join("")}},{}]},{},[3]);