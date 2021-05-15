import { FC } from "react"

const HEADING_CLASSES = [
  'text-5xl text-yellow-900 font-bold pb-4',
  'text-4xl text-yellow-500 font-semibold pb-3',
  'text-3xl text-yellow-300 font-semibold pb-3',
  'text-3xl text-magenta-900 font-semibold italic pb-2',
  'text-2xl text-magenta-500 font-semibold italic pb-2',
  'text-xl text-magenta-300 font-semibold italic pb-2',
]

export const Heading: FC<{ level: number, children: any }> = ({ level, children }) => <div className={
  HEADING_CLASSES[level - 1]
}>{children}</div>