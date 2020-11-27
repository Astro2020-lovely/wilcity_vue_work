/**
 * Created by pirates on 2/7/18.
 */
export default class PayAndPublish{
	constructor($btn){
		this.$btn = $btn;
		this.submit();
	}

	submit(){
		this.$btn.on('click', (event=>{
			event.preventDefault();

			$.ajax({
				type: 'POST',
				data: {
					action: 'wilcity_get_pay_and_publish_url'
				},
				url: WILOKE_GLOBAL.ajaxurl,
				success: function (response) {
					if ( response.success ){
						window.location.href = response.data.redirectTo;
					}else{
						alert(response.data.msg);
					}
				}
			})
		}))
	}
}