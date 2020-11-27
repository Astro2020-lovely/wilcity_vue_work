export default class General{
	textUpWhenFocusOn($){
		let $textField = $('body').find('input[type="text"], textarea, input[type="email"], input[type="url"]');

		$textField.each(function () {
			let $this = $(this);
			if ( $this.val() !=='' ){
				$this.closest('.js-field').addClass('active');
			}
		});

		$textField.on('focus', function (event) {
			$(event.currentTarget).closest('.js-field').addClass('active');
		}).on('blur', function (event) {
			if ( $(event.currentTarget).val() === '' ){
				$(event.currentTarget).closest('.js-field').removeClass('active');
			}
		})
	}

	constructor(){
		this.textUpWhenFocusOn(jQuery);
	}
}