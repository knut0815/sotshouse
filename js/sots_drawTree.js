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
		.text("Klik op een gemeente om in te zoomen naar de bijbehorende provincie");			
 
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