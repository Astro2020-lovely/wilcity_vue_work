import ToggleLoadingBtn from './ToggleLoadingBtn.js'
import AddListingData from './AddListingData.js'

export default class WilokeDirectBankTransfer{
	constructor($btn){
		this.$btn = $btn;
		if ( $btn.length ) {
			this.xhr = null;
			this.oData = {
				action: 'wiloke_submission_pay_with_directbanktransfer'
			};
		}
	}

	proceed(){
		let oGetDynamicData = AddListingData.configuration();
		oGetDynamicData = Object.assign(this.oData, oGetDynamicData);

		this.xhr = jQuery.ajax({
			type: 'POST',
			data: oGetDynamicData,
			url: WILOKE_GLOBAL.ajaxurl,
			success: (response=>{
				if ( response.success ){
					if ( typeof response.data.redirectTo !== 'undefined' ){
						window.location.href = response.data.redirectTo;
					}
				}else{
					jQuery('#wilcity-print-msg').trigger('printErrMsg', [response.data.msg]);
				}
				new ToggleLoadingBtn(this.$btn);
			})
		})
	}

	pay(){
		this.$btn.on('click', ((event)=>{
			event.preventDefault();
			jQuery('#wilcity-print-msg').addClass('hidden');
			new ToggleLoadingBtn(this.$btn);

			if ( this.xhr !== null && this.xhr.status !== 200 ){
				this.xhr.abort();
			}

			this.proceed();
		}));
	}
}
