import { Cell } from 'App'
import { Ball } from 'models/ball'
import { For, Match, Show, Switch } from 'solid-js'

interface Props {
  board: Cell[][]
  selectedCell: Cell | null
  nextCell: Cell | null
  selectCell: (cell: Cell) => void
  selectNextCell: (cell: Cell) => void
}

export default function Board(props: Props) {
  const EmptyCell = (props: { cell: Cell }) => <div class='w-8px h-8px rounded-50%' classList={{ 'bg-zinc500': props.cell.movable }} />

  const NextCell = (props: { selectedBallType?: symbol }) => (
    <div
      class='rounded-50% w-20px h-20px opacity-50'
      classList={{
        'bg-red': props.selectedBallType === Ball.RED,
        'bg-blue': props.selectedBallType === Ball.BLUE,
        'bg-green': props.selectedBallType === Ball.GREEN,
        'bg-purple': props.selectedBallType === Ball.PURPLE,
        'bg-amber': props.selectedBallType === Ball.BROWN,
      }}
    />
  )

  const BallCell = (props: { ballType: symbol }) => (
    <div
      class='w-20px h-20px rounded-50% cursor-pointer after:w-12px after:content-[quoted:1] after:color-transparent after:block after:rounded-50% after:top-4px after:relative after:left-4px after:h-12px from-white to-transparent after:bg-gradient-to-br after:opacity-50'
      classList={{
        'bg-red': props.ballType === Ball.RED,
        'bg-blue': props.ballType === Ball.BLUE,
        'bg-green': props.ballType === Ball.GREEN,
        'bg-purple': props.ballType === Ball.PURPLE,
        'bg-amber': props.ballType === Ball.BROWN,
      }}
    />
  )

  return (
    <div class='flex flex-col gap-4px rounded-4px bg-zinc800 p-8px'>
      <For each={props.board}>
        {(row) => (
          <div class='flex gap-4px flex-row'>
            <For each={row}>
              {(cell) => (
                <div
                  class='w-20px h-20px flex justify-center items-center bg-zinc900 bg-opacity-20'
                  onMouseDown={() => props.selectCell(cell)}
                  onMouseMove={() => props.selectNextCell(cell)}
                >
                  <Switch>
                    <Match when={cell.ball.type === Ball.EMPTY}>
                      <Show when={cell === props.nextCell} fallback={<EmptyCell cell={cell} />}>
                        <NextCell selectedBallType={props.selectedCell?.ball.type} />
                      </Show>
                    </Match>
                    <Match when={cell.ball.type !== Ball.EMPTY}>
                      <BallCell ballType={cell.ball.type} />
                    </Match>
                  </Switch>
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  )
}
