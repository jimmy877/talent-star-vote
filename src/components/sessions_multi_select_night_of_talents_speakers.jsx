import { useEffect, useMemo, useRef, useState } from "react";

const RAW_SESSIONS = [
  { name: "Марина Никитина", title: "Биржа Bybit: пошаговое руководство для начинающих полезность при условии роста долларов, проработка сопротивлений" },
  { name: "Юлия Сидорова", title: "Магическое мышление - как его используют в бизнесе, продажах, HR и не только" },
  { name: "Владислав Постоев", title: "Production - это сердце исполнения задач и достижения результатов" },
  { name: "Дарья Складчикова", title: "Reflection Session" },
  { name: "Айбике Джаныбекова", title: "Как мы принимаем решения и что такое когнитивные искажения" },
  { name: "Евгения Шилова", title: "Репутация через визуал: сила дизайна" },
  { name: "Владислав Постоев", title: "Способы и принципы постановки задач" },
  { name: "Юлия Сидорова", title: "Погружение в маркетинг (цикл из двух частей)" },
  { name: "Вадим Матюшшкин", title: "Портрет заказчика продуктов и услуг в сфере управления репутацией и как эти продукты и услуги связаны с его целями и ценностями" },
  { name: "Антон Глотов", title: "IT-отдел: кто мы, чем живём и зачем всё это вам" },
  { name: "Вадим Матюшкин", title: "Маркетинг лекции (цикл из 4 лекций)" },
  { name: "Никита Симонов", title: "Нейросети в работе и повседневном пользовании" },
  { name: "Артем Добровольский", title: "PR - синергия аналитики и творчества" },
  { name: "Илья Воронцов", title: "OSINT" },
  { name: "Дина Сухинина", title: "LinkedIn for Work and Life" },
  { name: "Екатерина Колычева", title: "Личный бренд как двигатель вовлечения: ежедневные микродействия для бо́льшего эффекта" },
  { name: "Ольга Кабрас", title: "Перерыв как стратегия: зачем нам нужны паузы и почему отдых - это часть работы" },
  { name: "Александр Меркулов", title: "Generative Engine Optimization: что это такое и почему за GEO будущее?" },
];

function cn(...c){ return c.filter(Boolean).join(" "); }

function firstTwo(full){
  const parts = (full || "").trim().split(/\s+/);
  return parts.slice(0,2).join(" ");
}

