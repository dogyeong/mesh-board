interface Props {
  timeMax: number
  timeValue: number
  score: number
}

export default function Status(props: Props) {
  return (
    <div class='flex bg-zinc800 py-4px items-center text-zinc200 rounded-4px px-12px gap-12px self-stretch'>
      <div class='rounded-4px bg-zinc900 flex-1 overflow-hidden h-12px'>
        <div class='h-100% bg-blue' style={{ width: `calc(${props.timeValue} / ${props.timeMax} * 100%)` }} />
      </div>
      <div class='w-40px text-right'>{props.score}</div>
    </div>
  )
}
