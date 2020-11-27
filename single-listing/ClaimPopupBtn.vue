<template>
    <a :class="wrapperClass" href="#" @click.prevent="onOpenClaimPopup"><slot name="insideBtn"></slot></a>
</template>
<script>
    export default{
        props: {
            wrapperClass: {
                type: String,
                default: 'wil-btn wil-btn--dark wil-btn--sm wil-btn--round'
            },
            targetId: {
                type: String,
                default: ''
            }
        },
        methods:{
            onOpenClaimPopup(){
                if ( WILOKE_INLINE_GLOBAL.isUserLoggedIn !== 'yes' ){
					this.$store.commit('updatePopupStatus', {
						id: 'signin-popup',
						status: 'open'
					});
				}else{
					this.$store.commit('updatePopupStatus', {
						id: 'claim-popup',
						status: 'open'
					});
				}
            }
        }
    }
</script>