function initialsFrom(full){
  const p = (full || "").trim().split(/\s+/);
  const a = p[0]?.[0] || "";
  const b = p[1]?.[0] || "";
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

export default function SessionsMultiSelect({ language = "ru", onChange }){
  const t = {
    ru: {
      headerTitle: "Список степов — мультивыбор",
      headerDesc: "Первая строка — фамилия и имя (первые два слова), вторая — название степа. Можно выбрать несколько.",
      selected: "Выбрано",
      search: "Поиск…",
      selectAll: "Выбрать всех из результата",
      clear: "Очистить",
      empty: "Ничего не найдено",
      hint: "Подсказка: ↑/↓ — перемещение, Enter/Space — выбрать.",
      chipRemoveAria: (name) => `Убрать ${name}`,
    },
    en: {
      headerTitle: "Sessions — multi-select",
      headerDesc: "Line 1: surname + name; Line 2: session title. Multi-select allowed.",
      selected: "Selected",
      search: "Search…",
      selectAll: "Select all from results",
      clear: "Clear",
      empty: "No results",
      hint: "Hint: ↑/↓ to move, Enter/Space to select.",
      chipRemoveAria: (name) => `Remove ${name}`,
    }
  }[language];

  // Clean i18n texts independent from original encoding
  const i18n = useMemo(() => (
    language === 'ru'
      ? {
          headerTitle: 'Список степов — мультивыбор',
          headerDesc: 'Первая строка — фамилия и имя (первые два слова), вторая — название степа. Можно выбрать несколько.',
          selected: 'Выбрано',
          search: 'Поиск…',
          selectAll: 'Выбрать всех из результата',
          clear: 'Очистить',
          empty: 'Ничего не найдено',
          hint: 'Подсказка: ↑/↓ — перемещение, Enter/Space — выбрать.',
          chipRemoveAria: (name) => `Удалить ${name}`,
        }
      : {
          headerTitle: 'Sessions — multi-select',
          headerDesc: 'Line 1: surname + name; Line 2: session title. Multi-select allowed.',
          selected: 'Selected',
          search: 'Search…',
          selectAll: 'Select all from results',
          clear: 'Clear',
          empty: 'No results',
          hint: 'Hint: ↑/↓ to move, Enter/Space to select.',
          chipRemoveAria: (name) => `Remove ${name}`,
        }
  ), [language]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]); // stores ids
  const rootRef = useRef(null);

  function ruToEn(str){
    const map = {А:'A',Б:'B',В:'V',Г:'G',Д:'D',Е:'E',Ё:'Yo',Ж:'Zh',З:'Z',И:'I',Й:'Y',К:'K',Л:'L',М:'M',Н:'N',О:'O',П:'P',Р:'R',С:'S',Т:'T',У:'U',Ф:'F',Х:'Kh',Ц:'Ts',Ч:'Ch',Ш:'Sh',Щ:'Sch',Ъ:'',Ы:'Y',Ь:'',Э:'E',Ю:'Yu',Я:'Ya',а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
    return (str||'').split('').map(ch => map[ch] ?? ch).join('');
  }
  const sessions = useMemo(() => RAW_SESSIONS.map((s, idx) => {
    const name = language === 'en' ? ruToEn(s.name) : s.name;
    const title = language === 'en' ? ruToEn(s.title) : s.title;
    return {
      id: idx,
      name,
      title,
      initials: initialsFrom(name),
      firstTwo: firstTwo(name),
    };
  }), [language]);

  const filtered = useMemo(() => {
    if(!query.trim()) return sessions;
    const q = query.toLowerCase();
    return sessions.filter(s =>
      s.name.toLowerCase().includes(q) || s.title.toLowerCase().includes(q) || s.firstTwo.toLowerCase().includes(q)
    );
  }, [sessions, query]);

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
    const toAdd = ids.filter(id => !selected.includes(id));
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

  // Notify parent about selection (speaker names only)
  useEffect(() => {
    if (typeof onChange === 'function') {
      const names = selected
        .map(id => sessions.find(s => s.id === id)?.name)
        .filter(Boolean);
      try { onChange(names); } catch (_) {}
    }
  }, [selected, sessions, onChange]);

  return (
    <div className="w-full text-white  z-[9]">
      <div>
        {/* <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{t.headerTitle}</h1>
          <p className="text-sm text-white/70 mt-1">{t.headerDesc}</p>
        </div> */}

        {selected.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selected.map((id) => {
              const s = sessions.find(x => x.id === id);
              if(!s) return null;
              return <Chip key={id} s={s} onRemove={() => toggleById(id)} />;
            })}
          </div>
        )}

        <div ref={rootRef}   className="relative z-[9999] overflow-visible" onKeyDown={(e) => { onKeyDown(e); handleKeyActivate(e); }}>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3 text-left hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-[#7a5cff]/60"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">{selected.length}</span>
                <span className="text-sm text-white/80">{selected.length > 0 ? i18n.selected : i18n.search}</span>
              </div>
              <svg className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "rotate-0")} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </div>
          </button>

          {open && (
            <div role="listbox" aria-multiselectable className="scrollbar-styled absolute z-[9999] mt-2 max-h-[520px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-2xl" style={{ backgroundColor: "#141414",maxHeight: '500px',
    overflowY: 'auto'  }}>
              <div className="p-3 border-b border-white/10 bg-white/5 backdrop-blur">
                <div className="flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2">
                  <svg viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 text-white/60"><circle cx="11" cy="11" r="7" fill="none" strokeWidth="1.5"/><path d="M20 20l-3.5-3.5" strokeWidth="1.5"/></svg>
                  <input
                    aria-label={i18n.search}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                    autoFocus
                    placeholder={i18n.search}
                    className="w-full bg-transparent text-sm placeholder:text-white/40 focus:outline-none"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                  <button onClick={selectAllFiltered} className="hover:text-white/90">{i18n.selectAll}</button>
                  <button onClick={clearAll} className="hover:text-white/90">{i18n.clear}</button>
                </div>
              </div>

              <ul className="max-h-[420px] overflow-auto p-2 scrollbar-styled">
                {filtered.length === 0 && (<li className="px-3 py-6 text-center text-sm text-white/60">{i18n.empty}</li>)}
                {filtered.map((s, idx) => {
                  const isActive = idx === active;
                  const isChecked = selected.includes(s.id);
                  return (
                    <li
                      key={s.id}
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
                      onClick={() => toggleById(s.id)}
                      className={cn("group grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 py-2", isActive ? "bg-white/10" : "hover:bg-white/5")}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#7a5cff] to-[#25d0ff] text-[11px] font-semibold">
                          {s.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{s.firstTwo}</div>
                          <div className="truncate text-[11px] text-white/60">{s.title}</div>
                        </div>
                      </div>
                      <div className={cn("h-5 w-5 rounded-md border flex items-center justify-center", isChecked ? "bg-[#7a5cff] border-[#7a5cff]" : "border-white/30")} aria-hidden>
                        {isChecked && <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" className="h-3 w-3"><path d="M5 10l3 3 7-7" /></svg>}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-white/10 p-3 text-[11px] text-white/60">{i18n.hint}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ s, onRemove }){
  const shortTitle = s.title.length > 36 ? s.title.slice(0, 33) + "..." : s.title;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold">{s.initials}</span>
      <span className="max-w-[240px] truncate"><strong>{s.firstTwo}</strong> - {shortTitle}</span>
      <button onClick={onRemove} className="ml-0.5 rounded-full p-0.5 hover:bg-white/10" aria-label={`Убрать ${s.name}`}>
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M10 8.586L6.707 5.293a1 1 0 10-1.414 1.414L8.586 10l-3.293 3.293a1 1 0 101.414 1.414L10 11.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 00-1.414-1.414L10 8.586z" clipRule="evenodd" />
        </svg>
      </button>
    </span>
  );
}
