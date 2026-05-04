import { useState } from "react";
import Icon from "@/components/ui/icon";

const LOCATIONS = [
  { id: 1, name: "Токио", country: "Япония", coords: { x: 81.5, y: 34 }, date: "Март 2023", lat: "35°41'N", lng: "139°41'E", desc: "Неоновые улицы Синдзюку, тишина храма Мэйдзи, сакура в Уэно.", emoji: "🌸" },
  { id: 2, name: "Рейкьявик", country: "Исландия", coords: { x: 33, y: 20 }, date: "Декабрь 2022", lat: "64°08'N", lng: "21°56'W", desc: "Северное сияние над чёрными пляжами. Геотермальные бассейны под звёздами.", emoji: "🌌" },
  { id: 3, name: "Марракеш", country: "Марокко", coords: { x: 42.5, y: 39 }, date: "Октябрь 2023", lat: "31°37'N", lng: "7°59'W", desc: "Лабиринты медины. Запах специй на площади Джемаа-эль-Фна.", emoji: "🏮" },
  { id: 4, name: "Буэнос-Айрес", country: "Аргентина", coords: { x: 27, y: 72 }, date: "Февраль 2022", lat: "34°36'S", lng: "58°22'W", desc: "Страстное танго в Сан-Тельмо. Бесконечные бульвары и стейкхаусы.", emoji: "💃" },
  { id: 5, name: "Луанг-Прабанг", country: "Лаос", coords: { x: 74.5, y: 43 }, date: "Январь 2024", lat: "19°53'N", lng: "102°08'E", desc: "Монахи на рассвете. Водопады Куанг Си. Меконг на закате.", emoji: "🛕" },
  { id: 6, name: "Тбилиси", country: "Грузия", coords: { x: 58.5, y: 30 }, date: "Май 2023", lat: "41°41'N", lng: "44°50'E", desc: "Серные бани в Абанотубани. Вино и хинкали. Старый город.", emoji: "🍷" },
  { id: 7, name: "Антарктида", country: "Антарктика", coords: { x: 50, y: 96 }, date: "Январь 2020", lat: "90°00'S", lng: "0°00'E", desc: "Конец света. Пингвины и айсберги высотой с дом.", emoji: "🧊" },
];

const STATS = [
  { label: "Стран", value: "23" },
  { label: "Городов", value: "67" },
  { label: "Километров", value: "84к" },
  { label: "Лет в пути", value: "6" },
];

