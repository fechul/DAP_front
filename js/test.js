var TEST = {
	init: function() {
		this.makeGrade();
	},

	// 학점 차트 생성
	makeGrade: function() {
		var info = {
			"width": 200,
			"height": 200,
			"segmentWidth": 100,
			"segmentHeight": 100,
			"padding": 12
		}

		var states = ['started', 'inProgress', 'completed'];
		var currentState = 'started';

		var GradeData = [{
			"avgGrade": "30"
		}]
		;

		var svg = d3.select('#gradeChart')
					.attr('weigth', info.width + info.padding * 2)
					.attr('height', info.height + info.padding * 2)
					.style('margin-top', '40px')
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
				.duration(1000)
				.attr('width', function() {
					return info.segmentWidth * states.length - info.padding * 2;
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


		var moveProgressBar = function(state) {
			progress.transition()
					.duration(2000)
					.attr('fill', function() {
						return colorScale(state);
					})
					.attr('width', function() {
						var index = states.indexOf(state);
						return (index + 1) * info.segmentWidth - info.padding * 2;
					})
			;

			svg.append('text')
				.attr('class', 'progress_text_avg')
				.attr('text-anchor', 'left')
				.attr('tranform', 'translate(15' + ', ' + '15)')
				.attr('x', function() {
					var index = states.indexOf(state);
					return (index + 1) * info.segmentWidth - info.padding * 2;
				})
				.attr('y', info.padding * 2 + info.segmentHeight + 18)
				.text('2.8')
			;
		}

		moveProgressBar("inProgress");

	},

	//  IT 역량 차트 생성
	makeAbility: function() {

	},

	// 성향 차트 생성
	makeCharcter: function() {

	}
};