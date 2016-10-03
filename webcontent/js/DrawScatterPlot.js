function DrawScatterPlot(containerId, width, height, lines){
	/*
	Extract the three dimension tuple (MOSL-State(numerical-10), MOSL-Local(numerical-12), MOTP(categorical-9))
	*/
	var hashmap = [];
	for(var i=1; i<lines.length; i++){
		var eachline = lines[i][0].split(',');
		var tuple = {//mixed type with int, int, string
			x: parseInt(eachline[10]),
			y: parseInt(eachline[12]),
			z: eachline[9]
		};
		hashmap.push(tuple);
	}
	// the same configuration to initialize the context of a svg element
	$("#"+containerId).empty();
	$("#"+containerId).height(height);
	var margin = {top: 20, right: 140, bottom: 40, left: 40},
		chartWidth = width - margin.left - margin.right,
		chartHeight = height - margin.top - margin.bottom;
	var svg = d3.select('#'+containerId).append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g')
		.attr('transform', 'translate('+margin.left+','+margin.top+')');
	// here the assumption is that this ratings are 0 based.
	var x = d3.scale.linear().range([0, chartWidth]).domain([0, d3.max(hashmap, function(d){ return d.x;})]);
	var y = d3.scale.linear().range([chartHeight, 0]).domain([0, d3.max(hashmap, function(d){ return d.y;})]);
	var xaxis = d3.svg.axis().scale(x).orient('bottom').innerTickSize(-chartHeight).outerTickSize(0).tickFormat(d3.format("d")),
		yaxis = d3.svg.axis().scale(y).orient('left').innerTickSize(-chartWidth).outerTickSize(0).tickFormat(d3.format("d"));
	svg.append('g')
		.attr('class', 'lct-axis')
		.attr("transform", "translate(0," + chartHeight + ")")
		.call(xaxis)
	svg.append('g')
		.attr('class', 'lct-axis')
		.call(yaxis)
		.append('text')
		.attr("y", 6)
			.attr("dy", ".71em")
			.attr("dx", ".71em")
			.style("text-anchor", "start")
			.text('MOSL-Local');
	svg.append('g')
	   .attr('transform', 'translate(' + (chartWidth/2-margin.left) + ','+ (chartHeight+margin.bottom)+')')
	   .append('text')
	   .text('MOSL-State');
	var rect = svg.append("g")
		.selectAll('circle')
		.data(hashmap)
		.enter()
		.append('circle')
		.attr('id',function(d, i){ return 'sctplt-circle-'+i;})
		.attr('r', 0)
		.attr('cx', function(d) {return x(d.x);})
		.attr('cy', function(d) {return y(d.y);})
		.style('fill', function(d) {return overallRatingColors[cateogricalMappings.indexOf(d.z)];})
		.on("mouseover", function(d, i){
			tooltip.html("<strong>MOSL-State: </strong><span>" + d.x + "</span>"
			+ "<br><strong>MOSL-Local: </strong><span>" + d.y + "</span>"
			+ "<br><strong>MOTP: </strong><span>" + d.z + "</span>");
			return tooltip.style("visibility", "visible");
		})
		.on("mousemove", function(d){
      		// note that tooltip here is a global variable in global.js file
      		return tooltip.style("top",(event.pageY-10)+"px").style("left", (event.pageX+10)+"px");
      	})
      	.on("mouseout", function(d){
      		return tooltip.style("visibility", "hidden");
      	});
    rect.transition()
   		.duration(500)
   		.delay(function (d, i) {
			return i * 100;
		})
		.attr('r', 5);
		
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
    			.attr('y', i*19)
    			.attr('dy', '.2em')
    			.style('fill', overallRatingColors[i])
    			.text(d);
    	});
}

function clicked(d){
	var circles = [];
	var circles = d3.select('#scpt-panel').selectAll('circle');
	// reset all circles
	circles.attr('r', function(d){
		if(this.id.indexOf('sctplt-circle-')>-1) return 5;
		else return 7;//for legend
	});
	var toChange = [];
	if(d==1){
		toChange.push('sctplt-circle-14');
	}
	else if(d==2){
		toChange.push('sctplt-circle-6');
		toChange.push('sctplt-circle-24');
	}
	else{
		toChange.push('sctplt-circle-6');
		toChange.push('sctplt-circle-18');
	}
	circles.attr('r', function(d){
		var index = toChange.indexOf(this.id);
		if(index>-1){
			toChange.splice(index, 1);
			return 10;
		}
		else{
			if(this.id.indexOf('sctplt-circle-')>-1) return 5;
			else return 7;//for legend
		}
	});
}