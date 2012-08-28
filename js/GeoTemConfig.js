/*
* GeoTemConfig.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class GeoTemConfig
 * Global GeoTemCo Configuration File
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */

var GeoTemConfig = {

	incompleteData : true, // show/hide data with either temporal or spatial metadata
	inverseFilter : true, // if inverse filtering is offered
	mouseWheelZoom : true, // enable/disable zoom with mouse wheel on map & timeplot
	language : 'en', // default language of GeoTemCo
	allowFilter : true, // if filtering should be allowed
	//colors for several datasets; rgb1 will be used for selected objects, rgb0 for unselected
	colors : [{
		r1 : 255,
		g1 : 101,
		b1 : 0,
		r0 : 253,
		g0 : 229,
		b0 : 205
	}, {
		r1 : 144,
		g1 : 26,
		b1 : 255,
		r0 : 230,
		g0 : 225,
		b0 : 255
	}, {
		r1 : 0,
		g1 : 217,
		b1 : 0,
		r0 : 213,
		g0 : 255,
		b0 : 213
	}, {
		r1 : 240,
		g1 : 220,
		b1 : 0,
		r0 : 247,
		g0 : 244,
		b0 : 197
	}]

}

GeoTemConfig.ie = false;
GeoTemConfig.ie8 = false;

if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
	GeoTemConfig.ie = true;
	var ieversion = new Number(RegExp.$1);
	if (ieversion == 8) {
		GeoTemConfig.ie8 = true;
	}
}

GeoTemConfig.configure = function(urlPrefix) {
	GeoTemConfig.urlPrefix = urlPrefix;
	GeoTemConfig.path = GeoTemConfig.urlPrefix + "images/";
}

GeoTemConfig.applySettings = function(settings) {
	$.extend(this, settings);
};

GeoTemConfig.getColor = function(id){
	if( GeoTemConfig.colors.length <= id ){
		GeoTemConfig.colors.push({
			r1 : Math.floor((Math.random()*255)+1),
			g1 : Math.floor((Math.random()*255)+1),
			b1 : Math.floor((Math.random()*255)+1),
			r0 : 230,
			g0 : 230,
			b0 : 230
		});
	}
	return GeoTemConfig.colors[id];
};

GeoTemConfig.getString = function(field) {
	if ( typeof Tooltips[GeoTemConfig.language] == 'undefined') {
		GeoTemConfig.language = 'en';
	}
	return Tooltips[GeoTemConfig.language][field];
}
/**
 * returns the actual mouse position
 * @param {Event} e the mouseevent
 * @return the top and left position on the screen
 */
GeoTemConfig.getMousePosition = function(e) {
	if (!e) {
		e = window.event;
	}
	var body = (window.document.compatMode && window.document.compatMode == "CSS1Compat") ? window.document.documentElement : window.document.body;
	return {
		top : e.pageY ? e.pageY : e.clientY,
		left : e.pageX ? e.pageX : e.clientX
	};
}
/**
 * returns the json object of the file from the given url
 * @param {String} url the url of the file to load
 * @return json object of given file
 */
GeoTemConfig.getJson = function(url) {
	var data;
	$.ajax({
		url : url,
		async : false,
		dataType : 'json',
		success : function(json) {
			data = json;
		}
	});
	return data;
}

GeoTemConfig.mergeObjects = function(set1, set2) {
	var inside = [];
	var newSet = [];
	for (var i = 0; i < set1.length; i++) {
		inside.push([]);
		newSet.push([]);
		for (var j = 0; j < set1[i].length; j++) {
			inside[i][set1[i][j].index] = true;
			newSet[i].push(set1[i][j]);
		}
	}
	for (var i = 0; i < set2.length; i++) {
		for (var j = 0; j < set2[i].length; j++) {
			if (!inside[i][set2[i][j].index]) {
				newSet[i].push(set2[i][j]);
			}
		}
	}
	return newSet;
}
/**
 * returns the xml dom object of the file from the given url
 * @param {String} url the url of the file to load
 * @return xml dom object of given file
 */
