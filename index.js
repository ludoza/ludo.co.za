function stars() {
	// credit: https://jsfiddle.net/psullivan6/ma6e78m0/
	var $galaxy = $(".galaxy");
	var iterator = 0;
	while (iterator <= 100) {
		var xposition = Math.random();
		var yposition = Math.random();
		var star_type = Math.floor((Math.random() * 3) + 1);
		var position = {
			"x": $galaxy.width() * xposition,
			"y": $galaxy.height() * yposition,
		};
		$('<div class="star star-type' + star_type + '"></div>').appendTo($galaxy).css({
			"top": position.y,
			"left": position.x
		});
		iterator++;
	}
}
function resize() {
	$(window).resize(function() {
		var bodyheight = $(this).height();
		var bodywidth = $(this).width();
		$(".galaxy").height(bodyheight);
		$(".galaxy").width(bodywidth);
		$(".girl").height(bodyheight);
	}).resize();
}
function show() {
	$(".hide").css('display', 'block');
}
$(document).ready(function() {
	console.log('Why you looking at the code, it is very simple...');
	resize();
	stars();
	show();
})
