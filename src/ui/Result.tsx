import Button from './Button'

interface Props {
  score: number
  onReset: () => void
}

export default function Result(props: Props) {
  return (
    <>
      <div class='text-size-28px text-zinc300 p-b-8px'>Score : {props.score}</div>
      <Button onClick={props.onReset}>Menu</Button>
    </>
  )
}
