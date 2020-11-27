export default function (items, needleKey, excludes) {
    if (! excludes.length) {
        return items;
    }

    return items.filter(item => ! excludes.includes(item[needleKey]));
}
