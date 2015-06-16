///////////////////////////////////////////////////////////////////////////
////////////// State of the State Woningmarkt Main Code ///////////////////
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
//////////////////////////// Initiate Map NL  /////////////////////////////
///////////////////////////////////////////////////////////////////////////
//General widths and heights	
var mapMargin = {left: 50, top: 20, right: 40, bottom: 60},
	mapWidth = Math.min($(".dataresource.map").width(),500) - mapMargin.left - mapMargin.right,
	mapHeight =  Math.max(550, mapWidth*7/5) - mapMargin.top - mapMargin.bottom;

//Create SVG inside the div	
var svgMap = d3.select(".dataresource.map").append("svg")
		.attr("width", (mapWidth + mapMargin.left + mapMargin.right))
		.attr("height", (mapHeight + mapMargin.top + mapMargin.bottom));
		
//Create g elements for each group of chart elements	
var map = svgMap.append("g").attr("class", "map")
		.attr("transform", "translate(" + mapMargin.left + "," + mapMargin.top + ")");
var mapCallout = svgMap.append("g").attr("class", "mapCallout")
		.attr("transform", "translate(" + (5) + "," + (mapMargin.top * 3/4) + ")")
		.style("visibility", "hidden");
var mapLegendWrapper = svgMap.append("g").attr("class", "legend");

///////////////////////////////////////////////////////////////////////////
/////////////////////////// Initiate Tree Maps  ///////////////////////////
///////////////////////////////////////////////////////////////////////////
var treeMargin = {left: 50, top: 60, right: 40, bottom: 20},
	treeWidth = Math.min($(".dataresource.treemap.potentie").width(),700) - treeMargin.left - treeMargin.right,
	treeHeight = mapHeight + 50 - (treeMargin.top - mapMargin.top);
	
//Potentie
var svgTreePotentie = d3.select(".dataresource.treemap.potentie").append("svg")
		.attr("width", (treeWidth + treeMargin.left + treeMargin.right))
		.attr("height", (treeHeight + treeMargin.top + treeMargin.bottom));
	
var treeMapChartPotentie = svgTreePotentie.append("g")
		.attr("class", "chart")
		.attr("transform", "translate(" + treeMargin.left + "," + treeMargin.top + ")")
		.attr("clip-path", "url(#clip)"); //Clip path
	
var treeLegendWrapperPotentie = svgTreePotentie.append("g").attr("class", "legend");

///////////////////////////////////////////////////////////////////////////
//////////////////////// Initiate Scatter plot  ///////////////////////////
///////////////////////////////////////////////////////////////////////////
var scatterMargin = {left: 40, top: 20, right: 40, bottom: 100},
	scatterWidth = $(".dataresource.scatter").width() - scatterMargin.left - scatterMargin.right,
	scatterHeight = Math.min(700, Math.max(500, $(window).height() - 120)) - scatterMargin.top - scatterMargin.bottom;

//Potentie
var svgScatter = d3.select(".dataresource.scatter").append("svg")
		.attr("width", (scatterWidth + scatterMargin.left + scatterMargin.right))
		.attr("height", (scatterHeight + scatterMargin.top + scatterMargin.bottom));
	
var scatterChart = svgScatter.append("g")
		.attr("class", "chartScatter")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
	
///////////////////////////////////////////////////////////////////////////
///////////////////// Initiate global variables ///////////////////////////
///////////////////////////////////////////////////////////////////////////

var GM_CODES = [],
	allGemeentes = [],
	GM_NAMES = [];
gemeentes.forEach(function(d,i) {
			GM_CODES[d.GM_CODE] = i;
			allGemeentes[i] = d.GM_NAAM;
			GM_NAMES[d.GM_NAAM] = d.GM_CODE;
});

var colorGreen = d3.scale.threshold()
			.range(['#bdd203','#8abc0c','#61a421','#3c8a2e'])
			.domain([0.0001,0.05,0.1]);							  
								  
///////////////////////////////////////////////////////////////////////////
/////////////////////////// Initiate charts ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Draw the NL map
drawMap(mapWrapper = map, colorScale = colorGreen, colorVar = "perc_groei_trans", 
		mapTitle = "", width = mapWidth, height = mapHeight);
//Draw the legend below the map
createMapLegend(mapLegendWrapper, mapWidth, mapHeight, mapMargin, "Huishoudensgroei in potentie op te vullen door kantorentransformatie")

