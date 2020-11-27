export const WilFocus = {
    inserted: function (el, binding) { // Ta gán focus vào phần tử đó
        if (binding.value === false) {
            return false;
        }
        el.focus();
    }
}
