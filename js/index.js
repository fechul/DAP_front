INDEX = {
	init: function() {
		this.analystType = ['gender', 'age', 'area', 'grade', 'major', 'ability', 'character', 'career'];
		this.currentTypeIdx = null;
		this.direction = 0;
		this.detailBox = $('#detailModal');

		this.initEvents();
		this.makeGender('#genderChart', 220, 220, 100);
		this.makeAge();
		this.makeMajor();
		this.makeCharacter();

		this.makeGenderDetail();
		this.makeAgeDetail();
		this.makeMajorDetail();
		this.makeCharacterDetail();
	},

	initEvents: function() {
		var self = this;

		$('.contentBox .fullscreen').click(function() {
			var type = $(this).parent('.contentBox').attr('type');
			self.setModalContent(type);
		});

		$('.moveType').click(function() {
			// left: 1, right: 2
			var direction = $(this).hasClass('left') ? 1 : 2;
			self.direction = direction;

			// self.detailBox.modal('hide');

			var type = '';

			if(self.direction == 1) {
				if(self.currentTypeIdx == 0)
					type = self.analystType[self.analystType.length-1];
				else
					type = self.analystType[self.currentTypeIdx - 1];
			} else {
				if(self.currentTypeIdx == self.analystType.length-1)
					type = self.analystType[0];
				else
					type = self.analystType[self.currentTypeIdx+1];
			}

			self.setModalContent(type);
		});

		$('#detailModal .close').click(function() {
			self.direction = 0;
			self.detailBox.modal('hide');
		});

		self.detailBox.on('show.bs.modal', function(e) {
			$('.modal-dialog').attr('class', 'modal-dialog  ' + (self.direction==0 ? 'fadeIn' : (self.direction==1 ? 'fadeInLeft' : 'fadeInRight')) + '  animated');
		});

		// self.detailBox.on('shown.bs.modal', function(e) {
		// 	$('.modal-dialog').removeClass('fadeInLeft').removeClass('fadeInRight').removeClass('animated');
		// });

		self.detailBox.on('hide.bs.modal', function(e) {
			$('.modal-dialog').attr('class', 'modal-dialog  ' + (self.direction==0 ? 'fadeOut' : (self.direction==1 ? 'fadeOutRight' : 'fadeOutLeft')) + '  animated');
		});

		// self.detailBox.on('hidden.bs.modal', function(e) {
		// 	$('.modal-dialog').removeClass('animated');
		// });

		$(document).on('keydown', function(e) {
			if(e.keyCode == 37) {	// LEFT
				$('.moveType.left').click();
			} else if(e.keyCode == 39) {	// RIGHT
				$('.moveType.right').click();
			}
		});
	},

	// Modal Resize
	// modalResize: function() {
	// 	var windowHeight = $(window).height();
	// 	var modalHeight = windowHeight*0.9;
	// 	$('#detailModal .modal-content').css('height', modalHeight);
	// },

	// GENDER
	makeGender: function(target, h, w, r, attrID) {
		// // BackEnd에서 이 형식으로 Data를 받아야함
		var genderData = [{
			"label": "남자",
			"value": 37,
			"color": "#1882dc"
		}, {
			"label": "여자",
			"value": 22,
			"color": "#dc183c"
		}];

	    // var vis = d3.select("#genderChart")
	    //     		.data([genderData])
	    //         	.attr("width", w)
	    //         	.attr("height", h)
	    //         	.append("svg:g")           
	    //         	.attr("transform", "translate(" + r + "," + r + ")");
	    // var arc = d3.svg.arc().outerRadius(r);
	    // var pie = d3.layout.pie().value(function(d) { return d.value; });
	    // var arcs = vis.selectAll("g.slice")
	    //     		  .data(pie)
	    //     		  .enter()                       
	    //         	  .append("svg:g")
	    //         	  .attr("id","genderpie") 
	    //               .attr("class", "slice");
	    //     arcs.append("svg:path")
	    //             .attr("fill", function(d, i) {return d.data.color; } )
	    //             .attr("d", arc)
	    //             .attr('stroke', 'black')
					// .attr('stroke-width', '3');                                   
	    //     arcs.append("svg:text").attr("transform", function(d) {                   
     //            d.innerRadius = 0;
     //            d.outerRadius = r;
     //            return "translate(" + arc.centroid(d) + ")";       
     //        }).attr("text-anchor", "middle")                         
	    //       .text(function(d, i) { return genderData[i].label; });

		// BackEnd에서 이 형식으로 Data를 받아야함
		var genderData = [{
			"label": "남자",
			"value": 37,
			"color": "#1882dc"
		}, {
			"label": "여자",
			"value": 22,
			"color": "#dc183c"
		}];

		var svg = d3.select(target).attr("width", w).attr("height", h);
		svg.append("g").attr("id", "genderpie").attr("stroke", "black").attr("stroke-width", "3");

		gradPie.draw("genderpie", [{"label": "남자", "value":50, "color":"#1882dc"},{"label": "여자", "value":50, "color":"#dc183c"}], 100, 100, r);
		gradPie.transition("genderpie", genderData, 100);
	},

	//AGE
	makeAge: function() {
		var ageData = [{
			"label": "23",
			"value": 2
		},{
			"label": "24",
			"value": 4
		},{
			"label": "25",
			"value": 9
		},{
			"label": "26",
			"value": 8
		},{
			"label": "27",
			"value": 17
		},{
			"label": "28",
			"value": 13
		},{
			"label": "29",
			"value": 3
		},{
			"label": "30",
			"value": 2
		},{
			"label": "31",
			"value": 1
		}];

		var width = 300,		// 차트 너비
			height = 200,		// 차트 높이
			padding = 5,		// 바 사이 간격
			division = 0.10,	// 바 높이를 알맞게 표현하기 위해 나눠주는 적당한 수
			duration = 10;		// 바 생성할 때 transition delay 값

		var svg = window.svg = d3.select('#ageChart').attr('width', width).attr('height', height);
							
		// 바 만들기
		svg.selectAll('rect')
			.data(ageData)
			.enter()
			.append('rect')
			.transition()
			.delay(function (d, i) {
				return i / ageData.length * 1000;
			})
			.attr('x', function (d, i) {
				return i * ((width + padding) / ageData.length);
			})
			.attr('y', function (d) {
				return height - parseInt(d.value / division, 10);
			})
			.attr('width', width / ageData.length - padding)
			.attr('height', function (d) {
				return parseInt(d.value / division, 10);
			})
			.attr('fill', function (d) {
				return 'rgb( ' + parseInt(d.value / division, 10) + ',0,0)';
			})
			.attr('stroke', 'black')
			.attr('stroke-width', '3');
				
		// 바 위에 수치 표시
		svg.selectAll('g')
			.data(ageData)
			.enter()
			.append('text')
			.transition()
			.delay(duration * 1.2)
			.attr('x', function (d, i) {
				return i * ((width + padding) / ageData.length) + (width / ageData.length - padding) / 2;
			})
			.attr('y', function (d) {
				return height - parseInt(d.value /division, 10) - 5;
			})
			.attr('fill', 'blue')
			.attr('text-anchor', 'middle');
				
		// 바 아래에 라벨 표시
		svg.selectAll('g')
			.data(ageData)
			.enter()
			.append('text')
			.transition()
			.delay(duration * 1.2)
			.text(function (d) {
				return d.label;
			})
			.attr('x', function (d, i) {
				return i * ((width + padding) / ageData.length) + (width / ageData.length - padding) / 2;
			})
			.attr('y', function (d) {
				return height;
			})
			.attr('fill', '#fff')
			.attr('text-anchor', 'middle');
	},

	makeMajor: function() {
		//BackEnd 에서 받을 데이터
		/*
			[{
				'major': 컴퓨터과학
				'cnt': 13	
			},{
				'major': 소프트웨어학과
				'cnt': 11
			},{
				'major': 경영학과
				'cnt': 7
			}]
		*/

		majorInfo = [{'name': '컴퓨터과학','size': 13},
		{'name': '소프트웨어학과','size': 11},
		{'name': '경영학과','size': 7},
		{'name': 'IT공학과','size': 19},
		{'name': '경제학과','size': 3},
		{'name': '전기전자컴퓨터공학부','size': 5},
		{'name': '국어국문학과','size': 2},
		{'name': '산업공학과','size': 8}];


		var majorData = {
			"name":"major",
			"children": [{
				"name":"이과",
				"children":[]
				}, {
				"name":"문과",
				"children":[]
				}]
		};

		var maj1 = ['국어국문학과', '중어중문학과', '영어영문학과', '독어독문학과', '사학과', '철학과', '정치외교학과', '행정학과', '사회학과', '관광학부', '법학과', '동양학과', '서양학과', '산업디자인학과', '산업디자인', '공예학과', '조소과', '성악과', '작곡과', '피아노학과', '관현악과', '국악과', '경영학과', '경제금융학과', '정책학과', '정치학과', '경제학과'];
		var maj2 = ['수학과', '화학과', '물리학과', '생명과학과', '생명공학과', '생명과학부', '생명공학부', '의류학과', '사회복지학과', '스포츠레저학과', '생활문화학과', '식품영양학과', '디자인학과', '건충공학부', '건축공학과', '건설공학부', '건설공학과', '도시공학부', '도시공학과', '컴퓨터공학부', '컴퓨터공학', '컴퓨터공학과', '컴퓨터과학부', '컴퓨터과학', '컴퓨터과학과', '화학공학과', '화학공학부', '생명공학과', '생명공학부', '기계공학과', '기계공학부', '응용시스템공학부', '응용시스템공학과', '미래자동차공학과', '융합전자공학과', '융합전자공학부', 'IT공학', '소프트웨어학과', '소프트웨어응용학과', '전기전자컴퓨터공학부', '전기전자컴퓨터공학과'];

		for(var i = 0; i < majorInfo.length; i++) {
			var target = majorInfo[i];
			if(maj1.indexOf(target.name) > -1) {
				majorData.children[0].children.push(target);
			} else {
				majorData.children[1].children.push(target);
			}
		}

		var tree = majorData;

		var width = 400,
		    height = 220,
		    color = d3.scale.category20c(),
		    div = d3.select("#majorTree").append("div")
		       .style("position", "relative")
		       .style("margin-left", "25px");

		var treemap = d3.layout.treemap()
		    .size([width, height])
		    .sticky(true)
		    .value(function(d) { return d.size; });
		 
		var node = div.datum(tree).selectAll(".node")
		      .data(treemap.nodes)
		      .enter().append("div")
		      .attr("class", "node")
		      .call(position)
		      .style("background-color", function(d) {
		          return d.name == 'tree' ? '#fff' : color(d.name); })
		      .append('div')
		      .style("font-size", function(d) {
		          return Math.min(20, 0.18*Math.sqrt(d.area))+'px'; })
		      .text(function(d) { return d.children ? null : d.name; });
		 
		function position() {
		  this.style("left", function(d) { return d.x + "px"; })
		      .style("top", function(d) { return d.y + "px"; })
		      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
		      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
		}
	},

	makeCharacter: function() {
		var words = [{"cnt": '12',"text": '패기'}, 
		    {"cnt": '4',"text": '열정'},
		    {"cnt": '6',"text": '친화력'}, 
		    {"cnt": '1',"text": '짜증'}, 
		    {"cnt": '5',"text": '밝음'}, 
		    {"cnt": '2',"text": '조용함'}, 
		    {"cnt": '4',"text": '모험'},
		    {"cnt": '17',"text": 'SUPEX'},
		    {"cnt": '3',"text": '강인함'},
		    {"cnt": '4',"text": '노력'},
		    {"cnt": '7',"text": '부지런'},
		    {"cnt": '9',"text": '끈기'}];

		var wordCloud = function(selector) {

			var fill = d3.scale.category20();

			//Construct the word cloud's SVG element
			var svg = d3.select("#characterWordCloud")
				.attr("width", 320)
				.attr("height", 220)
				.append("g")
				.attr("transform", "translate(150,120)");


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
					d3.layout.cloud().size([320, 220])
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

		//Prepare one of the sample sentences by removing punctuation,
		// creating an array of words and computing a random size attribute.
		function getWords(i) {
			var wordsCnt = words.length;
			var totalWordsCnt = 0;
			for(var j = 0; j < words.length; j++) {
				totalWordsCnt += parseInt(words[j].cnt, 10);
			}

			for(var j = 0; j < words.length; j++) {
				words[j].size = 10 + (words[j].cnt/totalWordsCnt)*60*3.5;
			}

			return words;
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

    //     var data = [{"category": '1',"password": '패기'}, 
    //     {"category": '2',"password": '열정'},
    //     {"category": '3',"password": '친화력'}, 
    //     {"category": '4',"password": '짜증'}, 
    //     {"category": '5',"password": '밝음'}, 
    //     {"category": '6',"password": '조용함'}, 
    //     {"category": '7',"password": '모험'}, 
    //     {"category": '8',"password": '열정'}, 
    //     {"category": '9',"password": '패기'}, 
    //     {"category": '10',"password": '패기'},
    //     {"category": '11',"password": 'SUPEX'},
    //     {"category": '12',"password": '패기'},
    //     {"category": '13',"password": 'SUPEX'},
    //     {"category": '14',"password": '밝음'},
    //     {"category": '15',"password": '열정'}];

    //     var margin = {top: 20, right: 20, bottom: 40, left: 20},
		  //   width = 300 - margin.left - margin.right,
		  //   height = 250 - margin.top - margin.bottom;

		  // var categories = d3.keys(d3.nest().key(function(d) { 
		  // 	return d.category; }).map(data));
		  // var color = d3.scale.ordinal().range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"]);
		  // var fontSize = d3.scale.pow().exponent(5).domain([0,1]).range([10,80]);

		  // var layout = d3.layout.cloud()
		  //     .timeInterval(10)
		  //     .size([width, height])
		  //     .words(data)
		  //     .rotate(function(d) { return 0; })
		  //     .font('monospace')
		  //     .fontSize(function(d,i) {return fontSize(Math.random()); })
		  //     .text(function(d) {return d.password; })
		  //     .spiral("archimedean")
		  //     .on("end", draw)
		  //     .start();

		  // var svg = d3.select('#characterWordCloud')
		  //     .attr("width", width + margin.left + margin.right)
		  //     .attr("height", height + margin.top + margin.bottom)
		  //     .append("g")
		  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		  // var wordcloud = svg.append("g")
		  //     .attr('class','wordcloud')
		  //     .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

		  // var x0 = d3.scale.ordinal()
		  //     .rangeRoundBands([0, width], .1)
		  //     .domain(categories);

		  // var xAxis = d3.svg.axis()
		  //     .scale(x0)
		  //     .orient("bottom");

		  // svg.append("g")
		  //     .attr("class", "x axis")
		  //     .attr("transform", "translate(0," + height + ")")
		  //     .call(xAxis)
		  //   .selectAll('text')
		  //     .style('font-size','20px')
		  //     .style('fill',function(d) { return color(d); })
		  //     .style('font','sans-serif');

		  // function draw(words) {
		  //   wordcloud.selectAll("text")
		  //       .data(words)
		  //       .enter().append("text")
		  //       .attr('class','word')
		  //       .transition()
    //             .duration(600)
		  //       .style("font-size", function(d) { return (d.size+10) + "px"; })
		  //       .style("font-family", function(d) { return d.font; })
		  //       .style("fill", function(d) { 
		  //       	d.rotate = Math.floor(Math.random() * 60);
		  //           var paringObject = data.filter(function(obj) { return obj.password === d.text});
		  //           return color(paringObject[0].category); 
		  //       })
		  //       .attr("text-anchor", "middle")
		  //       .attr("transform", function(d) {return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
		  //       .text(function(d) { return d.text; });
		  // };
	},

	setModalContent: function(type) {
		var self = this;

		$('#detailModalTitle').text(type.toUpperCase());
		$('.detailContainer').hide();
		switch(type) {
			case 'gender':
				$('.genderDetailContainer').show();
				break;
			case 'age':
				$('.ageDetailContainer').show();
				break;
			case 'major':
				$('.majorDetailContainer').show();
				break;
			case 'area':
				$('.areaDetailContainer').show();
				break;
			case 'grade':
				$('.gradeDetailContainer').show();
				break;
			case 'ability':
				$('.abilityDetailContainer').show();
				break;
			case 'character':
				$('.characterDetailContainer').show();
				break;
			case 'career':
				$('.careerDetailContainer').show();
				break;
		}
		// this.modalResize();
		self.currentTypeIdx = self.analystType.indexOf(type);

		self.detailBox.modal('hide');
		self.detailBox.modal('show');
		self.direction = 0;
	},

	makeGenderDetail: function() {
		// Left
		var genderData = [{
			"label": "남자",
			"value": 37,
			"color": "#1882dc"
		}, {
			"label": "여자",
			"value": 22,
			"color": "#dc183c"
		}];

		if(genderData[0].value == genderData[1].value) {
			$('#genderDetailCntMan').css('font-size', '60px');
			$('#genderDetailCntWoman').css('font-size', '60px');
		} else {
			if(genderData[0].label == '남자') {
				// $('#genderDetailCntMan').text(genderData[0].value + ' (' + );
				$('#genderDetailCntWoman').text(genderData[1].value);
				$('#genderManRectText').text(genderData[0].label);
				$('#genderDetailCntWomanText').text(genderData[1].label);
				if(genderData[0].value > genderData[1].value) {
					$('#genderDetailCntMan').css('font-size', '72px');
					$('#genderDetailCntWoman').css('font-size', '48px');
				} else {
					$('#genderDetailCntMan').css('font-size', '48px');
					$('#genderDetailCntWoman').css('font-size', '72px');
				}
			} else {
				$('#genderDetailCntMan').text(genderData[1].value);
				$('#genderDetailCntWoman').text(genderData[0].value);
				$('#genderManRectText').text(genderData[1].label);
				$('#genderDetailCntWomanText').text(genderData[0].label);
				if(genderData[0].value > genderData[1].value) {
					$('#genderDetailCntMan').css('font-size', '48px');
					$('#genderDetailCntWoman').css('font-size', '72px');
				} else {
					$('#genderDetailCntMan').css('font-size', '72px');
					$('#genderDetailCntWoman').css('font-size', '48px');
				}
			}
		}

        var width = 500;
        var height = 500;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 150;
        var legendRectSize = 18;
        var legendSpacing = 4;

        var color = d3.scale.category20b();

        var svg = d3.select('#genderDetailChart')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) + 
            ',' + (height / 2) + ')');

        var arc = d3.svg.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);

        var pie = d3.layout.pie()
          .value(function(d) { return d.value; })
          .sort(null);

        var tooltip = d3.select('#genderDetailChart')                              
          .append('div')                                               
          .attr('class', 'tooltip');                                   
                      
        tooltip.append('div')                                          
          .attr('class', 'label');                                     
             
        tooltip.append('div')                                          
          .attr('class', 'count');                                     

        tooltip.append('div')                                          
          .attr('class', 'percent');                                   

	      genderData.forEach(function(d) {
		      d.value = +d.value;

	      var path = svg.selectAll('path')
	        .data(pie(genderData))
	        .enter()
	        .append('path')
	        .attr('d', arc)
	        .attr('fill', function(d, i) { 
	          // return color(d.data.label);
	          return d.data.color;
	        });

	      path.on('mouseover', function(d) {
	        var total = d3.sum(genderData.map(function(d) {            
	          return d.value;
	        }));                                          

	        var percent = Math.round(1000 * d.data.value / total) / 10;
	        tooltip.select('.label').html(d.data.label);               
	        tooltip.select('.count').html(d.data.value);               
	        tooltip.select('.percent').html(percent + '%');
	        tooltip.style('display', 'block');                  
	      });                                                          
	      
	      path.on('mouseout', function() {                             
	        tooltip.style('display', 'none');                          
	      });                                                          
	    });
	},

	makeAgeDetail: function() {
		var h = 500;
		var w = 500;

		var ageData = [{
			"label": "23",
			"value": 2
		},{
			"label": "24",
			"value": 4
		},{
			"label": "25",
			"value": 9
		},{
			"label": "26",
			"value": 8
		},{
			"label": "27",
			"value": 17
		},{
			"label": "28",
			"value": 13
		},{
			"label": "29",
			"value": 3
		},{
			"label": "30",
			"value": 2
		},{
			"label": "31",
			"value": 1
		}];

		var maxAge = 0;
		var minAge = 100;
		var sumAge = 0;
		var pNum = 0;
		var avgAge = 0;

		for(var i = 0; i < ageData.length; i++) {
			var ageVal = parseInt(ageData[i].label);
			if(ageVal > maxAge) {
				maxAge = ageData[i].label;
			}

			if(ageVal < minAge) {
				minAge = ageData[i].label;
			}

			sumAge += ageVal*ageData[i].value;
			pNum += ageData[i].value;
		}

		avgAge = (sumAge/pNum).toFixed(1);

		$('#ageAverage').text(avgAge);
		$('#ageOldest').text(maxAge);
		$('#ageYoung').text(minAge);

		var margin = {top: 20, right: 20, bottom: 70, left: 40},
		    width = w - margin.left - margin.right,
		    height = h - margin.top - margin.bottom;

		var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(10);

		var svg = d3.select("#ageDetailChart")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		 	.append("g")
		    .attr("transform", 
		          "translate(" + margin.left + "," + margin.top + ")");

		// d3.csv("bar-data.csv", function(error, data) {

		    ageData.forEach(function(d) {
		        d.label = d.label;
		        d.value = +d.value;
		    });
			
		  x.domain(ageData.map(function(d) { return d.label; }));
		  y.domain([0, d3.max(ageData, function(d) { return d.value; })]);

		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis)
		    .selectAll("text")
		      .style("text-anchor", "end")
		      .attr("dx", "-.8em")
		      .attr("dy", "-.55em")
		      .attr("transform", "rotate(-90)" );

		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Count (명)");

		  svg.selectAll("bar")
		      .data(ageData)
		    .enter().append("rect")
		      .style("fill", "steelblue")
		      .attr("x", function(d) { return x(d.label); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d.value); })
		      .attr("height", function(d) { return height - y(d.value); });

		// });
	},

	makeMajorDetail: function() {
		var majorInfo = [{'name': 'IT공학과','size': 19},
		{'name': '컴퓨터과학','size': 13},
		{'name': '소프트웨어학과','size': 11},
		{'name': '산업공학과','size': 8},
		{'name': '경영학과','size': 7},
		{'name': '전기전자컴퓨터공학부','size': 5},
		{'name': '경제학과','size': 3},
		{'name': '국어국문학과','size': 2}];

		var color = ["#D981D5","#82CE8C","#839BE6","#C6D445","#C3B66B","D1A7CC","#70D3C5","#DD9692"];

		var totalSize = 0;
		for(var i = 0; i < majorInfo.length; i++) {
			// majorInfo[i].color = color[i%color.length];
			
			totalSize += majorInfo[i].size;
		}

		var majorData = {
			"name":"major",
			"children": [{
				"name":"이과",
				"children":[{
					"name": "공학계열",
					"children": []
				},{
					"name": "자연계열",
					"children": []
				},{
					"name": "의약계열",
					"children": []
				}]
			}, {
				"name":"문과",
				"children":[{
					"name": "인문계열",
					"children": []
				},{
					"name": "사회계열",
					"children": []
				},{
					"name": "교육계열",
					"children": []
				}]
			}, {
				"name": "예체능계열",
				"children": []
			}, {
				"name": "기타",
				"children": []
			}]
		};

		// var maj1 = ['국어국문학과', '중어중문학과', '영어영문학과', '독어독문학과', '사학과', '철학과', '정치외교학과', '행정학과', '사회학과', '관광학부', '법학과', '동양학과', '서양학과', '산업디자인학과', '산업디자인', '공예학과', '조소과', '성악과', '작곡과', '피아노학과', '관현악과', '국악과', '경영학과', '경제금융학과', '정책학과', '정치학과', '경제학과'];
		// var maj2 = ['수학과', '화학과', '물리학과', '생명과학과', '생명공학과', '생명과학부', '생명공학부', '의류학과', '사회복지학과', '스포츠레저학과', '생활문화학과', '식품영양학과', '디자인학과', '건충공학부', '건축공학과', '건설공학부', '건설공학과', '도시공학부', '도시공학과', '컴퓨터공학부', '컴퓨터공학', '컴퓨터공학과', '컴퓨터과학부', '컴퓨터과학', '컴퓨터과학과', '화학공학과', '화학공학부', '생명공학과', '생명공학부', '기계공학과', '기계공학부', '응용시스템공학부', '응용시스템공학과', '미래자동차공학과', '융합전자공학과', '융합전자공학부', 'IT공학', '소프트웨어학과', '소프트웨어응용학과', '전기전자컴퓨터공학부', '전기전자컴퓨터공학과'];

		// 공학계열
		var maj1 = ['건축공학과','건축학과','게임공학과','고분자공학과','공업화학과','공업화학학과','광학공학과','교양공학부','교통공학과','국방기술학과','금속공학과','기계공학과','기계설계공학과','냉동공조공학과','디지털콘텐츠학과','멀티미디어학과','메카트로닉스공학과','모바일시스템공학과','물류시스템공학과','미디어학과','반도체학과','사이버국방학과','산업공학과','섬유공학과','세라믹공학과','소방방재학과','소프트웨어공학과','시스템경영공학과','시스템공학과','신소재공학과','안전공학과','에너지자원공학과','원자력공학과','응용공학과','응용소프트웨어공학과','인쇄정보공학과','인터넷정보학과','자동차공학과','재료공학과','전기공학과','전기전자공학과','전기제어공학과','전자공학과','전파공학과','정밀화학과','정보통신공학과','제어계측공학과','제어로봇학과','제지공학과','조경학과','조선공학과','컴퓨터공학과','컴퓨터과학과','토목공학과','항공우주공학과','항공운항학과','항해학과','해양공학과','해양시스템학과','화장품과학과','화학공학과','컴퓨터공함','컴퓨터과학', '소프트웨어학과', 'IT공학과', '전기전자컴퓨터공학부', '전기전자컴퓨터공학과', 'IT공학부'];
		// 자연계열
		var maj2 = ['가정학과','교양생활과학부','교양자연과학부','나노공학과','농공학과','농생물학과','대기과학과','동물자원학과','말특수동물학과','물리학과','산림자원학과','생명공학과','생명과학과','생명자원학과','생물산업기계공학과','생물학과','생화학과','수의학과','수학과','식물자원학과','식품공학과','식품영양학과','우주과학과','원예학과','유전공학과','의류학과','의상학과','임산공학과','임학과','제약공학과','조리과학과','지구물리학과','지구정보공학과','지구해양과학과','지리학과','지적학과','지질학과','천문학과','축산학과','통계학과','한방학과','해양생명과학과','해양자원학과','화학과','환경공학과','환경과학과'];
		// 의약계열
		var maj3 = ['간호학과','공중보건학과','물리치료학과','방사선학과','보건관리학과','약학부','예술치료학과','응급구조학과','의료정보공학과','의예과','의용공학과','임상병리학과','작업치료학과','재활학과','치기공학과','치위생학과','치의예과','한약학과','한의예과','환경보건학과'];
		// 인문계열
		var maj4 = ['고고학과','교양인문학부','국어국문학과','기독교학과','독어독문학과','독일학과','러시아어문학과','러시아학과','문예창작학과','문헌정보학과', '문화재보존학과','문화콘텐츠학과','미국학과','민속학과','북한학과','불교학과','불어불문학과','사학과','선교학과','스토리텔링학과','스페인어학과','신학과','심리학과','아랍어학과','아시아어학과','아프리카어학과','언어과학과','영어영문학과','영어학과','외국어학부','유럽학과','윤리학과','이탈리아어학과','인도어학과','인류학과','인문학부','일본학과','일어일문학과','자율전공학부','종교학과','중국학과','중어중문학과','지역학과','철학과','태국어학과','터키어학과','통번역학과','포르투갈어학과','폴란드어학과','프랑스학과','한국어학과','한문학과','헝가리어학과'];
		// 사회계열
		var maj5 = ['e-비즈니스학과','경영정보학과','경영학과','경제학과','경찰행정학과','관광경영학과','광고홍보학과','교양경상학부','교양사회과학부','국제경영 및 통상학과','국제관계학과','국제문화정보학과','국제법무학과','국제학과','군사학과','금융보험학과','노인복지학과','농업경제학과','도시계획학과','도시공학과','무역학과','법학과','벤처창업학과','병원관리학과','보건행정학과','부동산학과','비서행정학과','사회복지학과','사회학과','산업경영학과','세무학과','세무회계학과','스포츠마케팅학과','신문방송학과','아동복지학과','아동학과','언론홍보학과','외식산업학과','유통학과','전자상거래학과','정보보호학과','정치외교학과','증권금융과','지역개발학과','청소년지도학과','항공서비스학과','해양경찰학과','행정학과','호텔경영학과','회계학과'];
		// 교육계열
		var maj6 = ['가정교육과','과학교육과','교육공학과','교육심리학과','교육학과','국어교육과','기술교육과','농업교육과','독일어교육과','물리교육과','미술교육과','불어교육과','사회교육학과','생물교육과','수학교육과','수해양산업교육과','언어치료학과','역사교육과','영어교육과','유아교육학과','윤리교육과','음악교육과','일반사회교육과','일어교육과','전기공학교육과','종교교육과','지구과학교육과','지리교육과','체육교육과','초등교육과','컴퓨터교육과','특수교육학과','한문교육과','화학교육과','환경교육과'];
		//예체능계열
		var maj7 = ['건강관리학과','경호학과','공업디자인학과','공예디자인학과','공예학과','관현악과','광고디자인학과','국악학과','금속공예학과','기악과','도자기공예학과','동양화과','디자인학과','디지털디자인학과','레저스포츠학과','만화애니메이션학과','목조형가구학과','무도학과','무용학과','미술학과','뷰티미용학과','사진영상학과','사회체육학과','산업디자인학과','서양화과','섬유디자인학과','성악과','스포츠의학과','스포츠지도학과','시각디자인학과','실내디자인학과','실용음악학과','연극영화학과','연극학과','영상미술학과','예술학과','음악학과','의상디자인학과','작곡과','조소학과','조형디자인학과','체육학과','커뮤니케이션디자인학과','컴퓨터디자인학과','코미디연기학과','판화과','패션디자인학과','피아노학과','한국음악과','해양스포츠학과','환경디자인학과','환경조각학과','회화학과'];

		majorInfo.sort(function (a, b) { 
			return a.size > b.size ? -1 : a.size < b.size ? 1 : 0;  
		});

		for(var i = 0; i < majorInfo.length; i++) {
			var target = majorInfo[i];
			if(maj1.indexOf(target.name) > -1) {
				majorData.children[0].children[0].children.push(target);
				target.category = '공학계열';
				target.color = color[0];
			} else if(maj2.indexOf(target.name) > -1){
				majorData.children[0].children[1].children.push(target);
				target.category = '자연계열';
				target.color = color[1];
			} else if(maj3.indexOf(target.name) > -1) {
				majorData.children[0].children[2].children.push(target);
				target.category = '의약계열';
				target.color = color[2];
			} else if(maj4.indexOf(target.name) > -1) {
				majorData.children[1].children[0].children.push(target);
				target.category = '인문계열';
				target.color = color[3];
			} else if(maj5.indexOf(target.name) > -1) {
				majorData.children[1].children[1].children.push(target);
				target.category = '사회계열';
				target.color = color[4];
			} else if(maj6.indexOf(target.name) > -1) {
				majorData.children[1].children[2].children.push(target);
				target.category = '교육계열';
				target.color = color[5];
			} else if(maj7.indexOf(target.name) > -1) {
				majorData.children[2].children.push(target);
				target.category = '예체능계열';
				target.color = color[6];
			} else {
				majorData.children[3].children.push(target);
				target.category = '기타';
				target.color = color[7];
			}
		}


		var root = majorData;

		var width = 500,
            height = 500;

        var color = d3.scale.ordinal()
            .range(["#D981D5","#82CE8C","#839BE6","#C6D445","#C3B66B","D1A7CC","#70D3C5","#DD9692"])
            
        var treemap = d3.layout.treemap()
            .size([width, height])
            .padding(.25) //I like the thin interal lines, the group seporations are set in the CSS
            .value(function (d) { return d.size; });

        var div = d3.select("#majorList").append("div")
            .attr("class","treemap")
            .style("position", "relative")
            .style("width", width + "px")
            .style("height", height + "px");

        var ledg = d3.select("body").append("div")
            .style("position", "relative")
            .style("width", width + "px")
            .style("height", 300 + "px");

        var tool = d3.select("body").append("div").attr("class", "toolTip");

        d3.select(self.frameElement).style("height", height + 300 + "px");
        d3.select(self.frameElement).style("width", width+20 + "px");

        function formatMoney(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        };

        function roundToTwo(num) {
            return +(Math.round(num + "e+2") + "e-2");
        };


        div.selectAll(".node")
            .data(treemap.nodes(root))
          .enter().append("div")
            .attr("class", "node")
            .style("left", function (d) { return d.x + "px"; })
            .style("top", function (d) { return d.y + "px"; })
            .style("width", function (d) { return Math.max(0, d.dx - 1) + "px"; })
            .style("height", function (d) { return Math.max(0, d.dy - 1) + "px"; })
            .style("background", function (d) {
            	// return d.children ? color(d.name) : null;
            	return d.color;
            })
            .text(function (d) { return d.children ? null : (d.dy < 10) ? null : (d.dx < 10) ? null : (d.name).length < (d.dx / 4) ? d.name + ' ' + roundToTwo((d.value / totalSize) * 100) + '%' : (d.dy < 25) ? null : ((d.name).length < (d.dx / 2.5)) ? d.name + ' ' + roundToTwo((d.value / totalSize) * 100) + '%' : null })
            .on("mousemove", function (d) {
                tool.style("left", d3.event.pageX + 10 + "px")
                tool.style("top", d3.event.pageY - 20 + "px")
                tool.style("display", "inline-block");
                tool.html(d.children ? null : d.name + "<br>" + ' $ ' + formatMoney(Math.round(d.size * 1000)) + ' ' + roundToTwo((d.value / totalSize) * 100) + '%');
            }).on("mouseout", function (d) {
                tool.style("display", "none");
            });

        var majorDetailText = '';
		for(var i = 0; i < 5; i++) {
			majorDetailText += "<li style='color:" + majorInfo[i].color + "'>" + majorInfo[i].name + "<span class='majorCategorySublabel'>(" + majorInfo[i].size + ")</span></li>"
		}
		$('#majorRankList').append(majorDetailText);
	},

	makeCharacterDetail: function() {
		var words = [{"cnt": '30',"text": 'SUPEX'},
			{"cnt": '22',"text": 'SK'},
			{"cnt": '21',"text": '패기'},
			{"cnt": '18',"text": 'Smart'},
			{"cnt": '15',"text": 'DT'},
			{"cnt": '12',"text": 'IT'},
			{"cnt": '11',"text": '컴퓨터'},
			{"cnt": '11',"text": '성실'},
			{"cnt": '9',"text": 'Digital'},
			{"cnt": '9',"text": '끈기'},
			{"cnt": '8',"text": 'AI'},
			{"cnt": '7',"text": '부지런'},
			{"cnt": '7',"text": '정의'},
			{"cnt": '6',"text": '친화력'}, 
			{"cnt": '6',"text": '알고리즘'},
			{"cnt": '5',"text": '밝음'}, 
			{"cnt": '5',"text": 'BigData'},
		    {"cnt": '5',"text": 'Cloud'},
		    {"cnt": '4',"text": '열정'},
		    {"cnt": '4',"text": '노력'},
		    {"cnt": '4',"text": '프로젝트'},
		    {"cnt": '4',"text": '모험'},
		    {"cnt": '3',"text": '강인함'},
		    {"cnt": '2',"text": '조용함'}];

	    var totalWordsCnt = 0;
		for(var j = 0; j < words.length; j++) {
			totalWordsCnt += parseInt(words[j].cnt, 10);
		}

		var characterDetailText = '';
		for(var i = 0; i < 5; i++) {
			characterDetailText += "<li>" + words[i].text + "<span class='characterCategorySublabel'>(" + ((words[i].cnt/totalWordsCnt)*100).toFixed(2) + "%)</span></li>"
		}
		$('#characterRankList').append(characterDetailText);


		var wordCloud = function(selector) {

			var fill = d3.scale.category20();

			//Construct the word cloud's SVG element
			var svg = d3.select("#characterWordCloudDetail")
				.attr("width", 700)
				.attr("height", 550)
				.append("g")
				.attr("transform", "translate(300,300)");


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
					d3.layout.cloud().size([700, 550])
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

		//Prepare one of the sample sentences by removing punctuation,
		// creating an array of words and computing a random size attribute.
		function getWords(i) {
			var wordsCnt = words.length;

			for(var j = 0; j < words.length; j++) {
				words[j].size = 10 + (words[j].cnt/totalWordsCnt)*60*10;
			}

			return words;
		}

		//This method tells the word cloud to redraw with a new set of words.
		//In reality the new words would probably come from a server request,
		// user input or some other source.
		function showNewWords(vis, i) {
			i = i || 0;

			vis.update(getWords(i ++ % words.length))
			setTimeout(function() {
				showNewWords(vis, i + 1)
			}, 2000)
		}

		//Create a new instance of the word cloud visualisation.
		var myWordCloud = wordCloud('body');

		//Start cycling through the demo data
		showNewWords(myWordCloud);
	}
};

