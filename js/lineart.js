$(document).ready(function(){
	// create a wrapper around native canvas element (with id="c")
	var canvas = new fabric.Canvas('mainCanvas', 
			{ width: $('#mainCanvas').parent().width()
			, height: $(document).height()
			});
	
	// "add" rectangle onto canvas
	canvas.add(new fabric.Line([0,0,100,0], 
	 {
        stroke: 'red',
        strokeWidth: 3
    }));
});

/**
 * fabric.Line([startLeft, startTop, finishLeft, finishTop]
 */

function addLine(canvas, left, top, direction, length, width)
{
	
}

function randomWithRange(min, max)
{
	var randomPart = Math.random() * max;
	
	return Math.floor(min+randomPart);
}