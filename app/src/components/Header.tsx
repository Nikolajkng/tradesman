import Image from "next/image";

// components/Header.js
export default function Header() {
  return (
    <div className="mb-12">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
            Tradesman
          </p>
          <Image
            src="/images/helmet.png"
            alt="Helmet icon"
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Velkommen *Bruger*
        </h1>

      </div>
    </div>
  );
}