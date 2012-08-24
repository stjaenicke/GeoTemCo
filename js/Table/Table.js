/*
* Table.js
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
 * @class Table
 * Implementation for a single table
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {Array} elements list of data items
 * @param {HTML object} parent div to append the table
 * @param {int} id dataset index
 */
function Table(elements, parent, id) {

	this.elements = elements;
	this.showElementsLength = elements.length;
	this.parent = parent;
	this.id = id;
	this.options = parent.options;

	this.validResultsPerPage = [10, 20, 50, 100];
	this.keyHeaderList = [];
	this.initialize();

}

Table.prototype = {

	initToolbar : function() {

		var table = this;

		this.toolbar = document.createElement("table");
		this.toolbar.setAttribute('class', 'ddbToolbar');
		this.toolbar.style.overflow = 'auto';
		this.tableDiv.appendChild(this.toolbar);

		var navigation = document.createElement("tr");
		this.toolbar.appendChild(navigation);

		var selectors = document.createElement("td");
		navigation.appendChild(selectors);

		if (table.options.tableSelectPage) {
			var selectPageItems = true;
			this.selectPage = document.createElement('div');
			this.selectPage.setAttribute('class', 'smallButton selectPage');
			this.selectPage.title = GeoTemConfig.getString('selectTablePageItemsHelp');
			selectors.appendChild(this.selectPage);
			this.selectPage.onclick = function() {
				selectPageItems = !selectPageItems;
				if (selectPageItems) {
					var items = 0;
					for (var i = table.first; i < table.elements.length; i++) {
						table.elements[i].selected = false;
						items++;
						if (items == table.resultsPerPage) {
							break;
						}
					}
					table.selectPage.setAttribute('class', 'smallButton selectPage');
					table.selectPage.title = GeoTemConfig.getString('selectTablePageItemsHelp');
				} else {
					var items = 0;
					for (var i = table.first; i < table.elements.length; i++) {
						table.elements[i].selected = true;
						items++;
						if (items == table.resultsPerPage) {
							break;
						}
					}
					table.selectPage.setAttribute('class', 'smallButton deselectPage');
					table.selectPage.title = GeoTemConfig.getString('deselectTablePageItemsHelp');
				}
				table.update();
				table.parent.tableSelection();
			}
		}

		if (table.options.tableSelectAll) {
			var selectAllItems = true;
			this.selectAll = document.createElement('div');
			this.selectAll.setAttribute('class', 'smallButton selectAll');
			table.selectAll.title = GeoTemConfig.getString('selectAllTableItemsHelp');
			selectors.appendChild(this.selectAll);
			this.selectAll.onclick = function() {
				selectAllItems = !selectAllItems;
				if (selectAllItems) {
					for (var i = 0; i < table.elements.length; i++) {
						table.elements[i].selected = false;
					}
					table.selectAll.setAttribute('class', 'smallButton selectAll');
					table.selectAll.title = GeoTemConfig.getString('selectAllTableItemsHelp');
				} else {
					for (var i = 0; i < table.elements.length; i++) {
						table.elements[i].selected = true;
					}
					table.selectAll.setAttribute('class', 'smallButton deselectAll');
					table.selectAll.title = GeoTemConfig.getString('deselectAllTableItemsHelp');
				}
				table.update();
				table.parent.tableSelection();
			}
		}

		this.showSelectedItems = false;
		if (table.options.tableShowSelected) {
			this.showSelected = document.createElement('div');
			this.showSelected.setAttribute('class', 'smallButton showSelected');
			table.showSelected.title = GeoTemConfig.getString('showSelectedHelp');
			selectors.appendChild(this.showSelected);
			this.showSelected.onclick = function() {
				table.showSelectedItems = !table.showSelectedItems;
				if (table.showSelectedItems) {
					table.showElementsLength = 0;
					for (var i = 0; i < table.elements.length; i++) {
						if (table.elements[i].selected) {
							table.showElementsLength++;
						}
					}
					table.showSelected.setAttribute('class', 'smallButton showAll');
					//					table.selectAll.title = GeoTemConfig.getString('showAllElementsHelp');
				} else {
					table.showElementsLength = table.elements.length;
					table.showSelected.setAttribute('class', 'smallButton showSelected');
					//					table.selectAll.title = GeoTemConfig.getString('showSelectedHelp');
				}
				table.updateIndices(table.resultsPerPage);
				table.update();
			}
		}
		this.selectors = selectors;

		//		selectors.style.width = (this.filter.offsetWidth + this.selectAll.offsetWidth + this.selectPage.offsetWidth)+"px";

		var results = document.createElement("td");
		navigation.appendChild(results);

		var pagination = document.createElement("td");
		navigation.appendChild(pagination);

		this.resultsInfo = document.createElement('div');
		this.resultsInfo.setAttribute('class', 'resultsInfo');
		results.appendChild(this.resultsInfo);

		this.firstPage = document.createElement('div');
		this.firstPage.setAttribute('class', 'paginationButton');
		this.firstPage.title = GeoTemConfig.getString('paginationFirsPageHelp');

		pagination.appendChild(this.firstPage);
		this.firstPage.onclick = function() {
			if (table.page != 0) {
				table.page = 0;
				table.update();
			}
		}

		this.previousPage = document.createElement('div');
		this.previousPage.setAttribute('class', 'paginationButton');
		this.previousPage.title = GeoTemConfig.getString('paginationPreviousPageHelp');
		pagination.appendChild(this.previousPage);
		this.previousPage.onclick = function() {
			if (table.page > 0) {
				table.page--;
				table.update();
			}
		}

		this.pageInfo = document.createElement('div');
		this.pageInfo.setAttribute('class', 'pageInfo');
		pagination.appendChild(this.pageInfo);

		this.nextPage = document.createElement('div');
		this.nextPage.setAttribute('class', 'paginationButton');
		this.nextPage.title = GeoTemConfig.getString('paginationNextPageHelp');
		pagination.appendChild(this.nextPage);
		this.nextPage.onclick = function() {
			if (table.page < table.pages - 1) {
				table.page++;
				table.update();
			}
		}

		this.lastPage = document.createElement('div');
		this.lastPage.setAttribute('class', 'paginationButton');
		this.lastPage.title = GeoTemConfig.getString('paginationLastPageHelp');
		pagination.appendChild(this.lastPage);
		this.lastPage.onclick = function() {
			if (table.page != table.pages - 1) {
				table.page = table.pages - 1;
				table.update();
			}
		}

		this.resultsDropdown = document.createElement('div');
		this.resultsDropdown.setAttribute('class', 'resultsDropdown');
		pagination.appendChild(this.resultsDropdown);
		var itemNumbers = [];
		var addItemNumber = function(count, index) {
			var setItemNumber = function() {
				table.updateIndices(count);
				table.update();
			}
			itemNumbers.push({
				name : count,
				onclick : setItemNumber
			});
		}
		for (var i = 0; i < table.options.validResultsPerPage.length; i++) {
			addItemNumber(table.options.validResultsPerPage[i], i);
		}
		var dropdown = new Dropdown(this.resultsDropdown, itemNumbers, 'selectMapType');
		for (var i = 0; i < table.options.validResultsPerPage.length; i++) {
			if (table.options.initialResultsPerPage == table.options.validResultsPerPage[i]) {
				dropdown.setEntry(i);
				break;
			}
		}
		dropdown.div.title = GeoTemConfig.getString('paginationDropdownHelp');

		this.input = document.createElement("div");
		this.input.style.overflow = 'auto';
		this.tableDiv.appendChild(this.input);

		this.elementList = document.createElement("table");
		this.elementList.setAttribute('class', 'resultList');
		this.input.appendChild(this.elementList);
		var height = this.parent.getHeight();
		if (height) {
			this.input.style.height = (height - pagination.offsetHeight) + 'px';
			this.input.style.overflowY = 'auto';
		}

		this.elementListHeader = document.createElement("tr");
		this.elementList.appendChild(this.elementListHeader);

		if (GeoTemConfig.allowFilter) {
			var cell = document.createElement('th');
			this.elementListHeader.appendChild(cell);
		}

		if ( typeof (this.elements[0]) == 'undefined') {
			return;
		}

		var ascButtons = [];
		var descButtons = [];
		var clearButtons = function() {
			for (var i in ascButtons ) {
				ascButtons[i].setAttribute('class', 'sort sortAscDeactive');
			}
			for (var i in descButtons ) {
				descButtons[i].setAttribute('class', 'sort sortDescDeactive');
			}
		}
		var addSortButton = function(key) {
			table.keyHeaderList.push(key);
			var cell = document.createElement('th');
			table.elementListHeader.appendChild(cell);
			var sortAsc = document.createElement('div');
			var sortDesc = document.createElement('div');
			var span = document.createElement('div');
			span.setAttribute('class', 'headerLabel');
			span.innerHTML = key;
			cell.appendChild(sortDesc);
			cell.appendChild(span);
			cell.appendChild(sortAsc);
			sortAsc.setAttribute('class', 'sort sortAscDeactive');
			sortAsc.title = GeoTemConfig.getString('sortAZHelp');
			sortDesc.setAttribute('class', 'sort sortDescDeactive');
			sortDesc.title = GeoTemConfig.getString('sortZAHelp');
			ascButtons.push(sortAsc);
			descButtons.push(sortDesc);
			sortAsc.onclick = function() {
				clearButtons();
				sortAsc.setAttribute('class', 'sort sortAscActive');
				table.sortAscending(key);
				table.update();
			}
			sortDesc.onclick = function() {
				clearButtons();
				sortDesc.setAttribute('class', 'sort sortDescActive');
				table.sortDescending(key);
				table.update();
			}
		}
		for (var key in this.elements[0].object.tableContent) {
			addSortButton(key);
		}

	},

	sortAscending : function(key) {
		var sortFunction = function(e1, e2) {
			if (e1.object.tableContent[key] < e2.object.tableContent[key]) {
				return -1;
			}
			return 1;
		}
		this.elements.sort(sortFunction);
	},

	sortDescending : function(key) {
		var sortFunction = function(e1, e2) {
			if (e1.object.tableContent[key] > e2.object.tableContent[key]) {
				return -1;
			}
			return 1;
		}
		this.elements.sort(sortFunction);
	},

	setPagesText : function() {
		var infoText = GeoTemConfig.getString('pageInfo');
		infoText = infoText.replace('PAGES_ID', this.pages);
		infoText = infoText.replace('PAGE_ID', this.page + 1);
		this.pageInfo.innerHTML = infoText;
	},

	setResultsText : function() {
		if (this.elements.length == 0) {
			this.resultsInfo.innerHTML = '0 Results';
		} else {
			var infoText = GeoTemConfig.getString('resultsInfo');
			var first = this.page * this.resultsPerPage + 1;
			var last = (this.page + 1 == this.pages ) ? this.showElementsLength : first + this.resultsPerPage - 1;
			infoText = infoText.replace('RESULTS_FROM_ID', first);
			infoText = infoText.replace('RESULTS_TO_ID', last);
			infoText = infoText.replace('RESULTS_ID', this.showElementsLength);
			this.resultsInfo.innerHTML = infoText;
		}
	},

	updateIndices : function(rpp) {
		if ( typeof this.resultsPerPage == 'undefined') {
			this.page = 0;
			this.resultsPerPage = 0;
		}
		var index = this.page * this.resultsPerPage;
		this.resultsPerPage = rpp;
		if (this.showSelectedItems) {
			index = 0;
		}
		this.pages = Math.floor(this.showElementsLength / this.resultsPerPage);
		if (this.showElementsLength % this.resultsPerPage != 0) {
			this.pages++;
		}
		this.page = Math.floor(index / this.resultsPerPage);
	},

	update : function() {
		var table = this;
		$(this.elementList).find("tr:gt(0)").remove();
		if (this.page == 0) {
			this.previousPage.setAttribute('class', 'paginationButton previousPageDisabled');
			this.firstPage.setAttribute('class', 'paginationButton firstPageDisabled');
		} else {
			this.previousPage.setAttribute('class', 'paginationButton previousPageEnabled');
			this.firstPage.setAttribute('class', 'paginationButton firstPageEnabled');
		}
		if (this.page == this.pages - 1) {
			this.nextPage.setAttribute('class', 'paginationButton nextPageDisabled');
			this.lastPage.setAttribute('class', 'paginationButton lastPageDisabled');
		} else {
			this.nextPage.setAttribute('class', 'paginationButton nextPageEnabled');
			this.lastPage.setAttribute('class', 'paginationButton lastPageEnabled');
		}
		this.setPagesText();
		this.setResultsText();
		if (this.showSelectedItems) {
			var start = this.page * this.resultsPerPage;
			var items = 0;
			for (var i = 0; i < this.elements.length; i++) {
				if (items == start) {
					this.first = i;
					break;
				}
				if (this.elements[i].selected) {
					items++;
				}
			}
		} else {
			this.first = this.page * this.resultsPerPage;
		}
		//this.last = ( this.page + 1 == this.pages ) ? this.elements.length : this.first + this.resultsPerPage;
		var c = GeoTemConfig.getColor(this.id);
		var itemSet = [];
		var clearDivs = function() {
			for (var i = 0; i < itemSet.length; i++) {
				if (!itemSet[i].e.selected) {
					itemSet[i].e.highlighted = false;
					$(itemSet[i].div).css('background-color', table.options.unselectedCellColor);
				}
			}
		}
		var setHighlight = function(item, div) {
			var enter = function() {
				clearDivs();
				if (!item.selected) {
					item.highlighted = true;
					$(div).css('background-color', 'rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')');
					table.parent.triggerHighlight(item.object);
				}
			}
			var leave = function() {
				clearDivs();
				if (!item.selected) {
					table.parent.triggerHighlight();
				}
			}
			$(div).hover(enter, leave);
			$(div).mousemove(function() {
				if (!item.selected && !item.highlighted) {
					item.highlighted = true;
					$(div).css('background-color', 'rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')');
					table.parent.triggerHighlight(item.object);
				}
			});
		}
		var setSelection = function(item, div, checkbox) {
			var click = function(e) {
				var checked = $(checkbox).is(':checked');
				if (checked) {
					item.selected = true;
					item.highlighted = false;
				} else {
					item.selected = false;
					item.highlighted = true;
				}
				//if( e.target == div ){
				//	$(checkbox).attr('checked', !checked);
				//}
				table.parent.tableSelection();
			}
			//$(div).click(click);
			$(checkbox).click(click);
		}
		this.checkboxes = [];
		var items = 0;
		for (var i = this.first; i < this.elements.length; i++) {
			var e = this.elements[i];
			//vhz because of an error
			if ( typeof (e) == "undefined") {
				continue;
			}
			if (this.showSelectedItems && !e.selected) {
				continue;
			}
			var itemRow = $("<tr/>").appendTo(this.elementList);
			if (GeoTemConfig.allowFilter) {
				var checkColumn = $("<td/>").appendTo(itemRow);
				var checkbox = $("<input type='checkbox'/>").appendTo(checkColumn);
				$(checkbox).attr('checked', e.selected);
			}
			var makeSubtext = function(cell, text) {
				var subtext = text.substring(0, table.options.tableContentOffset);
				subtext = subtext.substring(0, subtext.lastIndexOf(' '));
				subtext += ' ... ';
				var textDiv = $("<div style='display:inline-block;'/>").appendTo(cell);
				$(textDiv).html(subtext);
				var show = false;
				var fullDiv = $("<div style='display:inline-block;'><a href='javascript:void(0)'>\>\></a></div>").appendTo(cell);
				$(fullDiv).click(function() {
					show = !show;
					if (show) {
						$(textDiv).html(text);
						$(fullDiv).html('<a href="javascript:void(0)">\<\<</a>');
					} else {
						$(textDiv).html(subtext);
						$(fullDiv).html('<a href="javascript:void(0)">\>\></a>');
					}
				});
			}
			for (var k = 0; k < table.keyHeaderList.length; k++) {
				var key = table.keyHeaderList[k];
				//vhz
				var text = e.object.tableContent[key];
				var cell = $("<td/>").appendTo(itemRow);
				if (table.options.tableContentOffset && text.length < table.options.tableContentOffset) {
					$(cell).html(text);
				} else {
					makeSubtext(cell, text);
				}
			}
			if (e.selected || e.highlighted) {
				$(itemRow).css('background-color', 'rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')');
			} else {
				$(itemRow).css('background-color', table.options.unselectedCellColor);
			}
			itemSet.push({
				e : e,
				div : itemRow
			});
			setHighlight(e, itemRow);
			if (GeoTemConfig.allowFilter) {
				setSelection(e, itemRow, checkbox);
				this.checkboxes.push(checkbox);
				$(checkColumn).css('text-align', 'center');
			}
			items++;
			if (items == this.resultsPerPage) {
				break;
			}
		}
	},

	show : function() {
		if (GeoTemConfig.allowFilter) {
			this.parent.filterBar.appendTo(this.selectors);
		}
		this.tableDiv.style.display = "block";
	},

	hide : function() {
		this.tableDiv.style.display = "none";
	},

	resetElements : function() {
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].selected = false;
			this.elements[i].highlighted = false;
		}
	},

	reset : function() {
		this.showSelectedItems = false;
		this.showElementsLength = this.elements.length;
		this.showSelected.setAttribute('class', 'smallButton showSelected');
		this.updateIndices(this.resultsPerPage);
	},

	initialize : function() {

		this.tableDiv = document.createElement("div");
		this.tableDiv.setAttribute('class', 'singleTable');
		this.parent.gui.input.appendChild(this.tableDiv);

		this.initToolbar();

		this.tableDiv.style.display = 'none';
		this.updateIndices(this.options.initialResultsPerPage);

		this.update();

	}
}

function TableElement(object) {

	this.object = object;
	this.selected = false;
	this.highlighted = false;

}
