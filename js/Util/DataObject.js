/*
* DataObject.js
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
 * @class DataObject
 * GeoTemCo's data object class
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {String} name name of the data object
 * @param {String} description description of the data object
 * @param {JSON} locations a list of locations with longitude, latitide and place name
 * @param {JSON} dates a list of dates
 * @param {float} lon longitude value of the given place
 * @param {float} lat latitude value of the given place
 * @param {Date} timeStart start time of the data object
 * @param {Date} timeEnd end time of the data object
 * @param {int} granularity granularity of the given time
 * @param {int} weight weight of the time object
 */

function DataObject(name, description, locations, dates, weight, tableContent) {

	this.name = name;
	this.description = description;
	this.weight = weight;
	this.tableContent = tableContent;

	this.percentage = 0;
	this.setPercentage = function(percentage) {
		this.percentage = percentage;
	}

	this.locations = locations;
	this.isGeospatial = false;
	if (this.locations.length > 0) {
		this.isGeospatial = true;
	}

	this.placeDetails = [];
	for (var i = 0; i < this.locations.length; i++) {
		this.placeDetails.push(this.locations[i].place.split("/"));
	}

	this.getLatitude = function(locationId) {
		return this.locations[locationId].latitude;
	}

	this.getLongitude = function(locationId) {
		return this.locations[locationId].longitude;
	}

	this.getPlace = function(locationId, level) {
		if (level >= this.placeDetails[locationId].length) {
			return this.placeDetails[locationId][this.placeDetails[locationId].length - 1];
		}
		return this.placeDetails[locationId][level];
	}

	this.dates = dates;
	this.isTemporal = false;
	if (this.dates.length > 0) {
		this.isTemporal = true;
	}

	this.getDate = function(dateId) {
		return this.dates[dateId].date;
	}

	this.getTimeGranularity = function(dateId) {
		return this.dates[dateId].granularity;
	}

	this.setIndex = function(index) {
		this.index = index;
	}

	this.getTimeString = function() {
		if (this.timeStart != this.timeEnd) {
			return (SimileAjax.DateTime.getTimeString(this.granularity, this.timeStart) + " - " + SimileAjax.DateTime.getTimeString(this.granularity, this.timeEnd));
		} else {
			return SimileAjax.DateTime.getTimeString(this.granularity, this.timeStart) + "";
		}
	};

};
