//////////////////////////////////////////////////////
/////////////// Draw the Scatter plot ////////////////
//////////////////////////////////////////////////////
						 
function drawScatter(data, wrapper, width, height, margin,
					xScale, yScale, rScale,
					xVar, yVar, rVar, colorVar, chartTitle, 
					xLabel, yLabelTop, yLabelBottom) {
							 
	//////////////////////////////////////////////////////
	/////////////////// Initialize Axes //////////////////
	//////////////////////////////////////////////////////

	//Set the new x axis range - Already done in parent function
	//var xScale = d3.scale.log()
	//	.range([0, width])
	//	.domain(d3.extent(data, function(d) {return eval("d." + xVar);}))
	//	.nice();
		
	//Set new x-axis	
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.ticks(6, ",d")
		.scale(xScale)
		//.tickFormat(function (d) {
		//	return xScale.tickFormat(4,d3.format(",d"))(d);
		//})
		;	

	//Append the x-axis
	wrapper.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + height + ")")
		.call(xAxis);
			
	//Set the new y axis range - Already done in parent function
	//var yScale = d3.scale.linear()
	//	.range([height,0])
	//	.domain(d3.extent(data, function(d) {return eval("d." + yVar);}))
	//	.nice();
		
	var yAxis = d3.svg.axis()
		.orient("left")
		.ticks(6, ",d")
		.scale(yScale);	

	//Append the y-axis
	wrapper.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + 0 + "," + 0 + ")")
			.call(yAxis);
			
	////////////////////////////////////////////////////////////	
	/////////////////// Scatterplot Circles ////////////////////
	////////////////////////////////////////////////////////////	
	//var rScale = d3.scale.sqrt()
	//				.range([0, 20])
	//				.domain([0, d3.max(data, function(d) {return eval("d." + rVar);})]);
	
	wrapper.selectAll(".circleScatter")
			.data(data)
			.enter().append("circle")
				.attr("class", function(d) { return "circleScatter gemeente " + d.GM_CODE; })
				.style("opacity", 0.6)
				.style("fill", function(d) {
					if (colorVar.charAt(0) == "#") return colorVar;
					else return color(eval("d." + colorVar));
				})
				.attr("cx", function(d) {return xScale(eval("d." + xVar));})
				.attr("cy", function(d) {return yScale(eval("d." + yVar));})
				.attr("r", function(d) {return rScale(eval("d." + rVar));});
				
	////////////////////////////////////////////////////////////// 
	//////////////////////// Voronoi ///////////////////////////// 
	////////////////////////////////////////////////////////////// 

	//Initiate the voronoi function
	var voronoi = d3.geom.voronoi()
		.x(function(d) { return xScale(eval("d." + xVar)); })
		.y(function(d) { return yScale(eval("d." + yVar)); })
		.clipExtent([[0, 0], [width, height]]);

	//Initiate the voronoi group element	
	var voronoiGroup = wrapper.append("g")
		.attr("class", "voronoi");
		
	voronoiGroup.selectAll("path")
		.data(voronoi(data))
		.enter().append("path")
		.attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
		.datum(function(d, i) { return d.point; })
		.attr("class", function(d) { return "voronoiCells gemeente " + d.GM_CODE; })
		//.style("stroke", "red")
		.on("mouseover", showScatterTooltip)
		.on("mouseout",  function (d,i) { removeScatterTooltip.call(this, d, i); });

	//////////////////////////////////////////////////////
	///////////////// Initialize Labels //////////////////
	//////////////////////////////////////////////////////

	//Set up X axis label
	wrapper.append("g")
		.append("text")
		.attr("class", "x axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom*2/3) + ")")
		.style("font-size", "10px")
		.text(xLabel);

	//Set up y axis label
	wrapper.append("g")
		.append("text")
		.attr("class", "y axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + 0 + "," + (-margin.top*2/3) + ")")
		.style("font-size", "10px")
		.text(yLabelTop);

	wrapper.append("g")
		.append("text")
		.attr("class", "y axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + 0 + "," + (-margin.top*2/3 + 13) + ")")
		.style("font-size", "10px")
		.text(yLabelBottom);

	//Set up chart title
	wrapper.append("g")
		.append("text")
		.attr("class","chartTitle")
		.attr("transform", "translate(" + (width/2) + "," + (-margin.top*1/2) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.text(chartTitle);	
		
}// function drawScatter

//Hide the tooltip when the mouse moves away
function removeScatterTooltip (d, i) {

	//Which chart is being hovered over
	var element = d3.selectAll(".circleScatter.gemeente."+d.GM_CODE);	
		
	//Fade out the bubble again
	element.style("opacity", 0.5);
	
	//Hide tooltip
	$('.popover').each(function() {
		$(this).remove();
	}); 
  
	//Fade out guide lines, then remove them
	d3.selectAll(".guide")
		.transition().duration(200)
		.style("opacity",  0)
		.remove()
		
	scatterChart.selectAll(".circleScatter")
		.style("fill", "#81BC00")
		.style("opacity", 0.6);
		
}//function removeScatterTooltip

//Show the tooltip on the hovered over slice
function showScatterTooltip (d, i) {
	
	//Find the hovered over circle belonging to the Voronoi
	var element = d3.selectAll(".circleScatter.gemeente."+d.GM_CODE);
	var chosen = d;	

	//Define and show the tooltip
	$(element).popover({
		placement: 'auto top',
		container: '.dataresource.scatter',
		trigger: 'manual',
		html : true,
		content: function() { 
			return "<p style='font-size: 11px; text-align: center;'>" + d.GM_NAAM + "</p>"; }
	});
	$(element).popover('show');

	//Make chosen circle more visible
	element.style("opacity", 1);
	
	//Append lines to bubbles that will be used to show the precise data points
	//vertical line
	scatterChart.append("g")
		.attr("class", "guide")
		.append("line")
			.attr("x1", element.attr("cx"))
			.attr("x2", element.attr("cx"))
			.attr("y1", +element.attr("cy"))
			.attr("y2", (scatterHeight))
			.style("stroke", "#3c8a2e")
			.style("opacity",  0)
			.style("pointer-events", "none")
			.transition().duration(400)
			.style("opacity", 0.5);
	//horizontal line
	scatterChart.append("g")
		.attr("class", "guide")
		.append("line")
			.attr("x1", +element.attr("cx"))
			.attr("x2", 0)
			.attr("y1", element.attr("cy"))
			.attr("y2", element.attr("cy"))
			.style("stroke", "#3c8a2e")
			.style("opacity",  0)
			.style("pointer-events", "none")
			.transition().duration(400)
			.style("opacity", 0.5);

	scatterChart.selectAll(".circleScatter.gemeente")
		.style("fill", function(d) { 
			if (d.GM_CODE == chosen.GM_CODE) return "#3c8a2e";
			else return "#81BC00";				
		})
		.style("opacity", function(d) {
			if (d.GM_CODE == chosen.GM_CODE) return 1;
			else return 0.1;
		});
			
}//function showScatterTooltip
