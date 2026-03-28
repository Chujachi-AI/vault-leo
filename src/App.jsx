import { useState, useMemo, useEffect } from "react";

// ═══════════════════════════════════════════════════
// VAULT.LEO v3 — Personal Finance Command Center
// ═══════════════════════════════════════════════════

const MO = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const OWNERS = ["LEO","MAMÁ"];
const CATS = ["Transporte","Comida y Restaurantes","Ropa y Moda","Suscripciones","Telecomunicaciones","Tecnología","Salud","Hogar","Entretenimiento","Supermercado","Gimnasio","Belleza","Regalos","Intereses y Comisiones","Pagos y Abonos","Seguros","MSI","Deudas Anteriores","Transferencias","Otros"];
const CC = {"Transporte":"#3b82f6","Comida y Restaurantes":"#ef4444","Ropa y Moda":"#ec4899","Suscripciones":"#8b5cf6","Telecomunicaciones":"#06b6d4","Tecnología":"#6366f1","Salud":"#10b981","Hogar":"#f97316","Entretenimiento":"#a855f7","Supermercado":"#84cc16","Gimnasio":"#14b8a6","Belleza":"#f472b6","Regalos":"#fbbf24","Intereses y Comisiones":"#dc2626","Pagos y Abonos":"#22c55e","Seguros":"#64748b","MSI":"#7c3aed","Deudas Anteriores":"#b91c1c","Transferencias":"#0ea5e9","Otros":"#94a3b8"};

const BANK_CFG = {
  INVEX: { name:"INVEX (IKEA)", corte:26, pago:15, color:"#0066b2", bg:"#001f3f", text:"#e8f4fd", accent:"#ffc107", gradient:"linear-gradient(135deg,#001f3f,#003366)" },
  Nu: { name:"Nu Crédito", corte:7, pago:17, color:"#820ad1", bg:"#1a0033", text:"#f0e0ff", accent:"#c77dff", gradient:"linear-gradient(135deg,#1a0033,#3d0066)" },
  Santander: { name:"Santander", corte:3, pago:24, color:"#ec0000", bg:"#2a0000", text:"#ffe0e0", accent:"#ff6b6b", gradient:"linear-gradient(135deg,#2a0000,#4a0000)" },
  Liverpool: { name:"Liverpool", corte:19, pago:19, color:"#e91e8c", bg:"#2a0020", text:"#ffe0f0", accent:"#ff69b4", gradient:"linear-gradient(135deg,#2a0020,#4a0040)" },
  NuDeb: { name:"Nu Débito", corte:0, pago:0, color:"#820ad1", bg:"#0d001a", text:"#f0e0ff", accent:"#9d4edd", gradient:"linear-gradient(135deg,#0d001a,#1a0033)" },
};
const BANK_KEYS = ["INVEX","Nu","Santander","Liverpool"];

const fmt = n => { if(!n&&n!==0)return"$0.00"; const a=Math.abs(n); const s=a.toLocaleString("es-MX",{minimumFractionDigits:2,maximumFractionDigits:2}); return n<0?`-$${s}`:`$${s}`; };
const uid = () => Math.random().toString(36).slice(2,9);

