import { useState, useRef, useEffect } from "react";
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

function formatCoord(value: number, isLat: boolean): string {
  const dir = isLat ? (value >= 0 ? "N" : "S") : (value >= 0 ? "E" : "W");
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const min = Math.floor((abs - deg) * 60);
  return `${deg}°${min.toString().padStart(2, "0")}'${dir}`;
}

export default function Index() {
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", country: "", lat: "", lng: "", date: "", desc: "", emoji: "📍" });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 10],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (locations.length > 1) {
      polylineRef.current = L.polyline(
        locations.map(l => [l.lat, l.lng] as [number, number]),
        { color: "#C9A84C", weight: 1, opacity: 0.4, dashArray: "4 6" }
      ).addTo(map);
    }

    locations.forEach(loc => {
      const icon = L.divIcon({
        className: "custom-pin",
        html: '<div class="pin-dot"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -10],
      });

      const popupHtml = `
        <div>
          <div class="pin-popup-title">${loc.emoji} ${loc.name}</div>
          <div class="pin-popup-meta">${loc.country} · ${loc.date}</div>
          <div class="pin-popup-desc">${loc.desc}</div>
          <div class="pin-popup-coords">${formatCoord(loc.lat, true)} · ${formatCoord(loc.lng, false)}</div>
        </div>
      `;

      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(popupHtml);

      marker.on("click", () => setActiveLocation(loc.id));
      markersRef.current[loc.id] = marker;
    });
  }, [locations]);

  const handleSelectLocation = (loc: Location) => {
    setActiveLocation(loc.id);
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([loc.lat, loc.lng], 5, { duration: 1.4 });
    setTimeout(() => {
      markersRef.current[loc.id]?.openPopup();
    }, 1500);
  };

  const resetForm = () => {
    setForm({ name: "", country: "", lat: "", lng: "", date: "", desc: "", emoji: "📍" });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleStartEdit = (loc: Location) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name,
      country: loc.country,
      lat: String(loc.lat),
      lng: String(loc.lng),
      date: loc.date,
      desc: loc.desc,
      emoji: loc.emoji,
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    setLocations(locations.filter(l => l.id !== id));
    if (editingId === id) resetForm();
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (!form.name || isNaN(lat) || isNaN(lng)) return;

    if (editingId !== null) {
      const updated: Location = {
        id: editingId,
        name: form.name,
        country: form.country || "—",
        lat, lng,
        date: form.date || "—",
        desc: form.desc || "Новое место в архиве.",
        emoji: form.emoji || "📍",
      };
      setLocations(locations.map(l => l.id === editingId ? updated : l));
      resetForm();
      setTimeout(() => handleSelectLocation(updated), 300);
    } else {
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
      resetForm();
      setTimeout(() => handleSelectLocation(newLoc), 300);
    }
  };

  return (
    <div className="min-h-screen grid-bg" style={{ background: "#0D0B09" }}>
      <div className="fixed pointer-events-none" style={{ top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)", zIndex: 0 }} />

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

      <main className="relative z-10 px-8 grid gap-6 pb-8" style={{ gridTemplateColumns: "1fr 320px" }}>
        <div className="relative animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="relative rounded-sm overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.15)", background: "rgba(13,11,9,0.6)" }}>
            <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
              <span className="font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>MERCATOR LIVE · OPENSTREETMAP</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full animate-glow" style={{ background: "#C9A84C" }} />
                <span className="font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>{locations.length} ОБЪЕКТОВ</span>
              </div>
            </div>

            <div ref={mapContainerRef} style={{ height: "780px", width: "100%" }} />
          </div>

          {showAddForm && (
            <div className="mt-4 p-4 animate-fade-in-up rounded-sm" style={{ border: "1px solid rgba(201,168,76,0.25)", background: "rgba(13,11,9,0.8)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-custom text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
                  {editingId !== null ? "Редактирование" : "Новая координата"}
                </span>
                <button onClick={resetForm} style={{ color: "rgba(201,168,76,0.5)" }}>
                  <Icon name="X" size={14} />
                </button>
              </div>
              <form onSubmit={handleSubmitForm} className="grid grid-cols-2 gap-3">
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
                  ◈ {editingId !== null ? "Сохранить изменения" : "Сохранить в архив"}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="animate-fade-in-up space-y-2" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={12} className="text-[rgba(201,168,76,0.5)]" />
              <span className="font-mono-custom text-xs uppercase tracking-widest" style={{ color: "rgba(201,168,76,0.4)" }}>Журнал мест</span>
            </div>
            <button onClick={() => { resetForm(); setShowAddForm(true); }} className="flex items-center gap-1 px-2 py-1 rounded-sm transition-all"
              style={{ border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C" }}>
              <Icon name="Plus" size={11} />
              <span className="font-mono-custom text-[10px] uppercase tracking-widest">Добавить</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[820px] overflow-y-auto pr-2">
            {locations.map(loc => (
              <div
                key={loc.id}
                className="location-card rounded-sm p-3 cursor-pointer group"
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
                <div className="mt-2 pt-2 flex items-center justify-between" style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}>
                  <span className="font-mono-custom text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>
                    {formatCoord(loc.lat, true)} · {formatCoord(loc.lng, false)}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStartEdit(loc); }}
                      className="p-1 rounded-sm transition-all hover:bg-[rgba(201,168,76,0.15)]"
                      style={{ color: "rgba(201,168,76,0.7)" }}
                      title="Редактировать"
                    >
                      <Icon name="Pencil" size={11} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(loc.id); }}
                      className="p-1 rounded-sm transition-all hover:bg-[rgba(180,60,60,0.2)]"
                      style={{ color: "rgba(220,120,100,0.7)" }}
                      title="Удалить"
                    >
                      <Icon name="Trash2" size={11} />
                    </button>
                  </div>
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