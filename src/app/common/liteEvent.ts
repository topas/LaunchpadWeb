interface ILiteEvent<T,U> {
    on(handler: { (sender?: T, data?: U): void });
    off(handler: { (sender?: T, data?: U): void });
}

class LiteEvent<T,U> implements ILiteEvent<T,U> {
    private handlers: { (sender?: T, data?: U): void; }[] = [];

    public on(handler: { (sender?: T, data?: U): void }) {
        this.handlers.push(handler);
    }

    public off(handler: { (sender?: T, data?: U): void }) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(sender?: T, data?: U) {
        if (this.handlers) {
            this.handlers.forEach(h => h(sender, data));
        }
    }
}