export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function statusTone(status: number) {
  if (status >= 95) return 'text-status-ok'
  if (status >= 85) return 'text-status-warn'
  return 'text-status-crit'
}

export function statusBg(status: number) {
  if (status >= 95) return 'bg-status-ok'
  if (status >= 85) return 'bg-status-warn'
  return 'bg-status-crit'
}
