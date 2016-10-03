function DrawStackedBarChart(containerId, width, height, lines){
	/*
	Extract the data by each teacher
	*/
	var hashmap = [];
	for(var i=1; i<lines.length; i++){
		var eachline = lines[i][0].split(',');
		eachline.splice(0, 6);
		hashmap.push(eachline);
	}
	hashmap.sort(function(a, b){ return parseInt(b[b.length-2])-parseInt(a[a.length-2]);})//descending order for numerical overall rating
	var remapped = ['', '', ''].map(function(data, i){
		return hashmap.map(function(d, ii){
			return {x: ii, y: parseInt(d[2*i+2])};
		});
	});

	$("#"+containerId).empty();
	$("#"+containerId).height(height);
	var margin = {top: 20, right: 140, bottom: 60, left: 40},
		chartWidth = width - margin.left - margin.right,
		chartHeight = height - margin.top - margin.bottom;
	//generate stacked bar chart data
	var stacked = d3.layout.stack()(remapped);
	var x = d3.scale.ordinal().rangeRoundBands([0, chartWidth]).domain(stacked[0].map(function(d) {return d.x;}));
	// map the y location
	var y0 = d3.scale.linear().range([chartHeight, 0]).domain([0, d3.max(hashmap, function(d){ 
		return parseInt(d[d.length-2]);//get the max of the overall rating
	})*1.2]);
	// map the height
	var y = d3.scale.linear().range([0, chartHeight]).domain([0, d3.max(hashmap, function(d){ 
		return parseInt(d[d.length-2]);//get the max of the overall rating
	})*1.2]);
	var xAxis = d3.svg.axis().scale(x).orient('bottom').innerTickSize(-chartHeight).outerTickSize(0).tickFormat(function(d) { return hashmap[d][0];});
	var yAxis = d3.svg.axis().scale(y0).orient('left').innerTickSize(-chartWidth).outerTickSize(0).tickFormat(d3.format("d"));
    var svg = d3.select("#"+containerId).append('svg')
		.attr('width', width)
		.attr('height', height)
		.append("g")//the reason for appending g is that we can transform all the elements more conveniently
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var stack = svg.selectAll('g.stacked')
    	.data(stacked)
    	.enter()
    	.append('g')
    	.attr('class', 'bct-g')
    	.style('fill', function(d, i) { return ratingColors[i];})
    	.style("stroke", function(d, i) { return d3.rgb(ratingColors[i]).darker(); })
    	.style('opacity', 1.0)
    	.selectAll('rect')
   		.data(function(d) {return d;})
   		.enter()
   		.append('rect')
   		.attr('x', function(d){
   			return x(d.x);
   		})
   		.attr('y', function(d){
   			return chartHeight;
   		})
   		.attr('width', x.rangeBand())
   		.attr('height', function(d){
   			return 0;
   		})
   		.on("mouseover", function(d, i){
   			var each = hashmap[i];
			tooltip.html("<strong>Overall Rating: </strong><span>" + each[each.length-2] + "</span>");
			return tooltip.style("visibility", "visible");
		})
		.on("mousemove", function(d){
      		// note that tooltip here is a global variable in global.js file
      		return tooltip.style("top",(event.pageY-10)+"px").style("left", (event.pageX+10)+"px");
      	})
      	.on("mouseout", function(d){
      		return tooltip.style("visibility", "hidden");
      	});
   	stack.transition()
   		.duration(500)
   		.delay(function (d, i) {
				return i * 100;
		})
		.attr('y', function(d){
   			return y0(d.y0)-y(d.y);
   		})
		.attr("height", function (d, i) {
				return y(d.y);
		});

    //add axes and their title
	var axes = svg.append("g").attr("class", "lct-axis")
		.attr("transform", "translate(0," + chartHeight + ")")
		.call(xAxis)
		.selectAll('text')
		.style('text-anchor', 'end')
		.attr('transform', 'rotate(-45)')
		.attr("dx", ".1em")
        .attr("dy", ".5em");
	svg.append("g")
		.attr("class", "lct-axis")
		.call(yAxis)
		.append("text")//add axis title
			.attr("y", 6)
			.attr("dy", ".71em")
			.attr("dx", ".71em")
			.style("text-anchor", "start")
			.text('Overall Rating Per Teacher');
	svg.append('g')
	   .attr('transform', 'translate(' + (chartWidth/2-margin.left) + ','+ (chartHeight+margin.bottom)+')')
	   .append('text')
	   .text('Teacher(By Last Name)');
    var legend = svg.append('g')
    	.attr('class', 'legend')
    	.attr("transform", "translate(" + chartWidth + ",20)")
    legend.selectAll('g').data(ratingTypes)
    	.enter()
    	.append('g')
    	.each(function(d, i){
    		var g = d3.select(this);
    		g.append('rect')
    			.attr('x', 0)
    			.attr('y', i*20)
    			.attr('width', 10)
    			.attr('height', 10)
    			.style('fill', ratingColors[i]);
    		g.append('text')
    			.attr('x', 15)
    			.attr('y', i*20)
    			.attr('dy', '.6em')
    			.style('fill', ratingColors[i])
    			.text(d);
    	});

}