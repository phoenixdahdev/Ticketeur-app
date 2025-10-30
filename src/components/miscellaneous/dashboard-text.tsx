interface Props {
  text: string
}

export function DashboardText({ text }: Props) {
  return (
    <h2 className="font-transforma-sans text-sm font-bold text-black lg:text-lg">
      {text}
    </h2>
  )
}
