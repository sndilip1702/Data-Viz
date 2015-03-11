/*
 Data Set reading and cleaning
 */
var auth = true;
var selYear;
var selRound;
var resultSet = [];
var svg;
function getData() {
	var year = [];
	var round = [];
	d3.csv('data/11yearAUSOpenMatches.csv', function(d) {

		for (key in d) {
			year.push(d[key].year);
			round.push(d[key].round);
		}

		var uniqueYear = d3.set(year).values();
		var rounds = ["Final", "semi", "quarter", "Fourth"];

		// code for inputData based on user value

		$('<h3>Select Year : </h3>').appendTo('.radios');
		for (var y in uniqueYear) {
			var radioBtnYear = $('<input type="radio" name="rbtnYear" value="' + uniqueYear[y] + '"><label>' + uniqueYear[y] + '</label></input>');
			radioBtnYear.appendTo('.radios');
		}
		$('<br/><h3>Select Round : </h3>').appendTo('.radios');

		for (var r in rounds) {
			var radioBtnRound = $('<input type="radio" name="rbtnRound" value="' + rounds[r] + '"><label>' + rounds[r].toUpperCase() + '</label></input>');
			radioBtnRound.appendTo('.radios');
		}

		$('<br/> ').appendTo('.radios');

		var VizBtn = $('<input type="button" class="vizButton" name="vizButton" value="Visualize"</input>');
		VizBtn.appendTo('.radios');

		$('input[name="rbtnYear"]').on('change', function(d) {
			selYear = $(this).val();
		});
		$('input[name="rbtnRound"]').on('change', function(d) {
			selRound = $(this).val();
		});
		$('input[name="vizButton"]').on('click', function(d) {
			
			resultSet = [];
			d3.selectAll(".divElement > *").remove();
			svg = d3.select('.divElement').selectAll('svg').data(resultSet);

			if ( typeof selYear == 'undefined') {
				alert('Please select both values!!');
				auth = false;
			} else {
				if ( typeof selRound == 'undefined') {
					alert('Please select both values!!');
					auth = false;
				} else {
					auth = true;
					init();
				}
			}
		});
	});
}

/*
 The function which renders the svg elements
 */
