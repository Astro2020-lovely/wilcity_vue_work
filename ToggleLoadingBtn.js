export default class{
	constructor($button){
		if ( $button.length ){
			this.$btn = $button;
			this.toggle();
		}
	}

	toggle(){
		if ( this.$btn.hasClass('wil-btn--loading') ){
			this.$btn.find('.pill-loading_module__3LZ6v').addClass('hidden');
			this.$btn.removeClass('wil-btn--loading');
		}else{
			this.$btn.addClass('wil-btn--loading');
			if ( !this.$btn.find('.pill-loading_module__3LZ6v').length ){
				this.$btn.append('<div class="pill-loading_module__3LZ6v"><div class="pill-loading_loader__3LOnT"></div></div>');
			}else{
				this.$btn.find('.pill-loading_module__3LZ6v').removeClass('hidden');
			}
		}
	}
}