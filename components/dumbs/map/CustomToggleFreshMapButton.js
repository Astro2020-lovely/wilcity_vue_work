export const CustomToggleFreshMapButton = function (controlDiv, btnName) {
    let controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    // controlUI.style.left = '20px';
    controlUI.style.textAlign = 'center';

    controlDiv.appendChild(controlUI);

    let label = document.createElement('label');
    label.setAttribute('for', 'wilcity-map-auto-refresh-checkbox');
    label.setAttribute('class', 'wilcity-wrapper-map-auto-refresh-checkbox');

    let toggleMapRefreshCheckbox = document.createElement('INPUT');
    toggleMapRefreshCheckbox.type = 'checkbox';
    toggleMapRefreshCheckbox.setAttribute('id', 'wilcity-map-auto-refresh-checkbox');
    toggleMapRefreshCheckbox.setAttribute('checked', true);

    let wrapperSpan = document.createElement('small');
    wrapperSpan.setAttribute('class', 'wrapper-small');

    let span = document.createElement('span');
    span.innerHTML = btnName;
    wrapperSpan.appendChild(span);

    label.appendChild(toggleMapRefreshCheckbox);
    label.appendChild(wrapperSpan);

    controlUI.appendChild(label);

    toggleMapRefreshCheckbox.addEventListener('change', (event) => {
        let isChecked = jQuery(event.target).is(':checked');
        this.handling(isChecked);
    })
}

CustomToggleFreshMapButton.prototype.handling = function (isChecked) {};
