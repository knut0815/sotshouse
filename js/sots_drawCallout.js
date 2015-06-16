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