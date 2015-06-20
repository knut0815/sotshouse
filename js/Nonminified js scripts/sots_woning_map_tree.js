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


//////////////////////////////////////////////////////
/////////////////// Draw the Map /////////////////////
//////////////////////////////////////////////////////
		
function drawMap(mapWrapper, colorScale, colorVar, mapTitle, width, height, margin) {
	
	////////////////////////////////////////////////////////////	
	///////////////////// Initiate Map /////////////////////////
	////////////////////////////////////////////////////////////
	
	var mapScale = (width+margin.left+margin.right > 450 ? 5500 : 4500);
	var mapMove = (width+margin.left+margin.right > 450 ? 50 : 40);
	
	// new projection
	var projection = d3.geo.mercator()
						.center(d3.geo.centroid(gemeentesGeo))
						.scale(mapScale)
						.translate([(width/2 + mapMove), (height/2 - 30)]);
	var path = d3.geo.path().projection(projection);

	mapWrapper.selectAll("path")
		.data(gemeentesGeo.features)
		.enter().append("path")
		.attr("d", path)
		.attr("id", function(d) {return d.properties.GM_CODE; })
		.attr("class", function(d) {return "gemeente map"})
		.style("opacity", 1)
		.style("stroke-width", 1)
		.style("stroke", "white")
		.style("fill", function(d) {		
			var value = eval("gemeentes[GM_CODES[d.properties.GM_CODE]]." + colorVar);
			
			if (gemeentes[GM_CODES[d.properties.GM_CODE]].NVM === "NO") return "#E8E8E8";
			else if (value < 0) return "#8C8C8C"
			else return colorScale(value);
		})
		.on("mouseover", fadeIn)
		.on("mouseout", fadeOut)
		.on("click", zoomTreemap);
		
}//drawMap

//When clicking on a city, zoom the treemap into the province
function zoomTreemap(d) {
	d3.selectAll(".cell." + d.properties.GM_CODE)
		.each(function(d) {zoom(d.parent, true); });
		  
}//zoomTreemap

///////////////////////////////////////////////////////////////////////////
//////////////////////// Create the legends ///////////////////////////////
///////////////////////////////////////////////////////////////////////////
function createMapLegend(wrapper, width, height, margin, title) {
	
	var legendRectSize = 10, //dimensions of the colored square
		legendMaxWidth = 100, //maximum size that the longest element will be - to center content
		legendSectorHeight = 14,
		legendTitleSection = 18,
		legendHeight = 40,
		yoff = 30,
		legendText = ["0%","0 - 5%","5% - 10%","> 10%","Daling in huishoudensgroei","Onbekend"];
	
	wrapper.attr("transform", "translate(" + (20) + "," + (margin.top + height - legendHeight - yoff) + ")");
	
	//Append title to Legend
	wrapper.append('text')                                     
		  .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
		  .attr("x", 0)
		  .attr("y", 0)
		  .attr("dy", "0.35em")
		  .attr("class", "legendTitle")
		  .style("text-anchor", "start")	
		  .style("font-size", "11px")
		  .text(title)
		  .call(wrap, 200); 
		  
	//Create container per rect/text pair  
	var colorLegend = wrapper.selectAll('.scatterLegendSquare')  	
			  .data(['#bdd203','#8abc0c','#61a421','#3c8a2e',"#8C8C8C","#E8E8E8"])                              
			  .enter().append('g')   
			  .attr('class', 'scatterLegendSquare') 
			  .attr('width', 100)
			  .attr('height', legendSectorHeight)
			  .attr("transform", function(d,i) { return "translate(" + 0 + "," + ((i+1) * legendSectorHeight + legendTitleSection) + ")"; });
	 
	//Non visible white rectangle behind square and text for better UX
	colorLegend.append('rect')                                     
		  .attr('width', legendMaxWidth) 
		  .attr('height', legendSectorHeight) 			  
		  .attr('transform', 'translate(' + 0 + ',' + 0 + ')') 		  
		  .style('fill', "white");
	//Append small squares to Legend
	colorLegend.append('rect')                                     
		  .attr('width', legendRectSize) 
		  .attr('height', legendRectSize) 			  
		  .attr('transform', 'translate(' + 0 + ',' + 0 + ')') 		  
		  .style('fill', function(d) {return d;});                                 
	//Append text to Legend
	colorLegend.append('text')                                     
		  .attr('transform', 'translate(' + (20) + ',' + (legendRectSize/2) + ')')
		  .attr("class", "legendText")
		  .style("text-anchor", "start")
		  .attr("dy", ".30em")
		  //.attr("fill", "#949494")
		  .style("font-size", "9px")			  
		  .text(function(d,i) { return legendText[i]; });  
		
}//function createScatterLegend

