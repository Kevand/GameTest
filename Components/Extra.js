class Extra {
    static GetRandomProperty(obj) {
        let keys = Object.keys(obj);
        return obj[keys[keys.length * Math.random() << 0]];
    }
}

class Tween {
    static TweenQueue = [];

    static To(Property, Destination, Duration) {
        let gap = Property - Destination;
        let step = Duration / gap;

        this.TweenQueue.push({ Step: step, Property: Property, Destination: Destination });

    }

    static Update() {
        this.TweenQueue.forEach(Tween => {
            if (Tween.Property != Tween.Destination) {
                Tween.Property += Tween.Step;
            } else {
                this.TweenQueue.filter((e, i) => { return (e != Tween) });
            }
        });
    }
}

export { Extra, Tween };