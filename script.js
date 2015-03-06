$(function(){
// image initialization.
var a_canvas = document.getElementById("a");
var context = a_canvas.getContext("2d");


// on click event handler
$('#draw').on('click', function(){
	
	// get parameters from the page
	var level = parseInt($('#level').val());
	var size = parseInt($('#size').val());
	var offset = parseInt($('#offset').val());
	
	// set image options and clear
	a_canvas.width = size;
	a_canvas.height = size;
	context.fillStyle = 'black';
	context.clearRect(0,0,a_canvas.width,a_canvas.height);
	
	
	// calculate side length
	var line_length = (size-(offset*2))/(Math.pow(2,level)-1);
	
	// initialize draw location pass-by-reference object.
	var draw_location = {
		row: offset,
		column: offset
	};
	
	//console.log(level,size,offset,line_length, draw_location);
	//console.log(line_length);
	
	// start recursion
	hilbert_curve(0,1,level,line_length,draw_location,context);
	
	//console.log(draw_location);
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
// Left ---(-1, 0) -- ( 0, 1) (-1, 0) (-1, 0) ( 0,-1)
// Right --( 1, 0) -- ( 0,-1) ( 1, 0) ( 1, 0) ( 0, 1)
// Down ---( 0,-1) -- ( 1, 0) ( 0,-1) ( 0,-1) (-1, 0)

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
// Left ---(-1, ~) (b not used)
// Right --( 1, ~) (b not used)
// Down ---( 0,-1)
function draw_line(a,b,length,draw_loc,cxt){
	
	// Use when rectangle / line drawing is possible
	
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
	
	/*
	
	// Use when only pixel drawing is possible
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
	*/
};
});