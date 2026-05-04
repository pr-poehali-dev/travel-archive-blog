import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import Icon from "@/components/ui/icon";

type Location = {
  id: number;
  name: string;
  country: string;
  lat: number;
  lng: number;
  date: string;
  desc: string;
  emoji: string;
};

const INITIAL_LOCATIONS: Location[] = [
  { id: 1, name: "Токио", country: "Япония", lat: 35.6762, lng: 139.6503, date: "Март 2023", desc: "Неоновые улицы Синдзюку, тишина храма Мэйдзи, сакура в Уэно.", emoji: "🌸" },
  { id: 2, name: "Рейкьявик", country: "Исландия", lat: 64.1466, lng: -21.9426, date: "Декабрь 2022", desc: "Северное сияние над чёрными пляжами. Геотермальные бассейны под звёздами.", emoji: "🌌" },
  { id: 3, name: "Марракеш", country: "Марокко", lat: 31.6295, lng: -7.9811, date: "Октябрь 2023", desc: "Лабиринты медины. Запах специй на площади Джемаа-эль-Фна.", emoji: "🏮" },
  { id: 4, name: "Буэнос-Айрес", country: "Аргентина", lat: -34.6037, lng: -58.3816, date: "Февраль 2022", desc: "Страстное танго в Сан-Тельмо. Бесконечные бульвары и стейкхаусы.", emoji: "💃" },
  { id: 5, name: "Луанг-Прабанг", country: "Лаос", lat: 19.8845, lng: 102.1348, date: "Январь 2024", desc: "Монахи на рассвете. Водопады Куанг Си. Меконг на закате.", emoji: "🛕" },
  { id: 6, name: "Тбилиси", country: "Грузия", lat: 41.7151, lng: 44.8271, date: "Май 2023", desc: "Серные бани в Абанотубани. Вино и хинкали. Старый город.", emoji: "🍷" },
  { id: 7, name: "Лиссабон", country: "Португалия", lat: 38.7223, lng: -9.1393, date: "Июнь 2024", desc: "Жёлтые трамваи, фаду в Альфаме, паштел-де-ната у океана.", emoji: "🚋" },
];

const STATS = [
  { label: "Стран", value: "23" },
  { label: "Городов", value: "67" },
  { label: "Километров", value: "84к" },
  { label: "Лет в пути", value: "6" },
];

const customIcon = L.divIcon({
  className: "custom-pin",
  html: '<div class="pin-dot"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

function formatCoord(value: number, isLat: boolean): string {
  const dir = isLat ? (value >= 0 ? "N" : "S") : (value >= 0 ? "E" : "W");
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const min = Math.floor((abs - deg) * 60);
  return `${deg}°${min.toString().padStart(2, "0")}'${dir}`;
}

function FlyToLocation({ target }: { target: Location | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 5, { duration: 1.4 });
    }
  }, [target, map]);
  return null;
}

