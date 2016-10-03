function DrawLineChart(containerId, width, height, lines){
	/*
	process the data for line chart. compute the mean and std for each district 
	*/
	var hashmap = {};
	for(var i=1; i<lines.length; i++){
		var eachline = lines[i][0].split(',');
		var dID = eachline[2],
			rating = eachline[14],//numerical rating
			rank = eachline[15];//categorical rating
		if(hashmap[dID]==undefined)
			hashmap[dID] = [];
		hashmap[dID].push(parseInt(rating));
	}
	var svgData = [];
	for(var key in hashmap){
		var len = hashmap[key].length;
		var average = hashmap[key].reduce(function(a, b) {a+=b; return a;}, 0)/len;
		svgData.push([key, average]);
	}
	/*
	Draw the Line chart
	*/
	$("#"+containerId).empty();
	// $("#"+containerId).width(width);
	$("#"+containerId).height(height);
	var margin = {top: 20, right: 140, bottom: 40, left: 40},
		chartWidth = width - margin.left - margin.right,
		chartHeight = height - margin.top - margin.bottom;
	// get the minval and maxval on y axis.
	var minVal = d3.min(svgData, function(d){ return d[1];}),
		maxVal = d3.max(svgData, function(d){ return d[1];});
	// to have a better visualization effect, we properly scale down or up the max/min data
	minVal = (minVal<0?1.2:0.8)*minVal;
	maxVal = (maxVal<0?0.8:1.2)*maxVal;
	//create the mapping from x and y axis value to their actual value
	var x = d3.scale.linear().range([0, chartWidth]).domain([0, svgData.length]);
	var y = d3.scale.linear().range([chartHeight, 0]).domain([minVal, maxVal]);
	//create the axis data
	var xAxis = d3.svg.axis().scale(x).orient('bottom').innerTickSize(-chartHeight).outerTickSize(0).tickFormat(function(d){
		return svgData[d][0];//closure
	});
	var yAxis = d3.svg.axis().scale(y).orient('left').innerTickSize(-chartWidth).outerTickSize(0).tickFormat(d3.format("d"));
	//create the svg body and draw the mean line
	var svg = d3.select("#"+containerId).append('svg')
		.attr('width', width)
		.attr('height', height)
		.append("g")//the reason for appending g is that we can transform all the elements more conveniently
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	//create a clip for animation effect
	var clipPath = svg.append('clipPath')
		.attr('id', 'lct-rectclip')
		.append('rect')
		.attr('width', 0)
		.attr('height', height);
	var line = d3.svg.line()
		.interpolate('linear')
		.x(function(d, i) { 
			return x(i);
		})
		.y(function(d, i) { 
			return y(d[1]);
		});
	svg.datum(svgData);
	svg.append('path')
		.attr('class', 'lct-line')
		.attr('d', line)
		.attr('clip-path', 'url(#lct-rectclip)');
	//add axes and their title
	var axes = svg.append("g").attr("class", "lct-axis")
		.attr("transform", "translate(0," + chartHeight + ")")
		.call(xAxis);
	axes.append("g")
		.attr("class", "lct-axis")
		.attr("transform", "translate(0,-" + chartHeight + ")")
		.call(yAxis)
		.append("text")//add axis title
			.attr("y", 6)
			.attr("dy", ".71em")
			.attr("dx", ".71em")
			.style("text-anchor", "start")
			.text('Average Overall Rating Per District');
	// start the animation
	clipPath.transition()
		.duration(200*svgData.length)
		.attr("width", chartWidth);


	var markers = svg.selectAll('circle').data(svgData).enter().append('circle')
		.attr("r", 5)
		.attr("cx", function(d, i) { return x(i);})
		.attr("cy", function(d, i) { return y(d[1]);})
		.style("fill", function(d, i){
			if(d[1]<=74) return overallRatingColors[0];
			else if(d[1]>=75 && d[1]<=89) return overallRatingColors[1];
			else return overallRatingColors[2];
		})
		.on("mouseover", function(d, i){
			tooltip.html("<strong>Disctrict: </strong>" + d[0] 
			+ "<br><strong>Averaged Overall Rating: </strong>" + d[1].toFixed(2));
			return tooltip.style("visibility", "visible");
		})
		.on("mousemove", function(d){
      		// note that tooltip here is a global variable in global.js file
      		return tooltip.style("top",(event.pageY-10)+"px").style("left", (event.pageX+10)+"px");
      	})
      	.on("mouseout", function(d){
      		return tooltip.style("visibility", "hidden");
      	});
    svg.append('g')
	   .attr('transform', 'translate(' + (chartWidth/2-margin.left) + ','+ (chartHeight+margin.bottom)+')')
	   .append('text')
	   .text('District ID');
	var legend = svg.append('g')
    	.attr('class', 'legend')
    	.attr("transform", "translate(" + chartWidth + ",20)")
    legend.selectAll('g').data(cateogricalMappings)
    	.enter()
    	.append('g')
    	.each(function(d, i){
    		var g = d3.select(this);
    		g.append('circle')
    			.attr('cx', 16)
    			.attr('cy', i*16)
    			.attr('r', 7)
    			.style('fill', overallRatingColors[i]);
    		g.append('text')
    			.attr('x', 25)
    			.attr('y', i*18)
    			.attr('dy', '.2em')
    			.style('fill', overallRatingColors[i])
    			.text(d);
    	});
}