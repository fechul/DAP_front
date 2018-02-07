var TEST = {
	init: function() {
		this.makeGrade();
		this.makeAbility();
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
			.data(pie(AbilityData))
				.enter().append('text')
					.attr('class', 'ability_text')
					.attr("transform", function(d) { 
						return "translate(" + arc.centroid(d) + ")"; 
					})
					.attr('x', function(d) { 
						return arc.centroid(d)[0]; 
					})
					.attr('y', function(d) { 
						return arc.centroid(d)[1]; 
					})
					.text(function(d) { return d.data.label; })
		;




	},

	// 성향 차트 생성
	makeCharcter: function() {

	}
};