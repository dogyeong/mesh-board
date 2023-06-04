import { Ball } from './ball'

export interface Cell {
  column: number
  row: number
  ball: Ball
}

export class Board {
  private columns: number
  private rows: number
  private cells: Cell[][] = [[]]

  constructor({ columns, rows }: { columns: number; rows: number }) {
    this.columns = columns
    this.rows = rows

    this.initialize()
  }

  private initialize() {
    this.initializeCells()
    this.fillCellsWithRandomBall()
  }

  private initializeCells() {
    this.cells = Array.from({ length: this.rows }).map((_, row) => {
      return Array.from({ length: this.columns }).map((_, column) => {
        return {
          column,
          row,
          ball: new Ball(Ball.EMPTY),
        }
      })
    })
  }

  private fillCellsWithRandomBall() {
    const totalCells = this.columns * this.rows
    const ballsOfEachColor = Math.floor(totalCells * 0.11)
    const emptyCells = totalCells - ballsOfEachColor * 5

    const ballPool = [Ball.RED, Ball.BLUE, Ball.GREEN, Ball.PURPLE, Ball.BROWN]
      .flatMap((color) => Array.from({ length: ballsOfEachColor }, () => new Ball(color)))
      .concat(...Array.from({ length: emptyCells }, () => new Ball(Ball.EMPTY)))
      .sort(() => Math.random() - Math.random())
      .sort(() => Math.random() - Math.random())
      .sort(() => Math.random() - Math.random())

    this.cells.forEach((row) => {
      row.forEach((cell) => {
        const ball = ballPool.pop()
        if (ball) {
          cell.ball = ball
        }
      })
    })
  }

  public toJSON() {
    return this.cells.map((row) => {
      return row.map(({ column, row, ball }) => ({
        column,
        row,
        ball,
      }))
    })
  }

  public move({ from, to }: { from: Cell; to: Cell }) {
    const fromCell = this.at(from)
    const toCell = this.at(to)

    if (!fromCell || !toCell) return
    if (fromCell.ball.type === Ball.EMPTY) return
    if (toCell.ball.type !== Ball.EMPTY) return

    toCell.ball = new Ball(fromCell.ball.type)
    fromCell.ball = new Ball(Ball.EMPTY)
  }

  public at({ column, row }: { column: number; row: number }): Cell | undefined {
    return this.cells[row]?.[column]
  }
}
