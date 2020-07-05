class Extra {
  static GetRandomProperty(obj) {
    let keys = Object.keys(obj);
    return obj[keys[(keys.length * Math.random()) << 0]];
  }
}

export { Extra };
