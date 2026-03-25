// components/Header.js
export default function Header() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
            Tradesman
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Velkommen *Bruger*
          </h1>
        </div>
        <div className="text-4xl">🛠️</div>
      </div>
    </div>
  );
}