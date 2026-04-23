import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, Cancel01Icon } from '@hugeicons/core-free-icons'

import { cn } from '@ticketur/ui/lib/utils'

type Rule = {
  label: string
  valid: boolean
}

export function getPasswordRules(password: string): Rule[] {
  return [
    { label: 'Minimum of 8 characters', valid: password.length >= 8 },
    {
      label: 'At least one special character (@#!)',
      valid: /[^A-Za-z0-9\s]/.test(password),
    },
    {
      label: 'Mixture of uppercase and lowercase',
      valid: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
  ]
}

export function PasswordStrength({ password }: { password: string }) {
  const rules = getPasswordRules(password)

  return (
    <div className="bg-muted/50 border-border/60 mt-3 rounded-[10px] border p-4">
      <p className="text-foreground text-xs font-semibold tracking-[0.04em] uppercase">
        Password strength rules
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {rules.map((rule) => (
          <li
            key={rule.label}
            className={cn(
              'flex items-center gap-2 text-xs font-medium transition-colors',
              rule.valid ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <HugeiconsIcon
              icon={rule.valid ? CheckmarkCircle02Icon : Cancel01Icon}
              className={cn(
                'size-4 shrink-0',
                rule.valid ? 'text-primary' : 'text-muted-foreground/60'
              )}
              strokeWidth={2}
            />
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
