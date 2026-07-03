"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

const VIEWBOX_WIDTH = 1634

export function SiteFooterInteractiveLogotype() {
  const shouldReduceMotion = useReducedMotion()

  const gradientX1Raw = useMotionValue(0.5)
  const gradientX1 = useSpring(
    useTransform(gradientX1Raw, [0, 1], [0, VIEWBOX_WIDTH]),
    {
      stiffness: 150,
      damping: 25,
    }
  )

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return

    const containerRect = event.currentTarget.getBoundingClientRect()
    gradientX1Raw.set(
      (event.clientX - containerRect.left) / containerRect.width
    )
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return
    gradientX1Raw.set(0.5)
  }

  return (
    <div className="screen-line-bottom after:z-1 after:bg-foreground/15">
      <div
        className="overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex w-full translate-y-[37.5%] items-center justify-center">
          <svg
            className="container size-full"
            viewBox="0 0 1634 258"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1 1H33V257H1V1ZM129 1H161V257H129V1ZM33 33H65V97H33V33ZM65 97H97V161H65V97ZM97 161H129V225H97V161ZM225 65H353V257H321V225H289V193H321V97H225V65ZM225 225H193V97H225V225ZM225 225V257H289V225H225ZM385 65H513V129H481V97H417V257H385V65ZM577 65H705V257H673V225H641V193H673V97H577V65ZM577 225H545V97H577V225ZM577 225V257H641V225H577ZM737 1H769V257H737V1ZM769 161H801V193H769V161ZM801 129H833V161H801V129ZM833 97H865V129H833V97ZM801 193H833V225H801V193ZM833 225H865V257H833V225ZM1025 33H1057V65H1025V33ZM929 33V1H1025V33H929ZM929 225H897V33H929V225ZM1025 225V257H929V225H1025ZM1025 225V193H1057V225H1025ZM1089 33H1121V225H1089V33ZM1217 33H1249V225H1217V33ZM1121 1H1217V33H1121V1ZM1121 225H1217V257H1121V225ZM1281 1H1313V257H1281V1ZM1409 33H1441V225H1409V33ZM1313 1H1409V33H1313V1ZM1313 225H1409V257H1313V225ZM1473 1H1505V257H1473V1ZM1505 1H1633V33H1505V1ZM1505 97H1601V129H1505V97ZM1505 225H1633V257H1505V225Z"
              fill="url(#paint0_linear_1145_73)"
            />
            <path
              className="stroke-foreground/10"
              d="M1 1H33V257H1V1ZM129 1H161V257H129V1ZM33 33H65V97H33V33ZM65 97H97V161H65V97ZM97 161H129V225H97V161ZM289 225H321V257H353V65H225V97ZM289 225V193H321V97H225ZM289 225V257H225V225ZM289 225H225ZM225 97H193V225H225ZM225 97V225ZM385 65H417V257H385V65ZM417 65H513V97H417V65ZM481 97H513V129H481V97ZM641 225H673V257H705V65H577V97ZM641 225V193H673V97H577ZM641 225V257H577V225ZM641 225H577ZM577 97H545V225H577ZM577 97V225ZM737 1H769V257H737V1ZM769 161H801V193H769V161ZM801 129H833V161H801V129ZM833 97H865V129H833V97ZM801 193H833V225H801V193ZM833 225H865V257H833V225ZM1025 33H1057V65H1025V33ZM1025 33V1H929V33ZM1025 33H929ZM929 33H897V225H929ZM929 33V225ZM929 225V257H1025V225ZM929 225H1025ZM1025 225V193H1057V225H1025ZM1089 33H1121V225H1089V33ZM1217 33H1249V225H1217V33ZM1121 1H1217V33H1121V1ZM1121 225H1217V257H1121V225ZM1281 1H1313V257H1281V1ZM1409 33H1441V225H1409V33ZM1313 1H1409V33H1313V1ZM1313 225H1409V257H1313V225ZM1473 1H1505V257H1473V1ZM1505 1H1633V33H1505V1ZM1505 97H1601V129H1505V97ZM1505 225H1633V257H1505V225Z"
              strokeWidth="2"
            />
            <defs>
              <motion.linearGradient
                id="paint0_linear_1145_73"
                x1={gradientX1}
                y1="1"
                x2="817"
                y2="257"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.625"
                  stopColor="var(--foreground)"
                  stopOpacity="0"
                />
                <stop offset="1" stopColor="var(--foreground)" />
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 hidden h-px w-[50%] max-w-full -translate-x-1/2 dark:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0) 0%, rgba(228, 228, 231, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
        aria-hidden
      />
    </div>
  )
}