//////////////////////////////////////////////////////
/////////////// Create Map callout ///////////////////
//////////////////////////////////////////////////////

function drawCallout(calloutWrapper, topText, bottomText) {
	var calloutMarginLeft = 0,
		callOutNumbers = calloutMarginLeft + 190;
		
	calloutWrapper.append("text")
		.attr("class", "callout")
		.attr("id", "callout_title")
		.attr("transform", "translate(" + (calloutMarginLeft) + "," + (10) + ")")
		.style("font-size", "12px")
		.style("fill", "#0D0D0D")
		.text("Groningen");

	calloutWrapper.append("text")
		.attr("class", "callout")
		.style("fill", "#6E6E6E")
		.attr("transform", "translate(" + (calloutMarginLeft) + "," + (35) + ")")
		.text(topText);
		
	calloutWrapper.append("text")
		.attr("class", "callout")
		.style("fill", "#6E6E6E")
		.attr("transform", "translate(" + (calloutMarginLeft) + "," + (50) + ")")
		.text(bottomText);

	calloutWrapper.append("text")
		.attr("class", "callout")
		.attr("id", "callout_top")
		.attr("transform", "translate(" + (callOutNumbers+25) + "," + (35) + ")")
		.style("text-anchor", "end")
		.text("346");
		
	calloutWrapper.append("text")
		.attr("class", "callout")
		.attr("id", "callout_bottom")
		.attr("transform", "translate(" + (callOutNumbers+25) + "," + (50) + ")")
		.style("text-anchor", "end")
		.text("3467");
		
	calloutWrapper.append("line")
		.attr("class", "callout line")
		.style("stroke-width",  1)
		.style("stroke", "#D1D1D1")
		.style("shape-rendering", "crispEdges")
		.attr("x1", 0)
		.attr("x2", callOutNumbers*1.2)
		.attr("y1", 17)
		.attr("y2", 17);	
}//function drawCallout

//////////////////////////////////////////////////////
////////////////// Draw the Treemap //////////////////
//////////////////////////////////////////////////////

var zoomLevel,
	xTreeScale,
	yTreeScale,
	root,
	node,
	title,
	subTitle;

function drawTree(wrapper, subwrapper, colorScale, width, height, margin, sizeVar, colorVar) {

	//Create clip rectangle the size of the tree map
	var clip = wrapper.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("id", "clip-rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", width)
        .attr("height", height);
		
	//Set up chart title that will tell you which province you are viewing
	title = wrapper
		.append("text")
		.attr("class","treeTitle")
		.attr("transform", "translate(" + (width/2 + margin.left) + "," + (margin.top/2) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "18px")
		.style("fill", "#696969")
		.text("Nederland");
	subTitle = wrapper
		.append("text")
		.attr("class","treeSubTitle")
		.attr("transform", "translate(" + (width/2 + margin.left) + "," + (margin.top/2 + 15) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "11px")
		.style("fill", "#8F8F8F")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0em")
		.text("Klik op een gemeente om in te zoomen naar de bijbehorende provincie")
		.call(wrap, width*0.9);		
 
	xTreeScale = d3.scale.linear().range([0, width]),
	yTreeScale = d3.scale.linear().range([0, height]);

	var treemap = d3.layout.treemap()
		.round(false)
		.size([width, height])
		.sticky(true)
		.padding(2)
		.sort(comparator)
		.value(function(d) { return eval("d." + sizeVar); });

	node = root = provinciesTree;

	var nodes = treemap.nodes(root)
		  .filter(function(d) {return !d.children & eval("d." + sizeVar) > 0;});

	var cell = subwrapper.selectAll("g")
		  .data(nodes)
		.enter().append("g")
		  .attr("class", function(d) { return "cell " + d.GM_CODE; })
		  .on("click", function(d) { return zoom(node == d.parent ? root : d.parent, true); })
		  .on("mouseover", fadeIn)
		  .on("mouseout", fadeOut)
		  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		  .style("cursor", "pointer")
		  .append("svg")
		  .style("opacity", 1);

	cell.append("rect")
		  .attr("width", function(d) { return d.dx - 1; })
		  .attr("height", function(d) { return d.dy - 1; })
		  .style("fill", function(d) { return colorScale(eval("d." + colorVar)); });

	cell.append("text")
		  .attr("x", function(d) { return d.dx / 2; })
		  .attr("y", function(d) { return d.dy / 2; })
		  .attr("dy", ".35em")
		  .style("text-anchor", "middle")
		  .style("fill", "white")
		  .style("font-size", "9px")
		  .text(function(d) { return d.name; })
		  .style("opacity", function(d) { 
				d.w = this.getComputedTextLength(); 
				d.h = this.getBBox().height;
				if ( d.dx > (d.w * 1.1) & d.dy > (d.h) ) return 1;
				else return 0;
			});

	d3.select(window).on("click", function() { zoom(root, true); });
  
	////////////////////////////////////////////////////////////	
	////////////////////// Extra functions /////////////////////
	////////////////////////////////////////////////////////////		  
	function comparator(a, b) {
	  return b.order - a.order;
	}
	
}//function drawTree

