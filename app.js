'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor)
                descriptor.writable = true;



            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps)
            defineProperties(Constructor.prototype, protoProps);



        if (staticProps)
            defineProperties(Constructor, staticProps);



        return Constructor;
    };
}();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}(function ($) {
    "use strict";

    var oSwipersStore = {};
    function swiperSlider(self) {
        var wrapper = $('.swiper-wrapper', self),
            optData = self.data('options'),
            optDefault = {
                pagination: {
                    el: self.find('.swiper-pagination-custom'),
                    Clickable: true
                },
                navigation: {
                    nextEl: self.find('.swiper-button-next-custom'),
                    prevEl: self.find('.swiper-button-prev-custom')
                },
                spaceBetween: 30,
                preloadImages: wrapper.data('lazyLoad') == 1,
                lazy: wrapper.data('lazyLoad') == 1
            };
        if (typeof optData !== 'undefined') {
            var options = $.extend(optDefault, optData);
            wrapper.children().wrap('<div class="swiper-slide"></div>');
            var swiper = new Swiper(self, options);
            if (typeof self.attr('id') !== 'undefined') {
                oSwipersStore[self.attr('id')] = swiper;
            }
        }

        self.find('.' + WHITE_LABEL + '-listing-slider').removeClass('loading');
        self.find('.wave-loading').remove();

        function thumbnails(selector) {

            if (selector.length > 0) {
                var wrapperThumbs = selector.children('.swiper-wrapper'),
                    bObj = self.data('options'),
                    optDefaultThumbs = {
                        spaceBetween: 10,
                        centeredSlides: true,
                        slidesPerView: 3,
                        touchRatio: 0.3,
                        slideToClickedSlide: true,
                        pagination: {
                            el: selector.find('.swiper-pagination-custom')
                        },
                        navigation: {
                            nextEl: selector.find('.swiper-button-next-custom'),
                            prevEl: selector.find('.swiper-button-prev-custom')
                        }
                    };

                if (typeof bObj !== 'undefined') {

                    bObj = bObj.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g, '"');

                    var optData2 = JSON.parse(bObj);
                    var optionsThumbs = $.extend(optDefaultThumbs, optData2);

                    wrapperThumbs.children().wrap('<div class="swiper-slide"></div>');
                    var swiperThumbs = new Swiper(selector, optionsThumbs);
                    swiper.controller.control = swiperThumbs;
                    swiperThumbs.controller.control = swiper;
                }
            }
        }
        thumbnails(self.next('.swiper-thumbnails__module'));
    }

    function swiperSliders() {
        $('.swiper__module').each(function () {
            swiperSlider($(this));
        });
    }

    // HTML5 Web Storages
    $(document).ready(function () {
        let $root = $('#' + WHITE_LABEL + '-root');

        window.isMobile = {
            Android: function Android() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function BlackBerry() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            Ipad: function Ipad() {
                return navigator.userAgent.match(/iPad/i);
            },
            iOS: function iOS() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function Opera() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function Windows() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function any() {
                return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
            }
        };
        window.isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
        window.windowHeight = window.innerHeight;
        window.windowWidth = window.innerWidth;
        window.wilScrollTop = function () {
            return(window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
        };

        Element.prototype.wilHasClass = function (className) {
            return this !== null && this.className.search(new RegExp("(\\s+|^)" + className + "(\\s|$)", "g")) !== -1;
        };

        Element.prototype.wilAddClass = function (className) {
            return this !== null && !this.wilHasClass(className) && (this.className += this.className === "" ? className : " " + className);
        };
        Element.prototype.wilRemoveClass = function (className) {
            return this !== null && this.wilHasClass(className) && (this.className = this.className.search(/\s/g) === -1 ? this.className.replace(new RegExp("^" + className, "g"), "") : this.className.replace(new RegExp("\\s" + className + "|^" + className + "\\s", "g"), ""));
        };
        Element.prototype.wilToggleClass = function (className) {
            return this !== null && (this.wilHasClass(className) ? this.className = this.className.search(/\s/g) === -1 ? this.className.replace(new RegExp("^" + className, "g"), "") : this.className.replace(new RegExp("\\s" + className + "|^" + className + "\\s", "g"), "") : this.className += this.className === "" ? className : " " + className);
        };
        Element.prototype.wilStyles = function (obj) {
            for (var prop in obj) {
                this.style[prop] = obj[prop];
            }
        };
        function wilEach(els, cb) {
            for (var i = 0, len = els.length; i < len; i++) {
                if (i === len)
                    break;



                cb(els[i], i);
            }
        }
        function wilExtend(obj, src) {
            if ((typeof src === "undefined" ? "undefined" : _typeof(src)) === "object") {
                wilEach(Object.keys(src), function (key) {
                    obj[key] = src[key];
                });
            }
            return obj;
        }
        function wilWrapInner(el, wrapInner) {
            var _el = [].slice.call(el.children);
            var fragment = document.createDocumentFragment();
            el.insertAdjacentHTML("afterbegin", wrapInner);
            var _wrap = el.children[0];
            for (var i = 0, len = _el.length; i < len; i++) {
                fragment.appendChild(_el[i]);
            }
            _wrap.appendChild(fragment);
        }

        var selectors = [
            'iframe[src*="player.vimeo.com"]',
            'iframe[src*="youtube.com"]',
            'iframe[src*="youtube-nocookie.com"]',
            'iframe[src*="kickstarter.com"][src*="video.html"]',
            'object',
            'embed'
        ];
        var $allVideos = $('body').find(selectors.join(','));
        $allVideos.each(function () {
            var vid = $(this),
                vidWidth = vid.outerWidth(),
                vidHeight = vid.outerHeight(),
                ratio = vidHeight / vidWidth * 100;
            $allVideos.addClass('embed-responsive-item');
            if (ratio == 75) {
                $allVideos.wrap('<div class="embed-responsive embed-responsive-4by3"></div>');
            } else {
                $allVideos.wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
            }
        });

        if ($('.wpb_column').length || $('.elementor-column-wrap').length) {
            $(window).load(function () {
                swiperSliders();
            })
        } else {
            swiperSliders();
        }

        let $tab = $('.wil-tab__nav');

        if ($tab.length) {
            $tab.each(function () {
                if (! $(this).hasClass('ignore-swipper')) {
                    const $tabItem = $(this);
                    $(this).on('click', 'a', (event => {
                        event.preventDefault();
                        const $this = $(event.currentTarget);
                        $this.closest('.wil-tab__nav').find('a').removeClass('active');
                        $this.addClass('active');

                        const $target = $($this.attr('href'));
                        const $swiperModule = $target.find('.swiper__module');
                        const $wrap = $this.closest('.wilTab_module__jlr12');

                        if ($target.length) {
                            $wrap.find('.wil-tab__panel.active').removeClass('active');
                            $target.addClass('active');
                        }

                        let isSlider = false;
                        if ($swiperModule.length) {
                            let sliderID = $swiperModule.attr('id');
                            if (typeof sliderID !== 'undefined' && typeof oSwipersStore[sliderID] !== 'undefined') {
                                oSwipersStore[sliderID].destroy();
                            }
                            swiperSlider($swiperModule);
                            isSlider = true;
                        }

                        $(document).trigger('wilTabClicked', [$target, isSlider]);
                    }));
                }
            });
        }

        window.addEventListener("load", function () {
            document.body.classList.add("page-loaded");
        });

        if (isMobile.iOS()) {
            $("body").addClass("is-mobile is-ios");
        } else if (isMobile.Ipad()) {
            $("body").addClass("is-mobile is-ipad");
        } else if (isMobile.any()) {
            $("body").addClass("is-mobile is-ios");
        }
        var headerFixedHeight = $("body").hasClass("header-no-sticky") ? 0 : 88;
        var adminBarHeight = $("body").hasClass("admin-bar") ? 32 : 0;
        /**
    * Sticky
    */
        $(".js-sticky").each(function () {
            var self = $(this);
            self.theiaStickySidebar({
                updateSidebarHeight: true,
                additionalMarginTop: (Number(self.attr("data-margin-top")) || 20) + headerFixedHeight
            });
        });

        /**
	    * Toggle
	    */

        $.fn.wilToggle = function (opt) {
            return this.each(function () {
                var self = $(this),
                    data = self.attr('data-toggle-button'),
                    optDefault = {
                        content: '[data-toggle-content]',
                        effect: false,
                        classActive: 'active',
                        minWidth: 0
                    },
                    optData = {
                        effect: self.attr('data-toggle-effect'),
                        minWidth: self.attr('data-toggle-minWidth')
                    },
                    opts = $.extend(optDefault, opt, optData);
                self.css('user-select', 'none');
                self.on('click', function (e) {
                    if (window.innerWidth >= Number(opts.minWidth)) {
                        e.preventDefault();
                        if (! self.hasClass(opts.classActive))
                            e.stopPropagation();



                        $('[data-toggle-button][data-body-toggle]').removeClass(opts.classActive);
                        if (self.attr('data-body-toggle') == 'true') {
                            self.addClass(opts.classActive);
                        } else {
                            self.toggleClass(opts.classActive);
                        }
                        $('[data-body-toggle]').siblings(opts.content).removeClass(opts.classActive);
                        if (data == self.siblings(opts.content).attr('data-toggle-content')) {
                            if (self.attr('data-body-toggle') == 'true') {
                                self.siblings(opts.content).addClass(opts.classActive);

                                var $content = self.siblings(opts.content);
                                var contentOffset = $content.offset();
                                var contentHeight = $content.height();
                                var htmlHeight = $('html').height();

                                var condition = contentOffset.top + contentHeight + 30 > htmlHeight;

                                if (condition) {
                                    $content.addClass('reverse');
                                }

                            } else {
                                self.siblings(opts.content).toggleClass(opts.classActive);
                            }
                            if (opts.effect == 'default') {
                                self.siblings(opts.content).stop().toggle(300);
                            } else if (opts.effect == 'fade') {
                                self.siblings(opts.content).stop().fadeToggle(300);
                            } else if (opts.effect == 'slide') {
                                self.siblings(opts.content).stop().slideToggle(300);
                            }
                        }
                    }
                });
                if (self.attr('data-body-toggle') == 'true') {
                    $(document).on('click', function () {
                        self.removeClass(opts.classActive);
                        if (data == self.siblings(opts.content).attr('data-toggle-content')) {
                            self.siblings(opts.content).removeClass(opts.classActive);
                        }
                    });
                    self.siblings(opts.content).on('click', function (e) {
                        e.stopPropagation();
                    });
                }
                $('.js-toggle-close').on('click', function () {
                    var close = $(this);
                    close.closest(opts.content).removeClass('active');
                    close.closest(opts.content).siblings('[data-toggle-button]').removeClass('active');
                });
            });
        };
        // $('[data-toggle-button]').wilToggle();

        var wilTooltip = function () { // variable
            var cssStart = {},
                cssEnd = {},
                o = 0,
                cst = 0,
                tooltipWidth = 0,
                tooltipHeight = 0,
                modifierClass = '--';

            // constructor
            var wilTooltip = function wilTooltip(el, opt, index) {
                this.index = index;
                this.body = $('body');
                this.el = $(el);
                this.optDefault = {
                    placement: 'top',
                    animate: false,
                    tooltipClass: 'wil-tooltip',
                    duration: 100,
                    arrow: true,
                    theme: 'default'
                };
                this.optData = {
                    tooltip: this.el.attr('data-tooltip'),
                    placement: this.el.attr('data-tooltip-placement'),
                    animate: this.el.attr('data-tooltip-animate'),
                    duration: this.el.attr('data-tooltip-duration'),
                    theme: this.el.attr('data-tooltip-theme')
                };

                this.opts = $.extend(this.optDefault, opt, this.optData);
                this.init();
            };

            // prototype
            wilTooltip.prototype = {
                init: function init() {
                    this.animated();
                    this.hover();
                },

                animated: function animated() {
                    var _this = this,
                        opts = this.opts;
                    if (opts.animate == 'default' || opts.animate == false) {
                        cst = 0;
                        opts.duration = 0;
                    } else if (opts.animate == 'fade') {
                        cst = 0;
                    } else if (opts.animate == 'fadeMove') {
                        cst = 10;
                    }
                },

                placement: function placement(w, h) {
                    var _this = this,
                        opts = this.opts;
                    if (opts.placement === 'top') {
                        cssStart['top'] = o.top - tooltipHeight - cst + 'px';
                        cssStart['left'] = o.left + (w - tooltipWidth) / 2 + 'px';
                        cssEnd['top'] = o.top - tooltipHeight + 'px';
                        cssEnd['left'] = o.left + (w - tooltipWidth) / 2 + 'px';
                    } else if (opts.placement === 'bottom') {
                        cssStart['top'] = o.top + h + cst + 'px';
                        cssStart['left'] = o.left + (w - tooltipWidth) / 2 + 'px';
                        cssEnd['top'] = o.top + h + 'px';
                        cssEnd['left'] = o.left + (w - tooltipWidth) / 2 + 'px';
                    } else if (opts.placement === 'left') {
                        cssStart['top'] = o.top + h / 2 - tooltipHeight / 2 + 'px';
                        cssStart['left'] = o.left - tooltipWidth - cst + 'px';
                        cssEnd['top'] = o.top + h / 2 - tooltipHeight / 2 + 'px';
                        cssEnd['left'] = o.left - tooltipWidth + 'px';
                    } else if (opts.placement === 'right') {
                        cssStart['top'] = o.top + h / 2 - tooltipHeight / 2 + 'px';
                        cssStart['left'] = o.left + w + cst + 'px';
                        cssEnd['top'] = o.top + h / 2 - tooltipHeight / 2 + 'px';
                        cssEnd['left'] = o.left + w + 'px';
                    }
                    cssStart['opacity'] = opts.animate == false || opts.animate == 'default' ? 1 : 0;
                    cssEnd['opacity'] = 1;
                },

                addHtml: function addHtml(body, tooltip, tooltipClass, tooltipId) {
                    if ($('.' + tooltipClass + '#' + tooltipId).length == 0)
                        body.append('\
					<div class="' + tooltipClass + '" id="' + tooltipId + '">' + tooltip + '</div>\
				');



                },

                hover: function hover() {
                    var _this = this,
                        opts = this.opts;
                    _this.el.on({
                        mouseenter: function mouseenter() {
                            var self = $(this),
                                w = self.outerWidth(),
                                h = self.outerHeight();

                            o = self.offset();

                            $(window).resize(function () {
                                o = self.offset();
                            });

                            _this.addHtml(_this.body, opts.tooltip, opts.tooltipClass, opts.tooltipClass + '-' + _this.index);

                            tooltipWidth = $('.' + opts.tooltipClass).outerWidth();
                            tooltipHeight = $('.' + opts.tooltipClass).outerHeight();

                            _this.placement(w, h);

                            $('.' + opts.tooltipClass).css(cssStart).animate(cssEnd, opts.duration).addClass(opts.tooltipClass + modifierClass + opts.placement).addClass(opts.tooltipClass + modifierClass + opts.theme);
                            if (opts.arrow == true)
                                $('.' + opts.tooltipClass).addClass(opts.tooltipClass + modifierClass + 'arrow');



                        },

                        mouseleave: function mouseleave() {
                            $('.' + opts.tooltipClass).animate(cssStart, opts.duration, function () {
                                $('#' + opts.tooltipClass + '-' + _this.index).remove();
                            });
                        }

                    });
                }
            };
            return $.fn.wilTooltip = function (opt) {
                this.each(function (index) {
                    var new_wiltooltip = new wilTooltip(this, opt, index);
                });
            };
        }();


        if (!isMobile.any()) {
            var toolId;
            $(window).on('load mousemove', function () {
                clearTimeout(toolId);
                toolId = setTimeout(function () {
                    $('[data-tooltip]').wilTooltip({animate: 'default', arrow: true});
                }, 100);
            });

            $(".wil-scroll-bar").wrapInner('<div class="wil-scroll-container"></div>');
            var scrollBars = document.querySelectorAll(".wil-scroll-bar");
            wilEach(scrollBars, function (el) {
                new PerfectScrollbar(el);
            });
        }

        var wilAnimation = function () {
            function wilAnimation(el) {
                _classCallCheck(this, wilAnimation);

                this.el = $(el);
                return this.init();
            }

            _createClass(wilAnimation, [
                {
                    key: 'init',
                    value: function init() {
                        var _this7 = this;

                        this.el.each(function (index) {

                            var self = $(_this7.el[index]);
                            var inputType = $('input[type="checkbox"], input[type="radio"]', self);

                            self.on('click', self, function () {
                                return _this7.handleClick(inputType);
                            });
                        });
                    }
                }, {
                    key: 'handleClick',
                    value: function handleClick(inputType) {
                        if (inputType['0'].checked === true) {

                            inputType.parent().addClass('checkedAnimation');
                            inputType.parent().removeClass('uncheckedAnimation');

                            setTimeout(function () {
                                inputType.parent().removeClass('checkedAnimation');
                            }, 550);
                        } else {

                            inputType.parent().addClass('uncheckedAnimation');
                            inputType.parent().removeClass('checkedAnimation');

                            setTimeout(function () {
                                inputType.parent().removeClass('uncheckedAnimation');
                            }, 550);
                        }
                    }
                }
            ]);

            return wilAnimation;
        }();

        new wilAnimation('.js-checkbox');
        new wilAnimation('.comment-form-cookies-consent');

        var wilBlogSearchForm = function () {
            function wilBlogSearchForm(el) {
                _classCallCheck(this, wilBlogSearchForm);

                this.el = $(el);
                return this.init();
            }

            _createClass(wilBlogSearchForm, [
                {
                    key: 'init',
                    value: function init() {
                        var _this8 = this;

                        this.el.each(function (index) {
                            var self = $(_this8.el[index]);
                            var inputSubmit = $('.search-submit', self);
                            inputSubmit.on('mouseenter mouseleave', self, function () {
                                return _this8.onHover(inputSubmit);
                            });
                        });
                    }
                }, {
                    key: 'onHover',
                    value: function onHover(inputSubmit) {
                        $(inputSubmit).parent().toggleClass('active');
                    }
                }
            ]);

            return wilBlogSearchForm;
        }();

        new wilBlogSearchForm('.search-form');

        var wilHasValue = function () {
            function wilHasValue(el) {
                _classCallCheck(this, wilHasValue);

                this.el = $(el);

                return this.init();
            }

            _createClass(wilHasValue, [
                {
                    key: 'init',
                    value: function init() {
                        var _this9 = this;

                        this.el.each(function (index) {

                            var self = $(_this9.el[index]);
                            var inputValue = $('input[type="text"], input[type="password"], input[type="email"],input[type="url"], textarea', self);

                            _this9.onLoadValue(self, inputValue);
                            self.on('keyup', self, function () {
                                return _this9.handleChange(inputValue);
                            });
                        });
                    }
                }, {
                    key: 'onLoadValue',
                    value: function onLoadValue(self, inputValue) {
                        var inputValue = $(inputValue, self);

                        if (inputValue.val() !== '') {
                            inputValue.parent().addClass('hasAttribute');
                        }
                    }
                }, {
                    key: 'handleChange',
                    value: function handleChange(inputValue) {
                        if (inputValue['0'].value === "") {
                            inputValue.parent().removeClass('hasAttribute');
                        }
                    }
                }
            ]);

            return wilHasValue;
        }();

        new wilHasValue('.js-field');
        new wilHasValue('.comment-form p:not(.form-submit):not(.comment-form-cookies-consent)');

        var wilHasPlaceholder = function () {
            function wilHasPlaceholder(el) {
                _classCallCheck(this, wilHasPlaceholder);

                this.el = $(el);

                return this.init();
            }

            _createClass(wilHasPlaceholder, [
                {
                    key: 'init',
                    value: function init() {
                        var _this10 = this;

                        this.el.each(function (index) {

                            var self = $(_this10.el[index]);
                            var inputType = $('input[type="text"], input[type="email"], input[type="url"], input[type="password"], textarea', self);

                            _this10.onLoadAttr(self, inputType);
                            self.on('keyup', self, function () {
                                return _this10.handleChange(inputType);
                            });
                        });
                    }
                }, {
                    key: 'onLoadAttr',
                    value: function onLoadAttr(self, inputType) {

                        var inputType = $(inputType, self);

                        if (inputType.attr("placeholder")) {
                            inputType.parent().addClass('hasAttribute');
                        }
                    }
                }, {
                    key: 'handleChange',
                    value: function handleChange(inputType) {
                        if (inputType['0'].hasAttribute("placeholder")) {
                            inputType.parent().addClass('hasAttribute');
                        }
                    }
                }
            ]);

            return wilHasPlaceholder;
        }();

        new wilHasPlaceholder(".js-field");

        var wilField = function () {
            function wilField(el) {
                _classCallCheck(this, wilField);

                this.el = $(el);
                return this.init();
            }

            _createClass(wilField, [
                {
                    key: "init",
                    value: function init() {
                        var _this6 = this;

                        this.el.each(function (index) {
                            var self = $(_this6.el[index]);
                            var field = $("input, textarea", self);
                            var file = $('input[type="file"]', self);
                            _this6.inputText(field, self);
                            self.on("click", ".input-upload, .input-filename", function (event) {
                                return _this6.handleClickFile(event, field);
                            });
                            file.on("change", function (event) {
                                return _this6.typeFile(event, self);
                            });
                        });
                    }
                }, {
                    key: "inputText",
                    value: function inputText(field, self) {
                        var rightButton = $(".js-field-rightButton", self);
                        var val = field.val();

                        if (field.val() !== '') {
                            self.addClass('active');
                        }

                        field.focus(function () {
                            return self.addClass("active");
                        });

                        field.keyup(function (event) {
                            val = $(event.currentTarget).val();
                            if (val !== "")
                                self.addClass("active");



                            if (rightButton.length) {
                                if (val !== "") {
                                    rightButton.addClass("active");
                                } else {
                                    rightButton.removeClass("active");
                                }
                            }
                        });
                        field.blur(function () {
                            return self.removeClass(val === "" ? "active" : "");
                        });
                        if (self.hasClass("select-text")) {
                            field.on("click", function (event) {
                                return event.currentTarget.setSelectionRange(0, event.currentTarget.value.length);
                            });
                        }
                    }
                }, {
                    key: "handleClickFile",
                    value: function handleClickFile(event, field) {
                        event.preventDefault();
                        field.trigger("click");
                    }
                }, {
                    key: "typeFile",
                    value: function typeFile(event, self) {
                        var fileName = $(".input-filename", self);
                        var fileimg = $(".input-fileimg", self);
                        var getfileName = $(event.currentTarget).val().replace(/\\/g, "/").replace(/.*\//, "");
                        fileName.attr("data-text", getfileName);
                        if (getfileName !== "")
                            self.addClass("active");



                        if (event.currentTarget.files && event.currentTarget.files[0]) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                fileimg.css({
                                    "background-image": "url(\"" + e.target.result + "\")"
                                });
                            };
                            reader.readAsDataURL(event.currentTarget.files[0]);
                        }
                        if (fileName.attr("data-text") === "") {
                            fileimg.css("background-image", "");
                            self.removeClass("active");
                        }
                    }
                }
            ]);

            return wilField;
        }();

        var newWilField = new wilField(".js-field");
        var newWilField2 = new wilField(".comment-form p:not(.form-submit):not(.comment-form-cookies-consent):not(.comment-subscription-form)");

        var wilselect2 = function () {
            function wilselect2(el, opts) {
                _classCallCheck(this, wilselect2);

                this.el = $(el);
                this.opts = opts;
                this.val = '';
                return this.init();
            }

            _createClass(wilselect2, [
                {
                    key: 'init',
                    value: function init() {
                        var _this12 = this;

                        var opts = this.opts;

                        if (typeof WILCITY_SELECT2_LENG !== 'undefined') {
                            if (typeof opts === 'undefined') {
                                opts = {};
                            }
                            opts.language = WILCITY_SELECT2_LENG;
                        }

                        this.el.each(function (index) {
                            var self = $(_this12.el[index]);
                            var select2 = self.next('.select2');
                            self.select2(opts);
                            self.closest('.js-field').find('.select2-selection__rendered').css('color', 'transparent');
                            self.on('change', function (event) {
                                return _this12.handleChange(event, self);
                            });
                        });
                    }
                }, {
                    key: 'handleChange',
                    value: function handleChange(event, self) {
                        self.closest('.js-field').addClass('active');
                        this.val = $(event.currentTarget).val();
                        if (typeof this.val[0] === 'undefined')
                            self.closest('.js-field').removeClass('active');
                         else
                            self.closest('.js-field').find('.select2-selection__rendered').attr('style', '');



                        jQuery(event.currentTarget).trigger('select2-changed', [this.val]);
                    }
                }
            ]);

            return wilselect2;
        }();

        var newWilSelect2 = new wilselect2('.select-2');

        var wilSlider = function () {
            function wilSlider(el) {
                _classCallCheck(this, wilSlider);

                this.el = $(el);
                return this.init();
            }

            _createClass(wilSlider, [{
                    key: 'init',
                    value: function init() {
                        var _this13 = this;

                        this.el.each(function (index) {
                            var self = $(_this13.el[index]);
                            var info = self.siblings('.js-slider-info');
                            var number = $('.js-slider-info__number', info);
                            self.slider({
                                range: 'min',
                                min: self.data('slider-min'),
                                max: self.data('slider-max'),
                                value: self.data('slider-value'),
                                slide: function slide(event, ui) {
                                    info.attr('data-active', 'true');
                                    number.text(ui.value);
                                    self.attr('data-slider-value', ui.value);
                                    if (ui.value === 0) {
                                        info.attr('data-active', '');
                                    }
                                }
                            });
                        });
                    }
                }]);

            return wilSlider;
        }();

        var textareaAutoHeight = function () {
            function textareaAutoHeight(el, opt) {
                _classCallCheck(this, textareaAutoHeight);

                this.els = $(el);
                var defaultOpt = {
                    shiftKey: false
                };
                this.opts = $.extend({}, defaultOpt, opt);
            }

            _createClass(textareaAutoHeight, [
                {
                    key: "handleAutoHeight",
                    value: function handleAutoHeight(event, outerHeight) {
                        var opts = this.opts;
                        var currentTarget = event.currentTarget;

                        var el = $(currentTarget);
                        var borderTop = Number(el.css("border-top-width").replace("px", ""));
                        var borderBottom = Number(el.css("border-bottom-width").replace("px", ""));
                        var shiftKeyCheck = opts.shiftKey ? !isMobile.any() ? event.shiftKey : true : true;
                        if (event.keyCode === 13 && shiftKeyCheck || event.keyCode === 8) {
                            el.css("height", outerHeight);
                            var scrollHeight = el.prop("scrollHeight");
                            el.css("height", scrollHeight + borderTop + borderBottom);
                        }
                    }
                }, {
                    key: "init",
                    value: function init() {
                        var _this9 = this;

                        var els = this.els;

                        els.each(function (index) {
                            var el = $(els[index]);
                            var outerHeight = el.outerHeight();
                            var handleAutoHeight = function handleAutoHeight(event) {
                                return _this9.handleAutoHeight(event, outerHeight);
                            };
                            el.on({keyup: handleAutoHeight, paste: handleAutoHeight, cut: handleAutoHeight, drop: handleAutoHeight});
                        });
                    }
                }
            ]);

            return textareaAutoHeight;
        }();

        var newTextareaAutoHeight = new textareaAutoHeight(".field-autoHeight textarea");
        newTextareaAutoHeight.init();
        var newTextareaAutoHeight2 = new textareaAutoHeight(".field-autoHeight-2 textarea", {shiftKey: true});
        newTextareaAutoHeight2.init();

        var wilHoverParallax = function () {
            function wilHoverParallax(el, opt) {
                _classCallCheck(this, wilHoverParallax);

                this.el = $(el);
                var defaultOpt = {
                    type: '3d'
                };
                var dataOpt = {
                    type: this.el.data('hover-parallax-options')
                };
                this.opts = $.extend(defaultOpt, opt, dataOpt);
                this.inner = null;
                this.btnPlay = null;
                this.bgclone1 = '<div class="bg-parallax-clone-1"></div>';
                this.bgclone2 = '<div class="bg-parallax-clone-2"></div>';
                this.bgclone3 = '<div class="bg-parallax-clone-3"></div>';
                return this.init();
            }

            _createClass(wilHoverParallax, [
                {
                    key: 'init',
                    value: function init() {
                        var _this15 = this;

                        var el = this.el;

                        el.on({
                            mousemove: function mousemove(event) {
                                return _this15.mousemove(event);
                            },
                            mouseenter: function mouseenter(event) {
                                return _this15.mouseenter(event);
                            },
                            mouseleave: function mouseleave(event) {
                                return _this15.mouseleave(event);
                            }
                        });
                        this.type();
                    }
                }, {
                    key: 'type',
                    value: function type() {
                        var _this16 = this;

                        var opts = this.opts;

                        this.el.each(function (index) {
                            var img = $('.bg-cover', _this16.el[index]);
                            img.css({
                                'width': img.outerWidth() + 'px',
                                'height': img.outerHeight() + 'px'
                            });
                            if (opts.type === '3d') {
                                img.clone().prependTo(img.parent()).wrap(_this16.bgclone1);
                                img.clone().prependTo(img.parent()).wrap(_this16.bgclone2);
                                img.clone().prependTo(img.parent()).wrap(_this16.bgclone3);
                            }
                        });
                    }
                }, {
                    key: 'mousemove',
                    value: function mousemove(event) {
                        var self = $(event.currentTarget);
                        var w = self.outerWidth(),
                            h = self.outerHeight(),
                            o = self.offset(),
                            x = (o.left + w / 2 - event.pageX) / 15,
                            y = (o.top + h / 2 - event.pageY) / 15;
                        this.inner = self.children();
                        this.btnPlay = $('.js-video-popup', self);
                        this.inner.css('transform', 'perspective(300em) translate(' + parseInt(x / 2) + 'px, ' + parseInt(y / 2) + 'px) rotateX(' + -parseInt(y) + 'deg) rotateY(' + parseInt(x) + 'deg)');
                        this.btnPlay.css('transform', 'translate(' + parseInt(x) + 'px, ' + parseInt(y) + 'px)');
                        $('.' + $(this.bgclone1)[0].className, self).css('transform', 'translate(' + -parseInt(x / 1) + 'px, ' + -parseInt(y / 1) + 'px)');
                        $('.' + $(this.bgclone2)[0].className, self).css('transform', 'translate(' + -parseInt(x / 2) + 'px, ' + -parseInt(y / 2) + 'px)');
                        $('.' + $(this.bgclone3)[0].className, self).css('transform', 'translate(' + -parseInt(x / 3) + 'px, ' + -parseInt(y / 3) + 'px)');
                    }
                }, {
                    key: 'mouseenter',
                    value: function mouseenter() {
                        var _this17 = this;

                        var self = $(event.currentTarget);
                        this.inner = self.children();
                        this.btnPlay = $('.js-video-popup', self);
                        if (this.btnPlay.css('transform') === 'none' || this.btnPlay.css('transform') === 'matrix(1, 0, 0, 1, 0, 0)') {
                            this.inner.css('transition', 'all 0.3s ease');
                            this.btnPlay.css('transition', 'all 0.3s ease');
                            $('.' + $(this.bgclone1)[0].className + ', .' + $(this.bgclone2)[0].className + ', .' + $(this.bgclone3)[0].className, self).css('transition', 'all 0.3s ease');
                            setTimeout(function () {
                                _this17.inner.css('transition', 'none');
                                _this17.btnPlay.css('transition', 'none');
                                $('.' + $(_this17.bgclone1)[0].className + ', .' + $(_this17.bgclone2)[0].className + ', .' + $(_this17.bgclone3)[0].className, self).css('transition', 'none');
                            }, 300);
                        }
                    }
                }, {
                    key: 'mouseleave',
                    value: function mouseleave(event) {
                        var _this18 = this;

                        var self = $(event.currentTarget);
                        var update = setInterval(function () {
                            if (_this18.btnPlay.css('transform') !== 'matrix(1, 0, 0, 1, 0, 0)') {
                                _this18.inner.css({'transform': 'perspective(300em) translate(0px, 0px) rotateX(0deg) rotateY(0deg)', 'transition': 'all 0.3s ease'});
                                _this18.btnPlay.css({'transform': 'translate(0px, 0px)', 'transition': 'all 0.3s ease'});
                                $('.bg-parallax-clone-1, .bg-parallax-clone-2, .bg-parallax-clone-3', self).css({'transform': 'translate(0px, 0px)', 'transition': 'all 0.3s ease'});
                            } else {
                                _this18.inner.css('transition', 'none');
                                _this18.btnPlay.css('transition', 'none');
                                $('.bg-parallax-clone-1, .bg-parallax-clone-2, .bg-parallax-clone-3', self).css('transition', 'none');
                                clearInterval(update);
                            }
                        }, 5);
                    }
                }
            ]);

            return wilHoverParallax;
        }();

        var newWilHoverParallax = new wilHoverParallax('[class*="video-popup-parallax-"]');

        function pricing2() {

            $('.pricing-list-js').each(function () {

                var expand = parseInt($('.pricing-list-js').attr('data-expand')),
                    _this998 = $(this);

                _this998.find("ul li:gt(" + (
                    expand - 1
                ) + ")").addClass('hidden');

                _this998.find('li').prepend('<i class="la la-check"></i>');

                if (_this998.find('li del').length) {

                    _this998.find('li del').parent('li').children('.la-check').remove();
                    _this998.find('li del').parent('li').prepend('<i class="la la-times"></i>');
                }
            });

            // Expand features
            $('.expand-js a').on('click', function (event) {

                event.preventDefault();

                var _this9977 = $(this);

                _this9977.closest('.pricing-body-js').find('ul li').removeClass('hidden');
                _this9977.closest('.pricing-body-js').find('.expand-js').addClass('hidden');
            });

        }

        pricing2();

        function pricing() {
            var css = {
                module: ".pricing_module__2WIXR",
                header: ".pricing_header__1hEFl",
                featuresText: ".pricing_featuresText__1zmFJ",
                title: ".pricing_title__1vXhE",
                price: ".pricing_price__2vtrC",
                currency: ".pricing_currency__2bkpj",
                amount: ".pricing_amount__34e-B",
                period: ".pricing_period__2A8L4",
                body: ".pricing_body__2-Vq5",
                list: ".pricing_list__KtU8u",
                footer: ".pricing_footer__qz3lM",
                features: ".pricing_features__3Ki80",
                "": ""
            };
            var listWraps = document.querySelectorAll(css.list);
            wilEach(listWraps, function (listWrap) {
                var lists = [].slice.call(listWrap.querySelectorAll("li"));
                wilEach(lists, function (list) {
                    var check = document.createElement("i");
                    var close = document.createElement("i");
                    check.wilAddClass("la la-check");
                    close.wilAddClass("la la-close");
                    list.appendChild(list.querySelector("del") === null && list.querySelector("s") === null ? check : close);
                });
            });
        }
        pricing();

        var wilTab = function () {
            function wilTab(el, opt) {
                _classCallCheck(this, wilTab);

                this.els = document.querySelectorAll(el);
                this.block = el;
                this.opts = opt || {};
                this.index = this.opts.activeIndex || "auto";
                this.classActive = this.opts.classActive || "active";
                this.isLavaTab = this.opts.isLavaTab || false;
                this.lavaDuration = this.opts.lavaDuration || 300;
            }

            _createClass(wilTab, [
                {
                    key: "renderLava",
                    value: function renderLava() {
                        var line = document.createElement("LI");
                        line.wilAddClass("line");
                        line.style.transition = "all " + this.lavaDuration + "ms ease";
                        return line;
                    }
                }, {
                    key: "getStyleLava",
                    value: function getStyleLava(rect, nav) {
                        var navRect = nav.getBoundingClientRect();
                        var scrollLeft = nav.scrollLeft;

                        return {
                            width: rect.width,
                            left: rect.left - navRect.left + scrollLeft
                        };
                    }
                }, {
                    key: "tabMount",
                    value: function tabMount(navItems, panels, index) {
                        var _this14 = this;

                        wilEach(navItems, function (navItem) {
                            return navItem.classList.remove(_this14.classActive);
                        });
                        wilEach(panels, function (panel) {
                            return panel.classList.remove(_this14.classActive);
                        });
                        navItems[index].wilAddClass(this.classActive);
                        panels[index].wilAddClass(this.classActive);
                        var panelContent = panels[index].innerHTML.trim();
                        typeof this.opts.onChangeTab === "function" && this.opts.onChangeTab({panelContent: panelContent, index: index});
                    }
                }, {
                    key: "handleNavItemClick",
                    value: function handleNavItemClick(event, panels, navItems, line, nav, index) {
                        if (jQuery(event.target).hasClass('ignore-lava')) {
                            return true;
                        }
                        event.preventDefault();

                        var currentTarget = event.currentTarget;

                        var rect = currentTarget.getBoundingClientRect();

                        var _getStyleLava = this.getStyleLava(rect, nav),
                            width = _getStyleLava.width,
                            left = _getStyleLava.left;

                        line.style.width = width + "px";
                        line.style.left = left + "px";
                        // this.tabMount(navItems, panels, index);
                    }
                }, {
                    key: "init",
                    value: function init() {
                        var _this15 = this;

                        var els = this.els,
                            block = this.block;

                        wilEach(els, function (el) {
                            var nav = el.querySelector(block + "__nav");
                            if (nav != null && nav.querySelectorAll("a").length) {
                                var navItems = Array.from(nav.querySelectorAll("a"));
                                var panels = Array.from(el.querySelectorAll(block + "__panel"));
                                var rect = _this15.index === "auto" ? navItems.filter(function (item) {
                                    return item.wilHasClass(_this15.classActive);
                                })[0].getBoundingClientRect() : navItems[_this15.index].getBoundingClientRect();
                                nav.appendChild(_this15.renderLava());
                                var line = nav.querySelector(".line");

                                var _getStyleLava2 = _this15.getStyleLava(rect, nav),
                                    width = _getStyleLava2.width,
                                    left = _getStyleLava2.left;

                                line.style.width = width + "px";
                                line.style.left = left + "px";
                                wilEach(navItems, function (navItem, index) {
                                    navItem.addEventListener("click", function (event) {
                                        return _this15.handleNavItemClick(event, panels, navItems, line, nav, index);
                                    });
                                    navItem.wilHasClass(_this15.classActive) && index === "auto" && _this15.tabMount(navItems, panels, index);
                                });
                                _this15.index !== "auto" && _this15.tabMount(navItems, panels, _this15.index);
                            }
                        });
                    }
                }
            ]);

            return wilTab;
        };

        // var newTab = new wilTab(".wil-tab", {isLavaTab: true});
        // window.addEventListener("load", function () {
        //     return newTab.init();
        // });

        $('.js-canvas-textbox').each(function (index) {
            var self = $(this),
                canvasId = $('canvas', self).attr('id', self.attr('class') + '-' + index),
                ww = window.innerWidth,
                rangeY = 180,
                cst = 40,
                _level = .65,
                _count = 6;
            if (ww < 992) {
                _count = 5;
                rangeY = 150;
                cst = 30;
            } else if (ww < 768) {
                _count = 4;
                rangeY = 100;
                cst = 20;
            } else if (ww < 640) {
                _count = 3;
                rangeY = 30;
                cst = 10;
                _level = .75;
            }
            var c = document.getElementById(self.attr('class') + '-' + index),
                ctx = c.getContext('2d'),
                cw = c.width = self.width(),
                ch = c.height = self.height(),
                points = [],
                tick = 0,
                opt = {
                    count: _count,
                    range: {
                        x: 30,
                        y: rangeY
                    },
                    duration: {
                        min: 200,
                        max: 300
                    },
                    thickness: 10,
                    level: _level,
                    curved: true,
                    gradient: {
                        colorLeft: self.attr('data-gradient-left'),
                        colorRight: self.attr('data-gradient-right')
                    }
                },
                rand = function rand(min, max) {
                    return Math.floor(Math.random() * (max - min + 1) + min);
                },
                ease = function ease(t, b, c, d) {
                    if ((t /= d / 2) < 1)
                        return c / 2 * t * t + b;



                    return - c / 2 * (-- t * (t - 2) - 1) + b;
                };

            ctx.lineJoin = 'round';
            ctx.lineWidth = opt.thickness;

            var Point = function Point(config) {
                this.anchorX = config.x;
                this.anchorY = config.y;
                this.x = config.x;
                this.y = config.y;
                this.setTarget();
            };

            Point.prototype.setTarget = function () {
                this.initialX = this.x;
                this.initialY = this.y;
                this.targetX = this.anchorX + rand(0, opt.range.x * 2) - opt.range.x;
                this.targetY = this.anchorY + rand(0, opt.range.y * 2) - opt.range.y;
                this.tick = 0;
                this.duration = rand(opt.duration.min, opt.duration.max);
            };

            Point.prototype.update = function () {
                var dx = this.targetX - this.x;
                var dy = this.targetY - this.y;
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (Math.abs(dist) <= 0) {
                    this.setTarget();
                } else {
                    var t = this.tick;
                    var b = this.initialY;
                    var c = this.targetY - this.initialY;
                    var d = this.duration;
                    this.y = ease(t, b, c, d);

                    b = this.initialX;
                    c = this.targetX - this.initialX;
                    d = this.duration;
                    this.x = ease(t, b, c, d);

                    this.tick ++;
                }
            };

            var updatePoints = function updatePoints() {
                var i = points.length;
                while (i--) {
                    points[i].update();
                }
            };

            var renderShape = function renderShape(opacity, cst) {
                ctx.beginPath();
                var pointCount = points.length;
                ctx.moveTo(points[0].x, points[0].y);
                var i;
                for (i = 0; i < pointCount - 1; i++) {
                    var c = (points[i].x + points[i + 1].x) / 2;
                    var d = (points[i].y + points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(points[i].x - cst, points[i].y - cst, c - cst, d - cst);
                }
                ctx.lineTo(- opt.range.x - cst * 2 - opt.thickness, ch + opt.thickness);
                ctx.lineTo(cw + opt.range.x - cst * 2 + opt.thickness, ch + opt.thickness);
                ctx.closePath();
                var grd = ctx.createLinearGradient(0, 0, self.width() / 1.5, 0);
                grd.addColorStop(0, opt.gradient.colorLeft);
                grd.addColorStop(1, opt.gradient.colorRight);
                ctx.globalAlpha = opacity;
                ctx.fillStyle = grd;
                ctx.fill();
            };

            var clear = function clear() {
                ctx.clearRect(0, 0, cw, ch);
            };

            var loop = function loop() {
                window.requestAnimFrame(loop, c);
                clear();
                updatePoints();

                renderShape(0.2, cst);
                renderShape(0.4, cst / 2);
                renderShape(1, 0);
            };

            var i = opt.count + 2;
            var spacing = (cw + opt.range.x * 2) / (opt.count - 1);
            while (i--) {
                points.push(new Point({
                    x: spacing * (i - 1) - opt.range.x,
                    y: ch - ch * opt.level
                }));
            }

            window.requestAnimFrame = function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
                    window.setTimeout(a, 1E3 / 60);
                };
            }();

            loop();
        });

        /**
    * detailNavTopSticky
    */

        var detailNavTopSticky = function () {
            function detailNavTopSticky(el) {
                _classCallCheck(this, detailNavTopSticky);

                this.el = document.querySelector(el);
                this.lastScroll = 0;
                return this.create();
            }

            _createClass(detailNavTopSticky, [
                {
                    key: 'create',
                    value: function create() {
                        var _this19 = this;

                        var el = this.el;

                        if (el !== null) {
                            var stickyFix = document.createElement('DIV');
                            stickyFix.wilAddClass('js-detail--fixsticky');
                            el.parentNode.insertBefore(stickyFix, el);
                            window.addEventListener('scroll', function () {
                                return _this19.navScroll(el, stickyFix, window);
                            });
                        }
                    }
                }, {
                    key: 'navScroll',
                    value: function navScroll(el, stickyFix, w) {
                        var st = (w.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
                            o = stickyFix.offsetTop,
                            h = el.offsetHeight;
                        if (st >= o) {
                            stickyFix.style.height = h + 'px';
                            el.wilAddClass('js-detail--sticky');
                        } else {
                            stickyFix.style.height = '';
                            el.wilRemoveClass('js-detail--sticky');
                        }
                        this.lastScroll = st;
                    }
                }
            ]);

            return detailNavTopSticky;
        }();

        var newDetailNavTopSticky = new detailNavTopSticky('.js-detail-navtop');

        $('.js-event').each(function (index) {
            var self = $(this),
                cst = 10,
                len = $('.js-event').length;
            self.css('z-index', len + cst - index);
        });

        var highLightLava = function () {
            function highLightLava(el) {
                _classCallCheck(this, highLightLava);

                this.el = document.querySelector(el);
                this.html = document.getElementsByTagName('html')[0];
                this.init();
            }

            _createClass(highLightLava, [
                {
                    key: 'lineStyle',
                    value: function lineStyle(rect, line) {
                        var elRect = this.el.getBoundingClientRect();
                        var scrollLeft = this.el.scrollLeft;

                        var rtl = this.html.getAttribute('dir');
                        var flatten = rtl === 'rtl' ? 0 : scrollLeft;
                        line.style.width = rect.width + "px";
                        line.style.left = rect.left - elRect.left + flatten + "px";
                    }
                }, {
                    key: 'handleMouseenter',
                    value: function handleMouseenter(event, line) {
                        var currentTarget = event.currentTarget;

                        var rect = currentTarget.getBoundingClientRect();
                        this.lineStyle(rect, line);
                    }
                }, {
                    key: 'init',
                    value: function init() {
                        var _this25 = this;

                        var el = this.el;

                        var links = el.querySelectorAll("a");
                        if (links.length) {
                            var line = el.querySelector(".highlight-lava-js__line");
                            el.appendChild(line);
                            var firstRect = links[0].getBoundingClientRect();
                            this.lineStyle(firstRect, line);
                            wilEach(links, function (link) {
                                link.addEventListener("mouseenter", function (event) {
                                    return _this25.handleMouseenter(event, line);
                                });
                            });
                        }
                    }
                }
            ]);

            return highLightLava;
        }();

        let $header = document.querySelector('[data-header-theme]');
        if (document.querySelector(".highlight-lava-js")) {
            new highLightLava(".highlight-lava-js");
            let substract = 0;
            let hero = document.querySelector('[class*="hero_module"]');
            let heroTb = hero.querySelector(".wil-tb");


            if ($header) {
                let headerTheme = $header.getAttribute('data-header-theme');
                if (headerTheme === 'dark' || headerTheme === 'light') {
                    substract = $header.offsetHeight;
                }
            }
            heroTb.style.height = 'calc(100vh - ' + (
                adminBarHeight + substract
            ) + 'px)';
        }

        if ($header) {
            let headerTheme = $header.getAttribute('data-header-theme'),
                menuColor = $header.getAttribute('data-menu-color');

            if (headerTheme !== null && (headerTheme.indexOf('rgb') !== -1 || headerTheme.indexOf('#') !== -1)) {
                $header.style.backgroundColor = headerTheme;
                let $subMenu = document.querySelectorAll('#' + WHITE_LABEL + '-menu .sub-menu'),
                    totalSubMenu = $subMenu.length;
                if (totalSubMenu) {
                    for (let iSub = 0; iSub < totalSubMenu; iSub++) {
                        $subMenu[iSub].style.backgroundColor = headerTheme;
                    }
                }
            }

            if (menuColor !== null && menuColor.indexOf('rgb') !== -1) {
                let allItems = document.querySelectorAll('#' + WHITE_LABEL + '-menu a, #' + WHITE_LABEL + '-quick-notifications i, #' + WHITE_LABEL + '-message-notifications i, #' + WHITE_LABEL + '-quick-search-wrapper .header_searchText__10VVZ, #' + WHITE_LABEL + '-quick-search-wrapper .la');
                let totalItem = allItems.length;
                if (totalItem) {
                    for (let i = 0; i < totalItem; i++) {
                        allItems[i].style.color = menuColor;
                    }
                }
            }
        }

        var message = function () {
            function message() {
                _classCallCheck(this, message);

                this.css = {
                    "column": ".wilcity-message-column",
                    "module": ".message_module__2nm7D",
                    "box": ".message_box__3dDJa",
                    "left": ".message_left__3_nbH",
                    "body": ".message_body__njHFs",
                    "back": ".message_back__pjtJp",
                    "head": ".message_head__2tf2D",
                    "search": ".message_search__EhmrU",
                    "send": ".message_send__2pIGV",
                    "chatContent": ".message_chatContent__1AhzJ",
                    "content": ".message_content__2l2Qt",
                    "sendMessage": ".message_sendMessage__1tW4G",
                    "right": ".message_right__2YFjj",
                    "": ""
                };
                this.apply();

                jQuery(document.body).on('reCalcMessageBox', () => {
                    this.apply();
                });
            }

            _createClass(message, [
                {
                    key: "handleAutoHeight",
                    value: function handleAutoHeight(event, body, textareaH, chatContentH, headH) {
                        var currentTarget = event.currentTarget;

                        if (event.keyCode === 13 && (!isMobile.any() ? event.shiftKey : true) || event.keyCode === 8) {
                            $(currentTarget).css("height", textareaH);
                            var h = $(currentTarget).prop("scrollHeight");
                            $(currentTarget).css("height", h);
                            body.css("height", chatContentH - headH - h - 50);
                            body.scrollTop(body.prop("scrollHeight") + 3000);
                        }
                    }
                }, {
                    key: "apply",
                    value: function apply() {
                        var _this26 = this;
                        var css = this.css;
                        jQuery(css.column).each(function () {
                            var $this = $(this);
                            var body = $this.find(css.body);
                            var sendMessage = $this.find(css.sendMessage);
                            var chatContentH = $this.outerHeight();
                            var textarea = $("textarea", sendMessage);
                            var textareaH = textarea.height();
                            var headH = $this.find(css.head).outerHeight();
                            body.css("height", chatContentH - headH - textareaH - 50);
                            // body.scrollTop(body.prop("scrollHeight") + 3000);
                            var handleAutoHeight = function handleAutoHeight(event) {
                                return _this26.handleAutoHeight(event, body, textareaH, chatContentH, headH);
                            };

                            textarea.on({keyup: handleAutoHeight, paste: handleAutoHeight, cut: handleAutoHeight, drop: handleAutoHeight});
                        });
                    }
                }
            ]);

            return message;
        }();

        new message();

        /**
    * listingBar
    */
        var listingBar = function listingBar(el) {
            this.selector = {
                search: {
                    button: document.querySelector(".js-listing-search-button"),
                    content: document.querySelector(".js-listing-search")
                },
                map: {
                    button: document.querySelector(".js-map-button"),
                    content: document.querySelector(".js-listing-map")
                },
                layout: {
                    buttonGrid: document.querySelector(".js-grid-button"),
                    buttonList: document.querySelector(".js-list-button"),
                    module: document.querySelectorAll(".js-listing-grid .js-listing-module")
                }
            },
            this.el = document.querySelector(el);

            this.init();
        };

        listingBar.prototype = {
            init: function init() {
                var self = this,
                    el = self.el;
                if (el !== null) {
                    self.sticky();
                    if (self.search) {
                        self.handleClickSearch(function () {
                            self.scrollTop(event);
                        });
                        self.handleClickMap();
                        self.handleClickLayout();
                    }
                }
            },

            sticky: function sticky() {
                var self = this,
                    selector = self.selector,
                    el = self.el;

                // create el fix
                var stickyFix = document.createElement("DIV");
                stickyFix.wilAddClass("js-listing-bar-sticky-fix");
                el.parentNode.insertBefore(stickyFix, el);

                // create event sticky
                var eventSticky = document.createEvent("Event");
                eventSticky.initEvent("sticky", true, true);
                el.addEventListener("sticky", function () {
                    var ww = window.innerWidth,
                        wh = window.innerHight,
                        st = window.scrollY,
                        o = el.offsetTop,
                        h = el.offsetHeight,
                        rt = selector.search.content ? selector.search.content.offsetHeight + 50 : 50;
                    if (st >= rt) {
                        stickyFix.style.height = h + "px";
                        el.wilAddClass("js-listing-bar-fixed");
                        document.body.wilAddClass("is-fixed");
                        if (selector.map.content) {
                            selector.map.content.wilAddClass("map-fixed");
                        }
                        el.style.width = el.parentNode.offsetWidth + "px";
                    } else {
                        stickyFix.style.height = "";
                        el.wilRemoveClass("js-listing-bar-fixed");
                        document.body.wilRemoveClass("is-fixed");
                        if (selector.map.content) {
                            selector.map.content.wilRemoveClass("map-fixed");
                        }
                        el.style.width = "";
                    }
                });

                window.addEventListener("scroll", function () {
                    if (el.wilHasClass("js-sticky-for-md")) {
                        if (window.innerWidth <= 992) {
                            el.dispatchEvent(eventSticky);
                        }
                    } else {
                        el.dispatchEvent(eventSticky);
                    }
                });
            },

            scrollTop: function scrollTop(event) {
                event.preventDefault();
                var st = window.scrollY;
                var scrollAnim = setInterval(function () {
                    if (st <= 0) {
                        clearInterval(scrollAnim);
                    } else {
                        st--;
                        st = st / 1.1;
                        window.scrollTo(0, parseInt(st));
                    }
                }, 5);
            },

            handleClickSearch: function handleClickSearch(cbScrollTop) {
                var self = this,
                    selector = self.selector;

                selector.search.button.addEventListener("click", function (event) {
                    cbScrollTop(event);
                });
            },

            handleClickMap: function handleClickMap() {
                var self = this,
                    selector = self.selector;

                selector.map.button.addEventListener("click", function (event) {
                    event.preventDefault();
                    this.wilToggleClass("active color-primary");
                    selector.map.content.wilToggleClass("active");
                });
            },

            changeLayout: function changeLayout(el, event, layouts, width) {
                var self = this,
                    layout = self.selector.layout;
                event.preventDefault();
                layouts.wilRemoveClass("color-primary");
                el.wilAddClass("color-primary");
                wilEach(layout.module, function (module) {
                    var opacity = 0;
                    var fade = setInterval(function () {
                        if (opacity >= 60) {
                            clearInterval(fade);
                        } else {
                            opacity++;
                            module.parentNode.style.opacity = opacity / 60;
                        }
                    }, 5);
                    setTimeout(function () {
                        if (layouts === layout.buttonList)
                            module.wilRemoveClass("js-listing-list");
                         else
                            module.wilAddClass("js-listing-list");



                        module.parentNode.style.width = width;
                    }, 50);
                });
                // scroll top
                self.scrollTop(event);
            },

            handleClickLayout: function handleClickLayout() {
                var self = this,
                    layout = self.selector.layout;
                layout.buttonGrid.addEventListener("click", function (event) {
                    self.changeLayout(this, event, layout.buttonList, "");
                });
                layout.buttonList.addEventListener("click", function (event) {
                    self.changeLayout(this, event, layout.buttonGrid, "100%");
                });
            }
        };

        new listingBar(".js-listing-bar-sticky");

        var searchMoveMap = function () {
            function searchMoveMap(el) {
                _classCallCheck(this, searchMoveMap);

                this.el = document.querySelector(el);
                this.headerHeight = 88;
                this.adminBarHeight = document.body.wilHasClass(".admin-bar") ? 32 : 0;
                this.init();
            }

            _createClass(searchMoveMap, [
                {
                    key: 'getTranslate',
                    value: function getTranslate() {
                        if (wilScrollTop() < this.headerHeight) {
                            return this.headerHeight - wilScrollTop() + this.adminBarHeight;
                        }
                        return this.adminBarHeight;
                    }
                }, {
                    key: 'setTranslate',
                    value: function setTranslate(el) {
                        el.style.transform = 'translate(0, ' + this.getTranslate() + 'px)';
                    }
                }, {
                    key: 'init',
                    value: function init() {
                        var _this26 = this;

                        var el = this.el;

                        this.setTranslate(el);
                        window.addEventListener("scroll", function () {
                            return _this26.setTranslate(el);
                        });
                    }
                }
            ]);

            return searchMoveMap;
        }();

        if (!isMobile.any() && document.body.wilHasClass("header-no-sticky") && document.querySelector("#wilcity-map") !== null) {
            new searchMoveMap("#wilcity-map");
        }


        /**
    * Wil Popup
    */

        var wilPopup = function () {
            function wilPopup(el) {
                _classCallCheck(this, wilPopup);

                this.el = $(el);
                this.st = 0;
                return this.init();
            }

            _createClass(wilPopup, [
                {
                    key: 'init',
                    value: function init() {
                        var _this20 = this;

                        this.el.each(function (index) {
                            var self = $(_this20.el[index]);
                            var dataPopup = self.attr('data-popup');
                            var content = $('[data-popup-content="' + dataPopup + '"]');
                            var close = $('.js-toggle-close, .js-popup-overlay', content);
                            _this20.handleClick(self, content, close);
                        });
                    }
                }, {
                    key: 'openPopup',
                    value: function openPopup(self, content, event) {
                        event.preventDefault();
                        var allContent = document.querySelectorAll('[data-popup-content]');
                        wilEach(allContent, function (content) {
                            return content.style.zIndex = '';
                        });
                        $('[data-popup-content]').css('z-index', '');
                        self.addClass('active');
                        content.css('z-index', '10000').addClass('active');
                        this.st = $(window).scrollTop();
                        $('body').css('top', -this.st + 'px').addClass('disabled-scroll');
                    }
                }, {
                    key: 'closePopup',
                    value: function closePopup(self, content, event) {
                        event.preventDefault();
                        content.removeClass('active');
                        self.removeClass('active');
                        $('body').css('top', '').removeClass('disabled-scroll');
                        $(window).scrollTop(this.st);
                    }
                }, {
                    key: 'handleClick',
                    value: function handleClick(self, content, close) {
                        var _this21 = this;

                        self.on('click', function (event) {
                            return _this21.openPopup(self, content, event);
                        });
                        close.on('click', function (event) {
                            return _this21.closePopup(self, content, event);
                        });
                    }
                }
            ]);

            return wilPopup;
        }();

        var newWilPopup = new wilPopup('[data-popup]');

        // $('.js-sortbox').each(function() {
        // var self = $(this);
        // self.sortable({
        // items: '.js-sortItem'
        // });
        //     self.disableSelection();
        // });


        /*
       OPTIONS:
       menuWidth: Number,
       duration: Number,
       position: String ( left, right),
       classBackButton: String,
       backButton: Tag html,
       classActive: String,
       easing: String (easing css),
       arrow: Tag html
   */

        // create wilMenuVertical

        var wilMenuVertical = function () {
            function wilMenuVertical(el, opt) {
                _classCallCheck(this, wilMenuVertical);

                var winW1 = 300;
                var mobilePosition = 'left';

                if (document.body.classList.contains('rtl')) {
                    mobilePosition = 'right';
                }

                if (window.innerWidth < 480) {
                    winW1 = window.innerWidth - 50;
                }

                this.optDefault = {
                    menuWidth: winW1,
                    duration: 300,
                    position: mobilePosition,
                    classBackButton: "back-button",
                    backButton: "Back to",
                    classActive: "active",
                    easing: "ease",
                    arrow: "&gt;",
                    closeButton: ".js-menu-close"
                };
                this.nav = el;
                this.opts = wilExtend(this.optDefault, opt);
                this.level = 0;
                this.create(document.querySelectorAll(this.nav));
            }

            _createClass(wilMenuVertical, [{
                key: "create",
                value: function create(els) {
                    var _this19 = this;

                    var opts = this.opts,
                            nav = this.nav;


                    wilEach(els, function (el) {
                        _this19.wrapper(el);
                        _this19.position(el);
                        el.style.width = opts.menuWidth + "px";
                    });

                    var menus = document.querySelectorAll(nav + " .nav-menu");
                    var subMenus = document.querySelectorAll(nav + " .sub-menu");
                    wilEach(menus, function (menu) {
                        menu.setAttribute("data-height-default", menu.offsetHeight);
                        menu.style.transition = "all " + opts.duration + "ms " + opts.easing;
                        menu.parentNode.style.height = menu.offsetHeight + "px";
                    });
                    wilEach(subMenus, function (subMenu) {
                        _this19.createBackButton(menus, subMenu, function (back, menus) {
                            _this19.handleClickBack(back, menus);
                            _this19.handleClickLink(back, subMenu, menus);
                        });
                    });
                    this.menuTranslate(menus, this.level);
                    this.toggleMenu();
                }
            }, {
                key: "wrapper",
                value: function wrapper(el) {
                    var opts = this.opts;

                    var innerHtml = el.innerHTML;
                    el.innerHTML = "\n            <div class=\"nav-wrapper-outer\" style=\"display: table; width: 100%; height: 100%\">\n                <div class=\"nav-wrapper\" style=\"display: table-cell; width: 100%; vertical-align: " + opts.verticalAlign + "\">\n                    <div class=\"nav-wrapper-inner\" style=\"overflow: hidden; position: relative\">\n                        " + innerHtml + "\n                    </div>\n                </div>\n            </div>\n        ";
                }
            }, {
                key: "verticalAlign",
                value: function verticalAlign() {
                    var opts = this.opts;

                    var y = 50;
                    if (opts.verticalAlign === "middle") y = 50;
                    if (opts.verticalAlign === "top") y = 0;
                    if (opts.verticalAlign === "bottom") y = 100;
                    return y;
                }
            }, {
                key: "menuTranslate",
                value: function menuTranslate(menus, level, height) {
                    var _this20 = this;

                    var opts = this.opts;

                    wilEach(menus, function (menu) {
                        menu.wilStyles({
                            top: _this20.verticalAlign() + "%",
                            transform: "translate(-" + opts.menuWidth * level + "px, -" + _this20.verticalAlign() + "%)",
                            width: opts.menuWidth + "px"
                        });
                        menu.parentNode.wilStyles({
                            width: opts.menuWidth * (level + 1) + "px",
                            height: "80vh"
                        });
                        setTimeout(function () {
                            return menu.parentNode.style.height = height;
                        }, opts.duration);
                    });
                }
            }, {
                key: "position",
                value: function position(el) {
                    var opts = this.opts;

                    if (opts.position === "left") {
                        el.wilStyles({
                            left: 0,
                            right: "auto"
                        });
                    } else if (opts.position === "right") {
                        el.wilStyles({
                            right: 0,
                            left: "auto"
                        });
                    }
                }
            }, {
                key: "createBackButton",
                value: function createBackButton(menus, subMenu, cb) {
                    var nav = this.nav,
                            opts = this.opts;

                    var firstList = subMenu.children[0];
                    var back = document.createElement("LI");
                    back.wilAddClass(opts.classBackButton);
                    back.innerHTML = opts.backButton;
                    if (subMenu.children[0].className !== back.className) {
                        subMenu.insertBefore(back, firstList);
                    }
                    cb(back, menus);
                }
            }, {
                key: "handleClickLink",
                value: function handleClickLink(back, subMenu, menus) {
                    var _this21 = this;

                    var nav = this.nav,
                            opts = this.opts;

                    var parser = new DOMParser();
                    var menuHasSubMenu = subMenu.previousElementSibling;
                    subMenu.wilStyles({
                        visibility: "hidden",
                        top: this.verticalAlign() + "%",
                        transform: "translate(100%, -" + this.verticalAlign() + "%)"
                    });
                    menuHasSubMenu.innerHTML = menuHasSubMenu.innerHTML.indexOf(opts.arrow) === -1 ? menuHasSubMenu.innerHTML + opts.arrow : menuHasSubMenu.innerHTML;
                    menuHasSubMenu.addEventListener("click", function (event) {
                        var isArrow = opts.arrow.includes(event.target.parentNode.innerHTML);
                        if (isArrow) {
                            event.preventDefault();
                            var subMenuHeight = event.currentTarget.nextElementSibling.offsetHeight;
                            _this21.level++;
                            _this21.menuTranslate(menus, _this21.level, subMenuHeight + "px");
                            event.currentTarget.parentNode.wilAddClass(opts.classActive);
                            subMenu.style.visibility = "visible";

                            var backButton = opts.backButton;

                            if (backButton.indexOf("{{backName}}") !== -1) {
                                backButton = backButton.replace(/{{backName}}/g, event.currentTarget.innerText);
                            }
                            back.innerHTML = backButton;
                        }
                    });
                }
            }, {
                key: "handleClickBack",
                value: function handleClickBack(back, menus) {
                    var _this22 = this;

                    var opts = this.opts;

                    var subMenu = back.parentNode;
                    back.addEventListener("click", function (event) {
                        event.preventDefault();
                        _this22.level--;
                        var ul = back.parentNode.parentNode.parentNode;
                        var parentHeight = ul.offsetHeight;
                        if (ul.getAttribute("data-height-default") !== null) {
                            parentHeight = Number(ul.getAttribute("data-height-default"));
                        }
                        _this22.menuTranslate(menus, _this22.level, parentHeight + "px");
                        back.parentNode.parentNode.wilRemoveClass(opts.classActive);
                        setTimeout(function () {
                            return subMenu.style.visibility = "hidden";
                        }, opts.duration);
                    });
                }
            }, {
                key: "toggleMenu",
                value: function toggleMenu() {
                    var opts = this.opts;

                    var close = document.querySelector(opts.closeButton);
                    var toggleContent = document.querySelector('[data-menu-content="vertical"]');
                    var toggleButton = document.querySelector('[data-menu-toggle="vertical"]');
                    if (close !== null) {
                        close.addEventListener("click", function (event) {
                            event.preventDefault();
                            toggleContent.wilRemoveClass("active");
                            toggleButton.wilToggleClass("active");
                        });
                    }
                    if (toggleButton !== null) {
                        toggleButton.addEventListener("click", function (event) {
                            event.preventDefault();
                            event.currentTarget.wilToggleClass("active");
                            toggleContent.wilToggleClass("active");
                        });
                    }
                }
            }]);

            return wilMenuVertical;
        }();

        var menuMobile = new wilMenuVertical(".nav-mobile", {
            duration: 250,
            arrow: '<span class="nav-arrow"><i class="la la-ellipsis-h"></i></span>',
            backButton: '<a href="#"><i class="la la-long-arrow-left"></i> Back to {{backName}}</a>',
            classBackButton: "nav-back-button",
            verticalAlign: "top"
        });

        // Nav responsive jquery

        var navResponsive = function () {
            function navResponsive(el) {
                _classCallCheck(this, navResponsive);

                this.el = $(el);
                this.opts = {
                    maxWidth: 'auto',
                    moreText: typeof WILCITY_I18.more !== 'undefined' ? WILCITY_I18.more : 'More'
                };
                this.create();
            }

            _createClass(navResponsive, [{
                    key: 'create',
                    value: function create() {
                        var _this26 = this;

                        var opts = this.opts;

                        this.el.on('navResize', function () {
                            var update = setInterval(function () {
                                var w = _this26.el.outerWidth();
                                var maxWidth = opts.maxWidth;
                                var totalWidthHeaderItem = $('.js-header-login').outerWidth(true) + $('.js-header-logo').outerWidth(true) + $('.js-header-search').outerWidth(true) + $('.header-addlisting').outerWidth(true) + $('#' + WHITE_LABEL + '-message-notifications').outerWidth(true) + $('#' + WHITE_LABEL + '-quick-notifications').outerWidth(true) + $('#' + WHITE_LABEL + '-profile-nav-menu').outerWidth(true) + 100;
                                if (maxWidth === 'auto') {
                                    maxWidth = window.innerWidth - totalWidthHeaderItem;
                                }
                                maxWidth = maxWidth < 400 ? 400 : maxWidth;

                                var listItem = _this26.el.children('li');
                                var listLen = listItem.length;
                                if (w > maxWidth) {
                                    var moreHtml = '<li class="menu-item-more menu-item-has-children"><a href="#">' + opts.moreText + '</a><ul class="sub-menu sub-menu-more"></ul></li>';
                                    if ($('.menu-item-more', _this26.el).length === 0)
                                        _this26.el.append(moreHtml);



                                    listItem.eq(listLen - 2).prependTo('.sub-menu-more');
                                } else {
                                    clearInterval(update);
                                }
                            }, 5);
                        }).trigger('navResize');

                        window.addEventListener('resize', function () {
                            return _this26.el.trigger('navResize');
                        });
                    }
                }]);

            return navResponsive;
        }();

        var _navResponsive = new navResponsive('.wil-nav .nav-menu');

        // header sticky

        var headerSticky = function () {
            function headerSticky(el) {
                _classCallCheck(this, headerSticky);

                this.el = document.querySelector(el);
                this.stickyFix = document.createElement("DIV");
                this.init();
            }

            _createClass(headerSticky, [
                {
                    key: 'getTheme',
                    value: function getTheme(theme) {
                        switch (theme) {
                            case "transparent":
                                return "dark";
                            case "light":
                                return "light";
                            case "dark":
                                return "dark";
                            default:
                                return "";
                        }
                    }
                }, {
                    key: 'handleWindowScroll',
                    value: function handleWindowScroll(el, elHeight) {
                        var st = wilScrollTop();
                        var theme = el.getAttribute("data-header-theme");
                        if (st > 0) {
                            el.wilAddClass("js-header-fixed");
                            el.setAttribute("data-header-changetheme", this.getTheme(theme));
                            this.stickyFix.style.height = el.getAttribute("data-header-theme") === "transparent" ? "" : elHeight + "px";
                        } else {
                            el.wilRemoveClass("js-header-fixed");
                            el.setAttribute("data-header-changetheme", "");
                            this.stickyFix.style.height = 0;
                        }
                    }
                }, {
                    key: 'init',
                    value: function init() {
                        if (this.stickyFix) {
                            var _this24 = this;
                            var el = this.el;
                            var elHeight = el.offsetHeight;
                            el.parentNode.insertBefore(this.stickyFix, el);
                            window.addEventListener("scroll", function () {
                                return _this24.handleWindowScroll(el, elHeight);
                            });
                        }
                    }
                }
            ]);

            return headerSticky;
        }();

        window.addEventListener("load", function () {
            if (!document.body.wilHasClass("header-no-sticky") && document.querySelector(".js-header-sticky") !== null) {
                new headerSticky(".js-header-sticky");
            }
        });

        // scroll to top
        function scrollTopJs() {

            var scrollTop = $(".wil-scroll-top"),
                editBtn = $(".btn-group-fixed_module__3qULF");

            $(window).scroll(function () {

                var topPos = $(this).scrollTop(),
                    screenHeight = $(window).height();

                if (screenHeight < topPos) {
                    $(scrollTop).addClass('active');

                    if ($('.rtl').length && $(editBtn).length) {
                        $(scrollTop).css({'right': '20px', 'left': 'auto'})
                    } else if ($('body:not(.rtl)').length && $(editBtn).length) {
                        $(scrollTop).css({'right': 'auto', 'left': '20px'})
                    }

                } else {
                    $(scrollTop).removeClass('active');
                }
            });

            $(scrollTop).click(function () {
                $('html, body').animate({
                    scrollTop: 0
                }, 1000);
                return false;
            });
        }

        scrollTopJs();

        /*********************************************************************************************/
        /*********************************************************************************************/
        /************************************* Custom ************************************************/
        /*********************************************************************************************/
        /*********************************************************************************************/


        $.fn.wilMenu = function (opt) {
            return $(this).each(function () {
                var el = $(this),
                    optsDefault = {
                        menuClass: 'wil-menu-list',
                        breakpoint: 1000,
                        toggleClass: 'active',
                        classButtonToggle: 'toggle-menu',
                        subMenu: {
                            class: 'sub-menu',
                            parentClass: 'menu-item-has-children',
                            toggleClass: 'active'
                        }
                    },
                    options = $.extend({}, optsDefault, opt);
                el.on('wilMenu', function () {
                    $('.' + options.classButtonToggle, el).on('click', function (e) {
                        e.stopPropagation();
                        $('.' + options.menuClass, el).toggleClass(options.toggleClass);
                    });
                    $('.' + options.subMenu.parentClass, el).on('click', '> a', function (e) {
                        e.preventDefault();
                        var self = $(this);
                        self.next('.' + options.subMenu.class).slideToggle(400);
                        self.parent().toggleClass(options.subMenu.toggleClass);
                    });
                    $(document).on('click', function () {
                        $('.' + options.menuClass, el).removeClass(options.toggleClass);
                        $('.' + options.subMenu.parentClass, el).removeClass(options.subMenu.toggleClass);
                        $('.' + options.subMenu.class, el).hide();
                    });
                    $('.' + options.menuClass).on('click', function (e) {
                        e.stopPropagation();
                    });
                });
                if (window.innerWidth <= options.breakpoint) {
                    el.trigger('wilMenu');
                }
                $(window).resize(function () {
                    if (window.innerWidth <= options.breakpoint) {
                        el.trigger('wilMenu');
                    } else {
                        $('.' + options.classButtonToggle, el).off('click');
                        $('.' + options.subMenu.parentClass, el).off('click', '> a');
                        $('html, body').off('click');
                        $('.' + options.menuClass).off('click');
                    }
                });
            });
        }

        function listenRenderMap() {
            $('body').on('renderingMap', ((event, mapID, lat, lng) => {
                lat = parseFloat(lat);
                lng = parseFloat(lng);

                if (isNaN(lat) || isNaN(lng)) {
                    return false;
                }

                let $map = document.getElementById(mapID);

                if ($map.getAttribute('rendered')) {
                    return false;
                }

                let oMap = new google.maps.Map(document.getElementById(mapID), {
                    zoom: 5,
                    center: {
                        lat: lat,
                        lng: lng
                    }
                });

                new google.maps.Marker({
                    map: oMap,
                    position: {
                        lat: lat,
                        lng: lng
                    },
                    draggable: true,
                    anchorPoint: new google.maps.Point(0, -29)
                });
                $map.setAttribute('rendered', true);
            }));
        }

        listenRenderMap();

        function toggelEventMap() {
            $('.wilcity-toggle-event-map').on('click', function (event) {
                let lat = $(this).data('lat'),
                    lng = $(this).data('lng'),
                    mapID = $(this).data('id');
                jQuery('body').trigger('renderingMap', [mapID, lat, lng]);
            })
        }

        toggelEventMap();

        $('.js_edit_event').on('click', function (event) {
            event.preventDefault();
            var eventID = $(this).data('eventid');
            $('body').trigger('editingEvent', [{
                    eventID: eventID
                }]);
        });

        function isIphoneX() {

            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            var ratio = window.devicePixelRatio || 1;

            var screen = {
                width: window.screen.width * ratio,
                height: window.screen.height * ratio
            };

            if ((iOS && screen.width == 1125 && screen.height === 2436) || (iOS && screen.width == 1242 && screen.height === 2688)) {
                $('body').addClass('isIphoneX');
            }

        }

        isIphoneX();


        function drodownToggleReverse() {

            var dropModule707 = $('.dropdown_module__J_Zpj');

            dropModule707.each(function () {

                var wilBtn707 = $(this).children('a.wil-btn:not(active)');

                wilBtn707.on('click', function () {

                    var self707 = $(this);
                    var content707 = self707.closest('.dropdown_module__J_Zpj').children('.dropdown_itemsWrap__2fuze');
                    var contentHeight707 = content707.outerHeight();
                    var htmlHeight707 = $('html').height();

                    if ((self707.offset().top + contentHeight707 + 30) > htmlHeight707) {
                        var $module707 = self707.closest('.dropdown_module__J_Zpj');
                        $($module707).addClass('reverse');
                    } else {
                        $($module707).removeClass('reverse');
                    }

                });
            });
        }

        // if ($('.page-template-dashboard').length) {

        //     $(document).ajaxComplete(function (event, xhr, settings) {

        //         if (xhr.readyState === 4 && xhr.status === 200) {
        //             setTimeout(function () {
        //                 drodownToggleReverse();
        //             }, 500)
        //         }

        //         $('.pagination_pageLink__2UQhK').click(function () {
        //             setTimeout(function () {
        //                 drodownToggleReverse();
        //             }, 500)
        //         });

        //         $('.list_horizontal__7fIr5 .list_item__3YghP').click(function () {
        //             setTimeout(function () {
        //                 drodownToggleReverse();
        //             }, 500)
        //         });

        //     });

        // }
    });

})(jQuery);
