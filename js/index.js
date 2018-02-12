INDEX = {
	init: function() {
		this.analystType = ['gender', 'age', 'area', 'grade', 'major', 'ability', 'character', 'career'];
		this.currentTypeIdx = null;
		this.direction = 0;
		this.detailBox = $('#detailModal');
		this.comment = '하하하하하하하하하하하하하ㅑ';

		this.initEvents();
		// this.makeGender('#genderChart', 220, 220, 100);
		this.makeGender();
		this.makeAge();
		this.makeMajor();
		this.makeCharacter();

		// this.makeGenderDetail();
		// this.makeAgeDetail();
		this.makeMajorDetail();
		this.makeCharacterDetail();
		this.setComment();
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
	makeGender: function() {

		// BackEnd에서 이 형식으로 Data를 받아야함
		var genderData = [{
			"label": "남자",
			"value": 37
		}, {
			"label": "여자",
			"value": 22
		}];

		var total = genderData[0].value + genderData[1].value;
		var	manRate = genderData[0].label == '남자' ? ((genderData[0].value/total)*10).toFixed(1) : ((genderData[1].value/total)*100).toFixed(1);
		var	womanRate = genderData[0].label == '여자' ? ((genderData[0].value/total)*10).toFixed(1) : ((genderData[1].value/total)*100).toFixed(1);
		manRate = Math.round(manRate);
		womanRate = 10 - manRate;

		var width = 230,
			height = 230,
			radius = Math.min(width, height) / 2 - 20;
			
		var color = ['#1f77b4', '#dc5156'];

		var arc = d3.svg.arc()
						.outerRadius(radius)
		;
		var pie = d3.layout.pie();
		pie.value(function(d) {
			return d.value;
		});
		var svg = d3.select("#genderChart")
					.datum(genderData, function(d) { return d.value; })
					.attr("width", width)
					.attr("height", height)
					.append("g")
						.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		;
		var arcs = svg.selectAll("g.arc")
						.data(pie)
						.enter()
						.append("g")
						.attr("class", "arc");

		arcs.append("path")
				.attr("fill", function(d, i) { return color[i]; })
				.attr('stroke', 'black')
				.attr('stroke-width', '3px')
				.transition()
					.ease("bounce")
					.duration(1500)
					.attrTween("d", tweenPie)
				.transition()
					.ease("elastic")
					.delay(function(d, i) { return 1000 + i * 50; })
					.duration(750)
					.attrTween("d", tweenDonut)
				.each('end', function() {
					svg.append('text')
						.style('font-size', '32px')
						.style('font-weight', 'bold')
						.attr('text-anchor', 'middle')
						.attr("transform", "translate(0, 8)")
						.text(womanRate + ' : ' + manRate);
				})
		;
		function tweenPie(b) {
			b.innerRadius = 0;
			var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
			return function(t) { return arc(i(t)); };
		}
		function tweenDonut(b) {
			b.innerRadius = radius * .6;
			var i = d3.interpolate({innerRadius: 0}, b);
			return function(t) { return arc(i(t)); };
		}
	},

	//AGE
	makeAge: function() {
		var ageData = [{"label":"23","value":"2"},{"label":"24","value":"6"},{"label":"25","value":"9"},{"label":"26","value":"19"},{"label":"27","value":"9"},{"label":"28","value":"10"},{"label":"29","value":"2"},{"label":"30","value":"2"}];

		var width = 340,		// 차트 너비
			height = 200,		// 차트 높이
			padding = 5,		// 바 사이 간격
			division = 0.10,	// 바 높이를 알맞게 표현하기 위해 나눠주는 적당한 수
			duration = 10;		// 바 생성할 때 transition delay 값

		var svg = d3.select('#ageChart')
					.attr('width', width)
					.attr('height', height)	
					.style('margin-left', '30px')
					.style('margin-top', '10px')
		;

		var color = d3.scale.category20b();
							
		// 바 만들기
		svg.selectAll('rect')
			.data(ageData)
			.enter()
			.append('rect')
			.transition()
			.delay(function (d, i) {
				return i / ageData.length * 1500;
			})
			.attr('x', function (d, i) {
				return i * ((width + padding) / ageData.length);
			})
			.attr('y', function (d) {
				return height - parseInt(d.value / division, 10) + 9;
			})
			.attr('width', width / ageData.length - padding)
			.attr('height', function (d) {
				return parseInt(d.value / division, 10) - 12;
			})
			.attr('fill', function (d, i) {
				//return 'rgb( ' + parseInt(d.value / division, 10) + ',0,0)';
				return color(i);
			})
			.attr('stroke', 'black')
			.attr('stroke-width', '3px')
			;
				
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
					return height - parseInt(d.value /division, 10);
				})
				.style('font-weight', 'bold')
				.attr('fill', 'black')
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

		// majorInfo = [{'name': '컴퓨터과학','size': 13},
		// {'name': '소프트웨어학과','size': 11},
		// {'name': '경영학과','size': 7},
		// {'name': 'IT공학과','size': 19},
		// {'name': '경제학과','size': 3},
		// {'name': '전기전자컴퓨터공학부','size': 5},
		// {'name': '국어국문학과','size': 2},
		// {'name': '산업공학과','size': 8}];
		var majorInfo = [{"size":"1","name":"Computer Science"},{"size":"2","name":"IT공학"},{"size":"1","name":"경영학"},{"size":"1","name":"경제학"},{"size":"1","name":"디지털컨텐츠학"},{"size":"1","name":"로봇공학"},{"size":"1","name":"멀티미디어공학"},{"size":"1","name":"미디어콘텐츠학"},{"size":"4","name":"미디어학"},{"size":"1","name":"산업경영공학"},{"size":"1","name":"산업공학"},{"size":"1","name":"소프트웨어"},{"size":"2","name":"소프트웨어공학"},{"size":"1","name":"소프트웨어학"},{"size":"1","name":"전기전자공학"},{"size":"2","name":"전자공학"},{"size":"1","name":"전자컴퓨터공학"},{"size":"1","name":"정보미디어학"},{"size":"3","name":"정보컴퓨터공학"},{"size":"2","name":"정보통신공학"},{"size":"1","name":"정보통신전자공학"},{"size":"1","name":"컴퓨터SW학"},{"size":"20","name":"컴퓨터공학"},{"size":"3","name":"컴퓨터과학"},{"size":"1","name":"컴퓨터소프트웨어학"},{"size":"1","name":"컴퓨터정보공학"},{"size":"2","name":"통계학"},{"size":"1","name":"항공전자정보"}]


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

		var width = 300,
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
		var words = [
      {
        "cnt": "49.699000000000005",
        "text": "프로젝트"
      },
      {
        "cnt": "29.037",
        "text": "개발"
      },
      {
        "cnt": "28.674000000000003",
        "text": "팀원"
      },
      {
        "cnt": "22.002",
        "text": "사람"
      },
      {
        "cnt": "19.34",
        "text": "관심"
      },
      {
        "cnt": "17.758000000000003",
        "text": "아이디어"
      },
      {
        "cnt": "17.617",
        "text": "기능"
      },
      {
        "cnt": "17.270999999999997",
        "text": "친구"
      },
      {
        "cnt": "16.197",
        "text": "의견"
      },
      {
        "cnt": "14.953000000000001",
        "text": "수업"
      },
      {
        "cnt": "14.508",
        "text": "SK C&C"
      },
      {
        "cnt": "14.41",
        "text": "알고리즘"
      },
      {
        "cnt": "14.346999999999998",
        "text": "바탕"
      },
      {
        "cnt": "13.678999999999998",
        "text": "기술"
      },
      {
        "cnt": "13.657000000000002",
        "text": "업무"
      },
      {
        "cnt": "12.798000000000002",
        "text": "서비스"
      },
      {
        "cnt": "12.363",
        "text": "연구"
      },
      {
        "cnt": "11.896999999999998",
        "text": "데이터"
      },
      {
        "cnt": "11.811000000000002",
        "text": "지식"
      },
      {
        "cnt": "11.055",
        "text": "프로그램"
      },
      {
        "cnt": "10.940000000000001",
        "text": "어려움"
      },
      {
        "cnt": "10.930000000000001",
        "text": "역량"
      },
      {
        "cnt": "10.501999999999999",
        "text": "역할"
      },
      {
        "cnt": "10.351",
        "text": "시스템"
      },
      {
        "cnt": "9.335",
        "text": "사용자"
      },
      {
        "cnt": "9.115",
        "text": "서버"
      },
      {
        "cnt": "8.875",
        "text": "교수"
      },
      {
        "cnt": "8.84",
        "text": "자신감"
      },
      {
        "cnt": "8.677",
        "text": "기획"
      },
      {
        "cnt": "8.608",
        "text": "완성"
      },
      {
        "cnt": "8.568000000000001",
        "text": "코드"
      },
      {
        "cnt": "8.486",
        "text": "구현"
      },
      {
        "cnt": "8.469000000000001",
        "text": "작업"
      },
      {
        "cnt": "8.445",
        "text": "정보"
      },
      {
        "cnt": "8.407",
        "text": "기회"
      },
      {
        "cnt": "8.241",
        "text": "성과"
      },
      {
        "cnt": "8.058",
        "text": "학생"
      },
      {
        "cnt": "8.027000000000001",
        "text": "책임감"
      },
      {
        "cnt": "7.8500000000000005",
        "text": "인턴"
      },
      {
        "cnt": "7.630000000000001",
        "text": "공부"
      },
      {
        "cnt": "7.5889999999999995",
        "text": "능력"
      },
      {
        "cnt": "7.322",
        "text": "학교"
      },
      {
        "cnt": "7.236",
        "text": "논문"
      },
      {
        "cnt": "7.052999999999999",
        "text": "개발자"
      },
      {
        "cnt": "7.028",
        "text": "열정"
      },
      {
        "cnt": "6.989",
        "text": "반응"
      },
      {
        "cnt": "6.65",
        "text": "도전"
      },
      {
        "cnt": "6.521",
        "text": "데이터베이스"
      },
      {
        "cnt": "6.4910000000000005",
        "text": "자세"
      },
      {
        "cnt": "6.462",
        "text": "향상"
      },
      {
        "cnt": "6.365",
        "text": "기반"
      },
      {
        "cnt": "6.286999999999999",
        "text": "인공지능"
      },
      {
        "cnt": "6.133",
        "text": "전공"
      },
      {
        "cnt": "6.131",
        "text": "피드백"
      },
      {
        "cnt": "6.0440000000000005",
        "text": "대화"
      },
      {
        "cnt": "5.929",
        "text": "언어"
      },
      {
        "cnt": "5.904",
        "text": "과제"
      },
      {
        "cnt": "5.802",
        "text": "인재"
      },
      {
        "cnt": "5.708",
        "text": "환경"
      },
      {
        "cnt": "5.535",
        "text": "이해"
      },
      {
        "cnt": "5.531000000000001",
        "text": "소통"
      },
      {
        "cnt": "5.4879999999999995",
        "text": "SK주식회사 C&C"
      },
      {
        "cnt": "5.481",
        "text": "선배"
      },
      {
        "cnt": "5.41",
        "text": "과목"
      },
      {
        "cnt": "5.372",
        "text": "대회"
      },
      {
        "cnt": "5.3100000000000005",
        "text": "웹 개발"
      },
      {
        "cnt": "5.247",
        "text": "팀 프로젝트"
      },
      {
        "cnt": "5.202999999999999",
        "text": "연구실"
      },
      {
        "cnt": "5.197",
        "text": "영상"
      },
      {
        "cnt": "5.183",
        "text": "팀워크"
      },
      {
        "cnt": "5.180000000000001",
        "text": "협업"
      },
      {
        "cnt": "5.1610000000000005",
        "text": "문제점"
      },
      {
        "cnt": "5.144",
        "text": "원인"
      },
      {
        "cnt": "5.068",
        "text": "스터디"
      },
      {
        "cnt": "5.01",
        "text": "입사"
      },
      {
        "cnt": "4.964",
        "text": "흥미"
      },
      {
        "cnt": "4.926",
        "text": "위치"
      },
      {
        "cnt": "4.836",
        "text": "방향"
      },
      {
        "cnt": "4.82",
        "text": "동기"
      },
      {
        "cnt": "4.809",
        "text": "협력"
      },
      {
        "cnt": "4.799999999999999",
        "text": "최선"
      },
      {
        "cnt": "4.797",
        "text": "수강생"
      },
      {
        "cnt": "4.749",
        "text": "세상"
      },
      {
        "cnt": "4.731",
        "text": "고객"
      },
      {
        "cnt": "4.712999999999999",
        "text": "빅데이터"
      },
      {
        "cnt": "4.707",
        "text": "장점"
      },
      {
        "cnt": "4.688",
        "text": "조언"
      },
      {
        "cnt": "4.669",
        "text": "사이트"
      },
      {
        "cnt": "4.651",
        "text": "끈기"
      },
      {
        "cnt": "4.6129999999999995",
        "text": "자료"
      },
      {
        "cnt": "4.52",
        "text": "해결"
      },
      {
        "cnt": "4.519",
        "text": "시도"
      },
      {
        "cnt": "4.514",
        "text": "안드로이드"
      },
      {
        "cnt": "4.4719999999999995",
        "text": "대학원"
      },
      {
        "cnt": "4.434",
        "text": "공모전"
      },
      {
        "cnt": "4.416",
        "text": "해결책"
      },
      {
        "cnt": "4.392",
        "text": "발표"
      },
      {
        "cnt": "4.295",
        "text": "회사"
      },
      {
        "cnt": "4.258",
        "text": "스마트폰"
      },
      {
        "cnt": "4.218999999999999",
        "text": "학기"
      },
      {
        "cnt": "4.183999999999999",
        "text": "자연"
      },
      {
        "cnt": "4.162",
        "text": "차별"
      },
      {
        "cnt": "4.0969999999999995",
        "text": "센서"
      },
      {
        "cnt": "4.088",
        "text": "현장"
      },
      {
        "cnt": "4.014",
        "text": "선정"
      },
      {
        "cnt": "3.9850000000000003",
        "text": "CSS"
      },
      {
        "cnt": "3.952",
        "text": "아두이노"
      },
      {
        "cnt": "3.9499999999999997",
        "text": "수상"
      },
      {
        "cnt": "3.939",
        "text": "구성원"
      },
      {
        "cnt": "3.928",
        "text": "문서"
      },
      {
        "cnt": "3.904",
        "text": "작품"
      },
      {
        "cnt": "3.838",
        "text": "디자인"
      },
      {
        "cnt": "3.83",
        "text": "제품"
      },
      {
        "cnt": "3.778",
        "text": "프로그래밍"
      },
      {
        "cnt": "3.7299999999999995",
        "text": "동아리"
      },
      {
        "cnt": "3.7140000000000004",
        "text": "대학"
      },
      {
        "cnt": "3.652",
        "text": "성장"
      },
      {
        "cnt": "3.6510000000000002",
        "text": "전문성"
      },
      {
        "cnt": "3.6339999999999995",
        "text": "변화"
      },
      {
        "cnt": "3.621",
        "text": "마음가짐"
      },
      {
        "cnt": "3.616",
        "text": "적용"
      },
      {
        "cnt": "3.483",
        "text": "컴퓨터공학"
      },
      {
        "cnt": "3.463",
        "text": "어플리케이션"
      },
      {
        "cnt": "3.433",
        "text": "컴퓨터"
	  }
		];

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
						.style('font-weight', 'bold')
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
					d3.layout.cloud().size([240, 210])
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
	},

	setModalContent: function(type) {
		var self = this;

		$('#detailModalTitle').text(type.toUpperCase());
		$('.detailContainer').hide();
		switch(type) {
			case 'gender':
				$('#genderDetailChart').empty();
				$('#manCountText').empty();
				$('#womanCountText').empty();
				$('#manPercentText').empty();
				$('#womanPercentText').empty();
				$('.currentGenderImages').empty();
				$('#genderPreviousChart').empty();
				self.makeGenderDetail();
				$('.genderDetailContainer').show();
				break;
			case 'age':
				$('#ageDetailChart').empty();
				$('#ageAverage').empty();
				$('#compareVal').empty();
				$('#manAvgAge').empty();
				$('#womanAvgAge').empty();
				$('#ageOldest').empty();
				$('#ageYoung').empty();
				self.makeAgeDetail();
				$('.ageDetailContainer').show();
				break;
			case 'major':
				$('.majorDetailContainer').show();
				break;
			case 'area':
				$('#areaDetailChart').empty();
				TEST.makeAreaDetail.start();
				$('.areaDetailContainer').show();
				break;
			case 'grade':
				$('#gradeDetailChart').empty();
				$('#gradeLabelA').empty();
				$('#gradeLabelB').empty();
				$('#gradeLabelC').empty();
				TEST.makeGradeDetail();
				$('.gradeDetailContainer').show();
				break;
			case 'ability':
				$('.abilityDetailContainer').show();
				break;
			case 'character':
				$('.characterDetailContainer').show();
				break;
			case 'career':
				$('#careerDetailChart').empty();
				$('#careerCategoryFirst').empty();
				$('#careerCategorySecond').empty();
				TEST.makeCareerDetail();
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

		// BackEnd에서 이 형식으로 Data를 받아야함
		var genderData = [{
			"label": "남자",
			"value": 37
		}, {
			"label": "여자",
			"value": 22
		}];

		var	previousGenderData = [{
			"label": "남자",
			"value": 66
		}, {
			"label": "여자",
			"value": 17
		}];

		var drawPie = function(target, genderData, w, h, fs, mr, wr) {
			var width = w,
				height = h,
				radius = Math.min(width, height) / 2 - 20;
				
			var color = ['#1f77b4', '#dc5156'];

			var arc = d3.svg.arc()
							.outerRadius(radius)
			;
			var pie = d3.layout.pie();
			pie.value(function(d) {
				return d.value;
			});
			var svg = d3.select(target)
						.datum(genderData, function(d) { return d.value; })
						.attr("width", width)
						.attr("height", height)
						.append("g")
							.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
			;
			var arcs = svg.selectAll("g.arc")
							.data(pie)
							.enter()
							.append("g")
							.attr("class", "arc");

			arcs.append("path")
					.attr("fill", function(d, i) { return color[i]; })
					.attr('stroke', 'black')
					.attr('stroke-width', '3px')
					.transition()
						.ease("bounce")
						.duration(1500)
						.attrTween("d", tweenPie)
					.transition()
						.ease("elastic")
						.delay(function(d, i) { return 1000 + i * 50; })
						.duration(750)
						.attrTween("d", tweenDonut)
					.each('end', function() {
						svg.append('text')
							.style('font-size', fs + 'px')
							.style('font-weight', 'bold')
							.attr('text-anchor', 'middle')
							.attr("transform", "translate(0, 8)")
							.text(wr + ' : ' + mr);
					})
			;
			function tweenPie(b) {
				b.innerRadius = 0;
				var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
				return function(t) { return arc(i(t)); };
			}
			function tweenDonut(b) {
				b.innerRadius = radius * .6;
				var i = d3.interpolate({innerRadius: 0}, b);
				return function(t) { return arc(i(t)); };
			}
		};

		var total = genderData[0].value + genderData[1].value;
		var	manRate = genderData[0].label == '남자' ? ((genderData[0].value/total)*10).toFixed(1) : ((genderData[1].value/total)*100).toFixed(1);
		var	womanRate = genderData[0].label == '여자' ? ((genderData[0].value/total)*10).toFixed(1) : ((genderData[1].value/total)*100).toFixed(1);
		manRate = Math.round(manRate);
		womanRate = 10 - manRate;

		$('#manPercentText').text(genderData[0].label == '남자' ? (genderData[0].value/total * 100).toFixed(1) : (genderData[1].value/total * 100).toFixed(1));
		$('#womanPercentText').text(genderData[0].label == '남자' ? (genderData[1].value/total * 100).toFixed(1) : (genderData[0].value/total * 100).toFixed(1));
		$('#manCountText').text(genderData[0].label == '남자' ? genderData[0].value : genderData[1].value);
		$('#womanCountText').text(genderData[0].label == '남자' ? genderData[1].value : genderData[0].value);

		var genderImgText = '';
		for(var i = 0; i < manRate; i++) {
			genderImgText += '<img class="genderPic" src="img/gender_man.png"></img>';
		}
		for(var i = 0; i < womanRate; i++) {
			genderImgText += '<img class="genderPic" src="img/gender_woman.png"></img>';	
		}

		$('.currentGenderImages').append(genderImgText);

		var previousTotal = previousGenderData[0].value + previousGenderData[1].value;
		var	previousManRate = previousGenderData[0].label == '남자' ? ((previousGenderData[0].value/previousTotal)*10).toFixed(1) : ((previousGenderData[1].value/previousTotal)*100).toFixed(1);
		var	previousWomanRate = previousGenderData[0].label == '여자' ? ((previousGenderData[0].value/previousTotal)*10).toFixed(1) : ((previousGenderData[1].value/previousTotal)*100).toFixed(1);
		previousManRate = Math.round(previousManRate);
		previousWomanRate = 10 - previousManRate;

		$('#previousManCountText').text(previousGenderData[0].label == '남자' ? previousGenderData[0].value : previousGenderData[1].value);
		$('#previousWomanCountText').text(previousGenderData[0].label == '남자' ? previousGenderData[1].value : previousGenderData[0].value);
		$('#previousManPercentText').text(previousGenderData[0].label == '남자' ? (previousGenderData[0].value/previousTotal * 100).toFixed(1) : (previousGenderData[1].value/previousTotal * 100).toFixed(1));
		$('#previousWomanPercentText').text(previousGenderData[0].label == '남자' ? (previousGenderData[1].value/previousTotal * 100).toFixed(1) : (previousGenderData[0].value/previousTotal * 100).toFixed(1));

		drawPie('#genderDetailChart', genderData, 500, 500, '40', manRate, womanRate);
		drawPie('#genderPreviousChart', previousGenderData, 200, 200, '24', previousManRate, previousWomanRate);
	},

	makeAgeDetail: function() {
		var h = 500;
		var w = 500;

		var ageData = [{"label":"23","value":"2"},{"label":"24","value":"6"},{"label":"25","value":"9"},{"label":"26","value":"19"},{"label":"27","value":"9"},{"label":"28","value":"10"},{"label":"29","value":"2"},{"label":"30","value":"2"}];

		var maxAge = 0;
		var minAge = 100;
		var sumAge = 0;
		var pNum = 0;
		var avgAge = 0;

		var manAvg = 26.8;
		var womanAvg = 25.3;

		var previousAvgAge = 26.7;

		for(var i = 0; i < ageData.length; i++) {
			var ageVal = parseInt(ageData[i].label, 10);
			if(ageVal > maxAge) {
				maxAge = ageData[i].label;
			}

			if(ageVal < minAge) {
				minAge = ageData[i].label;
			}

			sumAge += ageVal*parseInt(ageData[i].value, 10);
			pNum += parseInt(ageData[i].value, 10);
		}

		avgAge = (sumAge/pNum).toFixed(1);

		// var compareVal = (((avgAge - previousAvgAge)/previousAvgAge)*100).toFixed(2);
		var compareVal = (avgAge - previousAvgAge).toFixed(1);

		$('#ageAverage').text(avgAge);
		var compareHtml = '';
		if(compareVal < 0) {
			compareHtml = '<span style="color:#f72626; font-weight:bold; font-size:22px;">' + compareVal*(-1) + '</span><span class="glyphicon glyphicon-arrow-down" style="color:#f72626; font-size:18px;"></span>';
		} else {
			compareHtml = '<span style="color:#1e9a27; font-weight:bold; font-size:22px;">' + compareVal + '</span><span class="glyphicon glyphicon-arrow-up" style="color:#1e9a27; font-size:18px;"></span>';
		}

		$('#compareVal').html(compareHtml);
		$('#manAvgAge').text(manAvg);
		$('#womanAvgAge').text(womanAvg);
		$('#ageOldest').text(maxAge);
		$('#ageYoung').text(minAge);

		var width = 500,		// 차트 너비
			height = 450,		// 차트 높이
			padding = 5,		// 바 사이 간격
			division = 0.05,	// 바 높이를 알맞게 표현하기 위해 나눠주는 적당한 수
      duration = 10;		// 바 생성할 때 transition delay 값
      

    // Scales
  var x = d3.scale.ordinal()
      .domain(ageData.map(function(d) { return d['label']; }))
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .domain([0, d3.max(ageData, function(d) { return +d['value']; }) * 1.1])
      .range([height, 0]);

  console.log(d3.max(ageData, function(d) { return +d['value']; }));

       // Axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

		var svg = d3.select('#ageDetailChart')
					.attr('width', width + 50)
					.attr('height', height + 50)	
					.style('padding-left', '30px')
					.style('margin-top', '10px')
    ;
    

            svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

		var color = d3.scale.category20b();
							
		// 바 만들기
		svg.selectAll('rect')
			.data(ageData)
			.enter()
			.append('rect')
			.transition()
			.delay(function (d, i) {
				return i / ageData.length * 1500;
			})
			.attr('x', function (d, i) {
				return i * ((width + padding) / ageData.length) + 1;
			})
			.attr('y', function (d) {
        // return height - parseInt(d.value / division, 10) + 12;//
        return y(d['value']);
			})
			.attr('width', width / ageData.length - padding)
			.attr('height', function (d) {
        // return parseInt(d.value / division, 10) - 12;
        return height - y(d['value']);
			})
			.attr('fill', function (d, i) {
				//return 'rgb( ' + parseInt(d.value / division, 10) + ',0,0)';
				return color(i);
			})
			.attr('stroke', 'black')
			.attr('stroke-width', '3px')
      ;



				
		// 바 아래에 라벨 표시
		// svg.selectAll('g')
		// 	.data(ageData)
		// 	.enter()
		// 	.append('text')
		// 		.transition()
		// 		.delay(duration * 1.2)
		// 		.text(function (d) {
		// 			return d.label;
		// 		})
		// 		.attr('x', function (d, i) {
		// 			return i * ((width + padding) / ageData.length) + (width / ageData.length - padding) / 2;
		// 		})
		// 		.attr('y', function (d) {
		// 			return height - parseInt(d.value /division, 10);
		// 		})
		// 		.style('font-weight', 'bold')
		// 		.attr('fill', 'black')
		// 		.attr('text-anchor', 'middle');
	},

	makeMajorDetail: function() {
		var majorInfo = [{"size":"1","name":"Computer Science"},{"size":"2","name":"IT공학"},{"size":"2","name":"경영학"},{"size":"1","name":"경제학"},{"size":"1","name":"디지털컨텐츠학"},{"size":"1","name":"로봇공학"},{"size":"1","name":"멀티미디어공학"},{"size":"1","name":"미디어콘텐츠학"},{"size":"4","name":"미디어학"},{"size":"1","name":"산업경영공학"},{"size":"1","name":"산업공학"},{"size":"1","name":"소프트웨어"},{"size":"2","name":"소프트웨어공학"},{"size":"1","name":"소프트웨어학"},{"size":"1","name":"전기전자공학"},{"size":"2","name":"전자공학"},{"size":"1","name":"전자컴퓨터공학"},{"size":"1","name":"정보미디어학"},{"size":"3","name":"정보컴퓨터공학"},{"size":"2","name":"정보통신공학"},{"size":"1","name":"정보통신전자공학"},{"size":"1","name":"컴퓨터SW학"},{"size":"20","name":"컴퓨터공학"},{"size":"3","name":"컴퓨터과학"},{"size":"1","name":"컴퓨터소프트웨어학"},{"size":"1","name":"컴퓨터정보공학"},{"size":"3","name":"통계학"},{"size":"1","name":"항공전자정보"}]
		// var majorInfo = [{'name': 'IT공학과','size': 19},
		// {'name': '컴퓨터과학','size': 13},
		// {'name': '소프트웨어학과','size': 11},
		// {'name': '산업공학과','size': 8},
		// {'name': '경영학과','size': 7},
		// {'name': '전기전자컴퓨터공학부','size': 5},
		// {'name': '경제학과','size': 3},
		// {'name': '국어국문학과','size': 2}];

		//var color = ["red","#82CE8C","#839BE6","#C6D445","#C3B66B","D1A7CC","#70D3C5","#DD9692"];
		// var color = d3.scale.category20();
    var color = ["#1f77b4","#aec7e8","#ff7f0e","#C6D445","#ff7f0e","D1A7CC","#70D3C5","#DD9692"];

		var totalSize = 0;
		for(var i = 0; i < majorInfo.length; i++) {
			// majorInfo[i].color = color[i%color.length];
			
			totalSize += parseInt(majorInfo[i].size, 10);
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
		var maj1 = ['건축공학과','건축학과','게임공학과','고분자공학과','공업화학과','공업화학학과','광학공학과','교양공학부','교통공학과','국방기술학과','금속공학과','기계공학과','기계설계공학과','냉동공조공학과','디지털콘텐츠학과', '미디어콘텐츠학', '정보통신전자공학', '컴퓨터소프트웨어학', '디지털콘텐츠학', '로봇공학', '컴퓨터SW학', '컴퓨터공학', '전기전자공학', '정보미디어학', '산업경영공학', '산업공학', '소프트웨어', '전자컴퓨터공학', '소프트웨어학', '디지털컨텐츠학', '디지털컨텐츠학과', '디지털텐츠학', '전자공학', '정보통신공학', '컴퓨터정보공학','멀티미디어학과', '멀티미디어공학', '메카트로닉스공학과','모바일시스템공학과','물류시스템공학과','미디어학과', '미디어콘텐츠', '반도체학과','사이버국방학과','산업공학과','섬유공학과','세라믹공학과','소방방재학과','소프트웨어공학과','시스템경영공학과','시스템공학과','신소재공학과','안전공학과','에너지자원공학과','원자력공학과','응용공학과','응용소프트웨어공학과','인쇄정보공학과','인터넷정보학과','자동차공학과','재료공학과','전기공학과','전기전자공학과','전기제어공학과', '정보컴퓨터공학', '미디어학', '소프트웨어공학','항공전자정보','전자공학과','전파공학과','정밀화학과','정보통신공학과','제어계측공학과','제어로봇학과', '로봇공','제지공학과','조경학과','조선공학과','컴퓨터공학과','컴퓨터과학과','토목공학과','항공우주공학과','항공운항학과','항해학과','해양공학과','해양시스템학과','화장품과학과','화학공학과','컴퓨터공함','컴퓨터과학', '소프트웨어학과', 'IT공학과', '전기전자컴퓨터공학부', '전기전자컴퓨터공학과', 'IT공학부', 'Computer Science', 'IT공학'];
		// 자연계열
		var maj2 = ['가정학과','교양생활과학부','교양자연과학부','나노공학과','농공학과','농생물학과','대기과학과','동물자원학과','말특수동물학과','물리학과','산림자원학과','생명공학과','생명과학과','생명자원학과','생물산업기계공학과','생물학과','생화학과','수의학과','수학과','식물자원학과','식품공학과','식품영양학과','우주과학과','원예학과','유전공학과','의류학과','의상학과','임산공학과','임학과','제약공학과','조리과학과','지구물리학과','지구정보공학과','지구해양과학과','지리학과','지적학과','지질학과','천문학과','축산학과', '통계학','통계학과','한방학과','해양생명과학과','해양자원학과','화학과','환경공학과','환경과학과'];
		// 의약계열
		var maj3 = ['간호학과','공중보건학과','물리치료학과','방사선학과','보건관리학과','약학부','예술치료학과','응급구조학과','의료정보공학과','의예과','의용공학과','임상병리학과','작업치료학과','재활학과','치기공학과','치위생학과','치의예과','한약학과','한의예과','환경보건학과'];
		// 인문계열
		var maj4 = ['고고학과','교양인문학부','국어국문학과','기독교학과','독어독문학과','독일학과','러시아어문학과','러시아학과','문예창작학과','문헌정보학과', '문화재보존학과','문화콘텐츠학과','미국학과','민속학과','북한학과','불교학과','불어불문학과','사학과','선교학과','스토리텔링학과','스페인어학과','신학과','심리학과','아랍어학과','아시아어학과','아프리카어학과','언어과학과','영어영문학과','영어학과','외국어학부','유럽학과','윤리학과','이탈리아어학과','인도어학과','인류학과','인문학부','일본학과','일어일문학과','자율전공학부','종교학과','중국학과','중어중문학과','지역학과','철학과','태국어학과','터키어학과','통번역학과','포르투갈어학과','폴란드어학과','프랑스학과','한국어학과','한문학과','헝가리어학과'];
		// 사회계열
		var maj5 = ['경영학', '경제학', 'e-비즈니스학과','경영정보학과','경영학과','경제학과','경찰행정학과','관광경영학과','광고홍보학과','교양경상학부','교양사회과학부','국제경영 및 통상학과','국제관계학과','국제문화정보학과','국제법무학과','국제학과','군사학과','금융보험학과','노인복지학과','농업경제학과','도시계획학과','도시공학과','무역학과','법학과','벤처창업학과','병원관리학과','보건행정학과','부동산학과','비서행정학과','사회복지학과','사회학과','산업경영학과','세무학과','세무회계학과','스포츠마케팅학과','신문방송학과','아동복지학과','아동학과','언론홍보학과','외식산업학과','유통학과','전자상거래학과','정보보호학과','정치외교학과','증권금융과','지역개발학과','청소년지도학과','항공서비스학과','해양경찰학과','행정학과','호텔경영학과','회계학과'];
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

		var width = 650,
        height = 530;

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

    // var ledg = d3.select("body").append("div")
    //     .style("position", "relative")
    //     .style("width", width + "px")
    //     .style("height", 300 + "px");

    var tool = d3.select("body").append("div").attr("class", "toolTip");

    d3.select(self.frameElement).style("height", height + 300 + "px");
    d3.select(self.frameElement).style("width", width + 20 + "px");

    function formatMoney(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    };

    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    };

    var rectType = {};

    div.selectAll(".node")
        .data(treemap.nodes(root))
      .enter().append("div")
        .attr("class", "node")
        // .style("padding", "10px")
        .style("left", function (d) { return d.x + "px"; })
        .style("top", function (d) { return d.y + "px"; })
        .style("width", function (d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function (d) { return Math.max(0, d.dy - 1) + "px"; })
        .style("background", function (d) {
          // return d.children ? color(d.name) : null;
          if(d.category && !rectType[d.category]) {
            rectType[d.category] = d.color;
          }
          return d.color;
        })
        .append('text')
        .style('position', 'relative')
        .style('top', '6px')
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

      majorInfo.sort(function (a, b) { 
        return parseInt(a.size, 10) > parseInt(b.size, 10) ? -1 : parseInt(a.size, 10) < parseInt(b.size, 10) ? 1 : 0;  
      });

      for(var i = 0; i < 5; i++) {
        majorDetailText += "<li style='color:" + majorInfo[i].color + "'>" + majorInfo[i].name + "<span class='majorCategorySublabel'>(" + majorInfo[i].size + ")</span></li>"
      }
      
      $('#majorRankList').append(majorDetailText);

		  // <div id="genderManRect" class="genderRect"></div><span id="genderManRectText" class="genderRectText">남자</span>
      // <div id="genderWomanRect" class="genderRect"></div><span id="genderManRectText" class="genderRectText">여자</span>

  		var majorRectText = '';
  		for(var key in rectType) {
  			majorRectText += '<div class="majorRect" style="background-color: ' + rectType[key] + '"></div><span style="margin-right: 10px;">' + key + '</span>';
  		}
		  $('.majorRectPart').append(majorRectText);
	},

	makeCharacterDetail: function() {

				var words = [
      {
        "cnt": "49.699000000000005",
        "text": "프로젝트"
      },
      {
        "cnt": "29.037",
        "text": "개발"
      },
      {
        "cnt": "28.674000000000003",
        "text": "팀원"
      },
      {
        "cnt": "22.002",
        "text": "사람"
      },
      {
        "cnt": "19.34",
        "text": "관심"
      },
      {
        "cnt": "17.758000000000003",
        "text": "아이디어"
      },
      {
        "cnt": "17.617",
        "text": "기능"
      },
      {
        "cnt": "17.270999999999997",
        "text": "친구"
      },
      {
        "cnt": "16.197",
        "text": "의견"
      },
      {
        "cnt": "14.953000000000001",
        "text": "수업"
      },
      {
        "cnt": "14.508",
        "text": "SK C&C"
      },
      {
        "cnt": "14.41",
        "text": "알고리즘"
      },
      {
        "cnt": "14.346999999999998",
        "text": "바탕"
      },
      {
        "cnt": "13.678999999999998",
        "text": "기술"
      },
      {
        "cnt": "13.657000000000002",
        "text": "업무"
      },
      {
        "cnt": "12.798000000000002",
        "text": "서비스"
      },
      {
        "cnt": "12.363",
        "text": "연구"
      },
      {
        "cnt": "11.896999999999998",
        "text": "데이터"
      },
      {
        "cnt": "11.811000000000002",
        "text": "지식"
      },
      {
        "cnt": "11.055",
        "text": "프로그램"
      },
      {
        "cnt": "10.940000000000001",
        "text": "어려움"
      },
      {
        "cnt": "10.930000000000001",
        "text": "역량"
      },
      {
        "cnt": "10.501999999999999",
        "text": "역할"
      },
      {
        "cnt": "10.351",
        "text": "시스템"
      },
      {
        "cnt": "9.335",
        "text": "사용자"
      },
      {
        "cnt": "9.115",
        "text": "서버"
      },
      {
        "cnt": "8.875",
        "text": "교수"
      },
      {
        "cnt": "8.84",
        "text": "자신감"
      },
      {
        "cnt": "8.677",
        "text": "기획"
      },
      {
        "cnt": "8.608",
        "text": "완성"
      },
      {
        "cnt": "8.568000000000001",
        "text": "코드"
      },
      {
        "cnt": "8.486",
        "text": "구현"
      },
      {
        "cnt": "8.469000000000001",
        "text": "작업"
      },
      {
        "cnt": "8.445",
        "text": "정보"
      },
      {
        "cnt": "8.407",
        "text": "기회"
      },
      {
        "cnt": "8.241",
        "text": "성과"
      },
      {
        "cnt": "8.058",
        "text": "학생"
      },
      {
        "cnt": "8.027000000000001",
        "text": "책임감"
      },
      {
        "cnt": "7.8500000000000005",
        "text": "인턴"
      },
      {
        "cnt": "7.630000000000001",
        "text": "공부"
      },
      {
        "cnt": "7.5889999999999995",
        "text": "능력"
      },
      {
        "cnt": "7.322",
        "text": "학교"
      },
      {
        "cnt": "7.236",
        "text": "논문"
      },
      {
        "cnt": "7.052999999999999",
        "text": "개발자"
      },
      {
        "cnt": "7.028",
        "text": "열정"
      },
      {
        "cnt": "6.989",
        "text": "반응"
      },
      {
        "cnt": "6.65",
        "text": "도전"
      },
      {
        "cnt": "6.521",
        "text": "데이터베이스"
      },
      {
        "cnt": "6.4910000000000005",
        "text": "자세"
      },
      {
        "cnt": "6.462",
        "text": "향상"
      },
      {
        "cnt": "6.365",
        "text": "기반"
      },
      {
        "cnt": "6.286999999999999",
        "text": "인공지능"
      },
      {
        "cnt": "6.133",
        "text": "전공"
      },
      {
        "cnt": "6.131",
        "text": "피드백"
      },
      {
        "cnt": "6.0440000000000005",
        "text": "대화"
      },
      {
        "cnt": "5.929",
        "text": "언어"
      },
      {
        "cnt": "5.904",
        "text": "과제"
      },
      {
        "cnt": "5.802",
        "text": "인재"
      },
      {
        "cnt": "5.708",
        "text": "환경"
      },
      {
        "cnt": "5.535",
        "text": "이해"
      },
      {
        "cnt": "5.531000000000001",
        "text": "소통"
      },
      {
        "cnt": "5.4879999999999995",
        "text": "SK주식회사 C&C"
      },
      {
        "cnt": "5.481",
        "text": "선배"
      },
      {
        "cnt": "5.41",
        "text": "과목"
      },
      {
        "cnt": "5.372",
        "text": "대회"
      },
      {
        "cnt": "5.3100000000000005",
        "text": "웹 개발"
      },
      {
        "cnt": "5.247",
        "text": "팀 프로젝트"
      },
      {
        "cnt": "5.202999999999999",
        "text": "연구실"
      },
      {
        "cnt": "5.197",
        "text": "영상"
      },
      {
        "cnt": "5.183",
        "text": "팀워크"
      },
      {
        "cnt": "5.180000000000001",
        "text": "협업"
      },
      {
        "cnt": "5.1610000000000005",
        "text": "문제점"
      },
      {
        "cnt": "5.144",
        "text": "원인"
      },
      {
        "cnt": "5.068",
        "text": "스터디"
      },
      {
        "cnt": "5.01",
        "text": "입사"
      },
      {
        "cnt": "4.964",
        "text": "흥미"
      },
      {
        "cnt": "4.926",
        "text": "위치"
      },
      {
        "cnt": "4.836",
        "text": "방향"
      },
      {
        "cnt": "4.82",
        "text": "동기"
      },
      {
        "cnt": "4.809",
        "text": "협력"
      },
      {
        "cnt": "4.799999999999999",
        "text": "최선"
      },
      {
        "cnt": "4.797",
        "text": "수강생"
      },
      {
        "cnt": "4.749",
        "text": "세상"
      },
      {
        "cnt": "4.731",
        "text": "고객"
      },
      {
        "cnt": "4.712999999999999",
        "text": "빅데이터"
      },
      {
        "cnt": "4.707",
        "text": "장점"
      },
      {
        "cnt": "4.688",
        "text": "조언"
      },
      {
        "cnt": "4.669",
        "text": "사이트"
      },
      {
        "cnt": "4.651",
        "text": "끈기"
      },
      {
        "cnt": "4.6129999999999995",
        "text": "자료"
      },
      {
        "cnt": "4.52",
        "text": "해결"
      },
      {
        "cnt": "4.519",
        "text": "시도"
      },
      {
        "cnt": "4.514",
        "text": "안드로이드"
      },
      {
        "cnt": "4.4719999999999995",
        "text": "대학원"
      },
      {
        "cnt": "4.434",
        "text": "공모전"
      },
      {
        "cnt": "4.416",
        "text": "해결책"
      },
      {
        "cnt": "4.392",
        "text": "발표"
      },
      {
        "cnt": "4.295",
        "text": "회사"
      },
      {
        "cnt": "4.258",
        "text": "스마트폰"
      },
      {
        "cnt": "4.218999999999999",
        "text": "학기"
      },
      {
        "cnt": "4.183999999999999",
        "text": "자연"
      },
      {
        "cnt": "4.162",
        "text": "차별"
      },
      {
        "cnt": "4.0969999999999995",
        "text": "센서"
      },
      {
        "cnt": "4.088",
        "text": "현장"
      },
      {
        "cnt": "4.014",
        "text": "선정"
      },
      {
        "cnt": "3.9850000000000003",
        "text": "CSS"
      },
      {
        "cnt": "3.952",
        "text": "아두이노"
      },
      {
        "cnt": "3.9499999999999997",
        "text": "수상"
      },
      {
        "cnt": "3.939",
        "text": "구성원"
      },
      {
        "cnt": "3.928",
        "text": "문서"
      },
      {
        "cnt": "3.904",
        "text": "작품"
      },
      {
        "cnt": "3.838",
        "text": "디자인"
      },
      {
        "cnt": "3.83",
        "text": "제품"
      },
      {
        "cnt": "3.778",
        "text": "프로그래밍"
      },
      {
        "cnt": "3.7299999999999995",
        "text": "동아리"
      },
      {
        "cnt": "3.7140000000000004",
        "text": "대학"
      },
      {
        "cnt": "3.652",
        "text": "성장"
      },
      {
        "cnt": "3.6510000000000002",
        "text": "전문성"
      },
      {
        "cnt": "3.6339999999999995",
        "text": "변화"
      },
      {
        "cnt": "3.621",
        "text": "마음가짐"
      },
      {
        "cnt": "3.616",
        "text": "적용"
      },
      {
        "cnt": "3.483",
        "text": "컴퓨터공학"
      },
      {
        "cnt": "3.463",
        "text": "어플리케이션"
      },
      {
        "cnt": "3.433",
        "text": "컴퓨터"
	  }
		];

	    var totalWordsCnt = 0;
		for(var j = 0; j < words.length; j++) {
			totalWordsCnt += parseInt(words[j].cnt, 10);
		}
		var fill = d3.scale.category20();
		var wordCloud = function() {

			//Construct the word cloud's SVG element
			var svg = d3.select("#characterWordCloudDetail")
				.attr("width", 700)
				.attr("height", 550)
				.append("g")
				.attr("transform", "translate(350,300)");


			//Draw the word cloud
			function draw(words) {
				var cloud = svg.selectAll("g text")
								.data(words, function(d) { return d.text; })

				//Entering words
				cloud.enter()
					.append("text")
					.style("font-family", "Impact")
					.style("fill", function(d, i) {
						return fill(i); 
					})
					.attr("text-anchor", "middle")
					.attr('font-size', 1)
					.text(function(d) { return d.text; });

				//Entering and existing words
				cloud
					.transition()
						.duration(600)
						.style("font-size", function(d) { return d.size + "px"; })
						.style('font-weight', 'bold')
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
				words[j].size = 10 + (words[j].cnt/totalWordsCnt)*60*15;
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
		var myWordCloud = wordCloud();

		//Start cycling through the demo data
		showNewWords(myWordCloud);

		var characterDetailText = '';
		for(var i = 0; i < 5; i++) {
			console.log()
			characterDetailText += "<li style=color:" + fill(i) + ";>" + words[i].text + "<span class='characterCategorySublabel'>(" + ((words[i].cnt/totalWordsCnt)*100).toFixed(2) + "%)</span></li>"
		}
		$('#characterRankList').append(characterDetailText);
	},

	setComment: function() {
		var tryCnt = 0;
		var commentText = ' 안녕하세요?<br>저는 <span style="color:#9c9dde;">26.3</span>살 <span style="color:#1f77b4;">남자</span>입니다.<br> 주로 <span style="color:#905151;">경기도</span> 지역에 있었고, <span style="color:#2076b4;">컴퓨터 공학</span>을 전공 했습니다. 학점은 <span style="color:#007f00;">3.67</span>이고, <span style="color:#8f2ec1;">C</span>와 <span style="color:#8f2ec1;">Java</span>에 능숙합니다. <br>미래에는 <span style="color:#e00707;">인공지능 전문가</span>가 되는 것이 꿈입니다.';
		$('#personComment').t({
		  delay:false,                // start-delay: 2s (default:false)
		  speed:75,               // 35ms (default:75)
		  speed_vary:false,       // adds lil' human-like speed variation (default:false)
		  caret:'\u2589',         // can be html too (default:\u258e)
		  blink:400,              // 400ms (default:false)
		  blink_perm:false,       // if FALSE, caret only blinks if paused/delayed/finished, if TRUE, permanent (default:false)
		  mistype:4,              // 1:4 per char; if set and <kbd> tag(s) detected, only there, else complete content (default:false)
		  locale:'en',            // 'de' for german keyboard layouts is also supported (default:'en')
		  pause_on_click:false,    // toggles typing-pause on elem click/tap (default:false)
		  repeat:0,               // if TRUE, infinite or N times (default:0)
		  
		  // init callback (ready-to-type)
		  init:function(elm) {},        
		  // typing callback
		  typing:function(elm,chr,chrs_total,chrs_left) {

		  },
		  // finished callback
		  fin:function(elm){
		  	if(tryCnt >= 1) {
		  		$(elm).empty();
		  		$(elm).html(commentText);
		  	} else {
		  		tryCnt++;
		  		$(elm).t('add', commentText);
		  	}
		  }          
		});
	}
};

