
## Usage
```coffeescript

# initialize, selecting the type (either micro, standard, or expanded)
micro = new nanobox.HourlyStats("micro", $("body"))
standard = new nanobox.HourlyStats("standard", $("body"))
expanded = new nanobox.HourlyStats("expanded", $("body"))

# build the component
*.build()

# update the stats
*.updateLiveStats(data)
*.updateHistoricStats(data)
```

## Data structure
The data structure for each of the three difference components is the same:

```coffeescript

# live data
data = [
	{"metric": "cpu", "value": "0.23807847689791828"},
	{"metric": "ram", "value": "0.5530410577019549"},
	{"metric": "swap", "value": "0.3581425287628821"},
	{"metric": "disk", "value": "0.21984489083848313"}
]

# historical data
data = [{
	"metric": "cpu",
	"data": [
			{"time": "00", "value": "0.6534948096773026"},
			{"time": "01", "value": "0.14894354901247153"},
			{"time": "02", "value": "0.45431886307178027"},
			{"time": "03", "value": "0.9188308219238996"},
			{"time": "04", "value": "0.31024535792235874"},
			{"time": "05", "value": "0.54477908493862"},
			{"time": "06", "value": "0.9250089804575174"},
			{"time": "07", "value": "0.04074839484880277"},
			{"time": "08", "value": "0.3564506734730384"},
			{"time": "09", "value": "0.49841759901548044"},
			{"time": "10", "value": "0.15957975877497899"},
			{"time": "11", "value": "0.544113102372187"},
			{"time": "12", "value": "0.318891205366709"},
			{"time": "13", "value": "0.37444500693633187"},
			{"time": "14", "value": "0.2571829618842001"},
			{"time": "15", "value": "0.5147684070522631"},
			{"time": "16", "value": "0.2271534656120302"},
			{"time": "17", "value": "0.07934084315393508"},
			{"time": "18", "value": "0.49946067122553384"},
			{"time": "19", "value": "0.18232810105494734"},
			{"time": "20", "value": "0.5123568290842926"},
			{"time": "21", "value": "0.3217633272176448"},
			{"time": "22", "value": "0.19953985183989964"},
			{"time": "23", "value": "0.33778626708331894"},
			{"time": "24", "value": "0.5063020706816594"}
		]
	},
	{"metric": "ram", "data": [...]},
	{"metric": "swap", "data": [...]},
	{"metric": "disk", "data": [...]}
]
```
