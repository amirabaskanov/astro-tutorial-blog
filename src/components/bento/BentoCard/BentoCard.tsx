import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

const BentoCard = (props: Props) => {
  const { children, className, ...rest } = props

  return (
    <div className="card group rounded-3xl" {...rest}>
      <div
        className=
          'card-content md:absolute border-[#1f2b3a] max-md:border'
      >
        {children}
      </div>
    </div>
  )
}

export default BentoCard