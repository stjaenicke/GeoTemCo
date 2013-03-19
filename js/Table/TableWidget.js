/*
* TableWidget.js
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
 * @class TableWidget
 * TableWidget Implementation
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {TableWrapper} core wrapper for interaction to other widgets
 * @param {HTML object} div parent div to append the table widget div
 * @param {JSON} options user specified configuration that overwrites options in TableConfig.js
 */
function TableWidget(core, div, options) {

	this.core = core;
	this.core.setWidget(this);
	this.tables = [];
	this.tableTabs = [];
	this.tableElements = [];
	this.tableHash = [];

	this.options = (new TableConfig(options)).options;
	this.gui = new TableGui(this, div, this.options);
	this.filterBar = new FilterBar(this);

}

TableWidget.prototype = {

	initWidget : function(data) {
		this.datasets = data;

		$(this.gui.tabs).empty();
		$(this.gui.input).empty();
		this.activeTable = undefined;
		this.tables = [];
		this.tableTabs = [];
		this.tableElements = [];
		this.tableHash = [];
		this.selection = new Selection();
		this.filterBar.reset(false);

		var tableWidget = this;
		var addTab = function(name, index) {
			var tableTab = document.createElement('div');
			tableTab.setAttribute('class', 'tableTab');
			tableTab.style.backgroundColor = tableWidget.options.unselectedCellColor;
			tableTab.onclick = function() {
				tableWidget.selectTable(index);
			}
			tableTab.innerHTML = name;
			return tableTab;
		}
		for (var i in data ) {
			this.tableHash.push([]);
			var tableTab = addTab(data[i].label, i);
			this.gui.tabs.appendChild(tableTab);
			this.tableTabs.push(tableTab);
			var elements = [];
			for (var j in data[i].objects ) {
				elements.push(new TableElement(data[i].objects[j]));
				this.tableHash[i][data[i].objects[j].index] = elements[elements.length - 1];
			}
			var table = new Table(elements, this, i);
			this.tables.push(table);
			this.tableElements.push(elements);
		}

		if (data.length > 0) {
			this.selectTable(0);
		}

	},

	getHeight : function() {
		if (this.options.tableHeight) {
			return this.gui.tableContainer.offsetHeight - this.gui.tabs.offsetHeight;
		}
		return false;
	},

	selectTable : function(index) {
		if (this.activeTable != index) {
			if ( typeof this.activeTable != 'undefined') {
				this.tables[this.activeTable].hide();
				this.tableTabs[this.activeTable].style.backgroundColor = this.options.unselectedCellColor;
			}
			this.activeTable = index;
			this.tables[this.activeTable].show();
			var c = GeoTemConfig.getColor(this.activeTable);
			this.tableTabs[this.activeTable].style.backgroundColor = 'rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')';
			this.core.triggerRise(index);
		}

	},

	highlightChanged : function(objects) {
		if( !GeoTemConfig.highlightEvents ){
			return;
		}
		if( this.tables.length > 0 ){
			return;
		}
		for (var i = 0; i < this.tableElements.length; i++) {
			for (var j = 0; j < this.tableElements[i].length; j++) {
				this.tableElements[i][j].highlighted = false;
			}
		}
		for (var i = 0; i < objects.length; i++) {
			for (var j = 0; j < objects[i].length; j++) {
				this.tableHash[i][objects[i][j].index].highlighted = true;
			}
		}
		this.tables[this.activeTable].update();
	},

	selectionChanged : function(selection) {
		if( !GeoTemConfig.selectionEvents ){
			return;
		}
		this.reset();
		if( this.tables.length == 0 ){
			return;
		}
		this.selection = selection;
		for (var i = 0; i < this.tableElements.length; i++) {
			for (var j = 0; j < this.tableElements[i].length; j++) {
				this.tableElements[i][j].selected = false;
				this.tableElements[i][j].highlighted = false;
			}
		}
		var objects = selection.getObjects(this);
		for (var i = 0; i < objects.length; i++) {
			for (var j = 0; j < objects[i].length; j++) {
				this.tableHash[i][objects[i][j].index].selected = true;
			}
		}
		this.tables[this.activeTable].reset();
		this.tables[this.activeTable].update();
	},

	triggerHighlight : function(item) {
		var selectedObjects = [];
		for (var i = 0; i < GeoTemConfig.datasets; i++) {
			selectedObjects.push([]);
		}
		if ( typeof item != 'undefined') {
			selectedObjects[this.activeTable].push(item);
		}
		this.core.triggerHighlight(selectedObjects);
	},

	tableSelection : function() {
		var selectedObjects = [];
		for (var i = 0; i < GeoTemConfig.datasets; i++) {
			selectedObjects.push([]);
		}
		var valid = false;
		for (var i = 0; i < this.tableElements.length; i++) {
			for (var j = 0; j < this.tableElements[i].length; j++) {
				var e = this.tableElements[i][j];
				if (e.selected) {
					selectedObjects[i].push(e.object);
					valid = true;
				}
			}
		}
		this.selection = new Selection();
		if (valid) {
			this.selection = new Selection(selectedObjects, this);
		}
		this.core.triggerSelection(this.selection);
		this.filterBar.reset(true);
	},

	deselection : function() {
		this.reset();
		this.selection = new Selection();
		this.core.triggerSelection(this.selection);
	},

	filtering : function() {
		for (var i = 0; i < this.datasets.length; i++) {
			this.datasets[i].objects = this.selection.objects[i];
		}
		this.core.triggerRefining(this.datasets);
	},

	inverseFiltering : function() {
		var selectedObjects = [];
		for (var i = 0; i < GeoTemConfig.datasets; i++) {
			selectedObjects.push([]);
		}
		var valid = false;
		for (var i = 0; i < this.tableElements.length; i++) {
			for (var j = 0; j < this.tableElements[i].length; j++) {
				var e = this.tableElements[i][j];
				if (!e.selected) {
					selectedObjects[i].push(e.object);
					valid = true;
				}
			}
		}
		this.selection = new Selection();
		if (valid) {
			this.selection = new Selection(selectedObjects, this);
		}
		this.filtering();
	},

	triggerRefining : function() {
		this.core.triggerRefining(this.selection.objects);
	},

	reset : function() {
		this.filterBar.reset(false);
		if( this.tables.length > 0 ){
			this.tables[this.activeTable].resetElements();
			this.tables[this.activeTable].reset();
			this.tables[this.activeTable].update();
		}
	}
}
