///////////////////////////////////////////////////////////////////////////
////////////// State of the State Woningmarkt Main Code ///////////////////
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
//////////////////////////// Initiate Map NL  /////////////////////////////
///////////////////////////////////////////////////////////////////////////
//General widths and heights	
var mapMargin = {left: 50, top: 20, right: 40, bottom: 60},
	mapWidth = Math.min($(".dataresource.map").width(),500) - mapMargin.left - mapMargin.right,
	mapHeight = mapWidth*7/5 - mapMargin.top - mapMargin.bottom;

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
var treeMargin = {left: 50, top: 50, right: 40, bottom: 60},
	treeWidth = Math.min($(".dataresource.treemap.potentie").width(),500) - treeMargin.left - treeMargin.right,
	treeHeight = mapHeight - (treeMargin.top - mapMargin.top);
	
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
var scatterMargin = {left: 70, top: 40, right: 40, bottom: 60},
	scatterWidth = Math.min($(".dataresource.scatter").width(),700) - scatterMargin.left - scatterMargin.right,
	scatterHeight = scatterWidth*3/5;
	
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

var GM_CODES = [];
gemeentes.forEach(function(d,i) {
			GM_CODES[d.GM_CODE] = i;
});

//Green color palette for Map
//var colorGreen = paletteGreen(d3.min(gemeentes, function(d) { return d.perc_groei_trans; }), 
//							  d3.max(gemeentes, function(d) { return d.perc_groei_trans; }));

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
createMapLegend(mapLegendWrapper, mapWidth, mapHeight, "% dat kan voldoen aan de huisvraag door transformatie")

//Initiate the call out
drawCallout(calloutWrapper = mapCallout, topText = "Groei aan woningen tot 2030", bottomText = "Nieuwe woningen door transformatie");

//Draw the Potentie treeMap
drawTree(wrapper = svgTreePotentie, subwrapper = treeMapChartPotentie, colorScale = colorGreen, width = treeWidth, 
		 height = treeHeight, margin = treeMargin, sizeVar = "potentie", colorVar = "perc_groei_trans", title = "");
	
//Draw the scatterplot	
initiateScatter(scatterWidth, scatterHeight, scatterMargin);

///////////////////////////////////////////////////////////////////////////
///////////////////// Initiate Scatterplot visual /////////////////////////
///////////////////////////////////////////////////////////////////////////

function initiateScatter(width, height, margin) {

	var data = gemeentes.filter(function(d) { return d.behoefte_woningen > 0 & d.leegstand_m2 > 1000 & d.potentie_m2 > 1000; });
	
	//Set the new x axis range
	var xScale = d3.scale.log()
		.range([0, width])
		.domain([1001, d3.max(data, function(d) {return d.leegstand_m2;})])
		.nice();

	//Set the new y axis range
	var yScale = d3.scale.log()
		.range([height,0])
		.domain([1001, d3.max(data, function(d) {return d.potentie_m2;})])
		.nice();
	
	//Set the scale for the bubble size
	var rScale = d3.scale.sqrt()
		.range([0, 20])
		.domain([0, d3.max(data, function(d) {return d.behoefte_woningen;})]);
	
	// Create gemeente scatter plot
	drawScatter(data = data, wrapper = scatterChart, 
			width = width, height = height, margin = margin,
			xScale = xScale, yScale = yScale, rScale = rScale,
			xVar = "leegstand_m2", yVar = "potentie_m2", rVar = "behoefte_woningen", 
			colorVar = "#81BC00", 
			chartTitle = "", xLabel = "Leegstand van kantoren [m2]", yLabelTop = "Transformatie potentie", yLabelBottom = "[m2]");
	
	
	/*
	//Create the g group to hold the data
	var medianLine = scatterChart.append("g").attr("class", "median")
		//.attr("transform", "translate(" + 0 + "," + yScale(avgs) + ")")
		.style("cursor", "default");
	//The line itself
	medianLine.append("line")
		.attr("x1", xScale.range()[0])
		.attr("x2",  xScale.range()[1])
		.attr("y1", yScale(xScale.domain()[0]))
		.attr("y2", yScale(xScale.domain()[1]))
		.style("stroke", "#B5B5B5")
		.style("pointer-events", "none");	
	//The word above the line
	//medianLine.append("text")
	//	.attr("class","legendText")
	//	.attr("transform", "translate(" + (5) + "," + (8) + ")")
	//	.style("text-anchor", "start")
	//	.text("Gemiddelde");	
	*/
	
	//////////////////////////////////////////////////////
	///////////////// Initialize Legend //////////////////
	//////////////////////////////////////////////////////

	var legend = scatterChart.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 30) + "," + (scatterHeight - 60) +")");
					
	bubbleLegend(legend, rScale, legendSizes = [15000, 5000, 500], legendName = "De groei in huishoudens");	


	//Create a wrapper for the circle legend				
	var legendCircle = scatterChart.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 130) + "," + (scatterHeight - 60) +")");
	
	legendCircle.append("text")
		.attr("class","legendTitle")
		.attr("transform", "translate(" + 0 + "," + -25 + ")")
		.attr("x", 0 + "px")
		.attr("y", 0 + "px")
		.attr("dy", "1em")
		.text("Elke cirkel is een gemeente")
		.call(wrap, 80);
	legendCircle.append("circle")
        .attr('r', rScale(5000))
        .attr('class',"legendCircle")
        .attr('cx', 0)
        .attr('cy', rScale(5000) + 7);	
	
}//initiateScatter

///////////////////////////////////////////////////////////////////////////
///////////// Initiate global functions to Woningmarkt ////////////////////
///////////////////////////////////////////////////////////////////////////

//Function on mouseover of gemeente
function fadeIn(d) {

	//The location of GM_CODE differs per dataset, check where the mouse over happens; map or plot
	if(hasClass(d3.select(this), "cell")) var chosen = d;
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
	} else {
		mapCallout.selectAll("#callout_top").text(Math.round(gemeentes[GM_CODES[chosen.GM_CODE]].behoefte_woningen/10,0)*10);
		mapCallout.selectAll("#callout_bottom").text(Math.round(gemeentes[GM_CODES[chosen.GM_CODE]].kantoren_woningen/10,0)*10);
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