function init() {
	var year = [];
	var dataset = [];

	/*
	 * Pull in data from csv file
	 */
	d3.csv('data/11yearAUSOpenMatches.csv', function(d) {
		for (key in d) {
			year.push(d[key].year);
			// My JSON object used as dataset
			var data = {
				year : d[key].year,
				round : d[key].round,
				results : d[key].results,
				winnerName : d[key].winnerName,
				player1 : d[key].player1,
				winner1 : d[key].winner1,
				error1 : d[key].error1,
				ace1 : d[key].ace1,
				double1 : d[key].double1,
				player2 : d[key].player2,
				winner2 : d[key].winner2,
				error2 : d[key].error2,
				ace2 : d[key].ace2,
				double2 : d[key].double2
			};

			dataset.push(data);

		}

		/*
		D3 Initializations
		*/
		//filtering dataset
		var filteredData = d3.nest().key(function(d) {
			return d.year;
		}).map(dataset, d3.map);

		//different arrays for each round
		var uniqueYear = d3.set(year).values();
		var rounds = ["Final", "semi", "quarter", "Fourth"];
		var roundFourth = [];
		var roundQuarter = [];
		var roundSemi = [];
		var roundFinal = [];
		for (var item in uniqueYear) {
			for ( i = 0; i < filteredData.get(uniqueYear[item]).length; i++) {
				switch(filteredData.get(uniqueYear[item])[i].round) {
				case 'Final' :
					roundFinal.push(filteredData.get(uniqueYear[item])[i]);
					break;
				case 'semi' :
					roundSemi.push(filteredData.get(uniqueYear[item])[i]);
					break;
				case 'quarter' :
					roundQuarter.push(filteredData.get(uniqueYear[item])[i]);
					break;
				case 'Fourth' :
					roundFourth.push(filteredData.get(uniqueYear[item])[i]);
					break;
				default :
					break;
				}

			}
		}

		/*
		 Code to assign dataset based on user selection
		 */
		switch(selRound) {
		case 'Final' :
			for (var val in roundFinal) {
				if (selYear == roundFinal[val].year) {
					resultSet.push(roundFinal[val]);
				}
			}
			break;
		case 'semi' :
			for (var val in roundSemi) {
				if (selYear == roundSemi[val].year) {
					resultSet.push(roundSemi[val]);
				}
			}
			break;
		case 'quarter' :
			for (var val in roundQuarter) {
				if (selYear == roundQuarter[val].year) {
					resultSet.push(roundQuarter[val]);
				}
			}
			break;
		case 'Fourth' :
			for (var val in roundFourth) {
				if (selYear == roundFourth[val].year) {
					resultSet.push(roundFourth[val]);
				}
			}
			break;
		default :
			break;
		}

		if (auth) {
			var r = 170,
			    m = 10;
			var color = d3.scale.category20c();

			var arc = d3.svg.arc().innerRadius(r - 30).outerRadius(r);

			var arcOver = d3.svg.arc().innerRadius(r - 25).outerRadius(r + 5);

			svg = d3.select('.divElement').selectAll('svg').data(resultSet).enter().append('svg').attr("width", (r + m) * 2).attr("height", (r + m) * 2).append("svg:g").attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

			var textTop = svg.append("svg:text").attr("text-anchor", "middle").attr('dy', -50).attr("class", "textTop");
			textTop.append('svg:tspan').attr("text-anchor", "middle").attr('class', 'first').style("fill", '#29A629').text(function(d) {
				return d.player1;
			});
			textTop.append('svg:tspan').attr("text-anchor", "middle").attr('class', 'second').attr('x', 0).attr('dy', 30).text(function(d) {
				return "Vs";
			});
			textTop.append('svg:tspan').attr("text-anchor", "middle").attr('class', 'third').style("fill", '#FF3300').attr('x', 0).attr('dy', 30).text(function(d) {
				return d.player2;
			});
			textTop.append('svg:tspan').attr("text-anchor", "middle").attr('class', 'fourth').style("fill", '#000').attr('x', 0).attr('dy', 30).text(function(d) {
				return d.results;
			});

			var myPie = d3.layout.pie();
			myPie.value(function(d) {
				return d;
			});

			var g = svg.selectAll("g").data(function(d) {
				// code to change values in pie
				return myPie([(parseInt(d.winner1) + parseInt(d.ace1) + parseInt(d.double2) - parseInt(d.error1) + 40), (parseInt(d.winner2) + parseInt(d.ace2) + parseInt(d.double1) - parseInt(d.error2) + 40)]);
			}).enter().append("svg:g").on('mouseover', function(d, i) {
				d3.select(this).select("path").transition().duration(200).style('opacity', 0.3).attr("d", arcOver);
				//get the data from parent node
				var player = d3.select(this.parentNode).datum().player1;
				var winner = d3.select(this.parentNode).datum().winner1;
				var error = d3.select(this.parentNode).datum().error1;
				var aces = d3.select(this.parentNode).datum().ace1;
				if (i) {
					player = d3.select(this.parentNode).datum().player2;
					d3.select(this.parentNode).datum().winner2;
					error = d3.select(this.parentNode).datum().error2;
					aces = d3.select(this.parentNode).datum().ace2;
				}
				d3.select(this.parentNode).select('text').select('.first').style("fill", '#000').html(player);
				d3.select(this.parentNode).select('text').select('.second').style("fill", '#29A629').html("Winners : " + winner);
				d3.select(this.parentNode).select('text').select('.third').style("fill", '#29A629').html("Aces : " + aces);
				d3.select(this.parentNode).select('text').select('.fourth').style("fill", '#FF3300').html("Errors : " + error);

			}).on('mouseout', function(d) {
				d3.select(this).select("path").transition().duration(100).style('opacity', 1).attr("d", arc);

				var res = d3.select(this.parentNode).datum();
				d3.select(this.parentNode).select('text').select('.first').style("fill", '#29A629').html(res.player1);
				d3.select(this.parentNode).select('text').select('.second').style("fill", '#000').html("Vs").attr("dy", 30);
				d3.select(this.parentNode).select('text').select('.third').style("fill", '#FF3300').html(res.player2);
				d3.select(this.parentNode).select('text').select('.fourth').style("fill", '#000').html(res.results);
			});

			g.append("svg:path").attr("d", arc).attr('fill', function(d, i) {
				return color(i);
			});

			g.append("svg:text")
			.attr("text-anchor", "middle").attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
			}).text(function(d) {
				return d.data;
			}).style('font-size', '1.5em');

			function angle(d) {
				var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
				return a > 90 ? a - 180 : a;
			}

		}

	});

}