// ═══ REAL DATA: Abril 2026 billing cycle (current) ═══
const INVEX_ABRIL = [
  {id:uid(),banco:"INVEX",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-02-28",concepto:"Uber Ride",monto:48.24,cat:"Transporte",_ts:1},
  {id:uid(),banco:"INVEX",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-02-28",concepto:"Uber Eats",monto:110,cat:"Comida y Restaurantes",_ts:2},
  {id:uid(),banco:"INVEX",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-01",concepto:"DLO*Uber Rides",monto:76.14,cat:"Transporte",_ts:3},
  {id:uid(),banco:"INVEX",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-01",concepto:"DLO*Uber Rides",monto:79.78,cat:"Transporte",_ts:4},
  {id:uid(),banco:"INVEX",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-02",concepto:"DLO*Uber Rides",monto:38.72,cat:"Transporte",_ts:5},
  {id:uid(),banco:"INVEX",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-03",concepto:"DLO*Uber Rides",monto:140.22,cat:"Transporte",_ts:6},
  {id:uid(),banco:"INVEX",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-05",concepto:"Uber",monto:37.44,cat:"Transporte",_ts:7},
  {id:uid(),banco:"INVEX",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-01",concepto:"Mercado Libre (MSI 5 de 9)",monto:341.10,cat:"MSI",_ts:8},
  {id:uid(),banco:"INVEX",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-01",concepto:"Estabilizador (MSI 3 de 12)",monto:257.42,cat:"MSI",_ts:9},

];

const NU_ABRIL = [
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-25",concepto:"Uber Eats",monto:174.47,cat:"Comida y Restaurantes",_ts:14},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-21",concepto:"Uber Ride",monto:33.08,cat:"Transporte",_ts:15},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-21",concepto:"Dlo*Tda Uber Rides",monto:49.87,cat:"Transporte",_ts:16},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-20",concepto:"Uber Eats",monto:126.12,cat:"Comida y Restaurantes",_ts:17},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-18",concepto:"Uber *Trip Help",monto:47.94,cat:"Transporte",_ts:18},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-18",concepto:"Uber *Trip Help",monto:65.98,cat:"Transporte",_ts:19},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-17",concepto:"Uber Ride",monto:72.64,cat:"Transporte",_ts:20},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-17",concepto:"Saldo revolvente",monto:2000,cat:"Deudas Anteriores",_ts:21},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-16",concepto:"Dlo*Tda Uber Rides",monto:70,cat:"Transporte",_ts:22},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-16",concepto:"Ikea Guadalajara (Mamá parte)",monto:631,cat:"Hogar",_ts:23},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-16",concepto:"Ikea Guadalajara (Leo parte)",monto:400,cat:"Hogar",_ts:24},

  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-14",concepto:"Uber Ride",monto:39.93,cat:"Transporte",_ts:26},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-13",concepto:"Mi ATT App (Mamá $520)",monto:520,cat:"Telecomunicaciones",_ts:27},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-13",concepto:"Mi ATT App (Leo parte)",monto:1084.75,cat:"Telecomunicaciones",_ts:28},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-13",concepto:"Uber *Trip Help",monto:116.13,cat:"Transporte",_ts:29},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-13",concepto:"Uber *Trip Help",monto:75.19,cat:"Transporte",_ts:30},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-12",concepto:"Adidas MSI 1/3",monto:599.94,cat:"Ropa y Moda",_ts:31},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-11",concepto:"Uber *Trip Help",monto:72.91,cat:"Transporte",_ts:32},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-09",concepto:"Microsoft*Store (GamePass)",monto:219,cat:"Suscripciones",_ts:33},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-09",concepto:"Paypal *CapCut",monto:330,cat:"Suscripciones",_ts:34},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-09",concepto:"Uber *Eats Help",monto:420.36,cat:"Comida y Restaurantes",_ts:35},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-08",concepto:"Uber Eats",monto:248.56,cat:"Comida y Restaurantes",_ts:36},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-08",concepto:"Dlo*Tda Uber Rides",monto:40.88,cat:"Transporte",_ts:37},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-08",concepto:"Uber *Trip Help",monto:150.39,cat:"Transporte",_ts:38},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-07",concepto:"Uber Eats",monto:241.63,cat:"Comida y Restaurantes",_ts:39},
  {id:uid(),banco:"Nu",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-07",concepto:"Ebanx TikTok Sh Arts 3/3",monto:274.36,cat:"Ropa y Moda",_ts:40},
];

