export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-evocative-primary flex items-center justify-center text-white font-display font-bold text-lg">
          E
        </div>
        <div>
          <h1 className="font-display font-semibold text-slate-800 text-lg">
            Evocative
          </h1>
          <p className="text-xs text-slate-500">Your shopping advisor</p>
        </div>
      </div>
    </header>
  );
}
