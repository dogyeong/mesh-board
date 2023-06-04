export class Ball {
  static EMPTY = Symbol('Empty')
  static RED = Symbol('Red')
  static BLUE = Symbol('Blue')
  static GREEN = Symbol('Green')
  static PURPLE = Symbol('Purple')
  static BROWN = Symbol('Brown')

  constructor(private ballType: symbol) {}

  get type() {
    return this.ballType
  }

  public equals(other: Ball) {
    return this.type === other.type
  }
}