//Initiate the call out
drawCallout(calloutWrapper = mapCallout, topText = "Verwachte huishoudensgroei tot 2025", bottomText = "Woningen door kantorentransformatie");

////////////// Create the search box //////////////////

//Create new options
var options = allGemeentes;
var select = document.getElementById("searchBoxMapNL"); 
//Put new options into select box
for(var i = 0; i < options.length; i++) {
	var opt = options[i];
	var el = document.createElement("option");
	el.textContent = opt;
	el.value = opt;
	select.appendChild(el);
}
//Create combo box
$('.combobox').combobox();


//////////////////// Treemap //////////////////////

//Draw the Potentie treeMap
drawTree(wrapper = svgTreePotentie, subwrapper = treeMapChartPotentie, colorScale = colorGreen, width = treeWidth, 
		 height = treeHeight, margin = treeMargin, sizeVar = "potentie_leegstand_m2", colorVar = "perc_groei_trans", title = "");
	
//////////////////// Connected scatterplot //////////////////////


//Set the new x axis range
var yScaleScatter = d3.scale.linear()
	.range([scatterHeight, 0])
	.domain([0, gemeentesPlanning.length])
	.nice();
	
//Groups for each row
var scatterElement = scatterChart.selectAll(".wrappingElement")
			.data(gemeentesPlanning)
			.enter().append("g")
				.attr("class", "wrappingElement")
				.attr("transform", function(d, i) {return "translate(0," + yScaleScatter(i) + ")" ;});

//When you click the buttons
d3.select("#totalButton").on("click", function(d){ 
		scatterChart.selectAll(".wrappingElement")
				.transition().duration(1000)
				.attr("transform", function(d, i) {return "translate(0," + yScaleScatter(d.orderTotal - 1) + ")" ;})
});
d3.select("#transButton").on("click", function(d){ 
		scatterChart.selectAll(".wrappingElement")
				.transition().duration(1000)
				.attr("transform", function(d, i) {return "translate(0," + yScaleScatter(d.orderTrans - 1) + ")" ;})
});
d3.select("#planButton").on("click", function(d){ 
		scatterChart.selectAll(".wrappingElement")
				.transition().duration(1000)
				.attr("transform", function(d, i) {return "translate(0," + yScaleScatter(d.orderPlan - 1) + ")" ;})
});
d3.select("#housesButton").on("click", function(d){ 
		scatterChart.selectAll(".wrappingElement")
				.transition().duration(1000)
				.attr("transform", function(d, i) { return "translate(0," + yScaleScatter(d.orderHouses - 1) + ")" ;})
});

//Draw the scatterplot	
initiateScatter(gemeentesPlanning, scatterWidth, scatterHeight, scatterMargin);
	
///////////////////////////////////////////////////////////////////////////
///////////////////// Initiate Scatterplot visual /////////////////////////
///////////////////////////////////////////////////////////////////////////

