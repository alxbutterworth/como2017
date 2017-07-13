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

		//var circleCircumference = 2 * Math.PI * mainCircleRadius,
		//	maxSize = d3.sum( data, function(d) { return d.size; });

		//for( var i=0, iEnd = data.length; i < iEnd; i++ ) {
		//	var circleData = data[i];
		//}

		function getRadius( d ) {
			//return 20;
			return d.size * 2;
		}

		// Chooseable circles
		var d3CirlcesData;

		function modeOne() {

			d3CirlcesData = svg.selectAll("rect.choice")
				.data(data);

			d3CirlcesData
				.enter()
				.append("rect")
				.classed("choice", true )
				.attr("x", function(d,i) {
					var angleRadians = ( (2 * Math.PI) / _dataLength ) * i;

					var x = mainCircleRadius * Math.cos(angleRadians);

					return x + circleCentre.x - getRadius(d)/2;
				})
				.attr("y", function(d,i) {

					var angleRadians = ( (2 * Math.PI) / _dataLength ) * i;
					var y = mainCircleRadius * Math.sin(angleRadians);

					return y + circleCentre.y - getRadius(d)/2;
				})
				.attr("width", function(d) { return getRadius(d); } )
				.attr("height", function(d) { return getRadius(d); } )
				.attr("rx", 1000)
				.attr("ry", 1000)
				/*.attr("r", function (d) {
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
				})*/
				.attr("label", function (d, i) {
					return d.name + ":" + i;
				})
				.on("mouseover", function () {
					var d3Obj = d3.select(this);
					d3Obj.classed("over", true);

					if (mode === 1) {
						/*d3Obj
							.attr("width", function (d) {
								return getRadius(d) + 20;
							})
							.attr("x", function(d) {
								return d3Obj.attr("x") - 10;
							})
							.attr("height", function (d) {
								return getRadius(d) + 20;
							})
							.attr("y", function(d) {
								return d3Obj.attr("y") - 10;
							});*/
					}
				})
				.on("mouseout", function () {
					var d3Obj = d3.select(this);
					d3Obj.classed("over", false);
					if (mode === 1) {
						/*d3Obj
							.attr("width", function (d) {
								return getRadius(d);
							})
							.attr("x", function(d) {
								return d3Obj.attr("x") + 10;
							})
							.attr("height", function (d) {
								return getRadius(d);
							})
							.attr("y", function(d) {
								return d3Obj.attr("y") + 10;
							});*/
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
				.attr("x", function(d,i) {
					var angleRadians = ( (2 * Math.PI) / _dataLength ) * i;

					var x = mainCircleRadius * Math.cos(angleRadians);

					return x + circleCentre.x - getRadius(d)/2;
				})
				.attr("y", function(d,i) {

					var angleRadians = ( (2 * Math.PI) / _dataLength ) * i;
					var y = mainCircleRadius * Math.sin(angleRadians);

					return y + circleCentre.y - getRadius(d)/2;
				})
				.attr("width", function(d) { return getRadius(d); } )
				.attr("height", function(d) { return getRadius(d); } )
				/*.attr("cx", function (d, i) {
					var angleRadians = ( (2 * Math.PI) / _dataLength ) * i;

					var x = mainCircleRadius * Math.cos(angleRadians);

					return x + circleCentre.x;
				})
				.attr("cy", function (d, i) {
					var angleRadians = ( (2 * Math.PI) / _dataLength ) * i;
					var y = mainCircleRadius * Math.sin(angleRadians);

					return y + circleCentre.y;
				})*/
				.attr("rx", 1000)
				.attr("ry", 1000)
				.style("fill", null)
			;

			mainCirlce.transition().duration(1000).attr("opacity", 1 );
		}

		function modeTwo() {
			console.log("timeline");
			mode = 2;

			var tim = {
				left: chartSize.left + 200,
				right: chartSize.left + chartSize.width/2 + 400,
				top : chartSize.top + 100,
				bottom: chartSize.top + 500
			};
			tim.width = tim.right - tim.left;
			tim.height = tim.bottom - tim.top;

			var left = choices[0],
				right = choices[1];

			function mainNode(d) {
				return d === left.d || d === right.d;
			}

			var countXPos = 0;
			d3CirlcesData
				.data(data, function(d) {return d.id;})
				.transition()
				.duration( function(d) {
					if( mainNode(d)) {
						return 1200;
					}
					return 1900;
				} )
				.attr("x", function(d) {
					if( !mainNode(d) ){
						countXPos += 1;
						return tim.left + (tim.width / (_dataLength) ) * countXPos;
						// return ((tim.left+tim.width/2) + Math.random() * (tim.width/2) - (tim.width/3)) - getRadius(d);

					}
					else {
						if( d === left.d ) {
							return tim.left;
						}
						if( d === right.d ) {
							return tim.right - getRadius(d) * 2;
						}
					}
				})
				.attr("y", function(d) {

					if( !mainNode(d) ){
						return tim.top + ((tim.height/2) * Math.random());
					}
					else {
						if( d === left.d ) {
							return tim.top;
						}
						if( d === right.d ) {
							return tim.top + 20;
						}
					}
				})
				.attr("height", function(d) {
					if( !mainNode(d) ){
						return (tim.height/2) * Math.random();
					}
					else {
						return tim.height - 20;
						if( d === left.d ) {
							return tim.height;
						}
						if( d === right.d ) {
							return tim.height
						}
					}
				} )
				.attr("width", function(d) {

					if( !mainNode(d) ){
						return 10;
					}
					else {
						if( d === left.d ) {
							return 20;
						}
						if( d === right.d ) {
							return 20;
						}
					}
				})
				.style("fill", function(d) {
					if( !mainNode(d) ){
						return "#333";
					}
					else {
						if( d === left.d ) {
							return "red";
						}
						if( d === right.d ) {
							return "green";
						}
					}
				})
				.attr("rx", 0)
				.attr("ry", 0)
				/*.attr("r", function(d) {
					if( !mainNode(d) ) {
						return Math.random() * 10 + 5;
					} else {
						return 30;//getRadius(d);
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
				})*/
			;


			mainCirlce.transition().duration(1000).attr("opacity", 0 );
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
				left: chartSize.left + chartSize.width/3,
				right: chartSize.left + chartSize.width/3 + 400,
				top : chartSize.top + 200,
				bottom: chartSize.top + 200 + 400
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
				.attr("x", function(d) {
					if( !mainNode(d) ){
						return ((tri.left+tri.width/2) + Math.random() * (tri.width/2) - (tri.width/3) ) - getRadius(d);
					}
					else {
						if( d === top.d ) {
							return tri.left - getRadius(d);
						}
						if( d === left.d ) {
							return tri.left - getRadius(d);
						}
						if( d === right.d ) {
							return tri.right - getRadius(d);
						}
					}
				})
				.attr("y", function(d) {
					if( !mainNode(d) ){
						return ( (tri.top+tri.height/2) + Math.random() * (tri.height/2) - (tri.height/3) ) - getRadius(d);
					}
					else {
						if( d === top.d ) {
							return tri.top  - getRadius(d);
						}
						if( d === left.d ) {
							return tri.bottom  - getRadius(d);
						}
						if( d === right.d ) {
							return ( tri.top + ((tri.bottom - tri.top) / 2) ) - getRadius(d);
						}
					}
				})
				.attr("width", function(d) {
					if( !mainNode(d) ) {
						return Math.random() * 5 + 20;
					} else {
						return 60;//getRadius(d);
					}
				})
				.attr("height", function(d) {
					if( !mainNode(d) ) {
						return Math.random() * 5 + 20;
					} else {
						return 60;//getRadius(d);
					}
				})
				.style("fill", function(d) {
					if( !mainNode(d) ){
						return "hsl(" + Math.random() * 360 + ",100%,50%)";
					}
					else {
						if( d === top.d ) {
							return "blue";
						}
						if( d === left.d ) {
							return "red";
						}
						if( d === right.d ) {
							return "green";
						}
					}
				})
				/*.attr("r", function(d) {
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
				})*/
			;


			mainCirlce.transition().duration(1000).attr("opacity", 0 );

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
			.attr( "y", chartSize.bottom - 200 )
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
			.attr( "y", chartSize.bottom - 200 + 20 )
			.classed( "button", true )
			.text("Select")
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
