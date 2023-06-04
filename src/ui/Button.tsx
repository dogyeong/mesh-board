import { JSXElement } from 'solid-js'
import { Sound } from 'sound'

interface Props {
  children: JSXElement
  onClick?: (...args: unknown[]) => void
}

export default function Button(props: Props) {
  const handleClick = () => {
    Sound['🎹']()
    props.onClick?.()
  }

  return (
    <button class='py-4px rounded-4px bg-zinc600 px-8px text-zinc200 text-xl hover:text-zinc50' onClick={handleClick}>
      {props.children}
    </button>
  )
}