function zoom(d, event) {
	zoomLevel = d.name;
	
	var kx = width / d.dx, ky = height / d.dy;
	xTreeScale.domain([d.x, d.x + d.dx]);
	yTreeScale.domain([d.y, d.y + d.dy]);

	var t = subwrapper.selectAll("g")
	  .transition()
	  .duration(750)
	  .attr("transform", function(d) { return "translate(" + xTreeScale(d.x) + "," + yTreeScale(d.y) + ")"; });

	t.select("rect")
	  .attr("width", function(d) { return kx * d.dx - 1; })
	  .attr("height", function(d) { return ky * d.dy - 1; })

	t.select("text")
	  .attr("x", function(d) { return kx * d.dx / 2; })
	  .attr("y", function(d) { return ky * d.dy / 2; })
	  .style("opacity", function(d) {
		  if (zoomLevel == "Nederland" ) {
			if ( (kx * d.dx) > (d.w * 1.1) & (ky * d.dy) > (d.h) ) return 1;
			else return 0;
		  } else { return 1;}
		});

	node = d;
	if(event) d3.event.stopPropagation();
	
	//Change the title above the 
	title.text(d.name);
	subTitle.text(zoomLevel === "Nederland" ? "Klik op een gemeente om in te zoomen naar de bijbehorende provincie" : "Klik om weer uit te zoomen naar Nederland");

	//////////////////////////////////////////////////////
	//////////////////// Change Map //////////////////////
	//////////////////////////////////////////////////////
	//Save al GM codes of the cities in the province
	var subset = [];
	gemeentes.forEach(function(d,i) {
		if (d.Provincie === zoomLevel) subset.push(d.GM_CODE);
	});
	//First make the map as it used to be
	map.selectAll("path")
		.style("fill", function(d) { 	
			var value = eval("gemeentes[GM_CODES[d.properties.GM_CODE]]." + colorVar);
			
			if (gemeentes[GM_CODES[d.properties.GM_CODE]].NVM === "NO") return "#E8E8E8";
			else if (value < 0) return "#8C8C8C"
			else return colorScale(value);
		});
	//Then set all cities which are not undefined but also do not belong to the clicked province to a dark grey
	if (zoomLevel != "Nederland") {
		map.selectAll("path")
			.filter(function(d) {return ($.inArray(d.properties.GM_CODE, subset) <= -1) & GM_CODES[d.properties.GM_CODE] != undefined; })
			.style("fill", "#8C8C8C");
	}//if
	
}//function zoom

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

////////////// Create the NL Map //////////////////

//Draw the NL map
drawMap(mapWrapper = map, colorScale = colorGreen, colorVar = "perc_groei_trans", 
		mapTitle = "", width = mapWidth, height = mapHeight, margin = mapMargin);
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

d3.select(".mapRowWrapper").on("click", fadeOut);