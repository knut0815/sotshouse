//////////////////////////////////////////////////////
/////////////////// Draw the Map /////////////////////
//////////////////////////////////////////////////////
		
function drawMap(mapWrapper, colorScale, colorVar, mapTitle, width, height) {
	
	////////////////////////////////////////////////////////////	
	///////////////////// Initiate Map /////////////////////////
	////////////////////////////////////////////////////////////
	
	// new projection
	var projection = d3.geo.mercator()
						.center(d3.geo.centroid(gemeentesGeo))
						.scale(5500)
						.translate([(width/2 + 50), (height/2 - 30)]);
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
		
	//Set up map title
	/*
	mapWrapper.append("g")
		.append("text")
		.attr("class","map title")
		.attr("transform", "translate(" + (width/2) + "," + (-20) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "20px")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.text(mapTitle)
		.call(wrap, 400);*/
		
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