GeoTemConfig.getKml = function(url,asyncFunc) {
	var data;
	var async = false;
	if( asyncFunc ){
		async = true;
	}
	$.ajax({
		url : url,
		async : async,
		dataType : 'xml',
		success : function(xml) {
			if( asyncFunc ){
				asyncFunc(xml);
			}
			else {
				data = xml;
			}
		}
	});
	if( !async ){
		return data;
	}
}

/**
 * returns a Date and a SimileAjax.DateTime granularity value for a given XML time
 * @param {String} xmlTime the XML time as String
 * @return JSON object with a Date and a SimileAjax.DateTime granularity
 */
GeoTemConfig.getTimeData = function(xmlTime) {
	if (!xmlTime)
		return;
	var dateData;
	try {
		var bc = false;
		if (xmlTime.startsWith("-")) {
			bc = true;
			xmlTime = xmlTime.substring(1);
		}
		var timeSplit = xmlTime.split("T");
		var timeData = timeSplit[0].split("-");
		for (var i = 0; i < timeData.length; i++) {
			parseInt(timeData[i]);
		}
		if (bc) {
			timeData[0] = "-" + timeData[0];
		}
		if (timeSplit.length == 1) {
			dateData = timeData;
		} else {
			var dayData;
			if (timeSplit[1].indexOf("Z") != -1) {
				dayData = timeSplit[1].substring(0, timeSplit[1].indexOf("Z") - 1).split(":");
			} else {
				dayData = timeSplit[1].substring(0, timeSplit[1].indexOf("+") - 1).split(":");
			}
			for (var i = 0; i < timeData.length; i++) {
				parseInt(dayData[i]);
			}
			dateData = timeData.concat(dayData);
		}
	} catch (exception) {
		return null;
	}
	var date, granularity;
	if (dateData.length == 6) {
		granularity = SimileAjax.DateTime.SECOND;
		date = new Date(Date.UTC(dateData[0], dateData[1] - 1, dateData[2], dateData[3], dateData[4], dateData[5]));
	} else if (dateData.length == 3) {
		granularity = SimileAjax.DateTime.DAY;
		date = new Date(Date.UTC(dateData[0], dateData[1] - 1, dateData[2]));
	} else if (dateData.length == 2) {
		granularity = SimileAjax.DateTime.MONTH;
		date = new Date(Date.UTC(dateData[0], dateData[1] - 1, 1));
	} else if (dateData.length == 1) {
		granularity = SimileAjax.DateTime.YEAR;
		date = new Date(Date.UTC(dateData[0], 0, 1));
	}
	if (timeData[0] && timeData[0] < 100) {
		date.setFullYear(timeData[0]);
	}
	return {
		date : date,
		granularity : granularity
	};
}
/**
 * converts a JSON array into an array of data objects
 * @param {JSON} JSON a JSON array of data items
 * @return an array of data objects
 */
