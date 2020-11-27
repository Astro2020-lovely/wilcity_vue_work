class GridObserver {
    constructor() {
        this.observers = [];
    }
    subscribe(subscriber) {
        this.observers = [
            ...this.observers,
            subscriber
        ];
    }
    unsubcribe(unsubscriber) {
        this.observers = this.observers.filter(subscriber => subscriber !== unsubscriber);
    }

    notify() {
        this.observers.every(observer => {
            if (observer.isLoading) {
                return false;
            }
            if (observer.isWaiting) {
                observer.prepareFetchListing(this, observer);
                console.log("Loading")
                return false;
            }

            return true;
        });
    }
};
const WilGridObserver = new GridObserver;
export {
    WilGridObserver
}
