const CookieCategoryRow = ({ title, description, accent, checked, disabled = false, onToggle }) => (
  <div className="relative overflow-hidden border border-[#1A1D26] bg-black/20">
    <div className="h-[2px] w-full" style={{ backgroundColor: accent, opacity: checked ? 0.95 : 0.4 }} />
    <div className="flex items-start justify-between gap-4 p-5">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
          />
          <h3 className="text-sm md:text-base font-bold text-white">{title}</h3>
          {disabled && (
            <span className="border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-[#00F0FF]">
              Sempre ativo
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-6 text-gray-400">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onToggle?.(!checked)}
        className={`min-w-[126px] border px-3 py-3 text-center font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${
          checked
            ? 'border-[#00F0FF]/60 bg-[#00F0FF]/16 text-[#00F0FF]'
            : 'border-white/10 bg-white/5 text-gray-300'
        } ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
      >
        {disabled ? 'Sempre ativo' : checked ? 'Ativo' : 'Bloqueado'}
      </button>
    </div>
  </div>
)

export default CookieCategoryRow
