/**
 * Accepts an array of items and randomly picks them without repeating until all have been picked.
 */
export class ShuffleRandomizer {
  constructor(items) {
    if (items.length === 0) {
      throw Error('cannot instantiate randomizer with empty list');
    }

    this.unpickedItems = [...items];
    this.pickedItems = [];
  }

  reset() {
    this.unpickedItems = [...this.unpickedItems, ...this.pickedItems];
    this.pickedItems = [];
  }

  pick() {
    if (this.unpickedItems.length === 0) {
      this.reset();
    }

    const pickedIndex = Math.floor(Math.random() * this.unpickedItems.length);
    const pickedItem = this.unpickedItems.splice(pickedIndex, 1)[0];

    this.pickedItems.push(pickedItem);

    return pickedItem;
  }
}
