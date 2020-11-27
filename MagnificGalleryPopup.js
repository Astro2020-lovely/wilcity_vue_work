(function($) {
  'use strict';

  $.fn.wilcityMagnificGalleryPopup = function() {
    var $this = $(this);
    $this.removeData('magnificPopup');
    var gallery = $this.data('gallery');
    if (typeof gallery === 'undefined' || gallery === '') {
      return false;
    }

    var aRawGallery = gallery.split(',');
    var aGallery = [];

    for (var i = 0; i < aRawGallery.length; i++) {
      aGallery.push({
        src: aRawGallery[i]
      });
    }

    $this.magnificPopup({
      items: aGallery,
      gallery: {
        enabled: true
      },
      type: 'image' // this is default type
    });
  };

  $(document).ready(function() {
    $('.' + WHITE_LABEL + '-preview-gallery').each(function() {
      $(this).wilcityMagnificGalleryPopup();
    });
  });

})(jQuery);
