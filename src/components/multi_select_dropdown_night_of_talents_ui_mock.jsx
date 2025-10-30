import { useEffect, useMemo, useRef, useState } from "react";

const RAW_NOMINEES = [
  "Дарья Ситливая","Вадим Матюшкин","Анастасия Пахоменкова","Никита Сычихин","Иван Стрелецкий","Евгения Шилова","Айбике Джаныбекова","Евгения Коршунова","Анна Скуйбида","Даниил Маркин","Наталья Бабенко","Роман Вяткин","Никита Симонов","Артем Добровольский","Кирилл Юдин","Александр Карпачев","Михаил Казанцев","Маргарита Буракова","Игорь Пирогов","Денис Майстренко","Екатерина Колычева","Анна Косарева","Александра Аверина","Виктория Филиппова","Ирина Месе","Алиса Закирова","Александр Меркулов","Лахан Шарма","Максим Ермолов","Анатолий Якунин","Шиям Ядагири","Ульяна Конева","Камиль Салямов",
];

function cn(...c){ return c.filter(Boolean).join(" "); }

function initialsFrom(full){
  const parts = (full || "").trim().split(/\s+/);
  const a = parts[0]?.[0] || "";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase();
}

function useKeyboardNav(itemsCount, isOpen){
  const [active, setActive] = useState(-1);
  useEffect(() => { if(!isOpen) setActive(-1); }, [isOpen]);
  return {
    active,
    setActive,
    onKeyDown: (e) => {
      if(!isOpen) return;
      if(e.key === "ArrowDown"){ e.preventDefault(); setActive(i => (i + 1) % Math.max(1, itemsCount)); }
      if(e.key === "ArrowUp"){ e.preventDefault(); setActive(i => (i - 1 + Math.max(1, itemsCount)) % Math.max(1, itemsCount)); }
    }
  };
}

