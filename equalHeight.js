export default function equalHeight($target) {
    let $wilcityGrid = $target ? jQuery('.' + WHITE_LABEL + '-grid') : $target;
    if ($wilcityGrid.length) {
        $wilcityGrid.each(function () {
            let $this = jQuery(this),
                isTab = false;
            if ($this.parent().hasClass('wil-tab__panel') || $this.parent().hasClass('vc_tta-panel-body')) {
                isTab = true;

                if (! $this.parent().hasClass('active') || ($this.parent().hasClass('vc_tta-panel-body') && ! $this.parent().parent().hasClass('vc_active'))) {
                    return;
                }
            }
            let highestBody = 0,
                highestFooter = 0;
            let $jsModule = $this.find('.js-grid-item, .js-event');

            if ($jsModule.length > 1) {
                if (! $this.data('highestBody')) {
                    $jsModule.each(function () {
                        if (highestBody < jQuery(this).find('.js-grid-item-body').outerHeight()) {
                            highestBody = jQuery(this).find('.js-grid-item-body').outerHeight();
                        }

                        if (highestFooter < jQuery(this).find('.js-grid-item-footer').outerHeight()) {
                            highestFooter = jQuery(this).find('.js-grid-item-footer').outerHeight();
                        }
                    });

                    $this.data('highestBody', highestBody);
                    $this.data('highestFooter', highestFooter);
                } else {
                    highestBody = $wilcityGrid.data('highestBody');
                    highestFooter = $wilcityGrid.data('highestFooter');
                }
                $jsModule.find('.js-grid-item-body').css({'height': highestBody});
                $jsModule.find('.js-grid-item-footer').css({'height': highestFooter});

                if (isTab) {
                    $this.parent().data('calculatedHeight', true);
                }
            }
        })
    }
}
