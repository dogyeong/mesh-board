import { Ball } from './ball'
import { Board, Cell } from './board'

type Event =
  | {
      type: 'update.time'
      leftTimeMs: number
    }
  | {
      type: 'end'
      score: number
    }
  | {
      type: 'update.board'
      board: Cell[][]
    }
  | {
      type: 'update.score'
      score: number
    }
  | {
      type: 'penalized'
    }

type Observer<Event> = (event: Event) => void

export class Game {
  static TIME_LIMIT_MS = 100 * 1000
  static TIME_PENALTY_MS = 5 * 1000
  static COLUMNS = 23
  static ROWS = 14

  private board = new Board({ columns: Game.COLUMNS, rows: Game.ROWS })
  private score = 0
  private leftTimeMs = 0
  private frame: number | null = null
  private observers: Observer<Event>[] = []

  public start() {
    this.score = 0
    this.leftTimeMs = Game.TIME_LIMIT_MS * 1000

    this.notify({
      type: 'update.board',
      board: this.board.toJSON(),
    })
    this.startTimeUpdate()
  }

  private startTimeUpdate() {
    if (this.frame) {
      return
    }

    let startTime = Date.now()
    const updateTime = () => {
      const elapsedTime = Date.now() - startTime
      startTime = Date.now()
      this.leftTimeMs = Math.max(this.leftTimeMs - elapsedTime, 0)
      this.notify({
        type: 'update.time',
        leftTimeMs: this.leftTimeMs,
      })

      if (this.leftTimeMs <= 0) {
        this.stop()
      } else {
        this.frame = requestAnimationFrame(updateTime)
      }
    }

    this.leftTimeMs = Game.TIME_LIMIT_MS
    this.frame = requestAnimationFrame(updateTime)
  }

  public stop() {
    if (this.frame) {
      cancelAnimationFrame(this.frame)
    }
    this.notify({
      type: 'end',
      score: this.score,
    })
  }

  public subscribe(observer: Observer<Event>) {
    this.observers.push(observer)

    return () => {
      this.observers = this.observers.filter((ob) => ob !== observer)
    }
  }

  private notify(event: Event) {
    this.observers.forEach((ob) => ob(event))
  }

  public move({ from, to }: { from: Cell; to: Cell }) {
    this.board.move({ from, to })

    const target = this.board.at(to)

    if (!target) return

    const cellsToBreak = this.getCellsToBreak(target)

    if (cellsToBreak.length >= 3) {
      this.increaseScore(cellsToBreak.length)
      this.breakBalls(cellsToBreak)
      this.notify({
        type: 'update.score',
        score: this.score,
      })
    } else {
      this.penalize()
      this.notify({
        type: 'penalized',
      })
    }

    this.notify({
      type: 'update.board',
      board: this.board.toJSON(),
    })
  }

  private getCellsToBreak(target: Cell) {
    const cellsToBreak = new Set([target])
    const directions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
    ]

    directions.forEach(([columnDirection, rowDirection]) => {
      const cellsToBreakInARow = [
        [columnDirection, rowDirection],
        [-columnDirection, -rowDirection],
      ]
        .map(([columnDirection, rowDirection]) => this.getCellsToBreakInARow({ target, columnDirection, rowDirection }))
        .reduce((result, set) => new Set([...result, ...set]), new Set())

      if (cellsToBreakInARow.size >= 3) {
        cellsToBreakInARow.forEach((cell) => cellsToBreak.add(cell))
      }
    })

    return Array.from(cellsToBreak)
  }

  private getCellsToBreakInARow({
    target,
    columnDirection,
    rowDirection,
  }: {
    target: Cell
    columnDirection: number
    rowDirection: number
  }) {
    const cellsToBreakInARow = new Set([target])

    ;[
      [columnDirection, rowDirection],
      [-columnDirection, -rowDirection],
    ].forEach(([columnDirection, rowDirection]) => {
      let { column, row } = target

      while (this.board.at({ column, row })) {
        const cell = this.board.at({ column, row })
        const type = cell?.ball.type

        if (!cell) break

        if (type === target.ball.type) {
          cellsToBreakInARow.add(cell)
        }
        if (type === target.ball.type || type === Ball.EMPTY) {
          column += columnDirection
          row += rowDirection
          continue
        }
        break
      }
    })

    return cellsToBreakInARow
  }

  private increaseScore(ballNum: number) {
    const scoreToGet = this.calculateScoreToGet(ballNum)
    this.score += scoreToGet
  }

  private calculateScoreToGet(ballNum: number) {
    let bonus = 0

    if (ballNum === 4) bonus += 1
    else if (ballNum === 5) bonus += 3
    else if (ballNum >= 6) bonus += 5

    return ballNum + bonus
  }

  private breakBalls(cellsToBreak: Cell[]) {
    cellsToBreak.forEach(({ column, row }) => {
      const cell = this.board.at({ column, row })
      if (cell) cell.ball = new Ball(Ball.EMPTY)
    })
  }

  private penalize() {
    this.leftTimeMs -= Game.TIME_PENALTY_MS
    this.notify({
      type: 'update.time',
      leftTimeMs: this.leftTimeMs,
    })
  }
}
