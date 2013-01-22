/*
* MapConfig.js
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
 * @class MapConfig
 * Map Configuration File
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */
function MapConfig(options) {

	this.options = {
		mapWidth : false, // false or desired width css definition for the map
		mapHeight : '580px', // false or desired height css definition for the map
		mapTitle : 'GeoTemCo Map View', // title will be shown in map header
		mapIndex : 0, // index = position in location array; for multiple locations the 2nd map refers to index 1
		alternativeMap : false, // alternative map definition for a web mapping service or 'false' for no alternative map
		/* an example:
		 {
		 name: 'someMapName',
		 url: '/geoserver/wms',
		 layer: 'namespace:layerName'
		 }
		 */
		googleMaps : false, // enable/disable Google maps (actually, no Google Maps API key is required)
		bingMaps : false, // enable/disable Bing maps (you need to set the Bing Maps API key below)
		bingApiKey : 'none', // bing maps api key, see informations at http://bingmapsportal.com/
		osmMaps : true, // enable/disable OSM maps
		baseLayer : 'Open Street Map', // initial layer to show (e.g. 'Google Streets')
		resetMap : true, // show/hide map reset button
		countrySelect : true, // show/hide map country selection control button
		polygonSelect : true, // show/hide map polygon selection control button
		circleSelect : true, // show/hide map circle selection control button
		squareSelect : true, // show/hide map square selection control button
		multiSelection : true, // true, if multiple polygons or multiple circles should be selectable
		popups : true, // enabled popups will show popup windows for circles on the map
		olNavigation : false, // show/hide OpenLayers navigation panel
		olLayerSwitcher : false, // show/hide OpenLayers layer switcher
		olMapOverview : false, // show/hide OpenLayers map overview
		olKeyboardDefaults : true, // (de)activate Openlayers keyboard defaults
		olScaleLine : false, // (de)activate Openlayers keyboard defaults
		geoLocation : true, // show/hide GeoLocation feature
		boundaries : {
			minLon : -29,
			minLat : 35,
			maxLon : 44,
			maxLat : 67
		}, // initial map boundaries or 'false' for no boundaries
		mapBackground : '#bbd0ed',
		labelGrid : true, // show label grid on hover
		maxPlaceLabels : 6, // Integer value for fixed number of place labels: 0 --> unlimited, 1 --> 1 label (won't be shown in popup, 2 --> is not possible because of others & all labels --> 3 labels, [3,...,N] --> [3,...,N] place labels)
		selectDefault : true, // true, if strongest label should be selected as default
		maxLabelIncrease : 2, // maximum increase (in em) for the font size of a label
		labelHover : false, // true, to update on label hover
		ieHighlightLabel : "color: COLOR1; background-color: COLOR0; filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';", // css code for a highlighted place label in IE
		highlightLabel : "color: COLOR0; text-shadow: 0 0 0.4em black, 0 0 0.4em black, 0 0 0.4em black, 0 0 0.4em COLOR0;", // css code for a highlighted place label
		ieSelectedLabel : "color: COLOR1; font-weight: bold;", // css code for a selected place label in IE
		selectedLabel : "color: COLOR1; font-weight: bold;", // css code for a selected place label
		ieUnselectedLabel : "color: COLOR1; font-weight: normal;", // css code for an unselected place label in IE
		unselectedLabel : "color: COLOR1; font-weight: normal;", // css code for an unselected place label
		ieHoveredLabel : "color: COLOR1; font-weight: bold;", // css code for a hovered place label in IE
		hoveredLabel : "color: COLOR1; font-weight: bold;", // css code for a hovered place label
		circleGap : 0, // gap between the circles on the map (>=0)
		circleOverlap : {
			type: 'area', // 'area' or 'diameter' is possible
			overlap: 0 // the percentage of allowed overlap (0<=overlap<=1)
		}, // maximum allowed overlap in percent (if circleGap = 0, circleOverlap will be used)
		minimumRadius : 4, // minimum radius of a circle with mimimal weight (>0)
		circleOutline : 2, // false for no outline or a pixel value v with 0 < v
		circleOpacity : 'balloon', // 'balloon' for dynamic opacity of the circles or a value t with 0 <= t <= 1
		minTransparency : 0.4, // maximum transparency of a circle
		maxTransparency : 0.8, // minimum transparency of a circle
		binning : 'generic', // binning algorithm for the map, possible values are: 'generic', 'square', 'hexagonal', 'triangular' or false for 'no binning'
		noBinningRadii : 'dynamic', // for 'no binning': 'static' for only minimum radii, 'dynamic' for increasing radii for increasing weights
		circlePackings : true, // if circles of multiple result sets should be displayed in circle packs, if a binning is performed
		binCount : 10, // number of bins for x and y dimension for lowest zoom level
		showDescriptions : true, // true to show descriptions of data items (must be provided by kml/json), false if not
		mapSelection : true, // show/hide select map dropdown
		binningSelection : false, // show/hide binning algorithms dropdown
		mapSelectionTools : true, // show/hide map selector tools
		dataInformation : true, // show/hide data information
		overlayVisibility : false, // initial visibility of additional overlays
		proxyHost : ''	//required for selectCountry feature, if the requested GeoServer and GeoTemCo are NOT on the same server

	};
	if ( typeof options != 'undefined') {
		$.extend(this.options, options);
	}

};
