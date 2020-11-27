class ListenScrollTo {
    constructor(element, oFuncCallback, oOffset) {
        this.element = document.getElementById(element)
        this.oFuncCallback = oFuncCallback
        this.currentTop = 0;
        this.currentButtom = 0;
        this.scrollHeight = 0;
        this.currentLeft = 0;
        this.clientHeight = 0;
        this.offsetHeight = 0;
        this.elementHeight = 0;
        this.lastPos = 0;
        this.debounce = null
        this.scrollHandler = null
        this.oOffset = {
            ...{
                top: 20,
                bottom: 20
            },
            ...oOffset
        };
        this.listenScroll()
    }

    handleScroll() {
        if (this.debounce !== null) {
            clearTimeout(this.debounce)
        }

        this.elementHeight = this.element.clientHeight;

        this.debounce = setTimeout(() => {
            this.currentLeft = this.element.scrollLeft;
            this.currentTop = this.element.scrollTop;
            this.scrollHeight = this.element.scrollHeight;
            this.currentButtom = this.scrollHeight -(this.currentTop + this.elementHeight);

            if (this.lastPos > this.currentTop) {
                this.scrollUp()
            } else {
                this.scrollDown()
            }

            this.lastPos = this.currentTop
            clearTimeout(this.debounce)
        }, 300)

        if (this.lastPos === 0) {
            this.lastPos = this.element.scrollTop;
        }
    }

    listenScroll() {
        this.clientHeight = this.element.clientHeight
        this.offsetHeight = this.element.offsetHeight
        this.scrollHandler = this.handleScroll.bind(this)
        this.element.addEventListener('scroll', this.scrollHandler, false)
    }

    callbackFunc(funcName) {
        if (typeof this.oFuncCallback[funcName] === 'function') {
            this.oFuncCallback[funcName](this)
        }
    }

    destroy() {
        this.element.removeEventListener('scroll', this.scrollHandler, false)
    }

    scrollUp() {
        this.callbackFunc('scrolledUp');
        if (this.lastPos === 0) {
            this.lastPos = this.oOffset.top;
        }
    }

    scrollDown() {
        this.callbackFunc('scrolledDown')
        if (this.lastPos === 0) {
            this.lastPos = this.oOffset.bottom;
        }
    }
}

export {
    ListenScrollTo
}
