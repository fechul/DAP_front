INDEX = {
	init: function() {
		this.makeGender();
		this.makeAge();
	},

	// GENDER
	makeGender: function() {
		var h = 200;
		var w = 200;
		var r = 100;

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

		var svg = d3.select("#genderChart").attr("width", w).attr("height", h);
		svg.append("g").attr("id","genderpie");
		gradPie.draw("genderpie", [{"label": "남자", "value":50, "color":"#1882dc"},{"label": "여자", "value":50, "color":"#dc183c"}], 100, 100, 100);

		gradPie.transition("genderpie", genderData, 100);
	},

	//AGE
	makeAge: function() {

		var width = 300,		// 차트 너비
			height = 200,		// 차트 높이
			padding = 5,		// 바 사이 간격
			division = 0.10,	// 바 높이를 알맞게 표현하기 위해 나눠주는 적당한 수
			duration = 10;		// 바 생성할 때 transition delay 값

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
					// 인구수는 천만, 몇백만 하는 큰 수이므로 화면에 적당한 픽셀로 표시하기 위해 적당한 division 값으로 나눠줌
			})
			.attr('width', width / ageData.length - padding)
			.attr('height', function (d) {
				return parseInt(d.value / division, 10);
			})
			.attr('fill', function (d) {
				return 'rgb(0, 0, ' + parseInt(d.value / division, 10) + ')';
			});
				
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
	}
};

