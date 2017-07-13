/**
 * Created by matthew on 02/05/17.
 */
var chart = {
	create : function(data, config) {
		//
		// Configuration set up
		//
		var _select = config.select || "#chart",
			_width = config.width || 800,
			_height = config.height || 600,
			_dataLength = data.length;

		var chartSize = {
			top: 0,
			bottom: _height,
			left: 0,
			right: _width
		};
		chartSize.width  = chartSize.right - chartSize.left;
		chartSize.height = chartSize.bottom - chartSize.top;

		var mainCircleRadius = 300;

		var choices = [],
			mode = 1;
		//
		// Chart create
		//
		var chartDiv = d3.select( _select );

		var	svg = chartDiv.append("svg")
			.attr("width", _width)
			.attr("height", _height);

		// DEBUG
		svg.append("rect")
			.attr("x", chartSize.left )
			.attr("y", chartSize.top )
			.attr("width", chartSize.width )
			.attr("height", chartSize.height );

		var circleCentre = {
			x: chartSize.left + ( chartSize.width) / 2,
			y : chartSize.top + ( chartSize.height) / 2
		};

		// Main circle
		var mainCirlce = svg.append("circle")
			.attr("r", mainCircleRadius )
			.attr("cx", circleCentre.x )
			.attr("cy", circleCentre.y )
			.attr("class","main");

		var circleCircumference = 2 * Math.PI * mainCircleRadius,
			maxSize = d3.sum( data, function(d) { return d.size; });
console.log(maxSize);
		for( var i=0, iEnd = data.length; i < iEnd; i++ ) {
			var circleData = data[i];
		}

		function getRadius( d ) {
			//return 20;
			return d.size;
		}

		// Chooseable circles
		var d3CirlcesData = svg.selectAll("circle.choice")
			.data(data);

		function modeOne() {

			d3CirlcesData = svg.selectAll("circle.choice")
				.data(data);

			d3CirlcesData
				.enter()
				.append("circle")
				.classed("choice", true )
				.classed("circle", true )
				.attr("r", function (d) {
					return getRadius(d);
				})
				.attr("cx", function (d, i) {
					var angleRadians = ( (2 * Math.PI) / _dataLength ) * i;

					var x = mainCircleRadius * Math.cos(angleRadians);

					return x + circleCentre.x;
				})
				.attr("cy", function (d, i) {
					var angleRadians = ( (2 * Math.PI) / _dataLength ) * i;
					var y = mainCircleRadius * Math.sin(angleRadians);

					return y + circleCentre.y;
				})
				.attr("label", function (d, i) {
					return d.name + ":" + i;
				})
				.on("mouseover", function () {
					d3.select(this).classed("over", true);
					if (mode === 1) {
						d3.select(this).attr("r", function (d) {
							return getRadius(d) + 10;
						});
					}
				})
				.on("mouseout", function () {
					d3.select(this).classed("over", false);
					if (mode === 1) {
						d3.select(this).attr("r", function (d) {
							return getRadius(d);
						});
					}
				})
				.on("click", function (d) {
					var d3Obj = d3.select(this);
					if (d3Obj.classed("selected")) {
						// Already selected
						choices = choices.filter(function (obj) {
							return obj.d.id !== d.id;
						});
						d3Obj.classed("selected", false);
					}
					else {
						choices.push({
							d: d,
							d3: d3Obj
						});
						d3Obj.classed("selected", true);
					}
					console.log(choices);

				})
				.append("title").text(function (d) {
				return d.name;
			})
			;

			d3CirlcesData
				.transition()
				.duration( 1000 )
				.attr("r", function (d) {
					return getRadius(d);
				})
				.attr("cx", function (d, i) {
					var angleRadians = ( (2 * Math.PI) / _dataLength ) * i;

					var x = mainCircleRadius * Math.cos(angleRadians);

					return x + circleCentre.x;
				})
				.attr("cy", function (d, i) {
					var angleRadians = ( (2 * Math.PI) / _dataLength ) * i;
					var y = mainCircleRadius * Math.sin(angleRadians);

					return y + circleCentre.y;
				})
			;

			mainCirlce.attr("opacity", 1 );
		}

		function modeTwo() {
			console.log("timeline");
			mode = 2;

			var tim = {
				left: 100,
				right: 600,
				top : 100,
				bottom: 600
			};
			tim.width = tim.right - tim.left;
			tim.height = tim.bottom - tim.top;

			var left = choices[0],
				right = choices[1];

			function mainNode(d) {
				return d === left.d || d === right.d;
			}

			d3CirlcesData
				.data(data, function(d) {return d.id;})
				.transition()
				.duration( function(d) {
					if( mainNode(d)) {
						return 700;
					}
					return 1200;
				} )
				.attr("r", function(d) {
					if( !mainNode(d) ) {
						return Math.random() * 10 + 5;
					} else {
						return 20;//getRadius(d);
					}
				})
				.attr("cx", function(d) {
					if( !mainNode(d) ){
						return (tim.left+tim.width/2) + Math.random() * (tim.width/2) - (tim.width/3);
					}
					else {
						if( d === left.d ) {
							return tim.left;
						}
						if( d === right.d ) {
							return tim.right;
						}
					}
				})
				.attr("cy", function(d) {
					return tim.top + tim.width/2;

					if( !mainNode(d) ){
						return (tim.top+tim.height/2) + Math.random() * (tim.height/2) - (tim.height/3);
					}
					else {
						if( d === left.d ) {
							return tim.top + tim.width/2;
						}
						if( d === right.d ) {
							return tim.top + tim.width/2
						}
					}
				})


			mainCirlce.attr("opacity", 0 );
		}

		function modeThree() {
			console.log("triangle");
			mode = 3;

			var top = choices[0],
				left = choices[1],
				right = choices[2];

			function mainNode(d) {
				return d === top.d || d === left.d || d === right.d;
			}

			var tri = {
				left: 200,
				right: 500,
				top : 200,
				bottom: 500
			};
			tri.width = tri.right - tri.left;
			tri.height = tri.bottom - tri.top;

			d3CirlcesData
				.data(data, function(d) {return d.id;})
				.transition()
				.duration( function(d) {
					if( mainNode(d)) {
						return 700;
					}
					return 1200;
				} )
				.attr("r", function(d) {
					if( !mainNode(d) ) {
						return Math.random() * 10 + 5;
					} else {
						return 20;//getRadius(d);
					}
				})
				.attr("cx", function(d) {
					if( !mainNode(d) ){
						return (tri.left+tri.width/2) + Math.random() * (tri.width/2) - (tri.width/3);
					}
					else {
						if( d === top.d ) {
							return tri.left;
						}
						if( d === left.d ) {
							return tri.left;
						}
						if( d === right.d ) {
							return tri.right;
						}
					}
				})
				.attr("cy", function(d) {
					if( !mainNode(d) ){
						return (tri.top+tri.height/2) + Math.random() * (tri.height/2) - (tri.height/3);
					}
					else {
						if( d === top.d ) {
							return tri.top;
						}
						if( d === left.d ) {
							return tri.bottom;
						}
						if( d === right.d ) {
							return tri.top + ((tri.bottom - tri.top) / 2);
						}
					}
				})


			mainCirlce.attr("opacity", 0 );

		}

		modeOne();

		/*svg.selectAll("text.title")
			.data(data, function(d) {return d.id;})
			.enter()
			.append("text")
			.attr("class","title")
			.text( function(d) {
				return d.name;
			})
			.attr("x", function(d,i) {
				var angleRadians = ( (2 * Math.PI) / _dataLength )*i;

				var x = mainCircleRadius * Math.cos( angleRadians);

				return x + circleCentre.x - (getRadius(d) / 2);
			})
			.attr("y", function(d, i) {
				var angleRadians = ( (2 * Math.PI) / _dataLength )*i;
				var y =  mainCircleRadius * Math.sin( angleRadians);

				return y + circleCentre.y + getRadius(d) + 15;
			})
		;*/

		svg.append( "rect" )
			.attr( "x", chartSize.right - 210 )
			.attr( "y", chartSize.bottom - 240 )
			.attr( "width", 100 )
			.attr( "height", 30 )
			.classed( "button", true )
			.on( "click", function() {


				if( choices.length === 3 ) {
					modeThree();
				}

				if( choices.length === 2 ) {
					modeTwo();
				}
			});

		svg.append("text")
			.attr( "x", chartSize.right - 210 + 30 )
			.attr( "y", chartSize.bottom - 240 + 20 )
			.classed( "button", true )
			.text("Show")
		;

		svg.append( "rect" )
			.attr( "x", chartSize.right - 210 )
			.attr( "y", chartSize.bottom - 140 )
			.attr( "width", 100 )
			.attr( "height", 30 )
			.classed( "button", true )

			.on( "click", function() {
				modeOne();
			})
		;

		svg.append("text")
			.attr( "x", chartSize.right - 210 + 30 )
			.attr( "y", chartSize.bottom - 140 + 20 )
			.classed( "button", true )
			.text("Back")
		;


		/*svg.append("g")
			.attr("class","group");
		svg.selectAll("g.group")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", function(_, i) { return i * 10;})
			.attr("y", function(d) { return d;})
			.attr("width", 10 )
			.attr("height", 10 )*/

		return {
			choices: choices
		}
	}
};