GeoTemConfig.loadJson = function(JSON) {
	var mapTimeObjects = [];
	var runningIndex = 0;
	for (var i in JSON ) {
		try {
			var item = JSON[i];
			var index = item.index || item.id || runningIndex++;
			var name = item.name || "";
			var description = item.description || "";
			var tableContent = item.tableContent || [];
			var locations = [];
			if (item.location instanceof Array) {
				for (var j = 0; j < item.location.length; j++) {
					var place = item.location[j].place || "unknown";
					var lon = item.location[j].lon || "";
					var lat = item.location[j].lat || "";
					if ((lon == "" || lat == "" || isNaN(lon) || isNaN(lat) ) && !GeoTemConfig.incompleteData) {
						throw "e";
					}
					locations.push({
						longitude : lon,
						latitude : lat,
						place : place
					});
				}
			} else {
				var place = item.place || "unknown";
				var lon = item.lon || "";
				var lat = item.lat || "";
				if ((lon == "" || lat == "" || isNaN(lon) || isNaN(lat) ) && !GeoTemConfig.incompleteData) {
					throw "e";
				}
				locations.push({
					longitude : lon,
					latitude : lat,
					place : place
				});
			}
			var dates = [];
			if (item.time instanceof Array) {
				for (var j = 0; j < item.time.length; j++) {
					var time = GeoTemConfig.getTimeData(item.time[j]);
					if (time == null && !GeoTemConfig.incompleteData) {
						throw "e";
					}
					dates.push(time);
				}
			} else {
				var time = GeoTemConfig.getTimeData(item.time);
				if (time == null && !GeoTemConfig.incompleteData) {
					throw "e";
				}
				if (time != null) {
					dates.push(time);
				}
			}
			var weight = item.weight || 1;
			var mapTimeObject = new DataObject(name, description, locations, dates, weight, tableContent);
			mapTimeObject.setIndex(index);
			mapTimeObjects.push(mapTimeObject);
		} catch(e) {
			continue;
		}
	}

	return mapTimeObjects;
}
/**
 * converts a KML dom into an array of data objects
 * @param {XML dom} kml the XML dom for the KML file
 * @return an array of data objects
 */
GeoTemConfig.loadKml = function(kml) {
	var mapObjects = [];
	var elements = kml.getElementsByTagName("Placemark");
	if (elements.length == 0) {
		return [];
	}
	var index = 0;
	for (var i = 0; i < elements.length; i++) {
		var placemark = elements[i];
		var name, description, place, granularity, lon, lat, tableContent = [], time = [], location = [];
		var weight = 1;
		var timeData = false, mapData = false;
		try {
			name = placemark.getElementsByTagName("name")[0].childNodes[0].nodeValue;
			tableContent["name"] = name;
		} catch(e) {
			name = "";
		}

		try {
			description = placemark.getElementsByTagName("description")[0].childNodes[0].nodeValue;
			tableContent["description"] = description;
		} catch(e) {
			description = "";
		}

		try {
			place = placemark.getElementsByTagName("address")[0].childNodes[0].nodeValue;
			tableContent["place"] = place;
		} catch(e) {
			place = "";
		}

		try {
			var coordinates = placemark.getElementsByTagName("Point")[0].getElementsByTagName("coordinates")[0].childNodes[0].nodeValue;
			var lonlat = coordinates.split(",");
			lon = lonlat[0];
			lat = lonlat[1];
			if (lon == "" || lat == "" || isNaN(lon) || isNaN(lat)) {
				throw "e";
			}
			location.push({
				longitude : lon,
				latitude : lat,
				place : place
			});
		} catch(e) {
			if (!GeoTemConfig.incompleteData) {
				continue;
			}
		}

		try {
			var tuple = GeoTemConfig.getTimeData(placemark.getElementsByTagName("TimeStamp")[0].getElementsByTagName("when")[0].childNodes[0].nodeValue);
			if (tuple != null) {
				time.push(tuple);
				timeData = true;
			} else if (!GeoTemConfig.incompleteData) {
				continue;
			}
		} catch(e) {
			try {
				throw "e";
				var timeSpanTag = placemark.getElementsByTagName("TimeSpan")[0];
				var tuple1 = GeoTemConfig.getTimeData(timeSpanTag.getElementsByTagName("begin")[0].childNodes[0].nodeValue);
				timeStart = tuple1.d;
				granularity = tuple1.g;
				var tuple2 = GeoTemConfig.getTimeData(timeSpanTag.getElementsByTagName("end")[0].childNodes[0].nodeValue);
				timeEnd = tuple2.d;
				if (tuple2.g > granularity) {
					granularity = tuple2.g;
				}
				timeData = true;
			} catch(e) {
				if (!GeoTemConfig.incompleteData) {
					continue;
				}
			}
		}
		var object = new DataObject(name, description, location, time, 1, tableContent);
		object.setIndex(index);
		index++;
		mapObjects.push(object);
	}
	return mapObjects;
};
