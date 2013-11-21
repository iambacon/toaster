Toaster
=======

A jQuery UI widget using CSS transitions with a jQuery animate fallback.

##Demo

If you want to see toaster in action

[Demo][ref1]

##Getting started

Toaster depends on jQuery(1.8+), jQuery UI(1.8+) and [transition helper][ref2]

Include these dependencies and the toaster widget files to your page.

	<!-- Basic stylesheet -->
	<link rel="stylesheet" href="toaster/src/css/cb.toaster.css">

	<!-- Include js widget -->
	<script src="toaster/src/js/jquery.cb.toaster.js"></script>

##HTML

All you need is a list and a data attribute and you're done.

`data-cb-toaster-title` - Holds the display title for the slide.

	<ol class="toaster">
		<li class="cb-toaster-item" data-cb-toaster-title="Slide 1">			
			<!-- Your content here -->
		</li>
		<li class="cb-toaster-item" data-cb-toaster-title="Slide 2">			
			<!-- Your content here -->
		</li>
		<li class="cb-toaster-item" data-cb-toaster-title="Slide 3">			
			<!-- Your content here -->
		</li>
		<li class="cb-toaster-item" data-cb-toaster-title="Slide 4">			
			<!-- Your content here -->
		</li>
	</ol>

##And finally

Initialise the plugin by calling:

	$('.toaster').toaster();

**Instant achievement!**


[ref1]:http://demo.iambacon.co.uk/toaster/demo
[ref2]:https://github.com/iambacon/transition-helper