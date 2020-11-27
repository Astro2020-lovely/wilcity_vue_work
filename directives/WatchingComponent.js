export const WatchingComponent = {
    bind(el, binding, vnode) {
        setTimeout(() => {
            let args;
            if (binding.value.intersectionArgs) {
                args = {
                    ...binding.value.intersectionArgs
                };
            }
            const observer = new IntersectionObserver(entries => {
                if (entries[0].intersectionRatio > 0) {
                    vnode.context[binding.value.setTo](binding.value.key); // Telling component that he is in view
                }
            }, args);
            observer.observe(el);
        }, 0);
    }
};
