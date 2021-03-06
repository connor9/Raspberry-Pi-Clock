$(function() {

	pi.init();

	$('#bedside').on('click', function(){
		$.getJSON(urls.bedsidestate, function(bedside){			
			var url = urls.bedsidestate + 'action';
			if(bedside.state.any_on == true) {
				$.ajax({
					type: 'PUT',
					url: url,
					data: '{"on": false}'
				});
			} else {
				$.ajax({
					type: 'PUT',
					url: url,
					data: '{"on": true, "bri": 100, "hue":65280}'
				});
			}
		});
	});

	$('#bedroom').on('click', function(){
		$.getJSON(urls.bedroomstate, function(bedroom){			
			var url = urls.bedroomstate + 'action';
			if(bedroom.state.any_on == true) {
				$.ajax({
					type: 'PUT',
					url: url,
					data: '{"on": false}'
				});
			} else {
				$.ajax({
					type: 'PUT',
					url: url,
					data: '{"on": true, "bri": 255}'
				});
			}
		});
	});

	$('#house').on('click', function(){
		var url = urls.housestate + 'action';
		$.ajax({
			type: 'PUT',
			url: url,
			data: '{"on": false}'
		});
	});


	$('#bedon').on('click', function(){
		$.ajax({
			type: 'PUT',
			url: urls.bedonoff,
			data: '{"on": true, "bri": 100, "hue":65280}'
		});

	});



});

var moons = {
	'new':		'<i class="wi wi-moon-alt-new"></i> New Moon',
	'waxc1':	'<i class="wi wi-moon-alt-waxing-crescent-1"></i> Waxing Crescent',
	'waxc2':	'<i class="wi wi-moon-alt-waxing-crescent-2"></i> Waxing Crescent',
	'waxc3':	'<i class="wi wi-moon-alt-waxing-crescent-3"></i> Waxing Crescent',
	'waxc4':	'<i class="wi wi-moon-alt-waxing-crescent-4"></i> Waxing Crescent',
	'waxc5':	'<i class="wi wi-moon-alt-waxing-crescent-5"></i> Waxing Crescent',
	'waxc6':	'<i class="wi wi-moon-alt-waxing-crescent-6"></i> Waxing Crescent',
	'quarter1':	'<i class="wi wi-moon-alt-first-quarter"></i> First Quarter',
	'waxg1':	'<i class="wi wi-moon-alt-waxing-gibbous-1"></i> Waxing Gibbous',
	'waxg2':	'<i class="wi wi-moon-alt-waxing-gibbous-2"></i> Waxing Gibbous',
	'waxg3':	'<i class="wi wi-moon-alt-waxing-gibbous-3"></i> Waxing Gibbous',
	'waxg4':	'<i class="wi wi-moon-alt-waxing-gibbous-4"></i> Waxing Gibbous',
	'waxg5':	'<i class="wi wi-moon-alt-waxing-gibbous-5"></i> Waxing Gibbous',
	'waxg6':	'<i class="wi wi-moon-alt-waxing-gibbous-6"></i> Waxing Gibbous',
	'full':		'<i class="wi wi-moon-alt-full"></i> Full Moon',
	'wang1':	'<i class="wi wi-moon-alt-waning-gibbous-1"></i> Waning Gibbous',
	'wang2':	'<i class="wi wi-moon-alt-waning-gibbous-2"></i> Waning Gibbous',
	'wang3':	'<i class="wi wi-moon-alt-waning-gibbous-3"></i> Waning Gibbous',
	'wang4':	'<i class="wi wi-moon-alt-waning-gibbous-4"></i> Waning Gibbous',
	'wang5':	'<i class="wi wi-moon-alt-waning-gibbous-5"></i> Waning Gibbous',
	'wang6':	'<i class="wi wi-moon-alt-waning-gibbous-6"></i> Waning Gibbous',
	'quarter2':	'<i class="wi wi-moon-alt-third-quarter"></i> Last Quarter',
	'wanc1':	'<i class="wi wi-moon-alt-waning-crescent-1"></i> Waning Crescent',
	'wanc2':	'<i class="wi wi-moon-alt-waning-crescent-2"></i> Waning Crescent',
	'wanc3':	'<i class="wi wi-moon-alt-waning-crescent-3"></i> Waning Crescent',
	'wanc4':	'<i class="wi wi-moon-alt-waning-crescent-4"></i> Waning Crescent',
	'wanc5':	'<i class="wi wi-moon-alt-waning-crescent-5"></i> Waning Crescent',
	'wanc6':	'<i class="wi wi-moon-alt-waning-crescent-6"></i> Waning Crescent',
}

