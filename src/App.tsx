import { Match, Switch, createSignal } from 'solid-js'
import { Ball } from 'models/ball'
import { Cell as BoardCell } from 'models/board'
import { Game } from 'models/game'
import Button from 'ui/Button'
import Status from 'ui/Status'
import Result from 'ui/Result'
import Board from 'ui/Board'
import { Sound } from 'sound'

export type Cell = BoardCell & {
  movable?: boolean
}

const [game, setGame] = createSignal(new Game())
const [status, setStatus] = createSignal<'ready' | 'playing' | 'end'>('ready')
const [time, setTime] = createSignal(0)
const [score, setScore] = createSignal(0)
const [board, setBoard] = createSignal<Cell[][]>([[]])
const [selectedCell, setSelectedCell] = createSignal<Cell | null>(null)
const [nextCell, setNextCell] = createSignal<Cell | null>(null)

export default function App() {
  function startGame() {
    const game = new Game()
    Sound['🛰️']()

    game.subscribe((event) => {
      switch (event.type) {
        case 'update.board':
          setBoard(event.board)
          break
        case 'update.score':
          if (event.score > score()) {
            Sound['💰']()
          }
          setScore(event.score)
          break
        case 'update.time':
          setTime(event.leftTimeMs)
          break
        case 'penalized':
          Sound['🚘']()
          break
        case 'end':
          setScore(event.score)
          setStatus('end')
          Sound['🥊']()
          break
        default:
          break
      }
    })

    game.start()
    setGame(game)
    setStatus('playing')
    setScore(0)
  }

  function selectCell(cell: Cell) {
    if (cell.ball.type === Ball.EMPTY) return
    setSelectedCell(cell)
    setNextCell(cell)
    findMovable(cell)
  }

  function selectNextCell(cell: Cell) {
    if (selectedCell() === null) return
    if (selectedCell() !== cell && cell.ball.type !== Ball.EMPTY) return
    if (!cell.movable) return
    setNextCell(cell)
  }

  function moveBall() {
    const from = selectedCell()
    const to = nextCell()

    if (!from || !to) return

    game().move({ from, to })
    setSelectedCell(null)
    setNextCell(null)
  }

  function findMovable(target: Cell) {
    target.movable = true
    ;[
      [-1, 0],
      [-1, -1],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ].forEach(([dCol, dRow]) => {
      let { column, row } = target

      column += dCol
      row += dRow

      while (board()[row]?.[column]) {
        const cell = board()[row][column]

        if (!cell) return

        if (cell !== target && cell.ball.type !== Ball.EMPTY) {
          break
        }

        cell.movable = true
        column += dCol
        row += dRow
      }
    })
    setBoard([...board().map((row) => [...row])])
  }

  return (
    <div class='min-w-100vw min-h-100vh bg-zinc900 flex justify-center items-center' onMouseUp={moveBall} onMouseLeave={moveBall}>
      <main class='flex justify-center items-center flex-col gap-4px w-564px'>
        <Switch>
          <Match when={status() === 'ready'}>
            <Button onClick={startGame}>Start</Button>
          </Match>
          <Match when={status() === 'playing'}>
            <Status timeMax={Game.TIME_LIMIT_MS} timeValue={time()} score={score()} />
            <Board
              board={board()}
              selectedCell={selectedCell()}
              nextCell={nextCell()}
              selectCell={selectCell}
              selectNextCell={selectNextCell}
            />
          </Match>
          <Match when={status() === 'end'}>
            <Result score={score()} onReset={() => setStatus('ready')} />
          </Match>
        </Switch>
      </main>
    </div>
  )
}