function WorldMapSVG({ locations, activeId, onHover }: {
  locations: typeof LOCATIONS;
  activeId: number | null;
  onHover: (id: number | null) => void;
}) {
  return (
    <div className="relative w-full" style={{ paddingBottom: "50%" }}>
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full"
        style={{ background: "transparent" }}
      >
        {/* Grid lines */}
        {Array.from({ length: 19 }, (_, i) => (
          <line
            key={`h${i}`}
            x1="0" y1={i * 500 / 18}
            x2="1000" y2={i * 500 / 18}
            stroke="rgba(201,168,76,0.06)" strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 37 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={i * 1000 / 36} y1="0"
            x2={i * 1000 / 36} y2="500"
            stroke="rgba(201,168,76,0.06)" strokeWidth="0.5"
          />
        ))}

        {/* Equator */}
        <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(201,168,76,0.12)" strokeWidth="0.8" strokeDasharray="4 4" />
        {/* Prime Meridian */}
        <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(201,168,76,0.08)" strokeWidth="0.5" strokeDasharray="3 6" />

        {/* North America */}
        <path
          d="M 80 100 L 120 80 L 180 75 L 240 85 L 270 110 L 290 130 L 295 160 L 275 190 L 250 210 L 220 230 L 200 260 L 180 275 L 160 270 L 140 250 L 120 230 L 100 200 L 85 170 L 75 140 Z"
          className="country-path"
          fill="rgba(42, 74, 58, 0.25)"
          stroke="rgba(201,168,76,0.15)"
          strokeWidth="0.8"
        />
        {/* Greenland */}
        <path
          d="M 200 30 L 230 20 L 260 25 L 275 45 L 265 65 L 240 75 L 215 68 L 200 50 Z"
          fill="rgba(42, 74, 58, 0.15)"
          stroke="rgba(201,168,76,0.1)"
          strokeWidth="0.5"
        />
        {/* South America */}
        <path
          d="M 185 300 L 215 285 L 245 295 L 265 320 L 275 360 L 270 400 L 250 440 L 220 470 L 200 480 L 185 465 L 175 430 L 170 390 L 175 350 L 178 320 Z"
          className="country-path"
          fill="rgba(42, 74, 58, 0.25)"
          stroke="rgba(201,168,76,0.15)"
          strokeWidth="0.8"
        />
        {/* Europe */}
        <path
          d="M 420 80 L 460 70 L 500 75 L 530 85 L 545 105 L 540 125 L 520 140 L 500 145 L 480 155 L 460 160 L 440 155 L 420 140 L 410 120 L 412 100 Z"
          className="country-path"
          fill="rgba(42, 74, 58, 0.25)"
          stroke="rgba(201,168,76,0.15)"
          strokeWidth="0.8"
        />
        {/* Africa */}
        <path
          d="M 420 165 L 460 155 L 500 160 L 525 180 L 540 210 L 545 250 L 540 290 L 525 330 L 505 370 L 480 400 L 460 415 L 440 410 L 420 385 L 400 350 L 390 310 L 388 270 L 392 230 L 400 195 Z"
          className="country-path"
          fill="rgba(42, 74, 58, 0.25)"
          stroke="rgba(201,168,76,0.15)"
          strokeWidth="0.8"
        />
        {/* Asia */}
        <path
          d="M 545 70 L 600 60 L 660 55 L 720 60 L 780 70 L 840 80 L 880 100 L 900 130 L 895 160 L 870 185 L 840 200 L 800 210 L 760 215 L 720 220 L 680 225 L 640 220 L 600 210 L 565 195 L 545 170 L 540 140 L 542 105 Z"
          className="country-path"
          fill="rgba(42, 74, 58, 0.25)"
          stroke="rgba(201,168,76,0.15)"
          strokeWidth="0.8"
        />
        {/* South/Southeast Asia */}
        <path
          d="M 600 225 L 640 225 L 680 230 L 720 240 L 745 265 L 750 290 L 740 310 L 715 320 L 690 315 L 665 300 L 640 280 L 615 265 L 598 245 Z"
          className="country-path"
          fill="rgba(42, 74, 58, 0.2)"
          stroke="rgba(201,168,76,0.12)"
          strokeWidth="0.8"
        />
        {/* Japan */}
        <path
          d="M 808 145 L 820 135 L 830 140 L 835 155 L 825 165 L 812 162 Z"
          className="country-path"
          fill="rgba(42, 74, 58, 0.3)"
          stroke="rgba(201,168,76,0.2)"
          strokeWidth="0.8"
        />
        {/* Australia */}
        <path
          d="M 720 310 L 780 295 L 840 300 L 880 320 L 900 355 L 895 395 L 870 420 L 830 435 L 790 435 L 755 420 L 725 395 L 710 360 L 712 330 Z"
          className="country-path"
          fill="rgba(42, 74, 58, 0.2)"
          stroke="rgba(201,168,76,0.12)"
          strokeWidth="0.8"
        />
        {/* Antarctica */}
        <path
          d="M 150 480 L 300 475 L 450 478 L 600 475 L 750 478 L 900 480 L 920 495 L 750 500 L 500 500 L 250 500 L 80 495 Z"
          fill="rgba(180, 200, 220, 0.08)"
          stroke="rgba(201,168,76,0.08)"
          strokeWidth="0.5"
        />

        {/* Connection lines between pins */}
        {locations.map((loc, i) => {
          if (i === locations.length - 1) return null;
          const next = locations[i + 1];
          const x1 = loc.coords.x * 10;
          const y1 = loc.coords.y * 5;
          const x2 = next.coords.x * 10;
          const y2 = next.coords.y * 5;
          return (
            <line
              key={`line-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(201,168,76,0.12)"
              strokeWidth="0.6"
              strokeDasharray="3 5"
            />
          );
        })}

        {/* Location pins */}
        {locations.map((loc) => {
          const x = loc.coords.x * 10;
          const y = loc.coords.y * 5;
          const isActive = activeId === loc.id;

          return (
            <g
              key={loc.id}
              className="map-pin"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => onHover(loc.id)}
              onMouseLeave={() => onHover(null)}
            >
              {isActive && (
                <circle
                  cx={x} cy={y} r="12"
                  fill="none"
                  stroke="rgba(201,168,76,0.4)"
                  strokeWidth="1"
                  style={{ animation: "pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite" }}
                />
              )}
              <circle
                cx={x} cy={y} r={isActive ? "5" : "3.5"}
                fill={isActive ? "#C9A84C" : "rgba(201,168,76,0.7)"}
                stroke={isActive ? "#E8C96A" : "rgba(201,168,76,0.3)"}
                strokeWidth="1"
                style={{ transition: "all 0.3s ease" }}
              />
              <circle cx={x} cy={y} r="1.5" fill="#0D0B09" />

              {/* Coordinate crosshair */}
              <line x1={x - 8} y1={y} x2={x - 5} y2={y} stroke="rgba(201,168,76,0.4)" strokeWidth="0.5" />
              <line x1={x + 5} y1={y} x2={x + 8} y2={y} stroke="rgba(201,168,76,0.4)" strokeWidth="0.5" />
              <line x1={x} y1={y - 8} x2={x} y2={y - 5} stroke="rgba(201,168,76,0.4)" strokeWidth="0.5" />
              <line x1={x} y1={y + 5} x2={x} y2={y + 8} stroke="rgba(201,168,76,0.4)" strokeWidth="0.5" />
            </g>
          );
        })}

        {/* Compass rose */}
        <g transform="translate(940, 440)">
          <circle cx="0" cy="0" r="22" fill="rgba(13,11,9,0.8)" stroke="rgba(201,168,76,0.25)" strokeWidth="0.5" />
          <text x="0" y="-12" textAnchor="middle" fill="rgba(201,168,76,0.6)" fontSize="7" fontFamily="Oswald">N</text>
          <text x="0" y="17" textAnchor="middle" fill="rgba(201,168,76,0.3)" fontSize="5" fontFamily="Oswald">S</text>
          <text x="-14" y="3" textAnchor="middle" fill="rgba(201,168,76,0.3)" fontSize="5" fontFamily="Oswald">W</text>
          <text x="14" y="3" textAnchor="middle" fill="rgba(201,168,76,0.3)" fontSize="5" fontFamily="Oswald">E</text>
          <polygon points="0,-9 1.5,0 0,2 -1.5,0" fill="rgba(201,168,76,0.7)" />
          <polygon points="0,9 1.5,0 0,2 -1.5,0" fill="rgba(201,168,76,0.25)" />
        </g>

        {/* Scale indicator */}
        <g transform="translate(30, 480)">
          <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(201,168,76,0.4)" strokeWidth="0.8" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(201,168,76,0.4)" strokeWidth="0.8" />
          <line x1="60" y1="-4" x2="60" y2="4" stroke="rgba(201,168,76,0.4)" strokeWidth="0.8" />
          <text x="30" y="-7" textAnchor="middle" fill="rgba(201,168,76,0.4)" fontSize="5" fontFamily="IBM Plex Mono">5000 КМ</text>
        </g>
      </svg>
    </div>
  );
}

export default function Index() {
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<typeof LOCATIONS[0] | null>(null);

  const activeData = LOCATIONS.find(l => l.id === activeLocation);

  return (
    <div className="min-h-screen grid-bg" style={{ background: "#0D0B09" }}>

      {/* Ambient glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "300px",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-8 pt-8 pb-4 flex items-start justify-between">
        <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
            <span className="font-mono-custom text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(201,168,76,0.5)" }}>
              ANNO MMXXIV
            </span>
          </div>
          <h1
            className="font-display text-5xl font-light leading-none"
            style={{ color: "#E8D9B8", letterSpacing: "-0.01em" }}
          >
            TERRA
            <br />
            <span style={{ color: "#C9A84C" }}>INCOGNITA</span>
          </h1>
          <p className="font-mono-custom text-xs mt-2" style={{ color: "rgba(232,217,184,0.35)", letterSpacing: "0.15em" }}>
            АРХИВ ПУТЕШЕСТВИЙ / PERSONAL ATLAS
          </p>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-in-up flex gap-6"
          style={{ animationDelay: "200ms" }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="text-right relative corner-bracket p-3"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="stat-number text-3xl font-light"
                style={{ color: "#C9A84C" }}
              >
                {stat.value}
              </div>
              <div
                className="font-mono-custom text-xs uppercase tracking-widest"
                style={{ color: "rgba(232,217,184,0.35)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Divider */}
      <div
        className="mx-8 mb-6"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3) 20%, rgba(201,168,76,0.3) 80%, transparent)"
        }}
      />

      {/* Main layout */}
      <main className="relative z-10 px-8 grid gap-6" style={{ gridTemplateColumns: "1fr 300px" }}>

        {/* Map area */}
        <div
          className="relative animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <div
            className="relative rounded-sm overflow-hidden"
            style={{
              border: "1px solid rgba(201,168,76,0.15)",
              background: "rgba(13,11,9,0.6)",
            }}
          >
            {/* Corner decorations */}
            {[
              "top-0 left-0 border-t border-l",
              "top-0 right-0 border-t border-r",
              "bottom-0 left-0 border-b border-l",
              "bottom-0 right-0 border-b border-r",
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute w-5 h-5 ${cls}`}
                style={{ borderColor: "rgba(201,168,76,0.5)", margin: "6px", zIndex: 2 }}
              />
            ))}

            {/* Map header bar */}
            <div
              className="px-4 py-2 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}
            >
              <span className="font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>
                MERCATOR PROJECTION v2.4
              </span>
              <div className="flex items-center gap-4">
                {activeData && (
                  <span
                    className="font-mono-custom text-xs animate-fade-in-up"
                    style={{ color: "rgba(201,168,76,0.6)" }}
                  >
                    ◈ {activeData.lat} / {activeData.lng}
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#C9A84C", boxShadow: "0 0 6px #C9A84C" }} />
                  <span className="font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>
                    {LOCATIONS.length} ОБЪЕКТОВ
                  </span>
                </div>
              </div>
            </div>

            <WorldMapSVG
              locations={LOCATIONS}
              activeId={activeLocation}
              onHover={setActiveLocation}
            />

            {/* Tooltip */}
            {activeData && (
              <div
                className="map-tooltip absolute bottom-8 left-6 rounded-sm p-4 animate-fade-in-up"
                style={{ minWidth: "220px", maxWidth: "280px", zIndex: 10 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{activeData.emoji}</span>
                  <div>
                    <div className="font-title text-sm font-medium" style={{ color: "#E8D9B8", letterSpacing: "0.1em" }}>
                      {activeData.name.toUpperCase()}
                    </div>
                    <div className="font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>
                      {activeData.country} · {activeData.date}
                    </div>
                  </div>
                </div>
                <div className="h-px mb-2" style={{ background: "rgba(201,168,76,0.2)" }} />
                <p className="font-display text-sm italic" style={{ color: "rgba(232,217,184,0.6)", lineHeight: "1.6" }}>
                  {activeData.desc}
                </p>
                <div className="mt-2 font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.35)" }}>
                  {activeData.lat} · {activeData.lng}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div
          className="animate-fade-in-up space-y-2"
          style={{ animationDelay: "400ms" }}
        >
          <div
            className="flex items-center gap-2 mb-4"
            style={{ borderBottom: "1px solid rgba(201,168,76,0.1)", paddingBottom: "12px" }}
          >
            <Icon name="MapPin" size={12} color="rgba(201,168,76,0.5)" />
            <span className="font-mono-custom text-xs uppercase tracking-widest" style={{ color: "rgba(201,168,76,0.4)" }}>
              Журнал мест
            </span>
          </div>

          {LOCATIONS.map((loc, i) => (
            <div
              key={loc.id}
              className="location-card rounded-sm p-3 cursor-pointer"
              style={{
                background: activeLocation === loc.id
                  ? "rgba(201,168,76,0.08)"
                  : "rgba(13,11,9,0.6)",
                animationDelay: `${400 + i * 60}ms`,
              }}
              onMouseEnter={() => setActiveLocation(loc.id)}
              onMouseLeave={() => setActiveLocation(null)}
              onClick={() => setSelectedLocation(selectedLocation?.id === loc.id ? null : loc)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{loc.emoji}</span>
                  <div>
                    <div
                      className="font-title text-sm"
                      style={{
                        color: activeLocation === loc.id ? "#C9A84C" : "#E8D9B8",
                        letterSpacing: "0.08em",
                        transition: "color 0.3s"
                      }}
                    >
                      {loc.name.toUpperCase()}
                    </div>
                    <div className="font-mono-custom text-xs" style={{ color: "rgba(232,217,184,0.3)" }}>
                      {loc.country}
                    </div>
                  </div>
                </div>
                <div className="font-mono-custom text-xs text-right" style={{ color: "rgba(201,168,76,0.35)", whiteSpace: "nowrap" }}>
                  {loc.date.split(" ")[1]}
                </div>
              </div>

              {selectedLocation?.id === loc.id && (
                <div
                  className="mt-3 pt-3 animate-fade-in-up"
                  style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}
                >
                  <p className="font-display text-xs italic mb-2" style={{ color: "rgba(232,217,184,0.5)", lineHeight: "1.7" }}>
                    {loc.desc}
                  </p>
                  <div className="font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.3)" }}>
                    {loc.lat} · {loc.lng}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add button */}
          <button
            className="w-full mt-4 rounded-sm py-3 flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              border: "1px dashed rgba(201,168,76,0.2)",
              color: "rgba(201,168,76,0.35)",
              background: "transparent",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "rgba(201,168,76,0.45)";
              el.style.color = "rgba(201,168,76,0.65)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "rgba(201,168,76,0.2)";
              el.style.color = "rgba(201,168,76,0.35)";
            }}
          >
            <Icon name="Plus" size={14} />
            <span className="font-mono-custom text-xs uppercase tracking-widest">Добавить место</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-6 mt-8 flex items-center justify-between">
        <div
          className="h-px flex-1"
          style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.15), transparent)" }}
        />
        <span
          className="mx-6 font-mono-custom text-xs"
          style={{ color: "rgba(201,168,76,0.2)", letterSpacing: "0.2em" }}
        >
          TERRA INCOGNITA · {new Date().getFullYear()}
        </span>
        <div
          className="h-px flex-1"
          style={{ background: "linear-gradient(270deg, rgba(201,168,76,0.15), transparent)" }}
        />
      </footer>
    </div>
  );
}
