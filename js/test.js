var TEST = {
	init: function() {
		this.makeGrade();
		this.makeAbility();
		this.makeArea.start();
	},

	// 지역 차트 생성
	makeArea: {
		originGeo: [16.8286, 52.4200],
		originName: 'POZ',
		destinations: [
			{'coord': [20.9679, 52.1672], 'name': 'WAW'},
			{'coord': [23.9569, 49.8134], 'name': 'LWO'},
			{'coord': [30.4433, 50.4120], 'name': 'IEV'},
			{'coord': [13.3724, 55.5355], 'name': 'MMX'},
			{'coord': [12.6508, 55.6180], 'name': 'CPH'},
			{'coord': [16.9154, 58.7890], 'name': 'NYO'},
			{'coord': [10.2569, 59.1824], 'name': 'TRF'},
			{'coord': [9.1526, 55.7408], 'name': 'BLL'},
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
			// {'coord': [19.914486, 39.607645], 'name': 'CFU'},
			{'coord': [34.9362, 29.9511], 'name': 'VDA'},
			{'coord': [34.8854, 32.0055], 'name': 'TLV'}
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
			var arc = svg
				.append('path')
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
				.style('stroke-width', 2)
				.style('fill', 'none')
				.transition()
				.duration(duration)
				.attrTween('stroke-dasharray', function() {
					var len = this.getTotalLength();
					return function(t) {
					return (d3.interpolate('0,' + len, len + ',0'))(t)
					};
				})
				.each('end', function(d) {
					var c = connection[1];
					svg.append('circle')
						.attr('cx', c[0])
						.attr('cy', c[1])
						.attr('r', 0)
						.attr('class', 'destCircleInner')
						.style('fill', 'steelblue')
						.style('fill-opacity', '1')
						.transition()
						.duration(300)
						.attr('r', '3px');
					svg.append('circle')
						.attr('cx', c[0])
						.attr('cy', c[1])
						.attr('r', 0)
						.attr('class', 'destCircleOuter')
						.style('fill', 'black')
						.style('fill-opacity', '0.05')
						.transition()
						.duration(300)
						.attr('r', '10px');
					svg.append('circle')
						.datum(c)
						.attr('cx', c[0])
						.attr('cy', c[1])
						.attr('r', 0)
						.style('class', 'destCircleMouse')
						.style('fill', 'steelblue')
						.style('fill-opacity', '1')
						.on('mouseover', function (d) {
							tooltip.html('<span style="color:white">' + destinationName + '</span>')
							.attr('class', 'tooltipDestination')
							.style('left', d[0] + 12 + 'px')
							.style('top', d[1] - 20 + 'px')
							.transition()
							.duration(700)
							.style('opacity', 1)
						}) 
						.on('mouseout', function (d) {
							tooltip.transition()
							.duration(700)
							.style('opacity', 0)
						})
						.transition()
						.duration(300)
						.attr('r', '3px')
						.each('end', function(d) {
							d3.select(this)
								.transition()
								.duration(2000)
								.attr('r', 20)
								.style('fill-opacity', '0');
							d3.select('.arc' + index)
								.transition()
								.duration(2000)
								.style('stroke-opacity', '0')
								.style('stroke-width', '1')
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
								});
						});
				});
		},
		drawConnections: function () {
			this.drawConnection(0);
		},
		
		drawMap: function (originName, originGeo, destinations) {
			var countries, height, path, projection, scale, svg, width;
			var width = 230;
			var height = 230;
			var center = [4, 68.6];
			var scale = 200;
			projection = d3.geo.mercator().scale(scale).translate([width / 2, 0]).center(center);
			path = d3.geo.path().projection(projection);
			svg = d3.select('#areaChart').append('svg')
				.attr('height', height)
				.attr('width', width)
				.style('background', '#C1E1EC');
			countries = svg.append("g");
			d3.json('europe.json', function(data) {
				countries.selectAll('.country')
				.data(topojson.feature(data, data.objects.europe).features)
				.enter()
				.append('path')
				.attr('class', 'country')
				.attr('d', path)  
				return;
			});
			var source = svg.selectAll('circleOrigin');
				source.data([originGeo]).enter()
						.append('circle')
						.attr('cx', function (d) { return projection(d)[0]; })
						.attr('cy', function (d) { return projection(d)[1]; })
						.attr('r', '3px')
						.style('opacity', 1)
						.attr('fill', 'green')
						.attr('class', 'circleOrigin')
				source.data([originGeo]).enter()
						.append('circle')
						.attr('cx', function (d) { return projection(d)[0]; })
						.attr('cy', function (d) { return projection(d)[1]; })
						.attr('r', '10px')
						.style('opacity', 0.05)
						.attr('fill', 'black')
						.attr('class', 'circleOrigin')
						.on('mouseover', function (d) {
							tooltip.html('<span style="color:white">' + originName + '</span>')
									.attr('class', 'tooltipOrigin')
									.style('left', projection(d)[0] + 12 + 'px')
									.style('top', projection(d)[1] - 20 + 'px')
									.transition()
									.duration(700)
									.style('opacity', 1)
						})
				.on('mouseout', function (d) {
					tooltip.transition()
							.duration(700)
							.style('opacity', 0)
				});
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
		var info = {
			'width': 200,
			'height': 200,
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
					.attr('weigth', info.width + info.padding * 2)
					.attr('height', info.height + info.padding * 2)
					.style('margin-top', '45px')
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
			.attr('height', info.segmentHeight)
			.attr('width', function() {
				return info.segmentWidth * states.length - info.padding * 2;
			})
			.attr('x', info.padding)
			.attr('y', info.padding * 2)
			;

		var progress = svg.append('rect')
							.attr('class', 'progress-rect')
						  	.attr('fill', function() {
								  return colorScale(currentState);
							})				
							.attr('stroke', 'black')
							.attr('stroke-width', '3')
							.attr('width', 0)
							.attr('height', info.segmentHeight)
							.attr('rx', 10)
							.attr('ry', 10)
							.attr('x', info.padding)
							.attr('y', info.padding * 2)
							;
		
		progress.transition()
				.duration(2000)
				.attr('fill', function() {
					return colorScale(endState);
				})
				.attr('width', function() {
					return (GradeData.avgGrade/4.5) * info.segmentWidth * states.length - info.padding * 2;
				})
		;


		svg.append('text')
				.attr('class', 'progress_text')
				.attr('text-anchor', 'left')
				.attr('tranform', 'translate(15' + ', ' + '15)')
				.attr('x', info.padding)
				.attr('y', info.padding * 2 - 3)
			.text('0')
		;

		svg.append('text')
				.attr('class', 'progress_text')
				.attr('text-anchor', 'left')
				.attr('tranform', 'translate(15' + ', ' + '15)')
				.attr('x', info.segmentWidth * states.length - info.padding * 2)
				.attr('y', info.padding * 2 - 3)
			.text('4.5')
		;

		svg.append('text')
			.attr('class', 'progress_text_avg')
			.attr('text-anchor', 'left')
			.attr('tranform', 'translate(15' + ', ' + '15)')
			.attr('x', function() {
				return (GradeData.avgGrade/4.5) * info.segmentWidth * states.length - info.padding * 2;;
			})
			.attr('y', info.padding * 2 + info.segmentHeight + 18)
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
		// 				return (index + 1) * info.segmentWidth - info.padding * 2;
		// 			})
		// 	;

		// 	svg.append('text')
		// 		.attr('class', 'progress_text_avg')
		// 		.attr('text-anchor', 'left')
		// 		.attr('tranform', 'translate(15' + ', ' + '15)')
		// 		.attr('x', function() {
		// 			var index = states.indexOf(state);
		// 			return (index + 1) * info.segmentWidth - info.padding * 2;
		// 		})
		// 		.attr('y', info.padding * 2 + info.segmentHeight + 18)
		// 		.text(GradeData.avgGrade)
		// 	;
		// }

		//moveProgressBar("inProgress");

	},

	//  IT 역량 차트 생성
	makeAbility: function() {
		var info = {
			'width': 220,
			'height': 220,
			'radius': 0,
			'innerRadius': 0,
			'padding': 5
		}

		info.radius = Math.min(info.width, info.height) / 2;
		info.innerRadius = 0.3 * info.radius;

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
						.innerRadius(info.innerRadius - info.padding * 2)
						.outerRadius(function(d) {
							return ((info.radius - info.innerRadius) * (d.data.value / max) + info.innerRadius) - info.padding * 2;
						})
		;

		var outlineArc = d3.svg.arc()
							   .innerRadius(info.innerRadius - info.padding * 2)
							   .outerRadius(info.radius - info.padding * 2)
		;

		var svg = d3.select('#abilityChart')
					.attr('width', info.width)
					.attr('height', info.height)
						.append('g')
						.attr('transform', 'translate(' + info.width / 2 + ', ' + info.height / 2 + ')')
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

	// 성향 차트 생성
	makeCharcter: function() {

	}
};