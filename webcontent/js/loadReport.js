function loadlctreport(containerId, width, height){
	$("#"+containerId).empty();
	$("#"+containerId).height(height);
	var holder = $("#"+containerId);
	var str = "<h1 align='left'>By District</h1><hr></hr>";
	str+="<p align='left'>The left line chart represents the averaged evaluation score of each district. From the line chart, we can get the following conclusions: <br>";
	str+="1. <strong>The Highest and Lowest:</strong> Among all the districts, district 16 has the highest average overall evaluation result while district 8 has the lowest average overall evaluation result. Their difference is score 27. <br>"
	str+="2. <strong>Tiers:</strong> In average, schools in district after 15 (inclusive) have higher performance than schools in district before 15. <br>"
	str+="3.  <strong>Percentage</strong>:  In average, around 46.7% district are evaluated as developing state among 15 districts. Secondly, 40% districts are evaluated as Effective. And the rest 13.3% are evaluated as Highly Effective.</p>";
	holder.append(str);
	holder.attr('style', 'font-size: 1.4em' );
}

function loadbctreport(containerId, width, height){
	$("#"+containerId).empty();
	$("#"+containerId).height(height);
	var holder = $("#"+containerId);
	var str = "<h1 align='left'>By Teachers</h1><hr></hr>";
	str += "<p align='left'>The left stacked bar chart shows the evaluation result of each teacher. As shown in the legend, the three colors represent three types of evaluation metrics MOTP, MOSL-State and MOSL-Local respectively.</p>"; 
	str += "<p align='left'>From the chart, we can see that Teacher George in the leftmost bar obtained the highest evaluation result while Teacher Maria in the rightmost bar obtained the lowest score.  From all three metrics, we can see the distribution of the metrics contribute to the final result randomly, which will be explained in the next section. </p>";
	holder.append(str);
	holder.attr('style', 'font-size: 1.5em;' );
}

function loadsctreport(containerId, width, height){
	$("#"+containerId).empty();
	$("#"+containerId).height(height);
	var holder = $("#"+containerId);
	var str = "<h1 align='left'>By Ratings</h1><hr></hr>";
	str+="<p align='left'>The left scatter plot shows the relationship between the three evaluation metrics for all schools. X-axis, Y-axis and the color represent MOSL-Local, MOSL-State and MOTP respectively. This scatter plot reflects following questions: <br>";
	str+="1. Lower teaching progress does not really means less students have learnt. From the <a href='#[17,20]' title='click me to see it in the graph' onclick='clicked(1)'>point ([17,20])</a>, we can see that even the teaching progress is under developing, students actually learnt more than others in regards to their MOSL-State and MOSL-Local score. <br>";
	str+="2. In MOSL-Local and MOSL-State, which one is more accurate? <br>";
	str+="    2.1.  From the <a href='#[9,20],[18,20]' onclick='clicked(2)' title='click me to see it in the graph'>points ([9,20],[18,20])</a>, with the same highest MOSL-Local score, the increasing of MOSL-State score from 9 to 18 pushes the teaching progress changed from under developing to highly effective.  <br>";
	str+="    2.2 When the MOSL-Local score decreases while MOSL-State stays as the same, the teaching progress still grows, which can be seen from the <a href='#[9,20],[9,15]' onclick='clicked(3)' title='click me to see it in the graph'>points ([9,20],[9,15])</a>.</p>";
	str+="<p align='left' margin-bottom='0'>To further precisely reflect the relationship of the three metrics, a linear regression model was fitted from the given data: </p>"
	str+="MOTP=45.34+0.388*MOSL_STATE-0.052*MOSL_LOCAL<br>";
	str+="<p align='left'>in which the response is the teaching progress and the two regressors are MOSL-State and MOSL-Local. Even the R-squared value of this model is very low, we may find the MOSL_STATE have larger positive influence to the response.</p>";
	holder.append(str);
}
