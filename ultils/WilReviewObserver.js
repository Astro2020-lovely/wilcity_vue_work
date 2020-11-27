const WilReviewObserver = {
    constructor() {
        this.observers = [];
    }
    subscribe(subscriber) {
        this.observers = [
            ...this.observers,
            subscriber
        ];
    }
    unsubcriber(unsubscriber) {
        this.observers = this.observers.filter(subscriber => subscriber !== unsubscriber);
    }

    notify(data) {
        this.observers.forEach(observer => observer(data));
    }
};


export {
    WilReviewObserver
}
