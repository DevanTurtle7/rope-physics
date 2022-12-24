const xor = (a: boolean, b: boolean) => (a || b) && !(a && b);

class Knot {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distance(other: Knot) {
    const diffX = Math.abs(this.x - other.x);
    const diffY = Math.abs(this.y - other.y);

    if (diffX === 1 && diffY === 1) {
      return 1;
    }

    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  }

  onSameAxis(other: Knot) {
    return xor(this.x - other.x === 0, this.y - other.y === 0);
  }

  clone() {
    return new Knot(this.x, this.y);
  }

  diagFrom(other: Knot) {
    const diffX = Math.abs(this.x - other.x);
    const diffY = Math.abs(this.y - other.y);

    return diffX === 1 && diffY === 1;
  }
}

export default Knot;
