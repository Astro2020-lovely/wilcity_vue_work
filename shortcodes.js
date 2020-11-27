(function ($) {
	'use strict';

	$.fn.wilcityInitMagnific = function () {
		$(this).find('.'+WHITE_LABEL+'-magnific-via-jquery').each(function () {
			$(this).removeData('magnificPopup');
			$(this).magnificPopup({
				delegate: 'a',
				gallery: {
					enabled: true
				},
				type: 'image' // this is default type
			});
		});
	};

	function copyPostLink() {
		$(document).on('click', '.'+WHITE_LABEL+'-copy-link', function () {
			window.prompt($(this).data('desc'), $(this).data('shortlink'));
		});
	}

	function countShared() {
		$('[data-toggle-content="share"]').on('click', '.'+WHITE_LABEL+'-social-sharing', function () {
			var postID = $(this).closest('.'+WHITE_LABEL+'-social-sharing-wrapper').data('postid');
			$.ajax({
				type: 'POST',
				url: WILOKE_GLOBAL.ajaxurl,
				data: {
					action: 'wilcity_count_shares',
					postID: postID
				},
				success: (response=>{
					if ( typeof response.data.countShared !== 'undefined' ){
						$('.'+WHITE_LABEL+'-count-shared-'+postID).html(response.data.countShared + ' ' + response.data.text);
					}
				})
			})
		});
	}

	$(document).ready(function () {
		$('.'+WHITE_LABEL+'-magnific-wrapper').each(function () {
			$(this).wilcityInitMagnific();
		});
		copyPostLink();
		countShared();
	});

})(jQuery);