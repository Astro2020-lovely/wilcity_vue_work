export const MyFavorite = {
    bind(el, binding, vnode) {
        el.addEventListener('click', (event) => {
            event.preventDefault();
            vnode.context[binding.value.icon]();
            const postID = binding.value.postID;

            if (WILOKE_INLINE_GLOBAL.isUserLoggedIn === 'no') {
                jQuery('body').trigger('onOpenLoginRegisterPopup');
                return false;
            }

            jQuery.ajax({
                type: 'POST',
                url: WILOKE_GLOBAL.ajaxurl,
                data: {
                    action: 'wilcity_favorite_statistics',
                    postID: postID
                }
            });
        });
    }
};
