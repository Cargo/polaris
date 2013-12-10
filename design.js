/**
 * Polaris
 */

var Design = {
	hoverProject: function() {
		// Thumbnail hover
		$(".thumbnails")
			.on("mouseenter", ".project_thumb", function(e) {
				$(".project_link[data-id='" + $(this).attr("data-id") +"'] a").addClass("hover");
			})
			.on("mouseleave", ".project_thumb", function(e) {
				$(".project_link[data-id='" + $(this).attr("data-id") +"'] a").removeClass("hover");
			});

		// Navigation
		$(".navigation")
			.on("mouseenter", ".project_link a", function(e) {
				$(".project_thumb[data-id='" + $(this).closest('.project_link').attr("data-id") +"']").addClass("hover");
			})
			.on("mouseleave", ".project_link a", function(e) {
				$(".project_thumb[data-id='" + $(this).closest('.project_link').attr("data-id") +"']").removeClass("hover");
			});
	},

	checkNavigationHeight: function() {
		var navigation = $(".navigation");
		if (navigation.length > 0) {
			if (navigation.height() + navigation.position().top > $(window).height()) {
				if (!navigation.hasClass("scroll")) {
					navigation.add(".site_header").removeClass("fixed").addClass("scroll");
				}
			} else {
				if (!navigation.hasClass("fixed")) {
					navigation.add(".site_header").removeClass("scroll").addClass("fixed");
				}
			}
		}
	},

	checkSetVisibility: function() {
		// Find the active set based on the project ID
		var parentSet = $("[data-setid='" + Cargo.Model.Project.GetSetId() + "']"),
			otherSets = $("[data-setid]").not(parentSet);

		// If the set exists, set active/inactive
		if (parentSet.length > 0) {
			otherSets.removeClass("active").addClass("inactive");
			parentSet.removeClass("inactive").addClass("active");

			// Show the footer link
			$(".set_footer").show();
		} else {
			$(".set_footer").hide();
		}
	},

	checkSetSpacing: function() {
		$(".set_link").removeClass("first-set last-set spacer");

		var first_set = $(".set_link:first"),
			last_set = $(".set_link:last");

		first_set.addClass("first-set");
		last_set.addClass("last-set");

		if (Cargo.Model.DisplayOptions.attributes.use_set_links) {
			var setLinksPosition = Cargo.Model.DisplayOptions.GetSetLinksPosition();

			if (first_set.attr("id") == last_set.attr("id")) {
				// Only one set
				if (setLinksPosition == "top") {
					last_set.addClass("spacer").removeClass("first-set");
				} else if (setLinksPosition == "bottom") {
					first_set.addClass("spacer");
				}
			} else {
				if (setLinksPosition == "top") {
					last_set.addClass("spacer");
				} else if (setLinksPosition == "bottom") {
					first_set.add(last_set).addClass("spacer");
				}
			}
		}
	}
};

/**
 * Events
 */

$(function() {
	Cargo.Core.ReplaceLoadingAnims.init();

	Cargo.Core.KeyboardShortcut.Add("Left", 37, function() {
		Action.Project.Prev();
		return false;
	});

	Cargo.Core.KeyboardShortcut.Add("Right", 39, function() {
		Action.Project.Next();
		return false;
	});

	Design.hoverProject();
	Design.checkSetSpacing();
	Design.checkNavigationHeight();
});

// Window Resize
$(window).resize(function() {
	Design.checkNavigationHeight();
});

// Project Load Complete
Cargo.Event.on("project_load_complete", function(pid) {
	Design.checkSetVisibility();

	/**
	 *   Move the project navigation if the default image widht is > 670px.
	 *   This is a quick fix and needs some refinement.
	 */
	
	var defaultImageWidth = parseInt(Cargo.Model.DisplayOptions.GetImageWidth());

	if (defaultImageWidth < 670) {
		defaultImageWidth = 670;
	}

	defaultImageWidth += 305;

	$(".project_navigation").css("left", defaultImageWidth + "px");
});

// Project Close Complete
Cargo.Event.on("show_index_complete", function(pid) {
	setTimeout(function() {
		// Reset sets
		$("[data-setid]").removeClass("active inactive");
		$(".set_footer").hide();
	}, 20);
});

Cargo.Event.on("navigation_reset", function(new_page) {
	Design.checkSetSpacing();
});

Cargo.Event.on("navigation_set_toggle", function() {
	Design.checkNavigationHeight();
});

// Pagination
Cargo.Event.on("pagination_complete", function(new_page) {
	Design.checkSetVisibility();
	Design.checkSetSpacing();
	window.setTimeout(function() {
		Design.checkNavigationHeight();
	}, 10);
});

/**
 * Typography
 */

WebFontConfig = {
	google: { families: ["Istok+Web:400,700,400italic,700italic:latin"] }
};

(function() {
	var wf = document.createElement("script");
	wf.src = ("https:" == document.location.protocol ? "https" : "http") + "://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
	wf.type = "text/javascript";
	wf.async = "true";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(wf, s);
})();
