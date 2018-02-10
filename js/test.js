var TEST = {
	init: function() {
		this.makeArea.start();
		this.makeGrade();
		this.makeAbility();
		this.makeCareer();
		// this.makeCharacter();

		this.makeGradeDetail();
		this.makeCareerDetail();
		this.makeAbilityDetail();
		this.makeAreaDetail.start();
	},

	makeCharacter: function() {
		var wordCloud = function(selector) {

			var fill = d3.scale.category20();

			//Construct the word cloud's SVG element
			var svg = d3.select("#characterWordCloud")
				.attr("width", 500)
				.attr("height", 500)
				.append("g")
				.attr("transform", "translate(250,250)");


			//Draw the word cloud
			function draw(words) {
				var cloud = svg.selectAll("g text")
								.data(words, function(d) { return d.text; })

				//Entering words
				cloud.enter()
					.append("text")
					.style("font-family", "Impact")
					.style("fill", function(d, i) { return fill(i); })
					.attr("text-anchor", "middle")
					.attr('font-size', 1)
					.text(function(d) { return d.text; });

				//Entering and existing words
				cloud
					.transition()
						.duration(600)
						.style("font-size", function(d) { return d.size + "px"; })
						.attr("transform", function(d) {
							return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
						})
						.style("fill-opacity", 1);

				//Exiting words
				cloud.exit()
					.transition()
						.duration(200)
						.style('fill-opacity', 1e-6)
						.attr('font-size', 1)
						.remove();
			}

			//Use the module pattern to encapsulate the visualisation code. We'll
			// expose only the parts that need to be public.
			return {

				//Recompute the word cloud for a new set of words. This method will
				// asycnhronously call draw when the layout has been computed.
				//The outside world will need to call this function, so make it part
				// of the wordCloud return value.
				update: function(words) {
					d3.layout.cloud().size([500, 500])
						.words(words)
						.padding(5)
						.rotate(function() { return ~~(Math.random() * 2) * 90; })
						.font("Impact")
						.fontSize(function(d) { return d.size; })
						.on("end", draw)
						.start();
				}
			}

		}

		//Some sample data - http://en.wikiquote.org/wiki/Opening_lines
		var words = [
			"안녕 하세요 바이 바이"
		]

		//Prepare one of the sample sentences by removing punctuation,
		// creating an array of words and computing a random size attribute.
		function getWords(i) {
			return words[i]
					.replace(/[!\.,:;\?]/g, '')
					.split(' ')
					.map(function(d) {
						return {text: d, size: 10 + Math.random() * 60};
					})
		}

		//This method tells the word cloud to redraw with a new set of words.
		//In reality the new words would probably come from a server request,
		// user input or some other source.
		function showNewWords(vis, i) {
			i = i || 0;

			vis.update(getWords(i ++ % words.length))
			setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
		}

		//Create a new instance of the word cloud visualisation.
		var myWordCloud = wordCloud('body');

		//Start cycling through the demo data
		showNewWords(myWordCloud);
	},

	// 지역 차트 생성
	makeArea: {
		originGeo: [127.106678, 37.366402], //[16.8286, 52.4200],//[37.366402, 127.106678], //[16.8286, 52.4200],
		originName: 'POZ',
		destinations: [
			{'coord': [127.104456, 37.513931], 'name': '고성군'},
			// {'coord': [23.9569, 49.8134], 'name': 'LWO'},
			// {'coord': [30.4433, 50.4120], 'name': 'IEV'},
			// {'coord': [13.3724, 55.5355], 'name': 'MMX'},
			// {'coord': [12.6508, 55.6180], 'name': 'CPH'},
			// {'coord': [16.9154, 58.7890], 'name': 'NYO'},
			// {'coord': [10.2569, 59.1824], 'name': 'TRF'},
			// {'coord': [9.1526, 55.7408], 'name': 'BLL'},
			// {'coord': [8.5622, 50.0379], 'name': 'FRA'},
			// {'coord': [11.7750, 48.3537], 'name': 'MUC'},
			// {'coord': [5.3921, 51.4584], 'name': 'EIN'},
			// {'coord': [2.1115, 49.4545], 'name': 'BVA'},
			// {'coord': [-2.7135, 51.3836], 'name': 'BRS'},
			// {'coord': [0.3717, 51.8763], 'name': 'LTN'},
			// {'coord': [0.2389, 51.8860], 'name': 'STN'},
			// {'coord': [-1.743507, 52.4524], 'name': 'BHX'},
			// {'coord': [-2.8544, 53.3375], 'name': 'LPL'},
			// {'coord': [-3.3615, 55.9508], 'name': 'EDI'},
			// {'coord': [-1.010464, 53.480662], 'name': 'DSA'},
			// {'coord': [-6.2499, 53.4264], 'name': 'DUB'},
			// {'coord': [-0.560056, 38.285483], 'name': 'ALC'}, 
			// {'coord': [0.065603, 40.207479], 'name': 'CDT'},
			// {'coord': [-3.56795, 40.4839361], 'name': 'MAD'},
			// {'coord': [2.071062, 41.288288], 'name': 'BCN'},
			// {'coord': [2.766066, 41.898201], 'name': 'GRO'},
			// {'coord': [14.483279, 35.854114], 'name': 'MLA'},     
			// {'coord': [23.9484, 37.9356467], 'name': 'ATH'},   
			// // {'coord': [19.914486, 39.607645], 'name': 'CFU'},
			// {'coord': [34.9362, 29.9511], 'name': 'VDA'},
			{'coord': [129.163984, 35.165740], 'name': '밀양시'}
		],
		svg: null,
		projection: null,
		speed: 2800,//km/sec
		tooltip: d3.select('#areaChart').append('div')	
					.attr('class', 'tooltipDestination')				
					.style('opacity', 0),
		getArc: function(d, s) {
			var dx = d.destination.x - d.origin.x;
			var dy = d.destination.y - d.origin.y;
			var dr = Math.sqrt(dx * dx + dy * dy);
			var spath = s == false ? ' 0 0,0 ' : ' 0 0,1 ';
			return 'M' + d.origin.x + ',' + d.origin.y + 'A' + dr + ',' + dr + spath + d.destination.x + ',' + d.destination.y;
		},
		calculateDistance: function(lat1, lon1, lat2, lon2) {
			var p = 0.017453292519943295;
			var c = Math.cos;
			var a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
			return 12742 * Math.asin(Math.sqrt(a));
		},
		calculateDuration: function(distance) {
			return (distance / this.speed) * 1000;
		},
		drawConnection: function(index) {
			var self = this;
			var destination = this.destinations[index];
			var originPos = this.projection(this.originGeo);
			var destinationPos = this.projection(destination.coord);
			var connection = [ originPos, destinationPos ];
			var destinationName = destination.name;
			var originGeo = this.originGeo;
			var destinationGeo = destination.coord;
			var svg = this.svg;
			var distance = this.calculateDistance(originGeo[1], originGeo[0], destinationGeo[1], destinationGeo[0]);
			var duration = this.calculateDuration(distance);
			var arc = svg;
			
			var drawCircle = function() {
				svg.append('circle')
					.datum(connection)
					.attr('cx', connection[1][0])
					.attr('cy', connection[1][1])
					.attr('r', 0)
					.attr('class', 'destCircleInner')
					.style('fill', 'steelblue')
					.style('fill-opacity', '1')
					.transition()
					.duration(300) //300
					.attr('r', '5px')
				;
				svg.append('circle')
						.datum(connection)
						.attr('cx', connection[1][0])
						.attr('cy', connection[1][1])
						.attr('r', 0)
						.attr('class', 'destCircleOuter')
						.style('fill', 'black')
						.style('fill-opacity', '0.05')
						.transition()
						.duration(300) //300
						.attr('r', '12px')
				;
				svg.append('circle')
					.datum(connection)
					.attr('cx', connection[1][0])
					.attr('cy', connection[1][1])
					.attr('r', 0)
					.style('class', 'destCircleMouse')
					.style('fill', 'steelblue')
					.style('fill-opacity', '1')
					.transition()
					.duration(300) //300
					.attr('r', '5px')
					.each('end', function(d) {
						d3.select(this)
							.transition()
							.duration(2000) //2000
							.attr('r', 20)
							.style('fill-opacity', '0')
						;
						svg.append('path')
							.datum(connection)
							.attr('class', 'arc' + index)
							.attr('d', function(coordinates) {
								var d = {
									origin: { x: coordinates[0][0], y: coordinates[0][1]},
									destination: { x: coordinates[1][0], y: coordinates[1][1]}
								};
								var s = false;
								if (d.destination.x > d.origin.x) {
									s = true;
								}
								return (self.getArc(d, s));
							}) 
							.style('stroke', 'steelblue')
							.style('stroke-width', '2.5')
							.style('fill', 'none')
							.transition()
							.duration(duration) //duration
							.attrTween('stroke-dasharray', function() {
								var len = this.getTotalLength();
								return function(t) {
									return (d3.interpolate('0,' + len, len + ',0'))(t)
								};
							})
							.each('end', function(d) {
								var c = connection[1];
								
							})
						;
						d3.select('.arc' + index)
							.transition()
							.duration(2000) //2000
							.style('stroke-opacity', '1') // style('stroke-opacity', '0') 
							.style('stroke-width', '2')
							.each('end', function (d) {
								if (index === self.destinations.length - 1) {
									svg.selectAll('.destCircleInner').remove();
									svg.selectAll('.destCircleOuter').remove();
									svg.selectAll('.destCircleMouse').remove();
								for (i = 0; i < self.destinations.length; i++) { 
									svg.selectAll('.arc' + i).remove();
								}
								}
								var nextIndex = index + 1;
								if (nextIndex < self.destinations.length) {
									self.drawConnection(nextIndex);
								} else {
									self.drawConnection(0);
								}
							})
						;
					})
				;
			};
			drawCircle();
		},
		drawConnections: function () {
			this.drawConnection(0);
		},
		drawMap: function (originName, originGeo, destinations) {
			var countries, height, path, projection, scale, svg, width;
			var width = 390;
			var height = 210;
			var center = [127.106678, 37.366402] //[128, 36]; //[4, 68.6];
			var scale = 2200; //200
			projection = d3.geo.mercator().scale(scale).translate([width / 2.2, height / 3.8]).center(center);
			path = d3.geo.path().projection(projection);
			svg = d3.select('#areaChart').append('svg')
				.attr('height', height)
				.attr('width', width)
				.style('background', 'white') // #C1E1EC:
				// .style('border', 'black solid 3px')
				// .style('border-radius', '11.5px')
			;
			countries = svg.append("g");
			d3.json('skorea_municipalities_topo_simple.json', function(data) { //europe.json
				countries.selectAll('.country')
							.data(topojson.feature(data, data.objects.skorea_municipalities_geo).features) //europe
							.enter()
							.append('path')
							.attr('class', 'country')
							.attr('d', path)
				;
				return;
			});
			var source = svg.selectAll('circleOrigin');
				source.data([originGeo]).enter()
						.append('circle')
						.attr('cx', function (d) { return projection(d)[0]; })
						.attr('cy', function (d) { return projection(d)[1]; })
						.attr('r', '5px')
						.style('opacity', 1)
						.attr('fill', '#d43f3a')
						.attr('class', 'circleOrigin')
				;
				source.data([originGeo]).enter()
						.append('circle')
						.attr('cx', function (d) { return projection(d)[0]; })
						.attr('cy', function (d) { return projection(d)[1]; })
						.attr('r', '12px')
						.style('opacity', 0.05)
						.attr('fill', 'black')
						.attr('class', 'circleOrigin')
						// .on('mouseover', function (d) {
						// 	d3.select('#areaChart').append('div')	
						// 			.attr('class', 'tooltipDestination')				
						// 			.style('opacity', 0).html('<span style="color:white">' + originName + '</span>')
						// 			.attr('class', 'tooltipOrigin')
						// 			.style('left', projection(d)[0] + 12 + 'px')
						// 			.style('top', projection(d)[1] - 20 + 'px')
						// 			.transition()
						// 			.duration(700) //700
						// 			.style('opacity', 1)
						// 	;
						// })
						// .on('mouseout', function (d) {
						// 	d3.select('#areaChart').append('div')	
						// 		.attr('class', 'tooltipDestination')				
						// 		.style('opacity', 0).transition()
						// 		.duration(700) //700
						// 		.style('opacity', 0)
						// 	;		
						// })
				;
			this.svg = svg;
			this.projection = projection;
			this.drawConnections();
		},
		start: function() {
			this.drawMap(this.originName, this.originGeo, this.destinations);
		}
		// drawMap(this.originName, this.originGeo, this.destinations);
	},

	// 학점 차트 생성
	makeGrade: function() {
		var config = {
			'width': 360,
			'height': 150,
			'segmentWidth': 100,
			'segmentHeight': 100,
			'padding': 12
		}

		var states = ['started', 'inProgress', 'completed'];
		var currentState = 'started' , 
		    endState = 'inProgress';

		var GradeData = {
			"avgGrade": "3.2"
		};

		var svg = d3.select('#gradeChart')
					.attr('width', config.width + config.padding * 2)
					.attr('height', config.height + config.padding * 2)
					.style('margin-top', '22px')
					.style('margin-left', '54px')
		;
		var colorScale = d3.scale.ordinal()
								 .domain(states)
								 .range(['orange', 'green', 'green'])
		;
		svg.append('rect')
			.attr('class', 'bg-rect')
			.attr('rx', 10)
			.attr('ry', 10)
			.attr('fill', 'gray')
			.attr('stroke', 'black')
			.attr('stroke-width', '3')
			.attr('height', config.segmentHeight)
			.attr('width', function() {
				return config.segmentWidth * states.length - config.padding * 2;
			})
			.attr('x', config.padding)
			.attr('y', config.padding * 2)
		;
		var progress = svg.append('rect')
							.attr('class', 'progress-rect')
						  	.attr('fill', function() {
								  return colorScale(currentState);
							})				
							.attr('stroke', 'black')
							.attr('stroke-width', '3')
							.attr('width', 0)
							.attr('height', config.segmentHeight)
							.attr('rx', 10)
							.attr('ry', 10)
							.attr('x', config.padding)
							.attr('y', config.padding * 2)
		;
		progress.transition()
				.duration(2000)
				.attr('fill', function() {
					return colorScale(endState);
				})
				.attr('width', function() {
					return (GradeData.avgGrade/4.5) * config.segmentWidth * states.length - config.padding * 2;
				})
		;
		svg.append('text')
				.attr('class', 'progress_text')
				.attr('text-anchor', 'left')
				.attr('tranform', 'translate(15' + ', ' + '15)')
				.attr('x', config.padding)
				.attr('y', config.padding * 2 - 3)
			.text('0')
		;

		svg.append('text')
				.attr('class', 'progress_text')
				.attr('text-anchor', 'left')
				.attr('tranform', 'translate(15' + ', ' + '15)')
				.attr('x', config.segmentWidth * states.length - config.padding * 2)
				.attr('y', config.padding * 2 - 3)
			.text('4.5')
		;

		svg.append('text')
			.attr('class', 'progress_text_avg')
			.attr('text-anchor', 'left')
			.attr('tranform', 'translate(15' + ', ' + '15)')
			.attr('x', function() {
				return (GradeData.avgGrade/4.5) * config.segmentWidth * states.length - config.padding * 2;;
			})
			.attr('y', config.padding * 2 + config.segmentHeight + 18)
			.text(GradeData.avgGrade)
		;


		// var moveProgressBar = function(state) {
		// 	progress.transition()
		// 			.duration(2000)
		// 			.attr('fill', function() {
		// 				return colorScale(state);
		// 			})
		// 			.attr('width', function() {
		// 				var index = states.indexOf(state);
		// 				return (index + 1) * config.segmentWidth - config.padding * 2;
		// 			})
		// 	;

		// 	svg.append('text')
		// 		.attr('class', 'progress_text_avg')
		// 		.attr('text-anchor', 'left')
		// 		.attr('tranform', 'translate(15' + ', ' + '15)')
		// 		.attr('x', function() {
		// 			var index = states.indexOf(state);
		// 			return (index + 1) * config.segmentWidth - config.padding * 2;
		// 		})
		// 		.attr('y', config.padding * 2 + config.segmentHeight + 18)
		// 		.text(GradeData.avgGrade)
		// 	;
		// }

		//moveProgressBar("inProgress");

	},

	// IT 역량 차트 생성
	makeAbility: function() {
		var w = 150,
			h = 150;

		var colorscale = d3.scale.category10();

		//Legend titles
		var LegendOptions = ['Ability'];

		//Data
		// var d = [
		// 	[
		// 	{axis:"Java", value:0.59},
		// 	{axis:"Python", value:0.56},
		// 	{axis:"C", value:0.42},
		// 	{axis:"Javascript", value:0.34},
		// 	{axis:"C++", value:0.48},
		// 	{axis:"Go", value:0.14}
		// 	]
		// ];

		var d = [
			[
				{axis:"Java", value:10},
				{axis:"Python", value:5},
				{axis:"C", value:7},
				{axis:"Javascript", value:20},
				{axis:"C++", value:9},
				{axis:"Go", value:12}
			]
		];

		var sum = 0;
		$.each(d[0], function(index, value) {
			// console.log(index+','+value);
			$.each(value, function(k, v) {
				// console.log(k+','+v);
				if(k === 'value') sum += v;
			})
		})
		// console.log(sum);

		var precisionRound = function(number, precision) {
  			var factor = Math.pow(10, precision);
  			return Math.round(number * factor) / factor;
		}

		var copy = function(arr1, arr2) {
			for(var i=0; i<arr1.length; i++) {
				arr2[i] = arr1[i];
			}
		}
		var abilityDetailChartData = [];
		for(var i=0; i<10; i++) abilityDetailChartData[i] = i;

		var abilityDetailChartData = $.extend(true, {}, d);
		abilityDetailChartData = Object.values(abilityDetailChartData);
		$.each(abilityDetailChartData, function(index, value) {
			$.each(value, function(k, v) {
				// console.log(k + ', ' + v.value / sum);
				v.value = precisionRound(v.value / sum, 4);
			})
		})

		//Options for the Radar chart, other than default
		var mycfg = {
			w: w,
			h: h,
			maxValue: 0.6,
			levels: 6,
			ExtraWidthX: 200
		}

		//Call function to draw the Radar chart
		//Will expect that data is in %'s
		RadarChart.draw("#abilityChart", abilityDetailChartData, mycfg);

		var svg = d3.select('#abilityChart')
						.selectAll('svg')
						.append('svg')
						.attr("width", w + 300)
						.attr("height", h)
		;
	},

	// IT 역량 차트 생성, 후보
	makeAbility2: function() {
		var config = {
			'width': 220,
			'height': 220,
			'radius': 0,
			'innerRadius': 0,
			'padding': 5
		}

		config.radius = Math.min(config.width, config.height) / 2;
		config.innerRadius = 0.3 * config.radius;

		var AbilityData = [
			{"label": "JAVA", "value": 12},
			{"label": "C", "value": 10},
			{"label": "R", "value": 2},
			{"label": "C++", "value": 1},
			{"label": "C#", "value": 5},
			{"label": "Python", "value": 20}
		];

		var max = 0;
		for(var i = 0; i < AbilityData.length; i++) {
			if(max <= AbilityData[i].value)
				max = AbilityData[i].value;
		}

		var colorScale = d3.scale.category20b();

		var pie = d3.layout.pie()
							.sort(function(a, b) {
								return d3.descending(a.value, b.value);
							})
							.value(function(d) {
								return d.value;
							})
		;

		// var tip = d3.tip()
		// 			.attr('class', 'd3-tip')
		// 			.offset([0, 0])
		// 			.html(function(d) {
		// 				return d.data.label
		// 			});

		var arc = d3.svg.arc()
						.innerRadius(config.innerRadius - config.padding * 2)
						.outerRadius(function(d) {
							return ((config.radius - config.innerRadius) * (d.data.value / max) + config.innerRadius) - config.padding * 2;
						})
		;

		var outlineArc = d3.svg.arc()
							   .innerRadius(config.innerRadius - config.padding * 2)
							   .outerRadius(config.radius - config.padding * 2)
		;

		var svg = d3.select('#abilityChart')
					.attr('width', config.width)
					.attr('height', config.height)
						.append('g')
						.attr('transform', 'translate(' + config.width / 2 + ', ' + config.height / 2 + ')')
		;

		// svg.call(tip);

		var path = svg.selectAll('.solidArc')
					  .data(pie(AbilityData))
						.enter().append('path')
							.attr('fill', function(d, i) {
								return colorScale(i);
							})
							.attr('class', 'solidArc')
							.attr('stroke', 'black')
							.attr('stroke-width', '3')
							.attr('d', arc)
							// .on('mouseover', tip.show)
							// .on('mouseout', tip.hide)
		;

		var outerPath = svg.selectAll('.outlineArc')
						 .data(pie(AbilityData))
							.enter().append('path')
								.attr('fill', 'none')
								.attr('stroke', 'black')
								.attr('stroke-width', '3')
								.attr('class', 'outlineArc')
								.attr('d', outlineArc)
		;

		svg.selectAll('.solidArc_text')
			.data (pie (AbilityData.sort(function(a, b) { return d3.descending(a.value, b.value); })))
				.enter().append('text')
					.attr('class', 'ability_text')
					// .attr("transform", function(d) { 
					// 	return "translate(" + arc.centroid(d) + ")"; 
					// })
					.attr('x', function(d) { 
						return (outlineArc.centroid(d)[0] + arc.centroid(d)[0]) / 2; 
					})
					.attr('y', function(d) { 
						return (outlineArc.centroid(d)[1] + arc.centroid(d)[1]) / 2; 
					})
					.attr("text-anchor", "middle")
					.text(function(d, i) { 
						if( i < 3 ) return d.data.label; 
						else return '';
					})
		;




	},

	// 커리어 path 차트 생성
	makeCareer: function() {
		var width = 340,
			height = 220;
			
		var careerData = {
			"nodes": [
				{ "name": "빅데이터", "group": 1, "value": 2 },
				{ "name": "처리", "group": 2, "value": 20 },
				{ "name": "분석", "group": 2, "value": 5 },
				{ "name": "데이터", "group": 2, "value": 10},
				{ "name": "AI", "group": 3, "value": 8 },
				{ "name": "IoT", "group": 3, "value": 2 },
				{ "name": "엔지니어", "group": 2, "value": 3 },
				{ "name": "제조", "group": 4, "value": 5 },
				{ "name": "인프라", "group": 4, "value": 9 },
				{ "name": "IoT 전문가", "group": 4, "value": 33 }


			],
			"links": [
				{ "source": 0, "target": 1, "value": 1 },
				{ "source": 0, "target": 2, "value": 1 },
				{ "source": 0, "target": 3, "value": 1 },
				{ "source": 0, "target": 6, "value": 1 },
				{ "source": 4, "target": 5, "value": 2 },
				{ "source": 4, "target": 0, "value": 3 },
				{ "source": 5, "target": 0, "value": 3 },
				{ "source": 5, "target": 7, "value": 4 },
				{ "source": 5, "target": 8, "value": 4 },
				{ "source": 5, "target": 9, "value": 4 },
				{ "source": 8, "target": 9, "value": 2 }
			

			]
		}

        var colorNode = d3.scale.category20(),
			colorLink = d3.scale.category10();
			
		var rScale = d3.scale.linear().domain([0, 100]).range([10, 35]);

        var force = d3.layout.force()
							.charge(-250)
							.linkDistance(75)
							.size([width, height]);

		var svg = d3.select('#careerChart')
					.append('svg')
						.attr('width', width)
						.attr('height', height);
			
		force.nodes(careerData.nodes)
				.links(careerData.links)
				.start();

		var link = svg.selectAll('.link')
						.data(careerData.links)
						.enter()
						.append('line')
							.attr('class', 'link')
							.style('stroke-width', 2)
							.style('stroke', function(d) { return colorLink(d.value); });

		var node = svg.selectAll('.node')
						.data(careerData.nodes)
						.enter()
						.append('circle')
							.attr('class', 'node')
							.attr('r', function(d) { return rScale(d.value) }) //18
							.style('fill-opacity', '0.85')
							.style('fill', function(d) { return colorNode(d.group); })
							.style('stroke-opacity','1.0')
							.style('stroke', function(d) { return colorNode(d.group); })
							.style('stroke-width', '2px')
							.call(force.drag);

		node.append('title')
				.text(function(d) { return d.name; });

		var nodelabels = svg.selectAll('.nodelabel') 
							.data(careerData.nodes)
							.enter()
								.append('text')
								.attr({ 'x': function(d){ return d.x; },
										'y': function(d){ return d.y; },
										'class': 'nodelabel',
										'stroke': '#404040'})
								.text(function(d){return d.name;});

		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

			node.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });

			nodelabels.attr("x", function(d) { return d.x; }) 
					  .attr("y", function(d) { return d.y; });
		});
	},

	makeAreaDetail: {
		originGeo: [127.106678, 37.366402], //[16.8286, 52.4200],//[37.366402, 127.106678], //[16.8286, 52.4200],
		originName: 'SK(주)C&C',
		destinations: [
			{'coord': [127.104456, 37.513931], 'name': '고성군'},
			// {'coord': [129.163984, 35.165740], 'name': '밀양시'},
			// {'coord': [126.964713, 37.546671], 'name': '여기'},
			{'coord': [126.924436, 37.557687], 'name': '홍대'}
		],
		svg: null,
		projection: null,
		speed: 2800,//km/sec
		tooltip: d3.select('#areaDetailChart').append('div')	
					.attr('class', 'tooltipDestinationDetail')				
					.style('opacity', 0),
		getArc: function(d, s) {
			var dx = d.destination.x - d.origin.x;
			var dy = d.destination.y - d.origin.y;
			var dr = Math.sqrt(dx * dx + dy * dy);
			var spath = s == false ? ' 0 0,0 ' : ' 0 0,1 ';
			return 'M' + d.origin.x + ',' + d.origin.y + 'A' + dr + ',' + dr + spath + d.destination.x + ',' + d.destination.y;
		},
		calculateDistance: function(lat1, lon1, lat2, lon2) {
			var p = 0.017453292519943295;
			var c = Math.cos;
			var a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
			return 12742 * Math.asin(Math.sqrt(a));
		},
		calculateDuration: function(distance) {
			return (distance / this.speed) * 1000;
		},
		drawConnection: function(index) {
			var self = this;
			var destination = this.destinations[index];
			var originPos = this.projection(this.originGeo);
			var destinationPos = this.projection(destination.coord);
			var connection = [ originPos, destinationPos ];
			var destinationName = destination.name;
			var originGeo = this.originGeo;
			var destinationGeo = destination.coord;
			var svg = this.svg;
			var distance = this.calculateDistance(originGeo[1], originGeo[0], destinationGeo[1], destinationGeo[0]);
			var duration = this.calculateDuration(distance);
			var arc = svg;
			
			

			var drawCircle = function() {
				svg.append('circle')
					.datum(connection)
					.attr('cx', connection[1][0])
					.attr('cy', connection[1][1])
					.attr('r', 0)
					.attr('class', 'destCircleInnerDetail')
					.style('fill', 'steelblue')
					.style('fill-opacity', '1')
					.transition()
					.duration(300) //300
					.attr('r', '8px')
				;
				svg.append('circle')
						.datum(connection)
						.attr('cx', connection[1][0])
						.attr('cy', connection[1][1])
						.attr('r', 0)
						.attr('class', 'destCircleOuterDetail')
						.style('fill', 'black')
						.style('fill-opacity', '0.05')
						.transition()
						.duration(300) //300
						.attr('r', '14px')
				;
				svg.append('circle')
					.datum(connection)
					.attr('cx', connection[1][0])
					.attr('cy', connection[1][1])
					.attr('r', 0)
					.style('class', 'destCircleMouseDetail')
					.style('fill', 'steelblue')
					.style('fill-opacity', '1')
					// .on('mouseover', function (d) {
					// 	d3.select('#areaDetailChart').append('div')	
					// 		.attr('class', 'tooltipDestinationDetail')				
					// 		.style('opacity', 0).html('<span style="color:white">' + destinationName + '</span>')
					// 		.attr('class', 'tooltipDestinationDetail')
					// 		.style('left', d[0] + 12 + 'px')
					// 		.style('top', d[1] - 20 + 'px')
					// 		.transition()
					// 		.duration(500)
					// 		.style('opacity', 1)
					// }) 
					// .on('mouseout', function (d) {
					// 	console.log('bye');
					// 	d3.selectAll('.tooltipDestinationDetail').transition()
                  	// 		.duration(500)
					// 		  .remove()
					// 	;
					// // 	d3.select('#areaDetailChart')//.append('div')	
					// // .attr('class', 'tooltipDestinationDetail')				
					// // .style('opacity', 0).transition()
					// // 	.duration(700)
					// // 	.style('opacity', 0)
					// })
					.transition()
					.duration(300) //300
					.attr('r', '8px')
					.each('end', function(d) {
						// SK (주) C&C에 대한 라벨 띄우기
						

						d3.select(this)
							.transition()
							.duration(2000) //2000
							.attr('r', 14)
							.style('fill-opacity', '0')
						;
						svg.append('path')
							.datum(connection)
							.attr('class', 'arcDetail' + index)
							.attr('d', function(coordinates) {
								var d = {
									origin: { x: coordinates[0][0], y: coordinates[0][1]},
									destination: { x: coordinates[1][0], y: coordinates[1][1]}
								};
								var s = false;
								if (d.destination.x > d.origin.x) {
									s = true;
								}
								return (self.getArc(d, s));
							}) 
							.style('stroke', 'steelblue')
							.style('stroke-width', '2.5')
							.style('fill', 'none')
							.transition()
							.duration(duration) //duration
							.attrTween('stroke-dasharray', function() {
								var len = this.getTotalLength();
								return function(t) {
									return (d3.interpolate('0,' + len, len + ',0'))(t)
								};
							})
							.each('end', function(d) {
								var c = connection[1];
							})
						;
						d3.select('.arcDetail' + index)
							.transition()
							.duration(2000) //2000
							.style('stroke-opacity', '1') // style('stroke-opacity', '0') 
							.style('stroke-width', '2')
							.each('end', function (d) {
								if (index === self.destinations.length - 1) {
									svg.selectAll('.destCircleInnerDetail').remove();
									svg.selectAll('.destCircleOuterDetail').remove();
									svg.selectAll('.destCircleMouseDetail').remove();
									for (i = 0; i < self.destinations.length; i++) { 
										svg.selectAll('.arcDetail' + i).remove();
									}
								}
								var nextIndex = index + 1;
								if (nextIndex < self.destinations.length) {
									console.log('1'+nextIndex);
									self.drawConnection(nextIndex);
								} else {
									console.log('2'+nextIndex);
									// d3.selectAll('.tooltipOriginDetail').data([originGeo]).enter().select('#areaDetailChart').append('div')
									// 	.html('<span style="color:white">' + this.originName + '</span>')
									// 	.attr('class', 'tooltipOriginDetail')
									// 	.style('left', projection(d)[0] + 50 + 'px')
									// 	.style('top', projection(d)[1] - 0 + 'px')
									// 	.transition()
									// 	.duration(500) //700
									// 	.style('opacity', 1)
									// ;
									self.drawConnection(0);
								}
							})
						;
					})
				;
			};
			drawCircle();
		},
		drawConnections: function () {
			this.drawConnection(0);
		},
		drawMap: function (originName, originGeo, destinations) {
			var countries, height, path, projection, scale, svg, width;
			var width = 680;
			var height = 580;
			var center = [127.106678, 37.366402] //[128, 36]; //[4, 68.6];
			var scale = 5500; //200
			projection = d3.geo.mercator().scale(scale).translate([width / 2.5, height / 3.2]).center(center);
			path = d3.geo.path().projection(projection);
			svg = d3.select('#areaDetailChart').append('svg')
				.attr('height', height)
				.attr('width', width)
				.style('background', 'white') // #C1E1EC:
			;
			countries = svg.append("g");
			d3.json('skorea_municipalities_topo_simple.json', function(data) { //europe.json
				countries.selectAll('.countryDetail')
							.data(topojson.feature(data, data.objects.skorea_municipalities_geo).features) //europe
							.enter()
							.append('path')
							.attr('class', 'countryDetail')
							.attr('d', path)
				;
				return;
			});
			var source = svg.selectAll('circleOriginDetail');
				source.data([originGeo]).enter()
						.append('circle')
						.attr('cx', function (d) { return projection(d)[0]; })
						.attr('cy', function (d) { return projection(d)[1]; })
						.attr('r', '8px')
						.style('opacity', 1)
						.attr('fill', '#d43f3a')
						.attr('class', 'circleOriginDetail')
				;

				
				source.data([originGeo]).enter()
						.append('circle')
						.attr('cx', function (d) { return projection(d)[0]; })
						.attr('cy', function (d) { return projection(d)[1]; })
						.attr('r', '14px')
						.style('opacity', 0.05)
						.attr('fill', 'black')
						.attr('class', 'circleOriginDetail')
						.on('mouseover', function (d) {
							d3.select('#areaDetailChart').append('div')	
									.attr('class', 'tooltipOriginDetail')				
									.style('opacity', 0)
									.html('<span style="color:white">' + originName + '</span>')
									.attr('class', 'tooltipOriginDetail')
									.style('left', projection(d)[0] + 50 + 'px')
									.style('top', projection(d)[1] - 0 + 'px')
									.transition()
									.duration(500) //700
									.style('opacity', 1)
							;
							console.log( projection(d)[0]);
						})
						.on('mouseout', function (d) {
							d3.selectAll('.tooltipOriginDetail').transition()
                  				.duration(500)
								.remove()
							;
					// d3.select('#areaDetailChart').append('div')	
					// .attr('class', 'tooltipDestinationDetail')				
					// .style('opacity', 0).transition()
					// 		.duration(700) //700
					// 		.style('opacity', 0)
						})
				;
			this.svg = svg;
			this.projection = projection;
			this.drawConnections();
		},
		start: function() {
			this.drawMap(this.originName, this.originGeo, this.destinations);
		}
	},

	makeGradeDetail: function() {
		var config = {
			'width': 650,
			'height': 250,
			'segmentWidth': 200,
			'segmentHeight': 200,
			'padding': 12
		}

		var states = ['started', 'inProgress', 'completed'];
		var currentState = 'started' , 
		    endState = 'inProgress';

		var GradeData = {
			"avgGrade": 3.2,
			"gradeA": 13,
			"gradeB": 3,
			"gradeC": 3
		}
		;
		var svg = d3.select('#gradeDetailChart')
					.attr('width', config.width + config.padding * 2)
					.attr('height', config.height + config.padding * 2)
					.style('margin-top', '45px')
					.style('margin-left', '79px')
		;
		var colorScale = d3.scale.ordinal()
								 .domain(states)
								 .range(['orange', 'green', 'green'])
		;
		svg.append('rect')
			.attr('class', 'bg-rect')
			.attr('rx', 10)
			.attr('ry', 10)
			.attr('fill', 'gray')
			.attr('stroke', 'black')
			.attr('stroke-width', '3')
			.attr('height', config.segmentHeight)
			.attr('width', function() {
				return config.segmentWidth * states.length - config.padding * 2;
			})
			.attr('x', config.padding)
			.attr('y', config.padding * 2)
		;
		var progress = svg.append('rect')
							.attr('class', 'progress-rect')
						  	.attr('fill', function() {
								  return colorScale(currentState);
							})				
							.attr('stroke', 'black')
							.attr('stroke-width', '3')
							.attr('width', 0)
							.attr('height', config.segmentHeight)
							.attr('rx', 10)
							.attr('ry', 10)
							.attr('x', config.padding)
							.attr('y', config.padding * 2)
		;
		progress.transition()
				.duration(2000)
				.attr('fill', function() {
					return colorScale(endState);
				})
				.attr('width', function() {
					return (GradeData.avgGrade/4.5) * config.segmentWidth * states.length - config.padding * 2;
				})
		;
		svg.append('text')
				.attr('class', 'progress_text')
				.attr('text-anchor', 'left')
				.attr('tranform', 'translate(15' + ', ' + '15)')
				.attr('x', config.padding)
				.attr('y', config.padding * 2 - 3)
			.text('0')
		;

		svg.append('text')
				.attr('class', 'progress_text')
				.attr('text-anchor', 'left')
				.attr('tranform', 'translate(15' + ', ' + '15)')
				.attr('x', config.segmentWidth * states.length - config.padding * 2)
				.attr('y', config.padding * 2 - 3)
			.text('4.5')
		;

		svg.append('text')
			.attr('class', 'progress_text_avg')
			.attr('text-anchor', 'left')
			.attr('tranform', 'translate(15' + ', ' + '15)')
			.attr('x', function() {
				return (GradeData.avgGrade/4.5) * config.segmentWidth * states.length - config.padding * 2;;
			})
			.attr('y', config.padding * 2 + config.segmentHeight + 18)
			.text(GradeData.avgGrade)
		;
	},

	makeAbilityDetail: function() {
		var w = 490,
			h = 480;

		var colorscale = d3.scale.category10();

		//Legend titles
		var LegendOptions = ['Ability'];

		//Data
		// var d = [
		// 	[
		// 		{axis:"Java", value:0.59},
		// 		{axis:"Python", value:0.56},
		// 		{axis:"C", value:0.42},
		// 		{axis:"Javascript", value:0.34},
		// 		{axis:"C++", value:0.48},
		// 		{axis:"Go", value:0.14}
		// 	]
		// ];

		var d = [
			[
				{axis:"Java", value:10},
				{axis:"Python", value:5},
				{axis:"C", value:7},
				{axis:"Javascript", value:20},
				{axis:"C++", value:9},
				{axis:"Go", value:12}
			]
		];

		var sum = 0;
		$.each(d[0], function(index, value) {
			// console.log(index+','+value);
			$.each(value, function(k, v) {
				// console.log(k+','+v);
				if(k === 'value') sum += v;
			})
		})
		// console.log(sum);

		var precisionRound = function(number, precision) {
  			var factor = Math.pow(10, precision);
  			return Math.round(number * factor) / factor;
		}

		var copy = function(arr1, arr2) {
			for(var i=0; i<arr1.length; i++) {
				arr2[i] = arr1[i];
			}
		}
		var abilityDetailChartData = [];
		for(var i=0; i<10; i++) abilityDetailChartData[i] = i;
		
		// var abilityDetailChartData = jQuery.extend(true, {}, d);
		// var abilityDetailChartData = d;
		var abilityDetailChartData = $.extend(true, {}, d);
		abilityDetailChartData = Object.values(abilityDetailChartData);
		$.each(abilityDetailChartData, function(index, value) {
			$.each(value, function(k, v) {
				// console.log(k + ', ' + v.value / sum);
				v.value = precisionRound(v.value / sum, 4);
			})
		})

		// console.log(abilityDetailChartData);
		// console.log(d);
		// console.log(abilityDetailChartData);
		

		// 그래프 그리기
		//Options for the Radar chart, other than default
		var mycfg = {
			w: w,
			h: h,
			maxValue: 0.6,
			levels: 6,
			ExtraWidthX: 200
		}

		//Call function to draw the Radar chart
		//Will expect that data is in %'s
		RadarChart.draw("#abilityDetailChart", abilityDetailChartData, mycfg);

		var svg = d3.select('#abilityDetailChart')
						.selectAll('svg')
						.append('svg')
						.attr("width", w + 300)
						.attr("height", h)
		;

		//Create the title for the legend
		// var text = svg.append("text")
		// 	.attr("class", "title")
		// 	.attr('transform', 'translate(90,20)') 
		// 	.attr("x", w - 70)
		// 	.attr("y", 10)
		// 	.attr("font-size", "18px")
		// 	.attr("fill", "#404040")
		// 	.text("IT 역량");
				
		//Initiate Legend	
		// var legend = svg.append("g")
		// 	.attr("class", "legend")
		// 	.attr("height", 100)
		// 	.attr("width", 200)
		// 	.attr('transform', 'translate(90,20)') 
		// 	;
		// 	//Create colour squares
		// 	legend.selectAll('rect')
		// 	  .data(LegendOptions)
		// 	  .enter()
		// 	  .append("rect")
		// 	  .attr("x", w - 65)
		// 	  .attr("y", function(d, i){ return i * 20;})
		// 	  .attr("width", 20)
		// 	  .attr("height", 20)
		// 	  .attr('transform', 'translate(-6, 20)') 
		// 	  .style("fill", function(d, i){ return colorscale(i);})
		// 	  ;
		// 	//Create text next to squares
		// 	legend.selectAll('text')
		// 	  .data(LegendOptions)
		// 	  .enter()
		// 	  .append("text")
		// 	  .attr("x", w - 52)
		// 	  .attr("y", function(d, i){ return i * 20 + 9;})
		// 	  .attr("font-size", "15px")
		// 	  .attr("fill", "#737373")
		// 	  .attr('transform', 'translate(0,20)') 
		// 	  .text(function(d) { return d; })
		// 	  ;
		
		// 랭킹 구하기
		var appendRanking = function() {
			// var html = '<li></li>'
			//console.log(d[0]);
			//console.log(d[0].sort(function(a, b) {  return d3.descending(a.value, b.value); }));
			var sortedData = d[0].sort(function(a, b) {  return d3.descending(a.value, b.value); });
			var rankData = sortedData.slice(0, 5);
			for(var i = 0; i<rankData.length; i++) {
				// console.log(i);
				$('#abilityRankList').append("<li>" + rankData[i].axis + "<span class='abilityCategorySublabel'>(" + rankData[i].value + ")</span></li>");
			}
		}

		var clickCategory = function() {
			for(var i = 0; i<categoryFirst.length; i++) {
				(function(m) {
					
					$('#category_' + m).on('click', function() { 
						hideSubcategoryAll();
						clickShowSubcategory(m); 
					});
				})(i);
				
			}
		}

		appendRanking();
	},

	makeCareerDetail: function() {
		var width = 700,
			height = 580;
			
		var careerData = {
			"nodes": [
				{ "name": "빅데이터", "group": 1, "value": 17 },
				{ "name": "처리", "group": 2, "value": 2 },
				{ "name": "분석", "group": 2, "value": 5 },
				{ "name": "데이터", "group": 2, "value": 10},
				{ "name": "AI", "group": 3, "value":22 },
				{ "name": "IoT", "group": 3, "value": 20 },
				{ "name": "엔지니어", "group": 2, "value": 3 },
				{ "name": "제조", "group": 4, "value": 5 },
				{ "name": "인프라", "group": 4, "value": 9 },
				{ "name": "IoT 전문가", "group": 4, "value": 3 },
				{ "name": "ML", "group": 3, "value": 22 }

			],
			"links": [
				{ "source": 0, "target": 1, "value": 1 },
				{ "source": 0, "target": 2, "value": 1 },
				{ "source": 0, "target": 3, "value": 1 },
				{ "source": 0, "target": 6, "value": 1 },
				{ "source": 4, "target": 5, "value": 2 },
				{ "source": 4, "target": 0, "value": 3 },
				{ "source": 5, "target": 0, "value": 3 },
				{ "source": 5, "target": 7, "value": 4 },
				{ "source": 5, "target": 8, "value": 4 },
				{ "source": 5, "target": 9, "value": 4 },
				{ "source": 4, "target": 10, "value": 2 }
				// ,
				// { "source": 8, "target": 9, "value": 2 }
			

			],
 			"category": [{
				"label": "빅데이터", 
				"subCategory": [{
								 "label": "데이터",
								 "value": 12
								}, 
								{
								 "label": "엔지니어",
								 "value": 3
								}, 
								{
								 "label": "처리",
								 "value": 20
								}, 
								{
								 "label": "분석",
								 "value": 8
								}]
			},
			{
				"label": "AI", 
				"subCategory": [{
								 "label": "ML",
								 "value": 22
								}]
			},
  			{
    			"label": "인공지능", 
    			"subCategory": [{
								 "label": "IoT 전문가",
								 "value": 32
								}, 
								{
								 "label": "제조",
								 "value": 40
								}, 
								{
								 "label": "인프라",
								 "value": 40
								}]
			}]
		}

		// 카테고리 분류
		var careerDataCategory = careerData.category;
		var categoryFirst = [];
		var categorySecond = [];
		var categoryFirstValue = [];
		$.each(careerDataCategory, function(index, value) {
			// console.log(index+','+value);
			// console.log(careerDataCategory[index].label);
			categoryFirst.push(careerDataCategory[index].label)
			$.each(value, function(k, v) {
				//console.log(k+','+v);
				if(k === 'subCategory') categorySecond.push(value[k]); //console.log(value[k]);
			})
		})

		// console.log(categoryFirst);
		// console.log(categorySecond);
		// console.log(categoryFirst.indexOf('AI'));

		var findSecondCategory = function(keyword) {
			return categorySecond[categoryFirst.indexOf(keyword)];
		}

		// console.log(findSecondCategory('AI'));
		for(i in categoryFirst) {
			$('#careerCategoryFirst').append('<div id=category_' + i + '>' + categoryFirst[i] + '<span></span></div>');
		}
		
		for(var j = 0; j<categoryFirst.length; j++) {
			var index_categorySecond = findSecondCategory(categoryFirst[j]);
			// $('#careerCategorySecond').append('<div id=category_' + i + '>' + index_categorySecond + '</div>');
			// console.log(index_categorySecond);
			var sum = 0;
			for(i in index_categorySecond) {
				var html = '<div class=subcategory_' + j + '><span>' + index_categorySecond[i].label + '</span>' + '<span>(' + index_categorySecond[i].value + ')</span>' + '</div>'
				$('#careerCategorySecond').append(html);
				sum += index_categorySecond[i].value;
			}
			categoryFirstValue.push(sum);
		}

		var hideSubcategoryAll = function() {
			for(i in categoryFirst) {
				$('.subcategory_' + i).hide();
			}
		}

		var initShowSubcategory = function() {
			$('.subcategory_0').show();
		}

		var clickShowSubcategory = function(index) {
			$('.subcategory_' + index).show();
		}
		
		// dafault 리스트 설정
		hideSubcategoryAll();
		initShowSubcategory();

		// 분류 클릭 이벤트 등록
		var clickCategory = function() {
			for(var i = 0; i<categoryFirst.length; i++) {
				(function(m) {
					
					$('#category_' + m).on('click', function() { 
						hideSubcategoryAll();
						clickShowSubcategory(m); 
					});
				})(i);
				
			}
		}
		clickCategory();
			
		// $('#category_0').on('click', function() { clickShowSubcategory(0) } );
		// $('#category_1').on('click', function() { clickShowSubcategory(1) } );
		// $('#category_2').on('click', function() { clickShowSubcategory(2) } );


		// 그래프 그리기			
        var colorNode = d3.scale.category20(),
			colorLink = d3.scale.category10();
			
		var rScale = d3.scale.linear().domain([0, 100]).range([10, 100]);

        var force = d3.layout.force()
							.charge(-1000)
							.linkDistance(120)
							.size([width, height]);

		var svg = d3.select('#careerDetailChart')
					.append('svg')
						.attr('width', width)
						.attr('height', height);
			
		force.nodes(careerData.nodes)
				.links(careerData.links)
				.start();

		var link = svg.selectAll('.link')
						.data(careerData.links)
						.enter()
						.append('line')
							.attr('class', 'link')
							.style('stroke-width', 3)
							.style('stroke', function(d) { return colorLink(d.value); });

		var node = svg.selectAll('.node')
						.data(careerData.nodes)
						.enter()
						.append('circle')
							.attr('class', 'node')
							.attr('r', function(d) { return rScale(d.value) }) //18
							.style('fill-opacity', '0.85')
							.style('fill', function(d) { return colorNode(d.group); })
							.style('stroke-opacity','1.0')
							.style('stroke', function(d) { return colorNode(d.group); })
							.style('stroke-width', '3px')
							.call(force.drag);

		node.append('title')
				.text(function(d) { return d.name; });

		var nodelabels = svg.selectAll('.nodelabel') 
							.data(careerData.nodes)
							.enter()
								.append('text')
								.attr({ 'x': function(d){ return d.x; },
										'y': function(d){ return d.y; },
										'class': 'nodelabel',
										'stroke': '#404040',
										'font-size': '20px'})
								.text(function(d){return d.name;});

		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

			node.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });

			nodelabels.attr("x", function(d) { return d.x; }) 
					  .attr("y", function(d) { return d.y; });
		});

		$('#careerCategoryFirst').append();
	}
};