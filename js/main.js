        $(document).ready(function() {
    var over = "64px";
    var out = "48px";
    $(".hover").mouseover(function() {
        $(this).animate({ width: over , height: over  }, "fast");
    }).mouseout(function() {
        $(this).animate({ width: out, height: out }, "fast");    
    });
	  });