var pi = {
	init: function() {
		window.addEventListener('contextmenu', function(e) { e.preventDefault(); })
		pi.time();
		pi.weather();
		pi.hue();
		setInterval( function() {
			pi.hue();
		}, 5*1000);
		setInterval( function() {
			pi.weather();
		}, 1000*60);
	},
	time: function() {
		setInterval( function() {
			$('#time').html(moment().format('HH:mm')).attr('datetime', moment().format('HHmm')).append('<span>'+moment().format('dddd Do MMMM, YYYY')+'</span>');
			pi.daynight();
		}, 1000);
	},
	daynight: function() {
		if($('#time').attr('datetime') > '0700' && $('#time').attr('datetime') < '2200') {
			$('body').removeClass('night').addClass('day');
			$('.button').removeClass('hollow');
		} else {
			$('body').removeClass('day').addClass('night');
			$('.button').addClass('hollow');
		}
	},
	weather: function() {
		$.getJSON(urls.weatherData, function(weather){

			var summary = weather.currently.summary,
				summaryIcon = weather.currently.icon,
				num = weather.currently.cloudCover,
				moon = weather.daily.data[0].moonPhase,
				sunrise = weather.daily.data[0].sunriseTime,
				sunset = weather.daily.data[0].sunsetTime,
				pred = '',
				moonPhase = '',
				forecast = '';
			if(summaryIcon == 'wind') {summaryIcon = 'strong-wind'};
			if(num == 0) {var text = 'Clear', cIcon = 'wi-clear-day'};
			if(num > 0 && num <= 0.4) {var text = 'Scattered Clouds', cIcon = 'wi-day-cloudy-high'};
			if(num >= 0.41 && num <= 0.75) {var text = 'Broken Clouds', cIcon = 'wi-cloudy'};
			if(num >= 0.76 && num <= 1) {var text = 'Overcast', cIcon = 'wi-cloud'};
			if(moon => 0.99 && moon <= 0.01) {moonPhase = moons.new};
			if(moon > 0.01 && moon < 0.05) {moonPhase = moons.waxc1};
			if(moon > 0.06 && moon < 0.10) {moonPhase = moons.waxc2};
			if(moon > 0.10 && moon < 0.14) {moonPhase = moons.waxc3};
			if(moon > 0.14 && moon < 0.18) {moonPhase = moons.waxc4};
			if(moon > 0.18 && moon < 0.22) {moonPhase = moons.waxc5};
			if(moon > 0.22 && moon < 0.25) {moonPhase = moons.waxc6};
			if(moon == 0.25) {moonPhase = moons.quarter1};
			if(moon > 0.25 && moon < 0.29) {moonPhase = moons.waxg1};
			if(moon > 0.29 && moon < 0.33) {moonPhase = moons.waxg2};
			if(moon > 0.33 && moon < 0.37) {moonPhase = moons.waxg3};
			if(moon > 0.37 && moon < 0.41) {moonPhase = moons.waxg4};
			if(moon > 0.41 && moon < 0.45) {moonPhase = moons.waxg5};
			if(moon > 0.45 && moon < 0.49) {moonPhase = moons.waxg6};
			if(moon == 0.5) {moonPhase = moons.full};
			if(moon > 0.5 && moon < 0.54) {moonPhase = moons.wang1};
			if(moon > 0.54 && moon < 0.58) {moonPhase = moons.wang2};
			if(moon > 0.58 && moon < 0.62) {moonPhase = moons.wang3};
			if(moon > 0.62 && moon < 0.66) {moonPhase = moons.wang4};
			if(moon > 0.66 && moon < 0.70) {moonPhase = moons.wang5};
			if(moon > 0.70 && moon < 0.75) {moonPhase = moons.wang6};
			if(moon == 0.75) {moonPhase = moons.quarter2};
			if(moon > 0.75 && moon < 0.79) {moonPhase = moons.wanc1};
			if(moon > 0.79 && moon < 0.83) {moonPhase = moons.wanc2};
			if(moon > 0.83 && moon < 0.87) {moonPhase = moons.wanc3};
			if(moon > 0.87 && moon < 0.91) {moonPhase = moons.wanc4};
			if(moon > 0.91 && moon < 0.95) {moonPhase = moons.wanc5};
			if(moon > 0.95 && moon < 0.99) {moonPhase = moons.wanc6};

			pred += '<strong><i class="wi wi-'+summaryIcon+'"></i> '+summary + '</strong><br />';

			pred += '<i class="wi wi-thermometer"></i> ' + weather.currently.temperature+'<i class="wi wi-celsius"></i> <small>(Feels like '+weather.currently.apparentTemperature+'<i class="wi wi-celsius"></i>)</small><br />';

			pred += '<small>Max: '+weather.daily.data[0].temperatureMax+'<i class="wi wi-celsius"></i> | Min: '+weather.daily.data[0].temperatureMin+'<i class="wi wi-celsius"></i></small><br />';

			pred += '<i class="wi wi-strong-wind"></i> Wind: <i class="wi wi-wind towards-'+weather.currently.windBearing+'-deg"></i> '+degToCompass(weather.currently.windBearing)+' '+weather.currently.windSpeed+' mph<br />';
			pred += '<i class="wi '+cIcon+'"></i> '+ text + '<br />';

			if(weather.currently.precipIntensity > 0) {
				pred += '<i class="wi wi-rain"></i> Rain: '+Math.round(weather.currently.precipProbability * 100, 2)+'% '+Math.round(weather.currently.precipIntensity * 10, 2)+'mm/hr '+weather.currently.precipType+'<br />';
			} else {
				pred += '<i class="wi wi-rain"></i> Rain: '+Math.round(weather.currently.precipProbability * 100, 2)+'%<br />';
			}

			if(weather.currently.nearestStormDistance > 0) {
				pred += 'Nearest rain: <i class="wi wi-wind towards-'+weather.currently.nearestStormBearing+'-deg"></i> '+degToCompass(weather.currently.nearestStormBearing)+' '+weather.currently.nearestStormDistance+' miles<br />';
			}

			pred += '<i class="wi wi-humidity"></i> Humidity: ' + Math.round(weather.currently.humidity * 100) + '%<br />';

			if(exists(weather.daily.data[0].moonPhase)) {
				pred += ''+moonPhase+'<br />';
			}

			pred += '<i class="wi wi-sunrise"></i> '+moment.unix(sunrise).format('HH:mm a')+' | <i class="wi wi-sunset"></i> '+moment.unix(sunset).format('HH:mm a');

			$('#weather').html(pred);

			// Future Weather

			var futureHourPeriodLength = 6;  //weather.hourly.data.length

			var futureDayIndexToday = 0;
			var futureDayIndexTomorrow = 1;
		
			// Check if it's early morning, and show today's forecast in the tomorrow spot cause it's still tomorrow really.
			var d = new Date();
			if(d.getHours() >= 0 && d.getHours() <= 5) {
				futureDayIndexToday = -1;
				futureDayIndexTomorrow = 0;
			}

			forecast += '<table class="weather moving-window three-hourly-0 one-hourly-7">';

			// TIME

    		forecast += '<thead>';
    		forecast += '<tr class="time">';
			forecast += '<th class="row-title">Time</th>';

			if(futureDayIndexToday < 0) {
				forecast += '<th class="value hours-1 highlight">-</th>';
			} else {
				var unixTimeStamp = weather.daily.data[futureDayIndexToday].time;
				var timestampInMilliSeconds = unixTimeStamp*1000;
				var date = new Date(timestampInMilliSeconds);

				var formattedDate = date.format('m-d');
				
				forecast += '<th class="value hours-1 highlight">';
				forecast += 'Today<br />' + formattedDate;
				forecast += '</th>';
			}


			for(i = 1; i < futureHourPeriodLength; i++) {
				var unixTimeStamp = weather.hourly.data[i].time;
				var timestampInMilliSeconds = unixTimeStamp*1000;
				var date = new Date(timestampInMilliSeconds);

				var formattedDate = date.format('Hi');
				
				forecast += '<th class="value hours-1 highlight">';
				forecast += formattedDate + '<br/>hours';
				forecast += '</th>';
			}

			// Today / Tomorrow
			var unixTimeStamp = weather.daily.data[futureDayIndexTomorrow].time;
			var timestampInMilliSeconds = unixTimeStamp*1000;
			var date = new Date(timestampInMilliSeconds);

			var formattedDate = date.format('m-d');
			
			forecast += '<th class="value hours-1 highlight">';
			forecast += 'Tomorrow<br />' + formattedDate;
			forecast += '</th>';
						
			forecast += '</tr>';
			forecast += '</thead>';

			forecast += '<tbody>';

			// WEATHER CONDITIONS
			forecast += '<tr class="weather-type">';
			forecast += '<th class="row-title">Weather Conditions</th>';

			if(futureDayIndexToday < 0) {
				forecast += '<td>-</td>';
			} else {
				forecast += '<td>';
				forecast += '<span class="content" style="bottom:-14.75px">';
				forecast += '<i class="wi wi-forecast-io-'+ weather.daily.data[futureDayIndexToday].icon + '"></i><br/>' + weather.daily.data[futureDayIndexToday].summary;
				forecast += '</span>';
				forecast += '</td>';
			}

			for(i = 1; i < futureHourPeriodLength; i++) {
				forecast += '<td>';
				forecast += '<span class="content" style="bottom:-14.75px">';
				forecast += '<i class="wi wi-forecast-io-'+weather.hourly.data[i].icon+'"></i><br/>' + weather.hourly.data[i].summary;
				forecast += '</span>';
				forecast += '</td>';
			}

			// Tomorrow 
			forecast += '<td>';
			forecast += '<span class="content" style="bottom:-14.75px">';
			forecast += '<i class="wi wi-forecast-io-'+ weather.daily.data[futureDayIndexTomorrow].icon + '"></i><br/>' + weather.daily.data[futureDayIndexTomorrow].summary;
			forecast += '</span>';
			forecast += '</td>';

			forecast += '</tr>';

			// TEMPERATURE
			forecast += '<tr class="weather-type">';
			forecast += '<th class="row-title">Temperature (°C)</th>';

			if(futureDayIndexToday < 0) {
				forecast += '<td>-</td>';
			} else {
				forecast += '<td>';
				forecast += '<span class="content" style="bottom:-14.75px">';
				forecast += 'Max - ' + weather.daily.data[futureDayIndexToday].temperatureMax + '°C';
				forecast += '</span>';
				forecast += '</td>';
			}

			for(i = 1; i < futureHourPeriodLength; i++) {
				forecast += '<td>';
				forecast += '<span class="content" style="bottom:-14.75px">';
				forecast += weather.hourly.data[i].temperature + '°C';
				forecast += '</span>';
				forecast += '</td>';
			}

			// Tomorrow
			forecast += '<td>';
			forecast += '<span class="content" style="bottom:-14.75px">';
			forecast += 'Max - ' + weather.daily.data[futureDayIndexTomorrow].temperatureMax + '°C';
			forecast += '</span>';
			forecast += '</td>';

			forecast += '</tr>';

			// WIND SPEED
			forecast += '<tr class="weather-type">';
			forecast += '<th class="row-title">Wind Speed</th>';

			if(futureDayIndexToday < 0) {
				forecast += '<td>-</td>';
			} else {
				forecast += '<td>';
				forecast += '<span class="content" style="bottom:-14.75px">';
				forecast += weather.daily.data[futureDayIndexToday].windSpeed + ' km/h';
				forecast += '</span>';
				forecast += '</td>';
			}
		
			for(i = 1; i < futureHourPeriodLength; i++) {
				forecast += '<td>';
				forecast += '<span class="content" style="bottom:-14.75px">';
				forecast += weather.hourly.data[i].windSpeed + ' km/h';
				forecast += '</span>';
				forecast += '</td>';
			}

			// Temperature
			forecast += '<td>';
			forecast += '<span class="content" style="bottom:-14.75px">';
			forecast += weather.daily.data[futureDayIndexTomorrow].windSpeed + ' km/h';
			forecast += '</span>';
			forecast += '</td>';

			forecast += '</tr>';

			forecast += '</tbody>';
			forecast += '</table>';

			$('#forecast').html(forecast);

		});
	},

	hue: function() {

		// TEMP WAY TO RESET STATUS - flickers
		$('#house').removeClass('success');
		$('#bedside').removeClass('success');
		$('#bedroom').removeClass('success');

		$.getJSON(urls.housestate, function(all){
			if(all.state.any_on) {
				$('#house').addClass('success');
			}
		});

		$.getJSON(urls.bedsidestate, function(bedside){
			if(bedside.state.any_on) {
				$('#bedside').addClass('success');
			}
		});
			
		$.getJSON(urls.bedroomstate, function(bedroom){
			if(bedroom.state.any_on) {
				$('#bedroom').addClass('success');
			}
		});

	}

}

function exists(data) {

	if(!data || data==null || data=='undefined' || typeof(data)=='undefined') return false;
	else return true;

}

function degToCompass(num) {

	var val = Math.floor((num / 22.5) + 0.5);
	var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
	return arr[(val % 16)];

}