export default function NightOfTalentsMultiSelect({ language = "ru" }){
  const t = {
    ru: {
      headerTitle: "Номинация: выберите коллег(у)",
      headerDesc: "Можно выбрать любое количество людей из выпадающего списка (мультивыбор). Введите пару букв для поиска.",
      selected: "Выбрано",
      search: "Поиск…",
      selectAll: "Выбрать всех из результата",
      clear: "Очистить выбор",
      empty: "Ничего не найдено",
      hint: "Подсказка: ↑/↓ — перемещение, Enter/Space — выбрать.",
      chipRemoveAria: (name) => `Убрать ${name}`,
      ctaClear: "Очистить",
      ctaSave: "Сохранить выбор",
      chosen: "Выбрано:",
    },
    en: {
      headerTitle: "Nomination: pick colleagues",
      headerDesc: "You can pick multiple people. Start typing to filter.",
      selected: "Selected",
      search: "Search…",
      selectAll: "Select all from results",
      clear: "Clear selection",
      empty: "No results",
      hint: "Hint: use ↑/↓ to move, Enter/Space to select.",
      chipRemoveAria: (name) => `Remove ${name}`,
      ctaClear: "Clear",
      ctaSave: "Save selection",
      chosen: "Chosen:",
    }
  }[language];

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]); // stores nominee IDs
  const rootRef = useRef(null);

  const nominees = useMemo(() => RAW_NOMINEES.map((name, idx) => ({
    id: idx,
    name,
    initials: initialsFrom(name),
    firstTwo: (name || "").trim().split(/\s+/).slice(0,2).join(" "),
  })), []);

  const filtered = useMemo(() => {
    if(!query.trim()) return nominees;
    const q = query.toLowerCase();
    return nominees.filter(n => n.name.toLowerCase().includes(q));
  }, [nominees, query]);

  const { active, setActive, onKeyDown } = useKeyboardNav(filtered.length, open);

  useEffect(() => {
    const onDocClick = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggleById(id){
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function clearAll(){ setSelected([]); }
  function selectAllFiltered(){
    const ids = filtered.map(f => f.id);
    const toAdd = ids.filter(n => !selected.includes(n));
    if(toAdd.length) setSelected(p => [...p, ...toAdd]);
  }

  function handleItemActivate(index){
    const item = filtered[index];
    if(!item) return;
    toggleById(item.id);
  }
  function handleKeyActivate(e){
    if(!open) return;
    if(e.key === "Enter" || e.key === " "){ e.preventDefault(); handleItemActivate(active); }
  }

  return (
    <div className="w-full text-white z-[9] ">
      <div>
        {/* <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{t.headerTitle}</h1>
          <p className="text-sm text-white/70 mt-1">{t.headerDesc}</p>
        </div> */}

        {selected.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selected.map((id) => {
              const s = nominees.find(n => n.id === id);
              if(!s) return null;
              return <Chip key={id} name={s.name} onRemove={() => toggleById(id)} />;
            })}
          </div>
        )}

        <div ref={rootRef}   className="relative z-[9999] overflow-visible"onKeyDown={(e) => { onKeyDown(e); handleKeyActivate(e); }}>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="w-full rounded-2xl mb-4 border border-white/10 bg-white/5 backdrop-blur px-4 py-3 text-left hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-[#7a5cff]/60"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">{selected.length}</span>
                <span className="text-sm text-white/80">{selected.length > 0 ? t.selected : t.search}</span>
              </div>
              <svg className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "rotate-0")} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </div>
          </button>

          {open && (
            <div role="listbox" style={{ backgroundColor: "#141414",maxHeight: '500px',
    overflowY: 'auto' }} aria-multiselectable className="absolute z-[9999] scrollbar-styled mt-2 max-h-[520px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-2xl">
              <div className="p-3 border-b border-white/10 bg-white/5 backdrop-blur">
                <div className="flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2">
                  <svg viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 text-white/60"><circle cx="11" cy="11" r="7" fill="none" strokeWidth="1.5"/><path d="M20 20l-3.5-3.5" strokeWidth="1.5"/></svg>
                  <input
                    aria-label={t.search}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                    autoFocus
                    placeholder={t.search}
                    className="w-full bg-transparent text-sm placeholder:text-white/40 focus:outline-none"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                  <button onClick={selectAllFiltered} className="hover:text-white/90">{t.selectAll}</button>
                  <button onClick={clearAll} className="hover:text-white/90">{t.clear}</button>
                </div>
              </div>

              <ul className="max-h-[420px] overflow-auto p-2 scrollbar-styled">
                {filtered.length === 0 && (<li className="px-3 py-6 text-center text-sm text-white/60">{t.empty}</li>)}
                {filtered.map((n, idx) => {
                  const isActive = idx === active;
                  const isChecked = selected.includes(n.id);
                  return (
                    <li
                      key={n.id}
                      role="option"
                                            style={{
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  cursor:"pointer"
}}
                      aria-selected={isChecked}
                      tabIndex={-1}
                      onMouseEnter={() => setActive(idx)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => toggleById(n.id)}
                      className={cn("group grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 py-2", isActive ? "bg-white/10" : "hover:bg-white/5")}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#7a5cff] to-[#25d0ff] text-[11px] font-semibold">
                          {n.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{n.firstTwo}</div>
                          <div className="truncate text-[11px] text-white/60"></div>
                        </div>
                      </div>
                      <div className={cn("h-5 w-5 rounded-md border flex items-center justify-center", isChecked ? "bg-[#7a5cff] border-[#7a5cff]" : "border-white/30")} aria-hidden>
                        {isChecked && <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" className="h-3 w-3"><path d="M5 10l3 3 7-7" /></svg>}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-white/10 p-3 text-[11px] text-white/60">{t.hint}</div>
            </div>
          )}
        </div>

        {/* <div className="inset-x-0 bottom-0 z-10">
          <div className="">
            <div className="rounded-2xl border border-white/10 bg-[#0f1122]/80 backdrop-blur p-4 flex items-center justify-between">
              <div className="text-sm text-white/70">
                {t.chosen} <span className="font-medium text-white">{selected.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearAll} className="px-4 py-2 text-sm rounded-xl border border-white/15 hover:bg-white/10">{t.ctaClear}</button>
                <button className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-[#7a5cff] to-[#25d0ff] text-black font-semibold hover:opacity-90">{t.ctaSave}</button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

function Chip({ name, onRemove }){
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold">{initialsFrom(name)}</span>
      <span className="max-w-[240px] truncate">{name}</span>
      <button onClick={onRemove} className="ml-0.5 rounded-full p-0.5 hover:bg-white/10" aria-label={`Убрать ${name}`}>
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M10 8.586L6.707 5.293a1 1 0 10-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 101.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 00-1.414-1.414L10 8.586z" clipRule="evenodd" />
        </svg>
      </button>
    </span>
  );
}

