import { cn } from "../lib/utils"

function LogoIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="26"
      fill="none"
      viewBox="0 0 27 26"
      className={cn(className)}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M26.02 12.645v.142c0 2.077-.497 4.032-1.377 5.752a4.68 4.68 0 0 0-4.349-2.574 7.5 7.5 0 0 0 .695-3.18v-.142c0-4.236-3.427-7.558-7.617-7.558h-3.309V0h3.31C20.328 0 26.02 5.613 26.02 12.645"
        clipRule="evenodd"
        className="text-teal-700"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15.094 10.173v15.14L0 25.432V7.977h5.032v12.368h5.031V10.173z"
        clipRule="evenodd"
        className="text-gray-800 dark:text-white"
      />
      <path
        fill="currentColor"
        d="M5.031 0H0v5.086h5.031z"
        className="text-gray-800 dark:text-white"
      />
      <path
        fill="currentColor"
        d="M20.472 24.217c1.924 0 3.483-1.576 3.483-3.521s-1.56-3.521-3.483-3.521-3.483 1.576-3.483 3.52c0 1.945 1.56 3.522 3.483 3.522"
        className="text-teal-700"
      />
    </svg>
  )
}

export { LogoIcon }
export default LogoIcon
