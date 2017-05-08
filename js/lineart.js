var left = 0;
var mytop = 0;
var maxwidth = 0;
var maxheight = 0;
var canvas, clock;
var direction;
var circle;

var colors = ["red","green","blue","purple","black","pink","orange","gray"]

$(document).ready(function(){
	
	maxwidth = $('#mainCanvas').parent().width();
	maxheight = $(document).height() - 20;
	
	canvas = new fabric.StaticCanvas('mainCanvas', 
			{ width: maxwidth,
			  height: maxheight
			});
	
	left = maxwidth / 2;
	mytop = maxheight / 2;
	
	if ($("#cursor")[0].checked)
	{
		circle = new fabric.Circle({left:left, top:mytop, radius: 3})
		canvas.add(circle)
	}

	$('#stop').click(stopDrawing)
	$('#clear').click(clearDrawing)
	$('#start').click(startDrawing)
	$('#cursor').click(startCursor)
	$('#jump').click(jumpCursor)
	
	$('#speed').slider({reversed: true});
	$('#length').slider({});
	$('#jumpiness').slider({});
});

function jumpCursor(e) {
	left = randomWithRange(0, maxwidth);
	mytop = randomWithRange(0, maxheight);
}

function clearDrawing(e) {
	canvas.clear();
	left = maxwidth / 2;
	mytop = maxheight / 2;
	if ($("#cursor")[0].checked)
	{
		circle = new fabric.Circle({left:left, top:mytop, radius: 3})
		canvas.add(circle)
	}
}

function startCursor(e)
{
	if ($("#cursor")[0].checked)
	{
		circle = new fabric.Circle({left:left, top:mytop, radius: 3})
		canvas.add(circle);
	}
	else
	{
		canvas.remove(circle);
		circle = null;
	}
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
	
	var jumpOrNot = randomWithRange(0,1000)
	if (jumpOrNot < $("#jumpiness")[0].value)
	{
			left = randomWithRange(0, maxwidth);
			mytop = randomWithRange(0, maxheight);
	}
	
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
		var minlength = parseInt($("#length")[0].value.split(",")[0])
		var maxlength = parseInt($("#length")[0].value.split(",")[1])
		length = randomWithRange(minlength, maxlength)
		
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
	
	var color = "black";
	if ($("#colors")[0].checked)
	{
		var colorindex = randomWithRange(0, colors.length)
		color = colors[colorindex]
	}
	
	canvas.add(new fabric.Line([left,mytop,x,y], 
			 {
		        stroke: color,
		        strokeWidth: 1
		    }));
	
//	canvas.renderAll();
	
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
	
	if ($("#cursor")[0].checked)
	{
		circle.setLeft(left);
		circle.setTop(mytop);
		canvas.renderAll();
	}
}

//create a Mersenne Twister-19937 that is auto-seeded based on time and other random values
var engine
var distribution;
var prevMin, prevMax;
function randomWithRange(min, max)
{
	var randomness = $("#randomness")[0].value
	if (randomness == "0")
	{
		if (! engine)
			engine = Random.engines.browserCrypto
		if (! distribution || min != prevMin || max != prevMax)
		{
			distribution = Random.integer(min, max);
			prevMin = min;
			prevMax = max;
		}
		return distribution(engine)
	}
	else if (randomness == "1")
	{
		if (! engine)
			 engine = Random.engines.mt19937().autoSeed();
		
		if (! distribution || min != prevMin || max != prevMax)
		{
			distribution = Random.integer(min, max);
			prevMin = min;
			prevMax = max;
		}
		return distribution(engine)
	}
	else if (randomness == "2")
	{
		var randomPart = Math.random() * max;
		return Math.floor(min+randomPart);
	}
	
}