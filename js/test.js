var TEST = {
	init: function() {
		this.makeArea.start();
		this.makeGrade();
		this.makeAbility();
		this.makeCareer();
		// this.makeCharacter();

		// this.makeGradeDetail();
		// this.makeCareerDetail();
		this.makeAbilityDetail();
		// this.makeAreaDetail.start();
		this.makeAreaDetailRight();
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
		originName: 'SK(주)C&C',
		destinations: [
			{'coord': [126.782, 37.505], 'name': '경기도 부천시'},
			{'coord': [127.113, 37.37], 'name': '경기도 성남시'},
			{'coord': [126.939, 37.399], 'name': '경기도 안양시'},
			{'coord': [126.907, 37.405], 'name': '경기도 안양시'},
			{'coord': [129.399, 36.988], 'name': '경상북도 울진군'},
			{'coord': [127.066, 37.637], 'name': '서울특별시 노원구'},
			{'coord': [126.955, 37.235], 'name': '경기도 화성시'},
			{'coord': [127.012, 37.612], 'name': '서울특별시 성북구'},
			{'coord': [127.138, 37.371], 'name': '경기도 성남시'},
			{'coord': [129.059, 35.14], 'name': '부산광역시 동구'},
			{'coord': [126.961, 37.562], 'name': '서울특별시 서대문구'},
			{'coord': [127.044, 37.307], 'name': '경기도 수원시'},
			{'coord': [126.981783, 37.38544], 'name': '경기도 의왕시'},
			{'coord': [127.062111, 37.500733], 'name': '서울특별시 강남구'},
			{'coord': [127.133428, 37.514078], 'name': '서울특별시 송파구'},
			{'coord': [126.717106, 37.460384], 'name': '인천광역시 남동구'},
			{'coord': [128.435188, 36.090831], 'name': '경상북도 구미시'},
			{'coord': [126.936089, 37.517971], 'name': '서울특별시 영등포구'},
			{'coord': [126.936428, 37.588674], 'name': '서울특별시 서대문구'},
			{'coord': [127.394479, 36.321067], 'name': '대전광역시 중구'},
			{'coord': [127.035, 37.286098], 'name': '경기도 수원시'},
			{'coord': [129.016393, 35.153772], 'name': '부산광역시 사상구'},
			{'coord': [128.549181, 35.928274], 'name': '대구광역시 북구'},
			{'coord': [127.503723, 36.612542], 'name': '충청북도 청주시'},
			{'coord': [128.695853, 35.838525], 'name': '대구광역시 수성구'},
			{'coord': [127.05916, 37.247775], 'name': '경기도 수원시'},
			{'coord': [129.114292, 37.524719], 'name': '강원도 동해시'},
			{'coord': [126.945021, 37.507494], 'name': '서울특별시 동작구'},
			{'coord': [127.03014, 37.249787], 'name': '경기도 수원시'},
			{'coord': [127.3945, 36.333589], 'name': '대전광역시 중구'},
			{'coord': [129.424018, 35.486247], 'name': '울산광역시 동구'},
			{'coord': [127.949535, 37.321936], 'name': '강원도 원주시'},
			{'coord': [128.113843, 35.203828], 'name': '경상남도 진주시'},
			{'coord': [128.376261, 36.640251], 'name': '경상북도 예천군'},
			{'coord': [126.797403, 37.441768], 'name': '경기도 시흥시'},
			{'coord': [126.847919, 37.544049], 'name': '서울특별시 강서구'},
			{'coord': [129.090057, 35.243748], 'name': '서울특별시 관악구'},
			{'coord': [126.929255, 37.480433], 'name': '서울특별시 송파구'},
			{'coord': [127.119464, 37.510683], 'name': '경기도 고양시'},
			{'coord': [126.815149, 37.679601], 'name': '전라북도 전주시'},
			{'coord': [127.062113, 35.832944], 'name': '경기도 용인시'},
			{'coord': [127.076572, 37.3127], 'name': '울산광역시 남구'},
			{'coord': [129.33183, 35.544405], 'name': '경기도 양주시'},
			{'coord': [127.06911, 37.843319], 'name': '경기도 성남시'},
			{'coord': [127.138484, 37.471674], 'name': '경기도 의왕시'},
			{'coord': [126.972836, 37.375725], 'name': '경기도 용인시'},
			{'coord': [127.125768, 37.328539], 'name': '경기도 하남시'},
			{'coord': [127.214769, 37.542722], 'name': '경기도 부천시'},
			{'coord': [126.800212, 37.477209], 'name': '경기도 부천시'},
			{'coord': [127.070949, 37.656217], 'name': '서울특별시 노원구'},
			{'coord': [128.548636, 35.820141], 'name': '대구광역시 달서구'},
			{'coord': [126.76029, 37.507457], 'name': '경기도 부천시'},
			{'coord': [128.528228, 35.858157], 'name': '대구광역시 달서구'},
			{'coord': [128.360322, 36.101793], 'name': '경상북도 구미시'},
			{'coord': [126.706846, 37.498095], 'name': '인천광역시 부평구'},
			{'coord': [127.055865, 37.546097], 'name': '서울특별시 성동구'},
			{'coord': [126.976231, 37.377447], 'name': '경기도 의왕시'},
			{'coord': [127.315403, 36.385909], 'name': '대전광역시 유성구'},
			{'coord': [126.689914, 37.444009], 'name': '인천광역시 남구'}
		],
		// destinations: [
		// 	{'coord': [127.104456, 37.513931], 'name': '고성군'},
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
			// {'coord': [129.163984, 35.165740], 'name': '밀양시'}
		// ],
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
							.duration(0) //2000
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
							.duration(0) //2000
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

		// var GradeData = {
		// 	"avgGrade": "3.2"
		// };
		var GradeData = {"avgGrade":"3.81","gradec":"3","gradeb":"43","gradea":"13"};
		

		// 차트 그리기
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

		// var d = [
		// 	[
		// 		{axis:"Java", value:10},
		// 		{axis:"Python", value:5},
		// 		{axis:"C", value:7},
		// 		{axis:"Javascript", value:20},
		// 		{axis:"C++", value:9},
		// 		{axis:"Go", value:12}
		// 	]
		// ];
		
		var d = [[{"axis":"C","value":35},{"axis":" JAVA","value":31},{"axis":" C++","value":29},{"axis":" MySQL","value":27},{"axis":" Python","value":24},{"axis":" Javascript","value":21}]];

		var sum = 0;
		$.each(d[0], function(index, value) {
			// console.log(index+','+value);
			$.each(value, function(k, v) {
				// console.log(k+','+v);
				if(k === 'value') sum += v;
			})
		})
		sum = 59;

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
			maxValue: 0.8,
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
				{ "name": "Data", "group": 1, "value": 9 }, //0
				{ "name": "DT", "group": 1, "value": 23 }, //1
				{ "name": "ICT", "group": 1, "value": 16 }, //2
				{ "name": "ITS", "group": 1, "value": 6 }, //3
				{ "name": "기타", "group": 1, "value": 5 }, //4

				{ "name": "Big Data Engineer", "group": 3, "value": 1 }, //5
				{ "name": "Connectivity 전문가", "group": 4, "value": 1 }, //6
				{ "name": "Data Analyst", "group": 2, "value": 1 }, //7
				{ "name": "Data Scientist", "group": 2, "value": 2 }, //8
				{ "name": "DBA", "group": 2, "value": 2 }, //9
				{ "name": "Deep learning 전문가", "group": 3, "value": 1 }, //10
				{ "name": "DT 전문가", "group": 3, "value": 2 }, //11
				{ "name": "HR 팀장", "group": 6, "value": 1 }, //12
				{ "name": "ICT 기술 전문가", "group": 4, "value": 1 }, //13
				{ "name": "Smart Factory 전문가", "group": 5, "value": 1 }, //14
				{ "name": "Solution 개발자", "group": 5, "value": 1 }, //15
				{ "name": "공정 자동화", "group": 5, "value": 1 }, //16
				{ "name": "글로벌 IT 컨설턴트", "group": 5, "value": 1 }, //17
				{ "name": "금융산업의 DT 전문가", "group": 5, "value": 1 }, //18
				{ "name": "데이터 분석 전문가", "group": 2, "value": 1 }, //19
				{ "name": "데이터 아키텍쳐", "group": 2, "value": 1 }, //20
				{ "name": "데이터 전문가", "group": 2, "value": 1 }, //21
				{ "name": "데이터 컨설턴트", "group": 2, "value": 1 }, //22
				{ "name": "딥러닝 전문가", "group": 3, "value": 1 }, //23
				{ "name": "블록체인 전문가", "group": 3, "value": 1 }, //24
				{ "name": "빅데이터 전문가", "group": 3, "value": 4 }, //25
				{ "name": "앱 개발자", "group": 4, "value": 1 }, //26
				{ "name": "아키텍터", "group": 4, "value": 1 }, //27
				{ "name": "어플리케이션 전문가", "group": 4, "value": 3 }, //28
				{ "name": "웹 개발자", "group": 4, "value": 1 }, //29
				{ "name": "인공지능 전문가", "group": 3, "value": 10 }, //30
				{ "name": "인공지능, 앱 전문가", "group": 3, "value": 1 }, //31
				{ "name": "인프라 전문가", "group": 4, "value": 2 }, //32
				{ "name": "좋은 아빠", "group": 6, "value": 1 }, //33
				{ "name": "클라우드 PaaS 전문가", "group": 3, "value": 1 }, //34
				{ "name": "클라우드 전문가", "group": 3, "value": 1 }, //35
				{ "name": "통신 전문가", "group": 5, "value": 1 }, //36
				{ "name": "평생개발", "group": 6, "value": 1 }, //37
				{ "name": "풀스택 Developer/PL/PM", "group": 4, "value": 3 }, //38
				{ "name": "풀스택개발자", "group": 4, "value": 1 }, //39
				{ "name": "플랫폼 개발 전문가", "group": 4, "value": 1 }, //40
				{ "name": "플랫폼 전문가", "group": 4, "value": 1 }, //41
				{ "name": "SK㈜C&C 임원", "group": 6, "value": 1 }, //42
				{ "name": "SK㈜C&C 전무", "group": 6, "value": 1 } //43
				// { "name": "글로벌 IT 컨설턴트", "group": 2, "value": 1 } //44
			],
			"links": [
				{ "source": 0, "target": 7, "value": 1 },
				{ "source": 0, "target": 8, "value": 1 },
				{ "source": 0, "target": 9, "value": 1 },
				{ "source": 0, "target": 20, "value": 1 },
				{ "source": 0, "target": 19, "value": 1 },
				{ "source": 0, "target": 21, "value": 1 },
				{ "source": 0, "target": 22, "value": 1 },


				{ "source": 1, "target": 5, "value": 2 },
				{ "source": 1, "target": 10, "value": 2 },
				{ "source": 1, "target": 11, "value": 2 },
				{ "source": 1, "target": 23, "value": 2 },
				{ "source": 1, "target": 24, "value": 2 },
				{ "source": 1, "target": 25, "value": 2 },
				{ "source": 1, "target": 30, "value": 2 },
				{ "source": 1, "target": 31, "value": 2 },
				{ "source": 1, "target": 34, "value": 2 },
				{ "source": 1, "target": 35, "value": 2 },

				{ "source": 2, "target": 6, "value": 3 },
				{ "source": 2, "target": 13, "value": 3 },
				{ "source": 2, "target": 27, "value": 3 },
				{ "source": 2, "target": 26, "value": 3 },
				{ "source": 2, "target": 28, "value": 3 },
				{ "source": 2, "target": 29, "value": 3 },
				{ "source": 2, "target": 32, "value": 3 },
				{ "source": 2, "target": 38, "value": 3 },
				{ "source": 2, "target": 39, "value": 3 },
				{ "source": 2, "target": 40, "value": 3 },
				{ "source": 2, "target": 41, "value": 3 },

				{ "source": 3, "target": 17, "value": 4 },
				{ "source": 3, "target": 18, "value": 4 },
				{ "source": 3, "target": 36, "value": 4 },
				{ "source": 3, "target": 14, "value": 4 },
				{ "source": 3, "target": 16, "value": 4 },
				{ "source": 3, "target": 15, "value": 4 },

				{ "source": 4, "target": 42, "value": 5 },
				{ "source": 4, "target": 43, "value": 5 },
				{ "source": 4, "target": 33, "value": 5 },
				{ "source": 4, "target": 37, "value": 5 },
				{ "source": 4, "target": 12, "value": 5 },

				{ "source": 0, "target": 1, "value": 6 },
				{ "source": 1, "target": 2, "value": 6 },
				{ "source": 2, "target": 3, "value": 6 },
				{ "source": 3, "target": 4, "value": 6 },
				{ "source": 4, "target": 0, "value": 6 }
				
				// ,
				// { "source": 8, "target": 9, "value": 2 }
			],
 			"category": [{			 
    			"label": "Data", 
    			"subCategory": [
					{ "label": "Data Analyst", "value": 1 },
					{ "label": "Data scientist", "value": 2 },
					{ "label": "DBA", "value": 2 },
					{ "label": "데이터 아키텍쳐", "value": 1 },
					{ "label": "데이터 분석 전문가", "value": 1 },
					{ "label": "데이터 전문가", "value": 1 },
					{ "label": "데이터 컨설턴트", "value": 1 }
				]
			 },
  			{
    			"label": "DT", 
    			"subCategory": [
     				{ "label": "Big Data Engineer", "value": 1 },
     				{ "label": "Deep learning 전문가", "value": 1 },
    				{ "label": "DT 전문가", "value": 2 },
    			 	{ "label": "딥러닝 전문가", "value": 1 },
     				{ "label": "블록체인 전문가", "value": 1 },
     				{ "label": "빅데이터 전문가", "value": 4 },
     				{ "label": "인공지능 전문가", "value": 10 },
     				{ "label": "인공지능, 앱 전문가", "value": 1 },
     				{ "label": "클라우드 PaaS 전문가", "value": 1 },
     				{ "label": "클라우드 전문가", "value": 1 }  
				  ]
			},
  			{
    			"label": "ICT", 
    			"subCategory": [
     				{ "label": "Connectivity 전문가", "value": 1 },
     				{ "label": "ICT 기술 전문가", "value": 1 },
     				{ "label": "아키텍터", "value": 1 },
     				{ "label": "앱 개발자", "value": 1 },
     				{ "label": "어플리케이션 전문가", "value": 3 },
     				{ "label": "웹 개발자", "value": 1 },
     				{ "label": "인프라 전문가", "value": 2 },
     				{ "label": "풀스택 Developer/PL/PM", "value": 3 },
     				{ "label": "풀스택개발자", "value": 1 },
     				{ "label": "플랫폼 개발 전문가", "value": 1 },
     				{ "label": "플랫폼 전문가", "value": 1 }  
				  ]
			},
  			{
    			"label": "ITS", 
    			"subCategory": [
     				{ "label": "글로벌 IT 컨설턴트", "value": 1 },
     				{ "label": "금융산업의 DT 전문가", "value": 1 },
     				{ "label": "통신 전문가", "value": 1 },
     				{ "label": "Smart Factory 전문가", "value": 1 },
     				{ "label": "공정 자동화", "value": 1 },
     				{ "label": "Solution 개발자", "value": 1 }  
				  ]
			},
 			{
   				"label": "기타", 
    			"subCategory": [
     				{ "label": "SK㈜C&C 임원", "value": 1 },
     				{ "label": "SK㈜C&C 전무", "value": 1 },
     				{ "label": "좋은 아빠", "value": 1 },
     				{ "label": "평생개발", "value": 1 },
     				{ "label": "HR 팀장", "value": 1 }  
				  ]
			}]
		}		

        // var colorNode = d3.scale.category20(),
        var colorNode = function(i) { var color = ['#1f77b4', '#c33e69', '#ff7f0e', '#8e44bd', '#2ca02c', '#8c564a', '#e376c2', '#bcbe23', '#18bed0', '#393b78', '#ad494a', '#d6616a', '#31a353', '#7b4173', '#a55094', '#3365cc', '#0199c6', '#dd4476', '#66aa01', '#b82f2f']; return color[i%20];}
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
		// originName: 'SK(주)C&C',
		originName: '<img id="sklogo" style="width:65px; height:auto;" src="img/sklogo.png"></img>',
		destinations: [
			{'coord': [126.782, 37.505], 'name': '경기도 부천시'},
			{'coord': [127.113, 37.37], 'name': '경기도 성남시'},
			{'coord': [126.939, 37.399], 'name': '경기도 안양시'},
			{'coord': [126.907, 37.405], 'name': '경기도 안양시'},
			{'coord': [129.399, 36.988], 'name': '경상북도 울진군'},
			{'coord': [127.066, 37.637], 'name': '서울특별시 노원구'},
			{'coord': [126.955, 37.235], 'name': '경기도 화성시'},
			{'coord': [127.012, 37.612], 'name': '서울특별시 성북구'},
			{'coord': [127.138, 37.371], 'name': '경기도 성남시'},
			{'coord': [129.059, 35.14], 'name': '부산광역시 동구'},
			{'coord': [126.961, 37.562], 'name': '서울특별시 서대문구'},
			{'coord': [127.044, 37.307], 'name': '경기도 수원시'},
			{'coord': [126.981783, 37.38544], 'name': '경기도 의왕시'},
			{'coord': [127.062111, 37.500733], 'name': '서울특별시 강남구'},
			{'coord': [127.133428, 37.514078], 'name': '서울특별시 송파구'},
			{'coord': [126.717106, 37.460384], 'name': '인천광역시 남동구'},
			{'coord': [128.435188, 36.090831], 'name': '경상북도 구미시'},
			{'coord': [126.936089, 37.517971], 'name': '서울특별시 영등포구'},
			{'coord': [126.936428, 37.588674], 'name': '서울특별시 서대문구'},
			{'coord': [127.394479, 36.321067], 'name': '대전광역시 중구'},
			{'coord': [127.035, 37.286098], 'name': '경기도 수원시'},
			{'coord': [129.016393, 35.153772], 'name': '부산광역시 사상구'},
			{'coord': [128.549181, 35.928274], 'name': '대구광역시 북구'},
			{'coord': [127.503723, 36.612542], 'name': '충청북도 청주시'},
			{'coord': [128.695853, 35.838525], 'name': '대구광역시 수성구'},
			{'coord': [127.05916, 37.247775], 'name': '경기도 수원시'},
			{'coord': [129.114292, 37.524719], 'name': '강원도 동해시'},
			{'coord': [126.945021, 37.507494], 'name': '서울특별시 동작구'},
			{'coord': [127.03014, 37.249787], 'name': '경기도 수원시'},
			{'coord': [127.3945, 36.333589], 'name': '대전광역시 중구'},
			{'coord': [129.424018, 35.486247], 'name': '울산광역시 동구'},
			{'coord': [127.949535, 37.321936], 'name': '강원도 원주시'},
			{'coord': [128.113843, 35.203828], 'name': '경상남도 진주시'},
			{'coord': [128.376261, 36.640251], 'name': '경상북도 예천군'},
			{'coord': [126.797403, 37.441768], 'name': '경기도 시흥시'},
			{'coord': [126.847919, 37.544049], 'name': '서울특별시 강서구'},
			{'coord': [129.090057, 35.243748], 'name': '서울특별시 관악구'},
			{'coord': [126.929255, 37.480433], 'name': '서울특별시 송파구'},
			{'coord': [127.119464, 37.510683], 'name': '경기도 고양시'},
			{'coord': [126.815149, 37.679601], 'name': '전라북도 전주시'},
			{'coord': [127.062113, 35.832944], 'name': '경기도 용인시'},
			{'coord': [127.076572, 37.3127], 'name': '울산광역시 남구'},
			{'coord': [129.33183, 35.544405], 'name': '경기도 양주시'},
			{'coord': [127.06911, 37.843319], 'name': '경기도 성남시'},
			{'coord': [127.138484, 37.471674], 'name': '경기도 의왕시'},
			{'coord': [126.972836, 37.375725], 'name': '경기도 용인시'},
			{'coord': [127.125768, 37.328539], 'name': '경기도 하남시'},
			{'coord': [127.214769, 37.542722], 'name': '경기도 부천시'},
			{'coord': [126.800212, 37.477209], 'name': '경기도 부천시'},
			{'coord': [127.070949, 37.656217], 'name': '서울특별시 노원구'},
			{'coord': [128.548636, 35.820141], 'name': '대구광역시 달서구'},
			{'coord': [126.76029, 37.507457], 'name': '경기도 부천시'},
			{'coord': [128.528228, 35.858157], 'name': '대구광역시 달서구'},
			{'coord': [128.360322, 36.101793], 'name': '경상북도 구미시'},
			{'coord': [126.706846, 37.498095], 'name': '인천광역시 부평구'},
			{'coord': [127.055865, 37.546097], 'name': '서울특별시 성동구'},
			{'coord': [126.976231, 37.377447], 'name': '경기도 의왕시'},
			{'coord': [127.315403, 36.385909], 'name': '대전광역시 유성구'},
			{'coord': [126.689914, 37.444009], 'name': '인천광역시 남구'}
		],
		// destinations: [
		// 	{'coord': [127.104456, 37.513931], 'name': '고성군'},
		// 	// {'coord': [129.163984, 35.165740], 'name': '밀양시'},
		// 	// {'coord': [126.964713, 37.546671], 'name': '여기'},
		// 	{'coord': [126.924436, 37.557687], 'name': '홍대'}
		// ],
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
							.duration(0) //2000
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
							.duration(0) //2000
							.style('stroke-opacity', '1') // style('stroke-opacity', '0') 
							.style('stroke-width', '2')
							.each('end', function (d) {
								// if (index === self.destinations.length - 1) {
								// 	svg.selectAll('.destCircleInnerDetail').remove();
								// 	svg.selectAll('.destCircleOuterDetail').remove();
								// 	svg.selectAll('.destCircleMouseDetail').remove();
								// 	for (i = 0; i < self.destinations.length; i++) { 
								// 		svg.selectAll('.arcDetail' + i).remove();
								// 	}
								// }
								var nextIndex = index + 1;
								if (nextIndex < self.destinations.length) {
									// console.log('1'+nextIndex);
									self.drawConnection(nextIndex);
								} else {
									d3.select('#areaDetailChart').append('div')	
										// .attr('class', 'tooltipOriginDetail')			
										.style('opacity', 0)
										// .html('<span style="color:white">' + self.originName + '</span>')
										.html(self.originName)
										// .attr('class', 'tooltipOriginDetail')
										.style('position',  'absolute')
										.style('left',  324 + 'px')
										.style('top',  180 + 'px')
										.transition()
										.duration(500) //700
										.style('opacity', 1)
								;

									// console.log('2'+nextIndex);
									// d3.selectAll('.tooltipOriginDetail').data([originGeo]).enter().select('#areaDetailChart').append('div')
									// 	.html('<span style="color:white">' + this.originName + '</span>')
									// 	.attr('class', 'tooltipOriginDetail')
									// 	.style('left', projection(d)[0] + 50 + 'px')
									// 	.style('top', projection(d)[1] - 0 + 'px')
									// 	.transition()
									// 	.duration(500) //700
									// 	.style('opacity', 1)
									// ;
									// self.drawConnection(0);
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
							//console.log( projection(d)[0]);
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

		// var GradeData = {
		// 	"avgGrade": 3.2,
		// 	"gradeA": 13,
		// 	"gradeB": 3,
		// 	"gradeC": 3
		// };
		var GradeData = {"avgGrade":"3.81","gradec":"3","gradeb":"43","gradea":"13"};
		var previousData = {"avgGrade": '3.5'};

		$('#currentAvgGrade').text(GradeData.avgGrade);

		$('#gradeAvg').text(previousData.avgGrade);
		var growRateColor = GradeData.avgGrade >= previousData.avgGrade ? '#2e6ba4' : '#ff2b2b';
		var growRate = '<span style="color:' + growRateColor + ';">';
		growRate += (GradeData.avgGrade >= previousData.avgGrade ? '+' : '-');
		growRate += (((parseFloat(GradeData.avgGrade)-parseFloat(previousData.avgGrade))/parseFloat(previousData.avgGrade))*100).toFixed(2);
		growRate += '%';
		growRate += '</span>';
		$('#gradePerChange').html(growRate);


		var svg = d3.select('#gradeDetailChart')
					.attr('width', config.width + config.padding * 2)
					.attr('height', config.height + config.padding * 2)
					.style('margin-top', '60px')
					.style('margin-left', '79px')
					.style('margin-bottom', '45px')
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
			.attr('y', config.padding * 2.3)
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
							.attr('y', config.padding * 2.3)
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
				.style('font-size', '30px')
				.style('fill', 'black')
				.style('stroke', 'none')
				.attr('tranform', 'translate(15' + ', ' + '15)')
				.attr('x', config.padding - 10)
				.attr('y', config.padding * 2.3 - 5)
			.text('0')
		;

		svg.append('text')
				.attr('class', 'progress_text')
				.attr('text-anchor', 'left')
				.style('font-size', '30px')
				.style('fill', 'black')
				.style('stroke', 'none')
				.attr('tranform', 'translate(15' + ', ' + '15)')
				.attr('x', config.segmentWidth * states.length - config.padding * 2 - 10)
				.attr('y', config.padding * 2.3 - 5)
			.text('4.5')
		;

		svg.append('text')
			.attr('class', 'progress_text_avg')
			.attr('text-anchor', 'left')			
			.style('font-size', '48px')
			.style('fill', 'black')
			.attr('tranform', 'translate(15' + ', ' + '15)')
			.attr('x', function() {
				return (GradeData.avgGrade/4.5) * config.segmentWidth * states.length - config.padding * 2;
			})
			.attr('y', config.padding * 2.3 + config.segmentHeight + 18 + 24)
			.text(GradeData.avgGrade)
		;


		var data = [{
                "name": "3.0 ~ 3.5",
                "value": 12,
        }, {
                "name": "3.5 ~ 4.0",
                "value": 34,
        }, {
                "name": "4.0 ~ 4.5",
                "value": 13,
        }];

		//sort bars based on value
        // data = data.sort(function (a, b) {
        //     return d3.ascending(a.value, b.value);
        // })

        //set up svg using margin conventions - we'll need plenty of room on the left for labels
        var margin = {
            top: 15,
            right: 25,
            bottom: 15,
            left: 60
        };

        var width = 370 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var svg = d3.select("#gradeHorizontalChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
			.style('margin-top', '40px')
			.style('padding', '8px')
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .1)
            .domain(data.map(function (d) {
                return d.name;
            }));

        //make y axis to show bar names
        var yAxis = d3.svg.axis()
            .scale(y)
            //no tick marks
            .tickSize(0)
            .orient("left");

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", "translate(" + 0 + "," + margin.top + ")")

        //append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("height", y.rangeBand()-30)
            .attr("x", 0)
            .attr("width", function (d) {
                return x((d.value)*0.9);
            })
            .attr('fill', '#5f9dde');

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.name) + (y.rangeBand()-30) / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.value*0.9) + 3;
            })
            .text(function (d) {
                return d.value;
            });

	},

	makeAbilityDetail: function() {
		var w = 490,
			h = 480;

		var colorscale = d3.scale.category10();

		//Legend titles
		var LegendOptions = ['Ability'];

		var d = [[{"axis":"C","value":35},{"axis":" JAVA","value":31},{"axis":" C++","value":29},{"axis":" MySQL","value":27},{"axis":" Python","value":24},{"axis":" Javascript","value":21}]];
		// var d = [[{"axis":"C","value":51},{"axis":" JAVA","value":48},{"axis":" C++","value":41},{"axis":" MySQL","value":39},{"axis":" Python","value":37},{"axis":" Javascript","value":35}]];

		var sum = 0;
		$.each(d[0], function(index, value) {
			// console.log(index+','+value);
			$.each(value, function(k, v) {
				// console.log(k+','+v);
				if(k === 'value') sum += v;
			})
		})
		sum = 59;
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
		

		// 그래프 그리기
		//Options for the Radar chart, other than default
		var mycfg = {
			w: w,
			h: h,
			maxValue: 0.8,
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
			// var rankData = sortedData.slice(0, 5);
			for(var i = 0; i<sortedData.length; i++) {
				// console.log(i);
				$('#abilityRankList').append("<li>" + sortedData[i].axis + "<span class='abilityCategorySublabel'>(" + sortedData[i].value + ")</span></li>");
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
				{ "name": "Data", "group": 1, "value": 9 }, //0
				{ "name": "DT", "group": 1, "value": 23 }, //1
				{ "name": "ICT", "group": 1, "value": 16 }, //2
				{ "name": "ITS", "group": 1, "value": 6 }, //3
				{ "name": "기타", "group": 1, "value": 5 }, //4

				{ "name": "Big Data Engineer", "group": 3, "value": 1 }, //5
				{ "name": "Connectivity 전문가", "group": 4, "value": 1 }, //6
				{ "name": "Data Analyst", "group": 2, "value": 1 }, //7
				{ "name": "Data Scientist", "group": 2, "value": 2 }, //8
				{ "name": "DBA", "group": 2, "value": 2 }, //9
				{ "name": "Deep learning 전문가", "group": 3, "value": 1 }, //10
				{ "name": "DT 전문가", "group": 3, "value": 2 }, //11
				{ "name": "HR 팀장", "group": 6, "value": 1 }, //12
				{ "name": "ICT 기술 전문가", "group": 4, "value": 1 }, //13
				{ "name": "Smart Factory 전문가", "group": 5, "value": 1 }, //14
				{ "name": "Solution 개발자", "group": 5, "value": 1 }, //15
				{ "name": "공정 자동화", "group": 5, "value": 1 }, //16
				{ "name": "글로벌 IT 컨설턴트", "group": 5, "value": 1 }, //17
				{ "name": "금융산업의 DT 전문가", "group": 5, "value": 1 }, //18
				{ "name": "데이터 분석 전문가", "group": 2, "value": 1 }, //19
				{ "name": "데이터 아키텍쳐", "group": 2, "value": 1 }, //20
				{ "name": "데이터 전문가", "group": 2, "value": 1 }, //21
				{ "name": "데이터 컨설턴트", "group": 2, "value": 1 }, //22
				{ "name": "딥러닝 전문가", "group": 3, "value": 1 }, //23
				{ "name": "블록체인 전문가", "group": 3, "value": 1 }, //24
				{ "name": "빅데이터 전문가", "group": 3, "value": 4 }, //25
				{ "name": "앱 개발자", "group": 4, "value": 1 }, //26
				{ "name": "아키텍터", "group": 4, "value": 1 }, //27
				{ "name": "어플리케이션 전문가", "group": 4, "value": 3 }, //28
				{ "name": "웹 개발자", "group": 4, "value": 1 }, //29
				{ "name": "인공지능 전문가", "group": 3, "value": 10 }, //30
				{ "name": "인공지능, 앱 전문가", "group": 3, "value": 1 }, //31
				{ "name": "인프라 전문가", "group": 4, "value": 2 }, //32
				{ "name": "좋은 아빠", "group": 6, "value": 1 }, //33
				{ "name": "클라우드 PaaS 전문가", "group": 3, "value": 1 }, //34
				{ "name": "클라우드 전문가", "group": 3, "value": 1 }, //35
				{ "name": "통신 전문가", "group": 5, "value": 1 }, //36
				{ "name": "평생개발", "group": 6, "value": 1 }, //37
				{ "name": "풀스택 Developer/PL/PM", "group": 4, "value": 3 }, //38
				{ "name": "풀스택개발자", "group": 4, "value": 1 }, //39
				{ "name": "플랫폼 개발 전문가", "group": 4, "value": 1 }, //40
				{ "name": "플랫폼 전문가", "group": 4, "value": 1 }, //41
				{ "name": "SK㈜C&C 임원", "group": 6, "value": 1 }, //42
				{ "name": "SK㈜C&C 전무", "group": 6, "value": 1 } //43
				// { "name": "글로벌 IT 컨설턴트", "group": 2, "value": 1 } //44
			],
			"links": [
				{ "source": 0, "target": 7, "value": 1 },
				{ "source": 0, "target": 8, "value": 1 },
				{ "source": 0, "target": 9, "value": 1 },
				{ "source": 0, "target": 20, "value": 1 },
				{ "source": 0, "target": 19, "value": 1 },
				{ "source": 0, "target": 21, "value": 1 },
				{ "source": 0, "target": 22, "value": 1 },


				{ "source": 1, "target": 5, "value": 2 },
				{ "source": 1, "target": 10, "value": 2 },
				{ "source": 1, "target": 11, "value": 2 },
				{ "source": 1, "target": 23, "value": 2 },
				{ "source": 1, "target": 24, "value": 2 },
				{ "source": 1, "target": 25, "value": 2 },
				{ "source": 1, "target": 30, "value": 2 },
				{ "source": 1, "target": 31, "value": 2 },
				{ "source": 1, "target": 34, "value": 2 },
				{ "source": 1, "target": 35, "value": 2 },

				{ "source": 2, "target": 6, "value": 3 },
				{ "source": 2, "target": 13, "value": 3 },
				{ "source": 2, "target": 27, "value": 3 },
				{ "source": 2, "target": 26, "value": 3 },
				{ "source": 2, "target": 28, "value": 3 },
				{ "source": 2, "target": 29, "value": 3 },
				{ "source": 2, "target": 32, "value": 3 },
				{ "source": 2, "target": 38, "value": 3 },
				{ "source": 2, "target": 39, "value": 3 },
				{ "source": 2, "target": 40, "value": 3 },
				{ "source": 2, "target": 41, "value": 3 },

				{ "source": 3, "target": 17, "value": 4 },
				{ "source": 3, "target": 18, "value": 4 },
				{ "source": 3, "target": 36, "value": 4 },
				{ "source": 3, "target": 14, "value": 4 },
				{ "source": 3, "target": 16, "value": 4 },
				{ "source": 3, "target": 15, "value": 4 },

				{ "source": 4, "target": 42, "value": 5 },
				{ "source": 4, "target": 43, "value": 5 },
				{ "source": 4, "target": 33, "value": 5 },
				{ "source": 4, "target": 37, "value": 5 },
				{ "source": 4, "target": 12, "value": 5 },

				{ "source": 0, "target": 1, "value": 6 },
				{ "source": 1, "target": 2, "value": 6 },
				{ "source": 2, "target": 3, "value": 6 },
				{ "source": 3, "target": 4, "value": 6 },
				{ "source": 4, "target": 0, "value": 6 }
				
				// ,
				// { "source": 8, "target": 9, "value": 2 }
			],
 			"category": [{			 
    			"label": "Data", 
    			"subCategory": [
					{ "label": "Data Analyst", "value": 1 },
					{ "label": "Data scientist", "value": 2 },
					{ "label": "DBA", "value": 2 },
					{ "label": "데이터 아키텍쳐", "value": 1 },
					{ "label": "데이터 분석 전문가", "value": 1 },
					{ "label": "데이터 전문가", "value": 1 },
					{ "label": "데이터 컨설턴트", "value": 1 }
				]
			 },
  			{
    			"label": "DT", 
    			"subCategory": [
     				{ "label": "Big Data Engineer", "value": 1 },
     				{ "label": "Deep learning 전문가", "value": 1 },
    				{ "label": "DT 전문가", "value": 2 },
    			 	{ "label": "딥러닝 전문가", "value": 1 },
     				{ "label": "블록체인 전문가", "value": 1 },
     				{ "label": "빅데이터 전문가", "value": 4 },
     				{ "label": "인공지능 전문가", "value": 10 },
     				{ "label": "인공지능, 앱 전문가", "value": 1 },
     				{ "label": "클라우드 PaaS 전문가", "value": 1 },
     				{ "label": "클라우드 전문가", "value": 1 }  
				  ]
			},
  			{
    			"label": "ICT", 
    			"subCategory": [
     				{ "label": "Connectivity 전문가", "value": 1 },
     				{ "label": "ICT 기술 전문가", "value": 1 },
     				{ "label": "아키텍터", "value": 1 },
     				{ "label": "앱 개발자", "value": 1 },
     				{ "label": "어플리케이션 전문가", "value": 3 },
     				{ "label": "웹 개발자", "value": 1 },
     				{ "label": "인프라 전문가", "value": 2 },
     				{ "label": "풀스택 Developer/PL/PM", "value": 3 },
     				{ "label": "풀스택개발자", "value": 1 },
     				{ "label": "플랫폼 개발 전문가", "value": 1 },
     				{ "label": "플랫폼 전문가", "value": 1 }  
				  ]
			},
  			{
    			"label": "ITS", 
    			"subCategory": [
     				{ "label": "글로벌 IT 컨설턴트", "value": 1 },
     				{ "label": "금융산업의 DT 전문가", "value": 1 },
     				{ "label": "통신 전문가", "value": 1 },
     				{ "label": "Smart Factory 전문가", "value": 1 },
     				{ "label": "공정 자동화", "value": 1 },
     				{ "label": "Solution 개발자", "value": 1 }  
				  ]
			},
 			{
   				"label": "기타", 
    			"subCategory": [
     				{ "label": "SK㈜C&C 임원", "value": 1 },
     				{ "label": "SK㈜C&C 전무", "value": 1 },
     				{ "label": "좋은 아빠", "value": 1 },
     				{ "label": "평생개발", "value": 1 },
     				{ "label": "HR 팀장", "value": 1 }  
				  ]
			}]
		}	
		// var careerData = {
		// 	"nodes": [
		// 		{ "name": "빅데이터", "group": 1, "value": 17 },
		// 		{ "name": "처리", "group": 2, "value": 2 },
		// 		{ "name": "분석", "group": 2, "value": 5 },
		// 		{ "name": "데이터", "group": 2, "value": 10},
		// 		{ "name": "AI", "group": 3, "value":22 },
		// 		{ "name": "IoT", "group": 3, "value": 20 },
		// 		{ "name": "엔지니어", "group": 2, "value": 3 },
		// 		{ "name": "제조", "group": 4, "value": 5 },
		// 		{ "name": "인프라", "group": 4, "value": 9 },
		// 		{ "name": "IoT 전문가", "group": 4, "value": 3 },
		// 		{ "name": "ML", "group": 3, "value": 22 }

		// 	],
		// 	"links": [
		// 		{ "source": 0, "target": 1, "value": 1 },
		// 		{ "source": 0, "target": 2, "value": 1 },
		// 		{ "source": 0, "target": 3, "value": 1 },
		// 		{ "source": 0, "target": 6, "value": 1 },
		// 		{ "source": 4, "target": 5, "value": 2 },
		// 		{ "source": 4, "target": 0, "value": 3 },
		// 		{ "source": 5, "target": 0, "value": 3 },
		// 		{ "source": 5, "target": 7, "value": 4 },
		// 		{ "source": 5, "target": 8, "value": 4 },
		// 		{ "source": 5, "target": 9, "value": 4 },
		// 		{ "source": 4, "target": 10, "value": 2 }
		// 		// ,
		// 		// { "source": 8, "target": 9, "value": 2 }
			

		// 	],
 		// 	"category": [{
		// 		"label": "빅데이터", 
		// 		"subCategory": [{
		// 						 "label": "데이터",
		// 						 "value": 12
		// 						}, 
		// 						{
		// 						 "label": "엔지니어",
		// 						 "value": 3
		// 						}, 
		// 						{
		// 						 "label": "처리",
		// 						 "value": 20
		// 						}, 
		// 						{
		// 						 "label": "분석",
		// 						 "value": 8
		// 						}]
		// 	},
		// 	{
		// 		"label": "AI", 
		// 		"subCategory": [{
		// 						 "label": "ML",
		// 						 "value": 22
		// 						}]
		// 	},
  		// 	{
    	// 		"label": "인공지능", 
    	// 		"subCategory": [{
		// 						 "label": "IoT 전문가",
		// 						 "value": 32
		// 						}, 
		// 						{
		// 						 "label": "제조",
		// 						 "value": 40
		// 						}, 
		// 						{
		// 						 "label": "인프라",
		// 						 "value": 40
		// 						}]
		// 	}]
		// }

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
			var html = '<button type="button" class="btn btn-secondary" id=category_' + i  +'>';
			html += categoryFirst[i];
			html += '</button>';
			$('#careerCategoryFirst').append(html);
			// $('#careerCategoryFirst').append('<div id=category_' + i + '>' +  + '<span></span></div>');
		}

		// var colorNode = d3.scale.category20(),
		var colorNode = function(i) { var color = ['#1f77b4', '#c33e69', '#ff7f0e', '#8e44bd', '#2ca02c', '#8c564a', '#e376c2', '#bcbe23', '#18bed0', '#393b78', '#ad494a', '#d6616a', '#31a353', '#7b4173', '#a55094', '#3365cc', '#0199c6', '#dd4476', '#66aa01', '#b82f2f']; return color[i%20];}
			colorLink = d3.scale.category10();
		for(var j = 0; j<categoryFirst.length; j++) {
			var index_categorySecond = findSecondCategory(categoryFirst[j]);
			// $('#careerCategorySecond').append('<div id=category_' + i + '>' + index_categorySecond + '</div>');
			// console.log(index_categorySecond);
			var sum = 0;
			for(i in index_categorySecond) {
				// console.log(index_categorySecond[i].label);
				// console.log(index_categorySecond[i].label);
				// console.log(careerData.nodes);
				var styleGroup;
				$.each(careerData.nodes, function(index, value){
					// console.log(value.name);
					if(value.name === index_categorySecond[i].label) styleGroup = value.group;//console.log(index_categorySecond[i].label);
				})

				// console.log(styleGroup);
				// if(careerData.nodes.name == index_categorySecond[i].label) console.log(index_categorySecond[i].label);
				var html = '<div class=subcategory_' + j + '><span style="color:' + colorNode(styleGroup) + '">';  
				html += index_categorySecond[i].label + ' </span>' + '<span style="float:right;font-size:20px;color:#aaa;">(' + index_categorySecond[i].value + ')</span>' + '</div>';
				$('#careerCategorySecond').append(html);
				sum += index_categorySecond[i].value;
			}
			categoryFirstValue.push(sum);
		}

		for(i in categoryFirstValue) {
			var html = '<span class="badge badge-light">';
			html += categoryFirstValue[i];
			html += '</span>';
			$('#category_' + i).append(html);
		}
		// console.log('대분류 합:' + categoryFirstValue);

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
			
		var rScale = d3.scale.linear().domain([0, 100]).range([10, 100]);

        var force = d3.layout.force()
							.charge(-950)
							.linkDistance(80)
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
										'font-size': '15px'})
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

	makeAreaDetailRight: function() { //areaDetailChartRight
		var width = 320,
			height = 300,
			initialScale = 5500,
			initialX = -11900,
			initialY = 4030,
			centered,
			labels;

		var projection = d3.geo.mercator()
								.scale(initialScale/2)
								.translate([initialX/2, initialY/2]);

		var path = d3.geo.path()
						 .projection(projection);

		var svg = d3.select("#areaDetailChartRight")
						.append("svg")
    					.attr("width", width)
   						.attr("height", height)
    					.attr('id', 'areaDetailChartMap');

		var states = svg.append("g")
    					.attr("id", "areaDetailChartRightStates");
    					// .call(zoom);

		states.append("rect")
    			.attr("class", "areaDetailChartBackground")
    			.attr("width", width)
    			.attr("height", height);

		d3.json("korea.json", function(json) {
  			states.selectAll("path")
      				.data(json.features)
					.enter()
					.append("path")
      					.attr("d", path)
      					.attr("id", function(d) { return 'areaDetailChartRightPath-'+d.id; })
      					.attr("class", function(d) { return d.properties.Name });
      				//.on("click", click);

  			labels = states.selectAll("text")
    						.data(json.features)
    						.enter().append("text")
      						.attr("transform", labelsTransform)
      						.attr("id", function(d) { return 'areaDetailChartRightLabel-'+d.id; })
    						.attr('text-anchor', 'middle')
      						.attr("dy", ".35em")
     						//.on("click", click)
      						.text(function(d) { return d.properties.Name; });
		});

		function click(d) {
			var x, y, k;
			if (d && centered !== d) {
				var centroid = path.centroid(d);
				x = centroid[0];
				y = centroid[1];
				k = 4;
				centered = d;
			} else {
				x = width / 2;
				y = height / 2;
				k = 1;
				centered = null;
			}

			states.selectAll("path")
					.classed("active", centered && function(d) { return d === centered; });

			states.transition()
					.duration(1000)
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
					.style("stroke-width", 1.5 / k + "px");
		}

		function zoom() {
			projection.translate(d3.event.translate).scale(d3.event.scale);
			states.selectAll("path").attr("d", path);
	
			labels.attr("transform", labelsTransform);  
		}

		function labelsTransform(d) {
		// 경기도가 서울특별시와 겹쳐서 예외 처리
			if (d.id == 8) {
				var arr = path.centroid(d);
				arr[1] += (d3.event && d3.event.scale) ? (d3.event.scale / height + 10) : (initialScale / height + 0);
				return "translate(" + arr + ")";
			} else if (d.id == 12) {
				var arr = path.centroid(d);
				arr[1] += (d3.event && d3.event.scale) ? (d3.event.scale / height + 15) : (initialScale / height - 35);
				return "translate(" + arr + ")";
			} else {
				return "translate(" + path.centroid(d) + ")";
			}
		}
	}
};