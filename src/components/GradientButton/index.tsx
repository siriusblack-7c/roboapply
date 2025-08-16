import React from "react"

interface Props {
  children: React.ReactNode
  className?: string
  type?: "button" | "submit" | "reset" | undefined
  onClick: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  style?: React.CSSProperties | undefined
}

const GradientButton = ({
  children,
  className,
  type,
  onClick,
  disabled,
  style
}: Props) => {
  return (
    <button
      type={type ? type : "button"}
      className={`py-2 px-2 md:px-7  text-base font-semibold bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded-lg hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}>
      {children}
    </button>
  )
}

export default GradientButton
