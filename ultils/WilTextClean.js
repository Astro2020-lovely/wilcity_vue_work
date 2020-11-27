export const wilTextClean = {
    clean(text) {
        return text.replace('<!-- wp:paragraph -->', '').replace('<!-- /wp:paragraph -->', '');
    }
}
