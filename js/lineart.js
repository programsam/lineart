var left = 0;
var mytop = 0;
var maxwidth = 0;
var maxheight = 0;
var canvas, clock;
var direction;
var circle;

$(document).ready(function(){
	
	maxwidth = $('#mainCanvas').parent().width();
	maxheight = $(document).height() - 80;
	
	canvas = new fabric.StaticCanvas('mainCanvas', 
			{ width: maxwidth,
			  height: maxheight
			});
	
	left = maxwidth / 2;
	mytop = maxheight / 2;
	
	circle = new fabric.Circle({left:left, top:mytop, radius: 3})
	canvas.add(circle)

	$('#stop').click(stopDrawing)
	$('#clear').click(clearDrawing)
	$('#start').click(startDrawing)
	
	$('#speed').slider({reversed: true});
	$('#length').slider({});
});

function clearDrawing(e) {
	canvas.clear();
}

function stopDrawing(e) {
	clearInterval(clock);
	clock = null;
}

function startDrawing(e) {
	if (clock == null)
	{
		clock = setInterval(nextLine, $("#speed")[0].value)
	}
}

function nextLine() {
	
	var doublebacks = $("#doublebacks")[0].checked
	var repeats = $("#repeats")[0].checked

	var repeatsOK = false;
	var doublebacksOK = false;
	var previousDirection = direction;
	var length = 0;
	while (! repeatsOK || ! doublebacksOK || ! endOK)
	{
		repeatsOK = false;
		doublebacksOK = false;
		endOK = false;
		
		direction = randomWithRange(0,4)
		length = randomWithRange(0,$("#length")[0].value)
		
		if (repeats)
		{
			repeatsOK = true;
		}
		else //repeats not allowed
		{
			if (direction != previousDirection)
				repeatsOK = true
		}
		
		if (doublebacks)
		{
			doublebacksOK = true;
		}
		else
		{
			doublebacksOK = true;
			if (direction == 0 && previousDirection == 2)
				doublebacksOK = false;
			if (direction == 2 && previousDirection == 0)
				doublebacksOK = false;
			if (direction == 1 && previousDirection == 3)
				doublebacksOK = false;
			if (direction == 3 && previousDirection == 1)
				doublebacksOK = false;
		}
		
		if ((direction == 0) && (left + length < maxwidth))
			endOK = true;
		else if ((direction == 1) && (mytop + length < maxheight))
			endOK = true;
		else if ((direction == 2) && (left - length > 0))
			endOK = true;
		else if ((direction == 3) && (mytop - length > 0))
			endOK = true;
	}

	var x = 0;
	var y = 0;
	
	if (direction == 0) //left to right
	{
		x = left + length;
		y = mytop;
	}
	else if (direction == 1) //top to bottom
	{
		x = left;
		y = mytop + length;
	}
	else if (direction == 2) //right to left
	{
		x = left - length;
		y = mytop;
	}
	else if (direction == 3) //bottom to top
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
	
	circle.setLeft(left);
	circle.setTop(mytop);
	
	canvas.renderAll();
}


function randomWithRange(min, max)
{
	var randomPart = Math.random() * max;
	
	return Math.floor(min+randomPart);
}