'use client'

interface RadioGroupProps {
  label?: string
  name: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  error?: string
}

export default function RadioGroup({ label, name, options, value, onChange, error }: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-medium uppercase tracking-wider text-text-anthracite/60">
          {label}
        </label>
      )}
      <div className="flex gap-6">
        {options.map(opt => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="sr-only peer"
              />
              <div className={`w-4 h-4 rounded-full border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-prune-main/40 peer-focus-visible:outline-none ${
                value === opt.value
                  ? 'border-prune-main'
                  : 'border-text-anthracite/20 group-hover:border-text-anthracite/40'
              }`}>
                {value === opt.value && (
                  <div className="w-2 h-2 rounded-full bg-prune-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <span className="text-sm text-text-anthracite">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-alert-red">{error}</p>}
    </div>
  )
}