function initiateScatter(data, width, height, margin) {

	var moveToRight = 70,
		barChartWidth = Math.min(220, (width-moveToRight)*0.25);
	
	//////////////////////////////////////////////////////
	/////////////////// Initialize Axes //////////////////
	//////////////////////////////////////////////////////
	
	//Set the new x axis range
	var xScale = d3.scale.linear()
		.range([moveToRight, width-barChartWidth])
		//.domain(d3.extent(data, function(d) {return d.perc_total;}))
		.domain([0,2.75]);
		
	//Set new x-axis	
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.ticks(6)
		.scale(xScale)
		.tickFormat(numFormatPercent);	

	//Append the x-axis
	scatterChart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + (height + 25) + ")")
		.call(xAxis);
		
	//Set the scale for the bubble size
	var rScale = d3.scale.sqrt()
		.range([0, 20])
		.domain([0, d3.max(data, function(d) {return d.houses_need;})]);		
				
	////////////////////////////////////////////////////////////	
	//////////////////// Connecting Lines //////////////////////
	////////////////////////////////////////////////////////////					

	//Lines behind the entire chart width
	scatterElement.append("line")
				.attr("class", "backgroundLine")
				.style("opacity", 0.4)
				.attr("x1", xScale.range()[0])
				.attr("x2", xScale.range()[1])
				.attr("y1", 0)
				.attr("y2", 0);
				
	//Lines connecting the two circles
	scatterElement.append("line")
				.attr("class", "connectLine")
				.style("opacity", 0.6)
				.attr("x1", function(d) {return xScale(d.perc_planning) + 5;})
				.attr("x2", function(d) {return xScale(d.perc_total) - 5;})
				.attr("y1", 0)
				.attr("y2", 0);
				
	////////////////////////////////////////////////////////////	
	/////////////////// Scatterplot Circles ////////////////////
	////////////////////////////////////////////////////////////					
				
	//Planning circles
	scatterElement.append("circle")
				.attr("class", function(d) { return "circleScatter planning " + d.GM_CODE; })
				.style("opacity", 0.8)
				.style("fill", "#8C8C8C")
				.attr("cx", function(d) {return xScale(d.perc_planning);})
				.attr("cy", 0)
				.attr("r", 5);
				//.attr("r", function(d) {return rScale();});

	//Planning+transformation circles
	scatterElement.append("circle")
				.attr("class", function(d) { return "circleScatter total " + d.GM_CODE; })
				.style("opacity", 0.8)
				.style("fill", "#81BC00")
				.attr("cx", function(d) {return xScale(d.perc_total);})
				.attr("cy", 0)
				.attr("r", 5);
				//.attr("r", function(d) {return rScale();});

	////////////////////////////////////////////////////////////	
	//////////////////// Scatterplot Labels ////////////////////
	////////////////////////////////////////////////////////////	

	//Names of the cities
	scatterElement.append("text")
				.attr("class", "legendTitle")
				.style("text-anchor", "end")	
				.style("font-size", "12px")
				.attr("x", xScale(0) - 10)
				.attr("y", 0)
				.attr("dy", "0.35em")
				.text(function(d) { return d.GM_NAAM; });

	////////////////////////////////////////////////////////////	
	////////////////// Bar chart at the right //////////////////
	////////////////////////////////////////////////////////////	

	var barStart = width - barChartWidth + 20,
		barHeight = Math.round(height/data.length * 0.7);
		
	//Set the bar scale
	var barScale = d3.scale.linear()
		.range([0, barChartWidth])
		//.domain(d3.extent(data, function(d) {return d.houses_need;}));
		.domain([0,40000]);

	//Create the bar scale axis	
	var barAxis = d3.svg.axis()
		.orient("bottom")
		.ticks(2)
		.scale(barScale)
		.tickFormat(NLformat);	

	//Append the bar scale axis
	scatterChart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + barStart + "," + (height + 25) + ")")
		.call(barAxis);
	
	//Create the bars themselves
	scatterElement.append("rect")
				.attr("class", "scatterBar")
				.attr("x", barStart)
				.attr("y", - barHeight/2)
				.attr("width", function(d) { return barScale(d.houses_need); })
				.attr("height", barHeight)
				.style("fill", "#DCDCDC");
	
	//////////////////////////////////////////////////////
	////////////// Initialize Axis Texts /////////////////
	//////////////////////////////////////////////////////	
	
	//Set up X axis label
	scatterChart.append("g")
		.append("text")
		.attr("class", "x axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (moveToRight + (width-moveToRight-barChartWidth)/2) + "," + (height + 60) + ")")
		.style("font-size", "10px")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0em")
		.text("Percentage van verwachte huishoudensgroei 2025")
		.call(wrap, (width-moveToRight-barChartWidth)*0.9);
		
	//Create the g group to hold the data
	var medianLine = scatterChart.append("g").attr("class", "median")
		.style("cursor", "default");
	//The line itself
	medianLine.append("line")
		.attr("x1", xScale(1))
		.attr("x2",  xScale(1))
		.attr("y1", 30)
		.attr("y2", height + 15)
		.style("stroke", "#B5B5B5")
		.style("shape-rendering", "crispEdges")
		.style("stroke-dasharray", "2 2")
		.style("pointer-events", "none");	
	//The word above the line
	//medianLine.append("text")
	//	.attr("class","legendText")
	//	.attr("transform", "translate(" + (5) + "," + (8) + ")")
	//	.style("text-anchor", "start")
	//	.text("Gemiddelde");	

	//Set up bar chart axis label
	scatterChart.append("g")
		.append("text")
		.attr("class", "bar chart label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (barStart + barChartWidth/2) + "," + (height + 60) + ")")
		.style("font-size", "10px")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0em")
		.text("Verwachte huishoudensgroei tot 2025 (absoluut)")
		.call(wrap, barChartWidth*0.9);
		
	//////////////////////////////////////////////////////
	///////////////// Initialize Legend //////////////////
	//////////////////////////////////////////////////////
	
	//Create a wrapper for the circle legend				
	var legendCircle = scatterChart.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (width/2) + "," + (scatterMargin.top/2) +")");
	
	//The grey circle
	legendCircle.append("text")
		.attr("class","legendTitle")
		.attr("x", -110)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.style("text-anchor", "start")
		.text("Plancapaciteit");
	legendCircle.append("circle")
        .attr('r', 5)
        .attr('cx', -120)
        .attr('cy', 0)
		.style("opacity", 0.8)
		.style("fill", "#8C8C8C");	

	//The green circle
	legendCircle.append("text")
		.attr("class","legendTitle")
		.attr("x", 30)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.style("text-anchor", "start")
		.text("Plancapaciteit incl. transformatiepotentie");
	legendCircle.append("circle")
        .attr('r', 5)
        .attr('cx', 20)
        .attr('cy', 0)
		.style("opacity", 0.8)
		.style("fill", "#81BC00");			
	
}//initiateScatter

