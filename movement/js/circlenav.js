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

		var choices = [];

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
		svg.append("circle")
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
		svg.selectAll("circle.choice")
			.data(data)
			.enter()
			.append("circle")
			.attr("class","choice")
			.attr("r", function(d) { return getRadius(d); } )
			.attr("cx", function(d,i) {
				var angleRadians = ( (2 * Math.PI) / _dataLength )*i;

				var x = mainCircleRadius * Math.cos( angleRadians);

				return x + circleCentre.x;
			})
			.attr("cy", function(d, i) {
				var angleRadians = ( (2 * Math.PI) / _dataLength )*i;
				var y =  mainCircleRadius * Math.sin( angleRadians);

				return y + circleCentre.y;
			})
			.attr("label", function(d,i) {
				return d.name + ":" + i;
			})
			.on("mouseover", function() {
				d3.select(this).classed("over", true);
				d3.select(this).attr("r", function(d) { return getRadius(d) + 10; } );
			})
			.on("mouseout", function() {
				d3.select(this).classed("over", false);
				d3.select(this).attr("r", function(d) { return getRadius(d); } );
			})
			.on("click", function(d) {
				var d3Obj = d3.select(this);
				if( d3Obj.classed("selected") ) {
					choices.push( d3Obj );
					d3Obj.classed("selected", false );
				}
				else {
					choices.filter( function( obj ) { return obj !== d3Obj; } );
					d3Obj.classed("selected", true );
				}

			});
		;

		svg.selectAll("text.title")
			.data(data)
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