export default function Index() {
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  const [flyTarget, setFlyTarget] = useState<Location | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", country: "", lat: "", lng: "", date: "", desc: "", emoji: "📍" });
  const markerRefs = useRef<Record<number, L.Marker | null>>({});

  const polylineCoords: [number, number][] = locations.map(l => [l.lat, l.lng]);

  const handleSelectLocation = (loc: Location) => {
    setActiveLocation(loc.id);
    setFlyTarget(loc);
    setTimeout(() => {
      markerRefs.current[loc.id]?.openPopup();
    }, 1500);
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (!form.name || isNaN(lat) || isNaN(lng)) return;

    const newLoc: Location = {
      id: Date.now(),
      name: form.name,
      country: form.country || "—",
      lat, lng,
      date: form.date || "—",
      desc: form.desc || "Новое место в архиве.",
      emoji: form.emoji || "📍",
    };
    setLocations([...locations, newLoc]);
    setForm({ name: "", country: "", lat: "", lng: "", date: "", desc: "", emoji: "📍" });
    setShowAddForm(false);
    setTimeout(() => handleSelectLocation(newLoc), 100);
  };

  return (
    <div className="min-h-screen grid-bg" style={{ background: "#0D0B09" }}>
      <div className="fixed pointer-events-none" style={{ top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)", zIndex: 0 }} />

      {/* Header */}
      <header className="relative z-10 px-8 pt-8 pb-4 flex items-start justify-between flex-wrap gap-4">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
            <span className="font-mono-custom text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(201,168,76,0.5)" }}>ANNO MMXXIV</span>
          </div>
          <h1 className="font-display text-5xl font-light leading-none" style={{ color: "#E8D9B8", letterSpacing: "-0.01em" }}>
            TERRA<br /><span style={{ color: "#C9A84C" }}>INCOGNITA</span>
          </h1>
          <p className="font-mono-custom text-xs mt-2" style={{ color: "rgba(232,217,184,0.35)", letterSpacing: "0.15em" }}>
            АРХИВ ПУТЕШЕСТВИЙ / PERSONAL ATLAS
          </p>
        </div>

        <div className="animate-fade-in-up flex gap-6" style={{ animationDelay: "200ms" }}>
          {STATS.map(stat => (
            <div key={stat.label} className="text-right relative corner-bracket p-3">
              <div className="stat-number text-3xl font-light" style={{ color: "#C9A84C" }}>{stat.value}</div>
              <div className="font-mono-custom text-xs uppercase tracking-widest" style={{ color: "rgba(232,217,184,0.35)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="mx-8 mb-6" style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3) 20%, rgba(201,168,76,0.3) 80%, transparent)" }} />

      {/* Main */}
      <main className="relative z-10 px-8 grid gap-6 pb-8" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* MAP */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="relative rounded-sm overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.15)", background: "rgba(13,11,9,0.6)" }}>
            {/* Header bar */}
            <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
              <span className="font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>MERCATOR LIVE · OPENSTREETMAP</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full animate-glow" style={{ background: "#C9A84C" }} />
                <span className="font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>{locations.length} ОБЪЕКТОВ</span>
              </div>
            </div>

            {/* Real Map */}
            <div style={{ height: "560px", width: "100%", position: "relative" }}>
              <MapContainer
                center={[20, 10]}
                zoom={2}
                minZoom={2}
                maxZoom={18}
                style={{ height: "100%", width: "100%" }}
                worldCopyJump={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline
                  positions={polylineCoords}
                  pathOptions={{ color: "#C9A84C", weight: 1, opacity: 0.4, dashArray: "4 6" }}
                />
                {locations.map(loc => (
                  <Marker
                    key={loc.id}
                    position={[loc.lat, loc.lng]}
                    icon={customIcon}
                    ref={(ref) => { markerRefs.current[loc.id] = ref; }}
                    eventHandlers={{
                      mouseover: () => setActiveLocation(loc.id),
                      mouseout: () => setActiveLocation(null),
                      click: () => setActiveLocation(loc.id),
                    }}
                  >
                    <Popup>
                      <div>
                        <div className="pin-popup-title">{loc.emoji} {loc.name}</div>
                        <div className="pin-popup-meta">{loc.country} · {loc.date}</div>
                        <div className="pin-popup-desc">{loc.desc}</div>
                        <div className="pin-popup-coords">
                          {formatCoord(loc.lat, true)} · {formatCoord(loc.lng, false)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                <FlyToLocation target={flyTarget} />
              </MapContainer>
            </div>
          </div>

          {/* Add form */}
          {showAddForm && (
            <div className="mt-4 p-4 animate-fade-in-up rounded-sm" style={{ border: "1px solid rgba(201,168,76,0.25)", background: "rgba(13,11,9,0.8)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-custom text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>Новая координата</span>
                <button onClick={() => setShowAddForm(false)} style={{ color: "rgba(201,168,76,0.5)" }}>
                  <Icon name="X" size={14} />
                </button>
              </div>
              <form onSubmit={handleAddLocation} className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Город" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="px-3 py-2 text-sm font-mono-custom rounded-sm" style={{ background: "rgba(13,11,9,0.6)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D9B8" }} />
                <input type="text" placeholder="Страна" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                  className="px-3 py-2 text-sm font-mono-custom rounded-sm" style={{ background: "rgba(13,11,9,0.6)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D9B8" }} />
                <input type="number" step="any" placeholder="Широта (lat)" required value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })}
                  className="px-3 py-2 text-sm font-mono-custom rounded-sm" style={{ background: "rgba(13,11,9,0.6)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D9B8" }} />
                <input type="number" step="any" placeholder="Долгота (lng)" required value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })}
                  className="px-3 py-2 text-sm font-mono-custom rounded-sm" style={{ background: "rgba(13,11,9,0.6)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D9B8" }} />
                <input type="text" placeholder="Дата (Май 2024)" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="px-3 py-2 text-sm font-mono-custom rounded-sm" style={{ background: "rgba(13,11,9,0.6)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D9B8" }} />
                <input type="text" placeholder="Эмодзи" maxLength={2} value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })}
                  className="px-3 py-2 text-sm font-mono-custom rounded-sm" style={{ background: "rgba(13,11,9,0.6)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D9B8" }} />
                <textarea placeholder="Описание места..." rows={2} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
                  className="px-3 py-2 text-sm font-display italic rounded-sm col-span-2" style={{ background: "rgba(13,11,9,0.6)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D9B8" }} />
                <button type="submit" className="col-span-2 py-2 text-sm font-mono-custom uppercase tracking-widest rounded-sm transition-all"
                  style={{ background: "rgba(201,168,76,0.2)", border: "1px solid #C9A84C", color: "#E8C96A" }}>
                  ◈ Сохранить в архив
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="animate-fade-in-up space-y-2" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={12} className="text-[rgba(201,168,76,0.5)]" />
              <span className="font-mono-custom text-xs uppercase tracking-widest" style={{ color: "rgba(201,168,76,0.4)" }}>Журнал мест</span>
            </div>
            <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1 px-2 py-1 rounded-sm transition-all"
              style={{ border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C" }}>
              <Icon name="Plus" size={11} />
              <span className="font-mono-custom text-[10px] uppercase tracking-widest">Добавить</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {locations.map(loc => (
              <div
                key={loc.id}
                className="location-card rounded-sm p-3 cursor-pointer"
                style={{ background: activeLocation === loc.id ? "rgba(201,168,76,0.08)" : "rgba(13,11,9,0.6)" }}
                onMouseEnter={() => setActiveLocation(loc.id)}
                onMouseLeave={() => setActiveLocation(null)}
                onClick={() => handleSelectLocation(loc)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{loc.emoji}</span>
                    <div>
                      <div className="font-title text-sm" style={{ color: activeLocation === loc.id ? "#C9A84C" : "#E8D9B8", letterSpacing: "0.08em", transition: "color 0.3s" }}>
                        {loc.name.toUpperCase()}
                      </div>
                      <div className="font-mono-custom text-xs" style={{ color: "rgba(232,217,184,0.3)" }}>{loc.country}</div>
                    </div>
                  </div>
                  <div className="font-mono-custom text-xs text-right" style={{ color: "rgba(201,168,76,0.35)", whiteSpace: "nowrap" }}>
                    {loc.date.split(" ")[1] || loc.date}
                  </div>
                </div>
                <div className="mt-2 pt-2 font-mono-custom text-xs" style={{ borderTop: "1px solid rgba(201,168,76,0.08)", color: "rgba(201,168,76,0.4)" }}>
                  {formatCoord(loc.lat, true)} · {formatCoord(loc.lng, false)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-8 py-6 flex items-center justify-between">
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.15), transparent)" }} />
        <span className="mx-6 font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.2)", letterSpacing: "0.2em" }}>
          TERRA INCOGNITA · {new Date().getFullYear()}
        </span>
        <div className="h-px flex-1" style={{ background: "linear-gradient(270deg, rgba(201,168,76,0.15), transparent)" }} />
      </footer>
    </div>
  );
}
