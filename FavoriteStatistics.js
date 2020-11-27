import WilCityHelpers from './helpers.js';
(function ($) {
	'use strict';

	function printLikedClassToLikedItem(){
		if( WILOKE_INLINE_GLOBAL.isUserLoggedIn === 'no' ){
			return false;
		}

		fetch(WilCityHelpers.buildRestRequest('users/'+WILOKE_INLINE_GLOBAL.userID + '/liked'))
			.then(response => response.json())
			.then(response=>{
				if ( WilCityHelpers.isRestError(response) ){
					WilCityHelpers.consoleInternalMessage(response);
				}else{
					let aItems = Object.values(response.data);
					let activeClass = '';
					let deactiveClass = '';

					for ( let i = 0; i < aItems.length; i++ ){
						let $target = $('.'+WHITE_LABEL+'-js-favorite[data-post-id="'+aItems[i]+'"]');
						if ( !$target.length ){
							continue;
						}

						$target.each(function(){
							let $icon = $(this).find('.la');

							if ( $(this).hasClass('is-event') ){
								activeClass = 'la-star';
								deactiveClass = 'la-star-o';
							}else{
								activeClass = 'la-heart';
								deactiveClass = 'la-heart-o';
							}

							$icon.removeClass(deactiveClass);
							$icon.addClass(activeClass);
							$icon.addClass('color-primary');
						});
					}
				}
			});
	}

	$.fn.wilcityFavoriteStatistic = function () {
		let $this = $(this);
		let postID = $this.data('postId'),
			activeClass = '',
			deactiveClass = '';

		postID = postID.toString();

		$this.on('click', function (event) {
			$this.prop('disabled', true);
			event.preventDefault();

			if( WILOKE_INLINE_GLOBAL.isUserLoggedIn === 'no' ){
				jQuery('body').trigger('onOpenLoginRegisterPopup');
				return false;
			}
			$this.closest('.js-listing-module, .'+WHITE_LABEL+'-single-tool-favorite, .event-detail-content_header__VdI5m, .js-event').find('.'+WHITE_LABEL+'-js-favorite').each(function(){
				let $self = $(this), $la = $self.find('i');

				if ( $self.hasClass('is-event') ){
					activeClass = 'la-star';
					deactiveClass = 'la-star-o';
				}else{
					activeClass = 'la-heart';
					deactiveClass = 'la-heart-o';
				}

				if ( $la.hasClass('color-primary') ){
					$la.removeClass(activeClass);
					$la.addClass(deactiveClass);
					$la.removeClass('color-primary');
				}else{
					$la.removeClass(deactiveClass);
					$la.addClass(activeClass);
					$la.addClass('color-primary');
				}
			});

			jQuery.ajax({
				type: 'POST',
				url: WILOKE_GLOBAL.ajaxurl,
				data: {
					action: 'wilcity_favorite_statistics',
					postID: postID
				}
			})
		})
	};

	$(document).ready(function () {
		if ( typeof WILCITY_GLOBAL !== 'undefined' ){
			$('.'+WHITE_LABEL+'-js-favorite').each(function () {
				$(this).wilcityFavoriteStatistic();
			});
		}
	});

	$(window).load(function(){
		printLikedClassToLikedItem();
	});
})(jQuery);