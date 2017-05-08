var left = 0;
var mytop = 0;
var maxwidth = 0;
var maxheight = 0;
var canvas;

$(document).ready(function(){
	
	maxwidth = $('#mainCanvas').parent().width();
	maxheight = $(document).height() - 80;
	
	canvas = new fabric.Canvas('mainCanvas', 
			{ width: maxwidth,
			  height: maxheight
			});
	
	left = maxwidth / 2;
	mytop = maxheight / 2;

	setInterval(nextLine, 0)
	
});

function nextLine() {
	
	var direction = randomWithRange(0,4)
	var length = randomWithRange(0,80)
	var x = 0;
	var y = 0;
	
	if ((direction == 0) && (left + length < maxwidth)) //left to right
	{
		x = left + length;
		y = mytop;
	}
	else if ((direction == 1) && (mytop + length < maxheight)) //top to bottom
	{
		x = left;
		y = mytop + length;
	}
	else if ((direction == 2) && (left - length > 0)) //right to left
	{
		x = left - length;
		y = mytop;
	}
	else if ((direction == 3) && (mytop - length > 0)) //left to right
	{
		x = left;
		y = mytop - length;
	}
	else
	{
		x = left;
		y = mytop;
	}
	
	canvas.add(new fabric.Line([left,mytop,x,y], 
			 {
		        stroke: 'black',
		        strokeWidth: 1
		    }));
	
	canvas.renderAll();
	
	if ((direction == 0) && (left + length < maxwidth)) // left to right
	{
		left = left + length;
	}
	else if ((direction == 1) && (mytop + length < maxheight)) //top to bottom
	{
		mytop = mytop + length;
	}
	else if ((direction == 2) && (left - length > 0)) //right to left
	{
		left = left - length;
	}
	else if ((direction == 3) && (mytop - length > 0)) //left to right
	{
		mytop = mytop - length;
	}
}


function randomWithRange(min, max)
{
	var randomPart = Math.random() * max;
	
	return Math.floor(min+randomPart);
}