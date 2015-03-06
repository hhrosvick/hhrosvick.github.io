// Recursive Hilbert Curve Drawing
// Henry Rosvick, 2015

// This is free and unencumbered software released into the public domain.

// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.

// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

// For more information, please refer to <http://unlicense.org>


$(function(){
// image initialization.
var a_canvas = document.getElementById("a");
var context = a_canvas.getContext("2d");
var type = '';


$('#reset').on('click', function(e){
	setTimeout(function(){
	$('#Hilbert_Curve').submit();
	}, 100);
});

// on click event handler
$('#Hilbert_Curve').submit(function(e){
	e.preventDefault();

	// get parameters from the page
	var level = parseInt($('#level').val());
	var size = parseInt($('#size').val());
	var offset = parseInt($('#offset').val());
		type = $('#type').val();
	var color = $('#color').val() || 'black';
	var direction = $.parseJSON($('#direction').val());
	
	// set image options and clear
	a_canvas.width = size;
	a_canvas.height = size;
	context.fillStyle = color;
	context.clearRect(0,0,a_canvas.width,a_canvas.height);

	// calculate side length
	var line_length = (size-(offset*2))/(Math.pow(2,level)-1);
	var start_location = direction[0]>=0 && direction[1]<=0 ? size-offset : offset;
	
	// Just for fun 
	if(type == 'Polygon'){
		context.beginPath();
		context.moveTo(start_location,start_location);
		console.log('moveTo: ', start_location,start_location);
	}
	
	// initialize draw location pass-by-reference object.
	var draw_location = {
		row: start_location,
		column: start_location
	};

	// start recursion with initial values
	hilbert_curve(direction[0],direction[1],level,line_length,draw_location,context);

	// Just for fun
	if(type == 'Polygon'){
		context.closePath();
		context.fill();
		console.log('closePath and fill');
	}
	
	
});


// Main recursive function
// No return value, will end when level 0 is reached.
//
// x        - left/right indicator (-1 = left, 0 = up/down,    1 = right)
// y        - up/down indicator    (-1 = down, 0 = left/right, 1 = up   )
// level    - current level
// length   - line length
// draw_loc - the object holding the current draw location (passed by reference)
// cxt      - the canvas context (passed by reference)
// 
// ----Mapping-----==---------Sub-curve Order-------- 
// --------( x, y) -- (-y,-x) ( x, y) ( x, y) ( y, x)
// Up -----( 0, 1) -- (-1, 0) ( 0, 1) ( 0, 1) ( 1, 0)
// Down ---( 0,-1) -- ( 1, 0) ( 0,-1) ( 0,-1) (-1, 0)
// Left ---(-1, 0) -- ( 0, 1) (-1, 0) (-1, 0) ( 0,-1)
// Right --( 1, 0) -- ( 0,-1) ( 1, 0) ( 1, 0) ( 0, 1)

function hilbert_curve(x,y,level,length,draw_loc,cxt){
	// returns when level is 0
	if(level <= 0) return;
	// call sub-curve (-y,-x)
	hilbert_curve(-y,-x,level-1,length,draw_loc,cxt);
	// draw connection line (opposite to current curve direction)
	draw_line(-x,y,length,draw_loc,cxt);
	// call sub-curve ( x, y)
	hilbert_curve(x,y,level-1,length,draw_loc,cxt);
	// draw connection line (perpendicular to current curve direction)
	draw_line(y,-x,length,draw_loc,cxt);
	// call sub-curve ( x, y)
	hilbert_curve(x,y,level-1,length,draw_loc,cxt);
	// draw connection line (same as current curve direction)
	draw_line(x,-y,length,draw_loc,cxt);
	// call sub-curve ( y, x)
	hilbert_curve(y,x,level-1,length,draw_loc,cxt);
};

// Line drawing function
// a - (-1/0/1) indicator for vertical/horizontal line.
//     zero = horizontal line, 'a' value not used.
//     -1/1 = vertical line, 'a' used as modifier for width
// b - (-1/0/1) modifier for vertical lines, not used if horizontal. 
//
// ----Mapping----
//(same as curve directions)
// --------( a, b)
// Up -----( 0, 1)
// Down ---( 0,-1)
// Left ---(-1, ~) (b not used)
// Right --( 1, ~) (b not used)
function draw_line(a,b,length,draw_loc,cxt){
	
	if(type == 'Lines'){
	
		// rectangle / line drawing
		
		// width is 1 for vertical lines, +/- length for horizontal lines
		var width = a==0 ? 1 : length * a;
		// height is +/- length for vertical lines, 1 for horizontal lines
		var height = a==0 ? length * b: 1;
		
		// draw the line
		cxt.fillRect(draw_loc.column,draw_loc.row,width,height);
		
		// update draw location based on direction
		if(a==0)
			draw_loc.row += height;
		else
			draw_loc.column += width;
		
	}
	
	if(type == 'Pixels'){
		// pixel drawing
		// Will cause odd image offset issues at higher levels due to non-integer side lengths
		
		// Loop over the line length
		for(i=0;i<length;i++){
			// draw a pixel
			cxt.fillRect(draw_loc.column,draw_loc.row,1,1);
			
			// update draw location based on direction
			if(a==0) 
				draw_loc.row += b;
			else 
				draw_loc.column += a;
		}
	}
	
	// Just for fun 
	if(type == 'Polygon'){
		
		if(a==0)
			draw_loc.row += length * b;
		else
			draw_loc.column += length * a;
		
		cxt.lineTo(draw_loc.column,draw_loc.row);
		console.log('lineTo: ', draw_loc.row,draw_loc.column);
	}
};
});