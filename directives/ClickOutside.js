export const ClickOutside = {
    priority: 700,
    bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
            if (!(el === event.target || el.contains(event.target))) { // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },

    unbind: function (el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
    }
};