///////////////////////////////////////////////////////////////////////////
//////////////////// Hover and Search functions ///////////////////////////
///////////////////////////////////////////////////////////////////////////

function searchEventMapNL(chosen) {
				
	//If the chosen county is not equal to the default, find that name and highlight it - mouseover function
	if (chosen != "") {
		fadeIn(chosen);
	} else {
		fadeOut();
	}//else
	
}//searchEventMapNL

//Function on mouseover of gemeente
function fadeIn(d) {

	//The location of GM_CODE differs per dataset, check where the mouse over happens; map or plot
	if (typeof(d) === "string") { 
		var chosen = {
				GM_NAAM: d,
				GM_CODE: GM_NAMES[d]
			};
	}
	else if(hasClass(d3.select(this), "cell")) var chosen = d;
	else var chosen = d.properties;

	//Highlight the chosen gemeente in other plots
	map.selectAll("path")
		.style("opacity", function(d) {
			if (d.properties.GM_CODE == chosen.GM_CODE) return 1;
			else return 0.2;
		});
		
	//If the gemeente is known, highlight in the treemap
	if (GM_CODES[chosen.GM_CODE] != undefined) {
		treeMapChartPotentie.selectAll("g.cell")
			.style("opacity", function(d) {
				if (d.GM_CODE == chosen.GM_CODE) return 1;
				else return 0.2;
			});	
	}//if
	
	//Update callout text and numbers
	mapCallout.selectAll("#callout_title").text(chosen.GM_NAAM);
	//Do not show anything for missing data
	if (GM_CODES[chosen.GM_CODE] === undefined) {
		mapCallout.selectAll("#callout_top").text("-");
		mapCallout.selectAll("#callout_bottom").text("-");
	} else if (gemeentes[GM_CODES[chosen.GM_CODE]].NVM === "NO") {
		mapCallout.selectAll("#callout_top").text(NLformat(Math.round(gemeentes[GM_CODES[chosen.GM_CODE]].behoefte_woningen/10,0)*10));
		mapCallout.selectAll("#callout_bottom").text("-")
	} else {
		mapCallout.selectAll("#callout_top").text(NLformat(Math.round(gemeentes[GM_CODES[chosen.GM_CODE]].behoefte_woningen/10,0)*10));
		mapCallout.selectAll("#callout_bottom").text(NLformat(Math.round(gemeentes[GM_CODES[chosen.GM_CODE]].kantoren_woningen/10,0)*10));
	}//else
	mapCallout.style("visibility", "visible");
	
}//fadeIn

//Function on mouseout of gemeente
function fadeOut(d) {
	mapCallout.style("visibility", "hidden");
	
	map.selectAll("path")
		.style("opacity", 1);
			
	treeMapChartPotentie.selectAll("g.cell")
		.style("opacity", 1);		
}//fadeOut	

	
function paletteGreen(min, max) {
	var d = (max-min)/5;
	return d3.scale.threshold()
		.range(['#bdd203','#93c201','#72b015','#589d25','#3c8a2e'])
		.domain([min+1*d,min+2*d,min+3*d,min+4*d]);
}