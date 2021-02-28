export class CommandQueue {
  constructor() {
    this.callbacks = [];
  }

  push(item) {
    for (const cb of this.callbacks) {
      try {
        cb(item);
      } catch (e) {
        console.log(e);
      }
    }
  }

  subscribe(cb) {
    if (typeof cb !== "function") {
      throw new Error("Queue callback must be a function");
    }
    this.cbs.push(cb);
  }
}

export default new CommandQueue();
