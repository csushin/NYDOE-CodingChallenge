var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("background", "rgba(0, 0, 0, 0.8)")
	.style("color", "#fff")
	.style("visibility", "hidden");
//Developing-Effective-Highly Effective=>~74, 75~89, 90~
var overallRatingColors = ['#984ea3', '#377eb8', '#4daf4a'];
//MOTP, MOSL State, MOSL Local
var ratingColors = ['#fc8d62', '#66c2a5', '#8da0cb'];
//MOTP categories
var cateogricalMappings = ['Developing', 'Effective', 'Highly Effective'];
//Types: MOTP, MOSL State, MOSL Local
var ratingTypes = ['MOTP', 'MOSL State', 'MOSL Local'];
var globalData;
var fileLoaded = false;

// read the csv file
function readFile(e){
	var file = e.target.files[0];
		reader = new FileReader();
	reader.onload = function(e){
		var csv = e.target.result;
		globalData = processData(csv);
		fileLoaded = true;
		beginRendering(globalData);
	}
	reader.readAsText(file);
	// split lines of the csv file
	function processData(csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        var lines = [];
        for (var i=0; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(';');
            var tarr = [];
            for (var j=0; j<data.length; j++) {
                tarr.push(data[j]);
            }
            if(tarr[0].length>0)
            	lines.push(tarr);
        }
      return lines;
    }
}




function beginRendering(data){
	if(fileLoaded && data!=undefined){
	    DrawLineChart('lct-panel', $('#lct-panel').width(), $('#lct-panel').height(), data);
	    DrawStackedBarChart('bct-panel', $('#bct-panel').width(), $('#bct-panel').height(), data);
	    DrawScatterPlot('scpt-panel', $('#scpt-panel').width(), $('#scpt-panel').height(), data);
	    loadlctreport('lct-comment', $('#lct-comment').width(), $('#lct-comment').height());
	    loadbctreport('bct-comment', $('#bct-comment').width(), $('#bct-comment').height());
	    loadsctreport('scpt-comment', $('#scpt-comment').width(), $('#scpt-comment').height());
	}
	else{
		alert('Please Load the CSV file first.');
	}
}