const SANT_ABRIL = [
  {id:uid(),banco:"Santander",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-21",concepto:"Uber",monto:10,cat:"Transporte",_ts:41},
  {id:uid(),banco:"Santander",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-21",concepto:"Uber",monto:65.80,cat:"Transporte",_ts:42},

  {id:uid(),banco:"Santander",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-05",concepto:"Claude.AI Subscription",monto:355.30,cat:"Suscripciones",_ts:44},
  {id:uid(),banco:"Santander",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-04",concepto:"Paypal *Componentes (PC Gamer 13/18)",monto:1277.33,cat:"MSI",_ts:45},
  {id:uid(),banco:"Santander",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-04",concepto:"Paypal *Farfetchmex (Leo $400)",monto:400,cat:"Ropa y Moda",_ts:46},
  {id:uid(),banco:"Santander",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-03-04",concepto:"Paypal *Farfetchmex (Mamá $500.25)",monto:500.25,cat:"Ropa y Moda",_ts:47},
  {id:uid(),banco:"Santander",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-04",concepto:"Interés exento",monto:14.67,cat:"Intereses y Comisiones",_ts:48},
  {id:uid(),banco:"Santander",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-04",concepto:"Impto interés gravable",monto:20.76,cat:"Intereses y Comisiones",_ts:49},
  {id:uid(),banco:"Santander",mes:"Abril",año:2026,titular:"LEO",fecha:"2026-03-04",concepto:"Interés gravable",monto:129.78,cat:"Intereses y Comisiones",_ts:50},
  {id:uid(),banco:"Santander",mes:"Abril",año:2026,titular:"MAMÁ",fecha:"2026-02-28",concepto:"Uber",monto:39.94,cat:"Transporte",_ts:51},
];

const LIVER_ABRIL = [
  // Liverpool current cycle: Corte 19 Mar → Pago 19 Abr
  // $2,800 was the payment for the previous cycle (March), not a current charge
  // Current charges will be added by the user as they come in
];

const ALL_INIT = [...INVEX_ABRIL,...NU_ABRIL,...SANT_ABRIL,...LIVER_ABRIL];

// ═══ STORAGE HELPERS (localStorage for Vercel deployment) ═══
const STORAGE_KEY = "vault-leo-v3c";
const STORAGE_DEB = "vault-leo-nudeb-v3c";

function loadDataSync(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}
function saveDataSync(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { console.error("Storage save error:", e); }
}

// ═══ COMPONENTS ═══
const Pill = ({active,label,onClick,color}) => (
  <button onClick={onClick} style={{padding:"7px 16px",borderRadius:20,border:active?`2px solid ${color||"#1a1a1a"}`:"1px solid #ddd",cursor:"pointer",fontSize:12,fontWeight:active?700:400,background:active?(color||"#1a1a1a"):"#fff",color:active?"#fff":"#666",transition:"all .2s",whiteSpace:"nowrap",fontFamily:"inherit"}}>{label}</button>
);

const StatCard = ({title,value,sub,accent}) => (
  <div style={{background:"#fff",borderRadius:14,padding:"18px 20px",border:"1px solid #ebe9e4"}}>
    <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",color:"#999",marginBottom:8}}>{title}</div>
    <div style={{fontSize:28,fontWeight:700,letterSpacing:"-1px",color:accent||"#1a1a1a",lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:12,color:"#999",marginTop:5}}>{sub}</div>}
  </div>
);

const BankHeader = ({bank,total,leo,mama,pagoInfo}) => {
  const c = BANK_CFG[bank];
  return (
    <div style={{background:c.gradient,borderRadius:16,padding:"24px 28px",color:c.text,marginBottom:16,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:c.accent+"15"}}/>
      <div style={{position:"absolute",bottom:-30,right:40,width:80,height:80,borderRadius:"50%",background:c.accent+"10"}}/>
      <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:2,opacity:.5,marginBottom:6}}>{c.name}</div>
      <div style={{fontSize:32,fontWeight:700,letterSpacing:"-1px",marginBottom:8}}>{fmt(total)}</div>
      <div style={{display:"flex",gap:24,marginBottom:pagoInfo?10:0}}>
        <div><div style={{fontSize:10,opacity:.5}}>Leo</div><div style={{fontSize:15,fontWeight:600}}>{fmt(leo)}</div></div>
        <div><div style={{fontSize:10,opacity:.5}}>Mamá</div><div style={{fontSize:15,fontWeight:600}}>{fmt(mama)}</div></div>
      </div>
      {pagoInfo&&<div style={{background:"rgba(255,255,255,.1)",borderRadius:8,padding:"8px 12px",marginTop:4,fontSize:12}}>
        <span style={{opacity:.7}}>Corte: día {c.corte}</span> · <span style={{fontWeight:600}}>Pago límite: {pagoInfo}</span>
      </div>}
    </div>
  );
};

// ═══ MAIN APP ═══
export default function App() {
  const [data, setData] = useState(ALL_INIT);
  const [nudeb, setNudeb] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("dashboard");
  const [bankView, setBankView] = useState("INVEX");
  const [ts, setTs] = useState(100);

  // Form
  const [form, setForm] = useState({fecha:"",concepto:"",monto:"",titular:"LEO",cat:"Otros",customCat:""});
  const [debForm, setDebForm] = useState({fecha:"",concepto:"",monto:"",cat:"Otros",customCat:""});
  const [isMSI, setIsMSI] = useState(false);
  const [msiN, setMsiN] = useState(3);
  const [msiStart, setMsiStart] = useState("Abril");
  const [editId, setEditId] = useState(null);

  // Load from storage
  useEffect(() => {
    const stored = loadDataSync(STORAGE_KEY, null);
    if (stored && stored.length > 0) setData(stored);
    const storedDeb = loadDataSync(STORAGE_DEB, null);
    if (storedDeb && storedDeb.length > 0) setNudeb(storedDeb);
    setLoaded(true);
  }, []);

  // Save on change
  useEffect(() => { if (loaded) saveDataSync(STORAGE_KEY, data); }, [data, loaded]);
  useEffect(() => { if (loaded) saveDataSync(STORAGE_DEB, nudeb); }, [nudeb, loaded]);

  // Responsive
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  const mob = w < 768;

  // Bank-filtered data
  const bankData = useMemo(() => data.filter(r => r.banco === bankView), [data, bankView]);
  const bankPos = useMemo(() => bankData.filter(r => r.monto > 0), [bankData]);
  const bankLeo = useMemo(() => bankPos.filter(r => r.titular === "LEO").reduce((s, r) => s + r.monto, 0), [bankPos]);
  const bankMama = useMemo(() => bankPos.filter(r => r.titular === "MAMÁ").reduce((s, r) => s + r.monto, 0), [bankPos]);
  const bankTotal = bankLeo + bankMama;

  // Dashboard stats
  const dashStats = useMemo(() => {
    const pos = data.filter(r => r.monto > 0);
    const tL = pos.filter(r => r.titular === "LEO").reduce((s, r) => s + r.monto, 0);
    const tM = pos.filter(r => r.titular === "MAMÁ").reduce((s, r) => s + r.monto, 0);
    const byCat = {};
    pos.forEach(r => { const c = r.cat || "Otros"; byCat[c] = (byCat[c] || 0) + r.monto; });
    const byBank = {};
    BANK_KEYS.forEach(b => { byBank[b] = pos.filter(r => r.banco === b).reduce((s, r) => s + r.monto, 0); });
    return { tL, tM, total: tL + tM, byCat, byBank };
  }, [data]);

  // Category breakdown for current bank
  const bankCats = useMemo(() => {
    const g = {};
    bankPos.forEach(r => { g[r.cat || "Otros"] = (g[r.cat || "Otros"] || 0) + r.monto; });
    return Object.entries(g).sort((a, b) => b[1] - a[1]);
  }, [bankPos]);

  // Handlers
  const addEntry = (banco) => {
    if (!form.fecha || !form.concepto || !form.monto) return;
    const mp = parseFloat(form.monto);
    const cat = form.cat === "Otros" && form.customCat ? form.customCat : form.cat;
    const mes = "Abril"; // Current billing
    if (isMSI && msiN > 1) {
      const si = MO.indexOf(msiStart); const ne = []; let t = ts;
      for (let i = 0; i < msiN; i++) {
        const mi = (si + i) % 12; t++;
        ne.push({ id: uid(), banco, mes: MO[mi], año: 2026, titular: form.titular, fecha: form.fecha, concepto: `${form.concepto} (MSI ${i+1} de ${msiN})`, monto: mp, cat, _ts: t });
      }
      setData(p => [...p, ...ne]); setTs(t);
    } else {
      const t = ts + 1; setTs(t);
      setData(p => [...p, { id: uid(), banco, mes, año: 2026, titular: form.titular, fecha: form.fecha, concepto: form.concepto, monto: mp, cat, _ts: t }]);
    }
    setForm({ fecha: "", concepto: "", monto: "", titular: "LEO", cat: "Otros", customCat: "" });
    setIsMSI(false);
  };

  const addDebEntry = () => {
    if (!debForm.fecha || !debForm.concepto || !debForm.monto) return;
    const cat = debForm.cat === "Otros" && debForm.customCat ? debForm.customCat : debForm.cat;
    const t = ts + 1; setTs(t);
    setNudeb(p => [...p, { id: uid(), fecha: debForm.fecha, concepto: debForm.concepto, monto: parseFloat(debForm.monto), cat, _ts: t }]);
    setDebForm({ fecha: "", concepto: "", monto: "", cat: "Otros", customCat: "" });
  };

  const delEntry = (id) => setData(p => p.filter(r => r.id !== id));
  const delDeb = (id) => setNudeb(p => p.filter(r => r.id !== id));

  // Edit mode
  const startEdit = (item) => { setEditId(item.id); setForm({ fecha: item.fecha, concepto: item.concepto, monto: String(item.monto), titular: item.titular, cat: item.cat || "Otros", customCat: "" }); };
  const cancelEdit = () => { setEditId(null); setForm({ fecha: "", concepto: "", monto: "", titular: "LEO", cat: "Otros", customCat: "" }); };
  const saveEdit = () => {
    const cat = form.cat === "Otros" && form.customCat ? form.customCat : form.cat;
    setData(p => p.map(r => r.id === editId ? { ...r, fecha: form.fecha, concepto: form.concepto, monto: parseFloat(form.monto), titular: form.titular, cat } : r));
    cancelEdit();
  };
  const [editDebId, setEditDebId] = useState(null);
  const startEditDeb = (item) => { setEditDebId(item.id); setDebForm({ fecha: item.fecha, concepto: item.concepto, monto: String(item.monto), cat: item.cat || "Otros", customCat: "" }); };
  const cancelEditDeb = () => { setEditDebId(null); setDebForm({ fecha: "", concepto: "", monto: "", cat: "Otros", customCat: "" }); };
  const saveEditDeb = () => {
    const cat = debForm.cat === "Otros" && debForm.customCat ? debForm.customCat : debForm.cat;
    setNudeb(p => p.map(r => r.id === editDebId ? { ...r, fecha: debForm.fecha, concepto: debForm.concepto, monto: parseFloat(debForm.monto), cat } : r));
    cancelEditDeb();
  };

  const pagoStr = (b) => {
    const c = BANK_CFG[b];
    return `día ${c.pago} de Abril 2026`;
  };

  // ═══ STYLES ═══
  const S = {
    inp: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fafaf8", boxSizing: "border-box" },
    sel: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, fontFamily: "inherit", background: "#fafaf8", cursor: "pointer", outline: "none" },
    lbl: { fontSize: 11, fontWeight: 600, color: "#888", display: "block", marginBottom: 3 },
    card: { background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #ebe9e4", marginBottom: 14 },
    ct: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.2px", color: "#999", marginBottom: 10 },
  };

  const BtnPrimary = ({ onClick, label, color }) => (
    <button onClick={onClick} style={{ padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: color || "#1a1a1a", color: "#fff", transition: "all .2s" }}>{label}</button>
  );

  // ═══ REGISTER FORM (reusable for each bank) ═══
  const RegisterForm = ({ banco }) => (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={S.ct}>{editId ? "Editar Movimiento" : "Registrar Movimiento"} — {BANK_CFG[banco].name}</div>
        {editId && <button onClick={cancelEdit} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#999", fontFamily: "inherit" }}>✕ Cancelar</button>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div><label style={S.lbl}>Fecha</label><input type="date" style={S.inp} value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} /></div>
        <div><label style={S.lbl}>Monto (- = abono)</label><input type="number" step="0.01" style={S.inp} placeholder="0.00" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} /></div>
        <div><label style={S.lbl}>Titular</label><select style={S.sel} value={form.titular} onChange={e => setForm({ ...form, titular: e.target.value })}>{OWNERS.map(o => <option key={o}>{o}</option>)}</select></div>
        <div><label style={S.lbl}>Concepto</label><input style={S.inp} placeholder="Descripción..." value={form.concepto} onChange={e => setForm({ ...form, concepto: e.target.value })} /></div>
        <div><label style={S.lbl}>Categoría</label><select style={S.sel} value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
        {form.cat === "Otros" && <div><label style={S.lbl}>Especificar</label><input style={S.inp} value={form.customCat} onChange={e => setForm({ ...form, customCat: e.target.value })} /></div>}
      </div>
      {/* MSI - only show when not editing */}
      {!editId && <div style={{ background: "#fafaf8", borderRadius: 10, padding: "12px 16px", marginBottom: 14, border: "1px solid #ebe9e4" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isMSI ? 10 : 0 }}>
          <div style={{ width: 40, height: 22, borderRadius: 11, background: isMSI ? BANK_CFG[banco].color : "#ddd", cursor: "pointer", position: "relative", transition: "background .2s" }} onClick={() => setIsMSI(!isMSI)}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#fff", position: "absolute", top: 3, left: isMSI ? 21 : 3, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>MSI</span>
        </div>
        {isMSI && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div><label style={S.lbl}>Meses</label><select style={{ ...S.sel, width: "auto" }} value={msiN} onChange={e => setMsiN(parseInt(e.target.value))}>{[2,3,4,5,6,9,10,12,18,24].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
          <div><label style={S.lbl}>Desde</label><select style={{ ...S.sel, width: "auto" }} value={msiStart} onChange={e => setMsiStart(e.target.value)}>{MO.map(m => <option key={m}>{m}</option>)}</select></div>
          {form.monto && <div style={{ background: "#fff", padding: "6px 12px", borderRadius: 8, border: "1px solid #eee", fontSize: 12 }}>{msiN}× {fmt(parseFloat(form.monto) || 0)} = <strong>{fmt((parseFloat(form.monto) || 0) * msiN)}</strong></div>}
        </div>}
      </div>}
      <div style={{ display: "flex", gap: 8 }}>
        {editId
          ? <BtnPrimary onClick={saveEdit} label="Guardar Cambios" color={BANK_CFG[banco].color} />
          : <BtnPrimary onClick={() => addEntry(banco)} label={isMSI ? `Agregar ${msiN} MSI` : "Agregar"} color={BANK_CFG[banco].color} />
        }
      </div>
    </div>
  );

  // ═══ MOVEMENTS TABLE ═══
  const MovTable = ({ items, onDel, onEdit, bankColor }) => (
    <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#fafaf8" }}>
            <th style={{ ...S.ct, padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #eee" }}>Fecha</th>
            <th style={{ ...S.ct, padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #eee" }}>Concepto</th>
            <th style={{ ...S.ct, padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #eee" }}>Titular</th>
            <th style={{ ...S.ct, padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #eee" }}>Categoría</th>
            <th style={{ ...S.ct, padding: "10px 12px", textAlign: "right", borderBottom: "2px solid #eee" }}>Monto</th>
            <th style={{ ...S.ct, padding: "10px 12px", borderBottom: "2px solid #eee", width: 60 }}>Acc.</th>
          </tr></thead>
          <tbody>{[...items].sort((a, b) => (b._ts || 0) - (a._ts || 0)).map(r => (
            <tr key={r.id} style={{ borderBottom: "1px solid #f4f3f0", background: editId === r.id ? "#fffbeb" : "" }}>
              <td style={{ padding: "10px 12px", fontSize: 11, color: "#666" }}>{r.fecha}</td>
              <td style={{ padding: "10px 12px", fontWeight: 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.concepto}</td>
              <td style={{ padding: "10px 12px" }}><span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: r.titular === "LEO" ? "#1a1a1a15" : "#8b735515", color: r.titular === "LEO" ? "#1a1a1a" : "#8b7355" }}>{r.titular}</span></td>
              <td style={{ padding: "10px 12px", fontSize: 11, color: CC[r.cat] || "#999" }}>{r.cat}</td>
              <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: r.monto < 0 ? "#16a34a" : "#1a1a1a" }}>{fmt(r.monto)}</td>
              <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                <button onClick={() => onEdit(r)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 2, marginRight: 4 }} title="Editar">✎</button>
                <button onClick={() => onDel(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 13, padding: 2 }} title="Eliminar">✕</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );

  // ═══ CATEGORY CHART ═══
  const CatChart = ({ items }) => {
    const g = {};
    items.filter(r => r.monto > 0).forEach(r => { g[r.cat || "Otros"] = (g[r.cat || "Otros"] || 0) + r.monto; });
    const sorted = Object.entries(g).sort((a, b) => b[1] - a[1]);
    const max = sorted[0]?.[1] || 1;
    const total = sorted.reduce((s, [, v]) => s + v, 0);
    return (<div style={S.card}>
      <div style={S.ct}>Desglose por Categoría</div>
      {sorted.map(([c, v]) => (<div key={c} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
        <div style={{ width: 8, height: 8, borderRadius: 3, background: CC[c] || "#999", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ fontWeight: 500 }}>{c}</span><span style={{ color: "#999" }}>{((v / total) * 100).toFixed(1)}%</span></div>
          <div style={{ height: 4, borderRadius: 2, background: "#f0eeea", overflow: "hidden", marginTop: 2 }}><div style={{ height: "100%", width: `${(v / max) * 100}%`, background: CC[c] || "#999", borderRadius: 2 }} /></div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, minWidth: 65, textAlign: "right" }}>{fmt(v)}</div>
      </div>))}
    </div>);
  };

  // ═══ RENDER ═══
  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: "#f4f3f0", minHeight: "100vh", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: "#ffffffee", borderBottom: "1px solid #e8e6e1", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(16px)", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.5px" }}>vault<span style={{ color: "#8b7355", fontWeight: 400 }}>.leo</span></span>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {["dashboard", ...BANK_KEYS, "NuDeb"].map(v => {
            const isBank = BANK_KEYS.includes(v);
            const active = view === "bank" && bankView === v || view === v;
            const label = v === "NuDeb" ? "Nu Débito" : v === "dashboard" ? "Dashboard" : BANK_CFG[v]?.name || v;
            const color = BANK_CFG[v]?.color || "#1a1a1a";
            return <button key={v} onClick={() => { if (isBank) { setView("bank"); setBankView(v); } else setView(v); }} style={{
              padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: active ? 700 : 400,
              background: active ? color : "transparent", color: active ? "#fff" : "#888", transition: "all .2s", fontFamily: "inherit", whiteSpace: "nowrap"
            }}>{label}</button>;
          })}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px" }}>

        {/* ═══ DASHBOARD ═══ */}
        {view === "dashboard" && <>
          <div style={mob ? { display: "flex", flexDirection: "column", gap: 12 } : { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <StatCard title="Total Cargos" value={fmt(dashStats.total)} sub={`${data.filter(r => r.monto > 0).length} movimientos`} />
            <StatCard title="Leo" value={fmt(dashStats.tL)} sub={`${((dashStats.tL / (dashStats.total || 1)) * 100).toFixed(1)}%`} />
            <StatCard title="Mamá" value={fmt(dashStats.tM)} sub={`${((dashStats.tM / (dashStats.total || 1)) * 100).toFixed(1)}%`} accent="#8b7355" />
          </div>

          {/* Payment Calendar */}
          <div style={{ ...S.card, marginTop: 14 }}>
            <div style={S.ct}>Próximos Pagos — Abril 2026</div>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 10 }}>
              {BANK_KEYS.map(b => {
                const bd = data.filter(r => r.banco === b && r.monto > 0);
                const tot = bd.reduce((s, r) => s + r.monto, 0);
                const leo = bd.filter(r => r.titular === "LEO").reduce((s, r) => s + r.monto, 0);
                const mama = bd.filter(r => r.titular === "MAMÁ").reduce((s, r) => s + r.monto, 0);
                const abonos = data.filter(r => r.banco === b && r.monto < 0).reduce((s, r) => s + r.monto, 0);
                const c = BANK_CFG[b];
                return (<div key={b} style={{ background: c.gradient, borderRadius: 12, padding: "16px 18px", color: c.text }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</span>
                    <span style={{ fontSize: 10, opacity: .6 }}>Pago: día {c.pago}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{fmt(tot + abonos)}</div>
                  <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
                    <span>Leo: {fmt(leo)}</span><span style={{ opacity: .7 }}>Mamá: {fmt(mama)}</span>
                  </div>
                </div>);
              })}
            </div>
          </div>

          {/* By Bank bars */}
          <div style={S.card}>
            <div style={S.ct}>Distribución por Banco</div>
            {BANK_KEYS.map(b => {
              const v = dashStats.byBank[b] || 0;
              const pct = (v / (dashStats.total || 1)) * 100;
              return (<div key={b} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                <div style={{ width: 80, fontSize: 12, fontWeight: 500 }}>{b}</div>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#f0eeea", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: BANK_CFG[b].color, borderRadius: 4, transition: "width .5s" }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, minWidth: 80, textAlign: "right" }}>{fmt(v)}</div>
              </div>);
            })}
          </div>

          <CatChart items={data} />

          {/* Recent */}
          <div style={S.card}>
            <div style={S.ct}>Últimos Registros</div>
            {[...data].sort((a, b) => (b._ts || 0) - (a._ts || 0)).slice(0, 12).map((r, i) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 11 ? "1px solid #f4f3f0" : "none" }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: BANK_CFG[r.banco]?.color || "#999" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.concepto}</div>
                  <div style={{ fontSize: 10, color: "#aaa" }}>{r.banco} · {r.fecha} · <span style={{ color: r.titular === "LEO" ? "#555" : "#8b7355" }}>{r.titular}</span></div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: r.monto < 0 ? "#16a34a" : "#1a1a1a" }}>{fmt(r.monto)}</div>
              </div>
            ))}
          </div>
        </>}

        {/* ═══ BANK VIEW ═══ */}
        {view === "bank" && <>
          <BankHeader bank={bankView} total={bankTotal} leo={bankLeo} mama={bankMama} pagoInfo={pagoStr(bankView)} />
          <CatChart items={bankData} />
          <RegisterForm banco={bankView} />
          <div style={{ ...S.ct, marginTop: 8 }}>Movimientos — {BANK_CFG[bankView].name}</div>
          <MovTable items={bankData} onDel={delEntry} onEdit={startEdit} bankColor={BANK_CFG[bankView].color} />
        </>}

        {/* ═══ NU DÉBITO ═══ */}
        {view === "NuDeb" && <>
          <div style={{ background: BANK_CFG.NuDeb.gradient, borderRadius: 16, padding: "24px 28px", color: BANK_CFG.NuDeb.text, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, opacity: .5, marginBottom: 6 }}>Nu Débito — Gastos Personales</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>{fmt(nudeb.reduce((s, r) => s + r.monto, 0))}</div>
            <div style={{ fontSize: 12, opacity: .6 }}>{nudeb.length} movimientos registrados</div>
          </div>

          {nudeb.length > 0 && <CatChart items={nudeb.map(r => ({ ...r, titular: "LEO" }))} />}

          {/* Register */}
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={S.ct}>{editDebId ? "Editar Gasto" : "Registrar Gasto"} — Nu Débito</div>
              {editDebId && <button onClick={cancelEditDeb} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#999", fontFamily: "inherit" }}>✕ Cancelar</button>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div><label style={S.lbl}>Fecha</label><input type="date" style={S.inp} value={debForm.fecha} onChange={e => setDebForm({ ...debForm, fecha: e.target.value })} /></div>
              <div><label style={S.lbl}>Monto</label><input type="number" step="0.01" style={S.inp} placeholder="0.00" value={debForm.monto} onChange={e => setDebForm({ ...debForm, monto: e.target.value })} /></div>
              <div><label style={S.lbl}>Categoría</label><select style={S.sel} value={debForm.cat} onChange={e => setDebForm({ ...debForm, cat: e.target.value })}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
              <div style={{ gridColumn: mob ? "1" : "1 / -1" }}><label style={S.lbl}>Concepto</label><input style={S.inp} placeholder="¿En qué gastaste?" value={debForm.concepto} onChange={e => setDebForm({ ...debForm, concepto: e.target.value })} /></div>
              {debForm.cat === "Otros" && <div><label style={S.lbl}>Especificar</label><input style={S.inp} value={debForm.customCat} onChange={e => setDebForm({ ...debForm, customCat: e.target.value })} /></div>}
            </div>
            <BtnPrimary onClick={editDebId ? saveEditDeb : addDebEntry} label={editDebId ? "Guardar Cambios" : "Registrar Gasto"} color="#820ad1" />
          </div>

          {nudeb.length > 0 && <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead><tr style={{ background: "#fafaf8" }}>
                  <th style={{ ...S.ct, padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #eee" }}>Fecha</th>
                  <th style={{ ...S.ct, padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #eee" }}>Concepto</th>
                  <th style={{ ...S.ct, padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #eee" }}>Categoría</th>
                  <th style={{ ...S.ct, padding: "10px 12px", textAlign: "right", borderBottom: "2px solid #eee" }}>Monto</th>
                  <th style={{ ...S.ct, padding: "10px 12px", borderBottom: "2px solid #eee", width: 60 }}>Acc.</th>
                </tr></thead>
                <tbody>{[...nudeb].sort((a, b) => (b._ts || 0) - (a._ts || 0)).map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f4f3f0", background: editDebId === r.id ? "#f3e8ff" : "" }}>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: "#666" }}>{r.fecha}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 500 }}>{r.concepto}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: CC[r.cat] || "#999" }}>{r.cat}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600 }}>{fmt(r.monto)}</td>
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <button onClick={() => startEditDeb(r)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 2, marginRight: 4 }}>✎</button>
                      <button onClick={() => delDeb(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 13, padding: 2 }}>✕</button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>}
        </>}

        <div style={{ textAlign: "center", padding: "28px 0 14px", fontSize: 11, color: "#bbb" }}>vault.leo v3 — 28 marzo 2026</div>
      </div>
    </div>
  );
}
