INDEX = {
	init: function() {
		this.analystType = ['gender', 'age', 'major', 'area', 'grade', 'ability', 'character', 'career'];
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

		var width = 320,
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
        var data = [{"category": '1',"password": '패기'}, 
        {"category": '2',"password": '열정'},
        {"category": '3',"password": '친화력'}, 
        {"category": '4',"password": '짜증'}, 
        {"category": '5',"password": '밝음'}, 
        {"category": '6',"password": '조용함'}, 
        {"category": '7',"password": '모험'}, 
        {"category": '8',"password": '열정'}, 
        {"category": '9',"password": '패기'}, 
        {"category": '10',"password": '패기'},
        {"category": '11',"password": 'SUPEX'},
        {"category": '12',"password": '패기'},
        {"category": '13',"password": 'SUPEX'},
        {"category": '14',"password": '밝음'},
        {"category": '15',"password": '열정'}];

        var margin = {top: 20, right: 20, bottom: 40, left: 20},
		    width = 300 - margin.left - margin.right,
		    height = 250 - margin.top - margin.bottom;

		  var categories = d3.keys(d3.nest().key(function(d) { 
		  	return d.category; }).map(data));
		  var color = d3.scale.ordinal().range(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"]);
		  var fontSize = d3.scale.pow().exponent(5).domain([0,1]).range([10,80]);

		  var layout = d3.layout.cloud()
		      .timeInterval(10)
		      .size([width, height])
		      .words(data)
		      .rotate(function(d) { return 0; })
		      .font('monospace')
		      .fontSize(function(d,i) {return fontSize(Math.random()); })
		      .text(function(d) {return d.password; })
		      .spiral("archimedean")
		      .on("end", draw)
		      .start();

		  var svg = d3.select('#characterWordCloud')
		      .attr("width", width + margin.left + margin.right)
		      .attr("height", height + margin.top + margin.bottom)
		      .append("g")
		      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		  var wordcloud = svg.append("g")
		      .attr('class','wordcloud')
		      .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

		  var x0 = d3.scale.ordinal()
		      .rangeRoundBands([0, width], .1)
		      .domain(categories);

		  var xAxis = d3.svg.axis()
		      .scale(x0)
		      .orient("bottom");

		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis)
		    .selectAll('text')
		      .style('font-size','20px')
		      .style('fill',function(d) { return color(d); })
		      .style('font','sans-serif');

		  function draw(words) {
		    wordcloud.selectAll("text")
		        .data(words)
		        .enter().append("text")
		        .attr('class','word')
		        .transition()
                .duration(600)
		        .style("font-size", function(d) { return (d.size+10) + "px"; })
		        .style("font-family", function(d) { return d.font; })
		        .style("fill", function(d) { 
		        	d.rotate = Math.floor(Math.random() * 60);
		            var paringObject = data.filter(function(obj) { return obj.password === d.text});
		            return color(paringObject[0].category); 
		        })
		        .attr("text-anchor", "middle")
		        .attr("transform", function(d) {return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
		        .text(function(d) { return d.text; });
		  };
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
				$('#genderDetailCntMan').text(genderData[0].value);
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
	}
};

