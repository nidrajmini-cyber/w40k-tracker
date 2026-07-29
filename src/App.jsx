import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import BattleReportForm from "./BattleReportForm";

const supabase = createClient(
  "https://khmbmhmkmwjaljvicrsz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobWJtaG1rbXdqYWxqdmljcnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzkwOTIsImV4cCI6MjA5NDE1NTA5Mn0.tfoNvKj4FYMq0yWpcNFUjNWpdLybZCzTGk1xdKEEZqc"
);

const FACTIONS = [
  "Astra Militarum","Space Marines","Chaos Space Marines","Death Guard","Thousand Sons",
  "World Eaters","Emperor's Children","Tyranids","Genestealer Cults","Orks","Eldar (Craftworlds)",
  "Drukhari","Harlequins","Tau Empire","Necrons","Sisters of Battle","Adeptus Mechanicus",
  "Imperial Knights","Chaos Knights","Daemons","Leagues of Votann","Grey Knights","Deathwatch",
  "Blood Angels","Dark Angels","Space Wolves","Black Templars","Custodes"
];

const PERFORMANCES = ["Excellent","Bon","Moyen","Décevant"];
const PERF_COLORS = { Excellent:"#4ade80", Bon:"#a3e635", Moyen:"#facc15", Décevant:"#f87171" };

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0b0e;
    --surface: #111318;
    --surface2: #181c23;
    --border: #2a2f3d;
    --gold: #c9a84c;
    --gold2: #e8c97e;
    --red: #c0392b;
    --red2: #e74c3c;
    --green: #27ae60;
    --blue: #2980b9;
    --text: #e8e0d0;
    --muted: #7a7a8c;
    --font-title: 'Cinzel', serif;
    --font-body: 'Rajdhani', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: 16px; min-height: 100vh; }

  .app { display: flex; flex-direction: column; min-height: 100vh; }

  /* Header */
  .header {
    background: linear-gradient(180deg, #0e1018 0%, #0a0b0e 100%);
    border-bottom: 2px solid var(--gold);
    padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 4px 24px rgba(0,0,0,0.6);
  }
  .header-logo { display: flex; align-items: center; gap: 12px; padding: 14px 0; }
  .header-skull { font-size: 28px; filter: drop-shadow(0 0 8px rgba(201,168,76,0.6)); }
  .header-title { font-family: var(--font-title); font-size: 20px; color: var(--gold); letter-spacing: 2px; line-height: 1; }
  .header-sub { font-size: 11px; color: var(--muted); letter-spacing: 3px; text-transform: uppercase; }
  .header-nav { display: flex; gap: 4px; }
  .nav-btn {
    font-family: var(--font-body); font-weight: 600; font-size: 13px; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 8px 16px; background: transparent; border: 1px solid transparent;
    color: var(--muted); cursor: pointer; transition: all .2s; border-radius: 3px;
  }
  .nav-btn:hover { color: var(--gold2); border-color: var(--border); }
  .nav-btn.active { color: var(--gold); border-color: var(--gold); background: rgba(201,168,76,0.08); }

  /* Main */
  .main { flex: 1; padding: 32px 24px; max-width: 1200px; margin: 0 auto; width: 100%; }

  /* Section title */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .section-title { font-family: var(--font-title); font-size: 22px; color: var(--gold); letter-spacing: 2px; }
  .section-title::before { content: '⚔ '; }

  /* Cards grid */
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; padding: 20px; position: relative; overflow: hidden;
    transition: border-color .2s, box-shadow .2s; cursor: pointer;
  }
  .card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }
  .card:hover { border-color: var(--gold); box-shadow: 0 0 20px rgba(201,168,76,0.1); }
  .card-title { font-family: var(--font-title); font-size: 15px; color: var(--gold2); margin-bottom: 8px; }
  .card-meta { font-size: 13px; color: var(--muted); margin-bottom: 4px; }
  .card-score { font-size: 28px; font-weight: 700; letter-spacing: 2px; }
  .card-badge {
    display: inline-block; padding: 2px 10px; border-radius: 2px; font-size: 12px;
    font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-top: 8px;
  }
  .badge-victoire { background: rgba(39,174,96,0.2); color: #4ade80; border: 1px solid #27ae60; }
  .badge-defaite { background: rgba(192,57,43,0.2); color: #f87171; border: 1px solid #c0392b; }
  .badge-egalite { background: rgba(201,168,76,0.2); color: var(--gold2); border: 1px solid var(--gold); }

  /* Buttons */
  .btn {
    font-family: var(--font-body); font-weight: 600; font-size: 13px; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 10px 20px; border-radius: 3px; cursor: pointer;
    transition: all .2s; border: 1px solid; display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary { background: var(--gold); color: #0a0b0e; border-color: var(--gold2); }
  .btn-primary:hover { background: var(--gold2); }
  .btn-ghost { background: transparent; color: var(--muted); border-color: var(--border); }
  .btn-ghost:hover { color: var(--text); border-color: var(--muted); }
  .btn-danger { background: transparent; color: var(--red2); border-color: var(--red); }
  .btn-danger:hover { background: rgba(192,57,43,0.15); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }

  /* Forms */
  .form { display: flex; flex-direction: column; gap: 18px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
  .form-input, .form-select, .form-textarea {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 4px;
    color: var(--text); padding: 10px 14px; font-family: var(--font-body); font-size: 15px;
    transition: border-color .2s; width: 100%;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none; border-color: var(--gold);
  }
  .form-select option { background: var(--surface2); }
  .form-textarea { resize: vertical; min-height: 100px; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 200;
    display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px;
    overflow-y: auto;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--gold); border-radius: 8px;
    padding: 32px; width: 100%; max-width: 700px; position: relative;
    box-shadow: 0 0 60px rgba(201,168,76,0.15);
  }
  .modal::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .modal-title { font-family: var(--font-title); font-size: 20px; color: var(--gold); margin-bottom: 28px; letter-spacing: 2px; }
  .modal-close {
    position: absolute; top: 16px; right: 16px; background: transparent; border: none;
    color: var(--muted); font-size: 22px; cursor: pointer; line-height: 1;
  }
  .modal-close:hover { color: var(--text); }

  /* Stats dashboard */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 6px;
    padding: 20px; text-align: center;
  }
  .stat-value { font-family: var(--font-title); font-size: 36px; color: var(--gold); line-height: 1; }
  .stat-label { font-size: 12px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 6px; }

  /* Detail view */
  .detail-header { margin-bottom: 28px; }
  .detail-section { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 20px; margin-bottom: 16px; }
  .detail-section-title { font-family: var(--font-title); font-size: 13px; color: var(--gold); letter-spacing: 2px; margin-bottom: 14px; text-transform: uppercase; }
  .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
  .detail-item label { font-size: 11px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 2px; }
  .detail-item value { font-size: 16px; color: var(--text); font-weight: 500; }

  /* Perf tags */
  .perf-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 3px; font-size: 13px; font-weight: 600; margin: 3px; }

  /* Secondaire row */
  .sec-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .sec-row:last-child { border-bottom: none; }
  .sec-pts { font-family: var(--font-title); font-size: 18px; color: var(--gold); }

  /* Score display */
  .score-display { display: flex; align-items: center; gap: 20px; }
  .score-block { text-align: center; }
  .score-big { font-family: var(--font-title); font-size: 48px; line-height: 1; }
  .score-big.win { color: var(--green); }
  .score-big.lose { color: var(--red2); }
  .score-big.draw { color: var(--gold); }
  .score-vs { color: var(--muted); font-size: 20px; font-weight: 700; }

  /* Winrate bar */
  .winrate-bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; margin-top: 8px; }
  .winrate-fill { height: 100%; background: linear-gradient(90deg, var(--green), var(--gold)); border-radius: 4px; transition: width .5s; }

  /* Empty state */
  .empty { text-align: center; padding: 60px 20px; }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }
  .empty-text { color: var(--muted); font-size: 16px; letter-spacing: 1px; }

  /* Sub section pills */
  .sub-tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
  .sub-tab { padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; letter-spacing: 1px; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--muted); transition: all .15s; }
  .sub-tab.active { background: rgba(201,168,76,0.15); border-color: var(--gold); color: var(--gold); }

  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

  @media (max-width: 640px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .form-row { grid-template-columns: 1fr; }
    .header-nav { display: none; }
  }
`;

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function StatsPanel({ batailles }) {
  const total = batailles.length;
  const wins = batailles.filter(b => b.resultat === "Victoire").length;
  const losses = batailles.filter(b => b.resultat === "Défaite").length;
  const draws = batailles.filter(b => b.resultat === "Égalité").length;
  const winrate = total > 0 ? Math.round((wins / total) * 100) : 0;
  const avgScore = total > 0 ? Math.round(batailles.reduce((s, b) => s + (b.score_moi || 0), 0) / total) : 0;

  // Faction matchup stats
  const factionStats = {};
  batailles.forEach(b => {
    if (!b.adversaire_faction) return;
    if (!factionStats[b.adversaire_faction]) factionStats[b.adversaire_faction] = { w: 0, l: 0, d: 0 };
    if (b.resultat === "Victoire") factionStats[b.adversaire_faction].w++;
    else if (b.resultat === "Défaite") factionStats[b.adversaire_faction].l++;
    else factionStats[b.adversaire_faction].d++;
  });

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{total}</div><div className="stat-label">Parties</div></div>
        <div className="stat-card"><div className="stat-value" style={{color:"#4ade80"}}>{wins}</div><div className="stat-label">Victoires</div></div>
        <div className="stat-card"><div className="stat-value" style={{color:"#f87171"}}>{losses}</div><div className="stat-label">Défaites</div></div>
        <div className="stat-card"><div className="stat-value">{winrate}%</div><div className="stat-label">Win Rate</div></div>
      </div>
      <div className="stats-grid" style={{gridTemplateColumns:"repeat(2,1fr)"}}>
        <div className="stat-card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span className="stat-label">Win Rate</span>
            <span style={{color:"var(--gold)",fontWeight:700}}>{winrate}%</span>
          </div>
          <div className="winrate-bar"><div className="winrate-fill" style={{width:`${winrate}%`}}/></div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:13,color:"var(--muted)"}}>
            <span>🟢 {wins}V</span><span>🟡 {draws}N</span><span>🔴 {losses}D</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{marginBottom:12}}>Score moyen</div>
          <div className="stat-value" style={{fontSize:28}}>{avgScore} <span style={{fontSize:16,color:"var(--muted)"}}>pts</span></div>
          {total > 0 && <div style={{fontSize:13,color:"var(--muted)",marginTop:6}}>
            Best: {Math.max(...batailles.map(b => b.score_moi || 0))} pts
          </div>}
        </div>
      </div>

      {Object.keys(factionStats).length > 0 && (
        <div className="detail-section" style={{marginTop:16}}>
          <div className="detail-section-title">Matchups par faction</div>
          {Object.entries(factionStats).sort((a,b)=>(b[1].w+b[1].d+b[1].l)-(a[1].w+a[1].d+a[1].l)).map(([faction, s]) => (
            <div key={faction} className="sec-row">
              <span style={{fontWeight:600}}>{faction}</span>
              <span style={{fontSize:13,color:"var(--muted)"}}>
                <span style={{color:"#4ade80"}}>{s.w}V</span> · <span style={{color:"var(--gold)"}}>{s.d}N</span> · <span style={{color:"#f87171"}}>{s.l}D</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListeForm({ liste, onSave, onClose }) {
  const [form, setForm] = useState(liste || { nom:"", faction:"Astra Militarum", detachement:"", points:2000, contenu:"", notes:"", active:true });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nom.trim()) return alert("Nom requis");
    const { error } = liste?.id
      ? await supabase.from("w40k_listes").update({ ...form, updated_at: new Date() }).eq("id", liste.id)
      : await supabase.from("w40k_listes").insert(form);
    if (error) return alert("Erreur: " + error.message);
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{liste?.id ? "Modifier la liste" : "Nouvelle liste"}</div>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nom de la liste</label>
              <input className="form-input" value={form.nom} onChange={e=>set("nom",e.target.value)} placeholder="01.competitive..." />
            </div>
            <div className="form-group">
              <label className="form-label">Points</label>
              <input className="form-input" type="number" value={form.points} onChange={e=>set("points",+e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Faction</label>
              <select className="form-select" value={form.faction} onChange={e=>set("faction",e.target.value)}>
                {FACTIONS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Détachement</label>
              <input className="form-input" value={form.detachement} onChange={e=>set("detachement",e.target.value)} placeholder="Grizzled Company..." />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Contenu de la liste</label>
            <textarea className="form-textarea" style={{minHeight:200}} value={form.contenu} onChange={e=>set("contenu",e.target.value)} placeholder="Colle ta liste ici..." />
          </div>
          <div className="form-group">
            <label className="form-label">Notes / Stratégie</label>
            <textarea className="form-textarea" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Game plan, synergies clés..." />
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button className="btn btn-primary" onClick={handleSave}>💾 Sauvegarder</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BatailleForm({ listes, bataille, onSave, onClose }) {
  const [form, setForm] = useState(bataille || {
    date: new Date().toISOString().slice(0,10),
    liste_id: listes[0]?.id || "",
    adversaire_faction: "",
    adversaire_detachement: "",
    adversaire_liste: "",
    scenario: "",
    mission_principale: "",
    score_moi: 0,
    score_adversaire: 0,
    resultat: "",
    tour_fin: 5,
    premier_joueur: "Moi",
    notes: ""
  });
  const [secondaires, setSecondaires] = useState([]);
  const [unites, setUnites] = useState([]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Auto-detect result
  useEffect(() => {
    if (form.score_moi !== "" && form.score_adversaire !== "") {
      const m = +form.score_moi, a = +form.score_adversaire;
      set("resultat", m > a ? "Victoire" : m < a ? "Défaite" : "Égalité");
    }
  }, [form.score_moi, form.score_adversaire]);

  const addSecondaire = () => setSecondaires(s => [...s, { joueur:"Moi", nom_secondaire:"", points_gagnes:0, points_max:5, notes:"" }]);
  const setSecondaire = (i, k, v) => setSecondaires(s => s.map((x,j) => j===i ? {...x,[k]:v} : x));
  const removeSecondaire = (i) => setSecondaires(s => s.filter((_,j)=>j!==i));

  const addUnite = () => setUnites(u => [...u, { unite:"", performance:"Bon", notes:"" }]);
  const setUnite = (i, k, v) => setUnites(u => u.map((x,j) => j===i ? {...x,[k]:v} : x));
  const removeUnite = (i) => setUnites(u => u.filter((_,j)=>j!==i));

  const handleSave = async () => {
    if (!form.resultat) return alert("Résultat requis");
    // Find liste to snapshot
    const listeChoisie = listes.find(l => l.id === form.liste_id);
    const payload = { ...form, liste_snapshot: listeChoisie?.contenu || null };
    const { data, error } = bataille?.id
      ? await supabase.from("w40k_batailles").update(payload).eq("id", bataille.id).select().single()
      : await supabase.from("w40k_batailles").insert(payload).select().single();
    if (error) return alert("Erreur: " + error.message);
    const bid = data.id;
    if (secondaires.length > 0) {
      await supabase.from("w40k_secondaires").delete().eq("bataille_id", bid);
      await supabase.from("w40k_secondaires").insert(secondaires.map(s => ({ ...s, bataille_id: bid })));
    }
    if (unites.length > 0) {
      await supabase.from("w40k_unites_perf").delete().eq("bataille_id", bid);
      await supabase.from("w40k_unites_perf").insert(unites.map(u => ({ ...u, bataille_id: bid })));
    }
    onSave();
  };

  const resultatColor = form.resultat === "Victoire" ? "#4ade80" : form.resultat === "Défaite" ? "#f87171" : "var(--gold)";

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{maxWidth:780}}>
        <div className="modal-title">📋 Rapport de Bataille</div>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="form">

          {/* Date + liste */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={form.date} onChange={e=>set("date",e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Ma liste</label>
              <select className="form-select" value={form.liste_id} onChange={e=>set("liste_id",e.target.value)}>
                <option value="">— Sans liste —</option>
                {listes.map(l => <option key={l.id} value={l.id}>{l.nom}</option>)}
              </select>
            </div>
          </div>

          {/* Adversaire */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Faction adverse</label>
              <select className="form-select" value={form.adversaire_faction} onChange={e=>set("adversaire_faction",e.target.value)}>
                <option value="">— Choisir —</option>
                {FACTIONS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Détachement adverse</label>
              <input className="form-input" value={form.adversaire_detachement} onChange={e=>set("adversaire_detachement",e.target.value)} placeholder="..." />
            </div>
          </div>

          {/* Carte */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Carte</label>
              <input className="form-input" value={form.scenario} onChange={e=>set("scenario",e.target.value)} placeholder="Burden of Trust, Hidden Supplies..." />
            </div>
            <div className="form-group">
              <label className="form-label">Mission principale</label>
              <input className="form-input" value={form.mission_principale} onChange={e=>set("mission_principale",e.target.value)} placeholder="Take and Hold, Linchpin..." />
            </div>
          </div>

          {/* Score */}
          <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:6,padding:20}}>
            <div style={{display:"flex",gap:20,alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}>
              <div style={{textAlign:"center"}}>
                <div className="form-label" style={{marginBottom:8}}>Mon score</div>
                <input className="form-input" type="number" min="0" max="100" value={form.score_moi}
                  onChange={e=>set("score_moi",+e.target.value)}
                  style={{width:90,textAlign:"center",fontSize:28,fontFamily:"var(--font-title)",color:"var(--gold2)"}} />
              </div>
              <div style={{fontSize:24,color:"var(--muted)",fontWeight:700,paddingTop:20}}>VS</div>
              <div style={{textAlign:"center"}}>
                <div className="form-label" style={{marginBottom:8}}>Score adverse</div>
                <input className="form-input" type="number" min="0" max="100" value={form.score_adversaire}
                  onChange={e=>set("score_adversaire",+e.target.value)}
                  style={{width:90,textAlign:"center",fontSize:28,fontFamily:"var(--font-title)",color:"#f87171"}} />
              </div>
              <div style={{textAlign:"center",paddingTop:20}}>
                {form.resultat && <span className={`card-badge badge-${form.resultat.toLowerCase().replace("é","e").replace("è","e")}`}>{form.resultat}</span>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Premier joueur</label>
              <select className="form-select" value={form.premier_joueur} onChange={e=>set("premier_joueur",e.target.value)}>
                <option>Moi</option><option>Adversaire</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nombre de tours joués</label>
              <select className="form-select" value={form.tour_fin} onChange={e=>set("tour_fin",+e.target.value)}>
                {[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Secondaires */}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span className="form-label">Missions secondaires</span>
              <button className="btn btn-ghost btn-sm" onClick={addSecondaire}>+ Ajouter</button>
            </div>
            {secondaires.map((s,i) => (
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 2fr 60px 60px auto",gap:8,marginBottom:8,alignItems:"center"}}>
                <select className="form-select" value={s.joueur} onChange={e=>setSecondaire(i,"joueur",e.target.value)}>
                  <option>Moi</option><option>Adversaire</option>
                </select>
                <input className="form-input" placeholder="Nom du secondaire" value={s.nom_secondaire} onChange={e=>setSecondaire(i,"nom_secondaire",e.target.value)} />
                <input className="form-input" type="number" min="0" placeholder="Pts" value={s.points_gagnes} onChange={e=>setSecondaire(i,"points_gagnes",+e.target.value)} style={{textAlign:"center"}} />
                <input className="form-input" type="number" min="0" placeholder="Max" value={s.points_max} onChange={e=>setSecondaire(i,"points_max",+e.target.value)} style={{textAlign:"center"}} />
                <button className="btn btn-danger btn-sm" onClick={()=>removeSecondaire(i)}>✕</button>
              </div>
            ))}
          </div>

          {/* Unités perf */}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span className="form-label">Performance des unités</span>
              <button className="btn btn-ghost btn-sm" onClick={addUnite}>+ Ajouter</button>
            </div>
            {unites.map((u,i) => (
              <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr auto",gap:8,marginBottom:8,alignItems:"center"}}>
                <input className="form-input" placeholder="Unité" value={u.unite} onChange={e=>setUnite(i,"unite",e.target.value)} />
                <select className="form-select" value={u.performance} onChange={e=>setUnite(i,"performance",e.target.value)}>
                  {PERFORMANCES.map(p=><option key={p}>{p}</option>)}
                </select>
                <button className="btn btn-danger btn-sm" onClick={()=>removeUnite(i)}>✕</button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Rapport de bataille / Notes</label>
            <textarea className="form-textarea" style={{minHeight:140}} value={form.notes}
              onChange={e=>set("notes",e.target.value)}
              placeholder="Déroulement de la partie, ce qui a marché, ce qui a raté, ajustements à faire..." />
          </div>

          <div className="form-group">
            <label className="form-label">Liste de l'adversaire (optionnel)</label>
            <textarea className="form-textarea" value={form.adversaire_liste} onChange={e=>set("adversaire_liste",e.target.value)} placeholder="Colle la liste adverse ici..." />
          </div>

          <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button className="btn btn-primary" onClick={handleSave}>⚔ Sauvegarder la bataille</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BatailleDetail({ bataille, onClose, onEdit, onDelete }) {
  const [secondaires, setSecondaires] = useState([]);
  const [unites, setUnites] = useState([]);
  const [coachAnalysis, setCoachAnalysis] = useState(bataille.coachanalysis || null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    supabase.from("w40k_secondaires").select("*").eq("bataille_id", bataille.id).then(({data}) => setSecondaires(data||[]));
    supabase.from("w40k_unites_perf").select("*").eq("bataille_id", bataille.id).then(({data}) => setUnites(data||[]));
  }, [bataille.id]);

  const scoreCls = bataille.resultat === "Victoire" ? "win" : bataille.resultat === "Défaite" ? "lose" : "draw";

  const handleCoachAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      console.log("🧠 Calling coach API with gameId:", bataille.id);
      // Obtenir l'URL de base de l'app
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/coach-analyze`;
      console.log("📍 API URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: bataille.id }),
      });
      console.log("📡 Response status:", response.status);
      const data = await response.json();
      console.log("📦 Response data:", data);
      if (!response.ok) {
        alert(`Erreur API (${response.status}): ${data.error || "Erreur inconnue"}\n\nDétails: ${JSON.stringify(data)}`);
        return;
      }
      if (data.analysis) {
        console.log("✅ Analysis received, setting state...");
        setCoachAnalysis(data.analysis);
      } else {
        console.error("❌ No analysis in response", data);
        alert("Pas d'analyse reçue.\n\nRéponse: " + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error("❌ Coach API error:", error);
      alert("Erreur lors de l'analyse du coach: " + error.message);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const renderAnalysis = (text) => {
    if (!text) return null;
    const sections = text.split("--").map(s => s.trim()).filter(Boolean);
    return (
      <div style={{marginTop:20}}>
        {sections.map((section, i) => (
          <div key={i} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid var(--border)"}}>
            <div style={{fontSize:14,lineHeight:1.8,color:"var(--text)",whiteSpace:"pre-wrap"}}>{section}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{maxWidth:780,maxHeight:"90vh",overflowY:"auto"}}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
          <div>
            <div className="modal-title" style={{marginBottom:4}}>{bataille.adversaire_faction || "Adversaire inconnu"}</div>
            <div style={{color:"var(--muted)",fontSize:13}}>{fmt(bataille.date)} · Tour {bataille.tour_fin} · Premier: {bataille.premier_joueur}</div>
          </div>
          <div className="score-display">
            <div className="score-block"><div className={`score-big ${scoreCls}`}>{bataille.score_moi}</div><div style={{fontSize:12,color:"var(--muted)"}}>MOI</div></div>
            <div className="score-vs">—</div>
            <div className="score-block"><div className={`score-big`} style={{color:"var(--muted)"}}>{bataille.score_adversaire}</div><div style={{fontSize:12,color:"var(--muted)"}}>ADV</div></div>
          </div>
        </div>

        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
          {bataille.scenario && <span style={{background:"var(--surface2)",padding:"4px 10px",borderRadius:3,fontSize:13,color:"var(--muted)"}}>📍 {bataille.scenario}</span>}
          {bataille.adversaire_detachement && <span style={{background:"var(--surface2)",padding:"4px 10px",borderRadius:3,fontSize:13,color:"var(--muted)"}}>{bataille.adversaire_detachement}</span>}
          <span className={`card-badge badge-${(bataille.resultat||"").toLowerCase().replace("é","e").replace("è","e")}`}>{bataille.resultat}</span>
        </div>

        {secondaires.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-title">Missions secondaires</div>
            {secondaires.map(s => (
              <div key={s.id} className="sec-row">
                <div>
                  <span style={{fontSize:12,color:"var(--muted)",marginRight:8}}>{s.joueur}</span>
                  <span style={{fontWeight:600}}>{s.nom_secondaire}</span>
                </div>
                <div>
                  <span className="sec-pts">{s.points_gagnes}</span>
                  <span style={{color:"var(--muted)",fontSize:13}}>/{s.points_max}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {unites.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-title">Performance des unités</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {unites.map(u => (
                <div key={u.id} className="perf-tag" style={{background:`${PERF_COLORS[u.performance]}18`,border:`1px solid ${PERF_COLORS[u.performance]}`,color:PERF_COLORS[u.performance]}}>
                  {u.unite} · {u.performance}
                </div>
              ))}
            </div>
          </div>
        )}

        {bataille.notes && (
          <div className="detail-section">
            <div className="detail-section-title">Rapport</div>
            <div style={{fontSize:15,lineHeight:1.7,color:"var(--text)",whiteSpace:"pre-wrap"}}>{bataille.notes}</div>
          </div>
        )}

        {bataille.liste_snapshot && (
          <div className="detail-section">
            <div className="detail-section-title">Liste jouée (snapshot)</div>
            <pre style={{fontSize:12,color:"var(--muted)",overflowX:"auto",whiteSpace:"pre-wrap"}}>{bataille.liste_snapshot}</pre>
          </div>
        )}

        {coachAnalysis && (
          <div className="detail-section" style={{background:"rgba(201,168,76,0.05)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:6,padding:16}}>
            <div className="detail-section-title" style={{marginBottom:12}}>🧠 Analyse du Coach</div>
            {renderAnalysis(coachAnalysis)}
          </div>
        )}

        <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:20,flexWrap:"wrap"}}>
          <button className="btn btn-danger btn-sm" onClick={()=>onDelete(bataille.id)}>🗑 Supprimer</button>
          <button className="btn btn-ghost" onClick={onClose}>Fermer</button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleCoachAnalysis}
            disabled={loadingAnalysis}
            style={{opacity: loadingAnalysis ? 0.6 : 1}}
          >
            {loadingAnalysis ? "⏳ Analyse..." : "🧠 Coach IA"}
          </button>
          <button className="btn btn-primary btn-sm" onClick={()=>onEdit(bataille)}>✏ Modifier</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [listes, setListes] = useState([]);
  const [batailles, setBatailles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showListeForm, setShowListeForm] = useState(false);
  const [editListe, setEditListe] = useState(null);
  const [showBatailleForm, setShowBatailleForm] = useState(false);
  const [editBataille, setEditBataille] = useState(null);
  const [detailBataille, setDetailBataille] = useState(null);
  const [showNewBattleForm, setShowNewBattleForm] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [{ data: l }, { data: b }] = await Promise.all([
      supabase.from("w40k_listes").select("*").order("created_at", { ascending: false }),
      supabase.from("w40k_batailles").select("*").order("date", { ascending: false })
    ]);
    setListes(l || []);
    setBatailles(b || []);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const deleteBataille = async (id) => {
    if (!confirm("Supprimer cette bataille ?")) return;
    await supabase.from("w40k_batailles").delete().eq("id", id);
    setDetailBataille(null);
    loadAll();
  };

  const deleteListe = async (id) => {
    if (!confirm("Supprimer cette liste ?")) return;
    await supabase.from("w40k_listes").delete().eq("id", id);
    loadAll();
  };

  const TABS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "batailles", label: "Batailles" },
    { id: "listes", label: "Listes" },
  ];

  return (
    <div className="app">
      <style>{css}</style>

      <header className="header">
        <div className="header-logo">
          <span className="header-skull">💀</span>
          <div>
            <div className="header-title">Grimdark Tracker</div>
            <div className="header-sub">Astra Militarum · Campaign Log</div>
          </div>
        </div>
        <nav className="header-nav">
          {TABS.map(t => (
            <button key={t.id} className={`nav-btn ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </nav>
      </header>

      <main className="main">
        {/* Mobile tabs */}
        <div className="sub-tabs" style={{display:"flex"}}>
          {TABS.map(t => (
            <button key={t.id} className={`sub-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="empty"><div className="empty-icon">⚙</div><div className="empty-text">Chargement...</div></div>
        ) : (
          <>
            {/* ── DASHBOARD ── */}
            {tab === "dashboard" && (
              <div>
                <div className="section-header">
                  <div className="section-title">Statistiques</div>
                  <button className="btn btn-primary" onClick={()=>{setEditBataille(null);setShowBatailleForm(true);}}>
                    + Nouvelle bataille
                  </button>
                </div>
                {batailles.length === 0
                  ? <div className="empty"><div className="empty-icon">⚔</div><div className="empty-text">Aucune bataille enregistrée.<br/>Commence par ajouter ta première partie.</div></div>
                  : <StatsPanel batailles={batailles} />
                }

                {batailles.length > 0 && (
                  <>
                    <div className="section-header" style={{marginTop:32}}>
                      <div className="section-title">Dernières batailles</div>
                    </div>
                    <div className="grid">
                      {batailles.slice(0,6).map(b => (
                        <div key={b.id} className="card" onClick={()=>setDetailBataille(b)}>
                          <div className="card-title">{b.adversaire_faction || "Adversaire inconnu"}</div>
                          <div className="card-meta">{fmt(b.date)} · {b.scenario || "Scénario non renseigné"}</div>
                          <div style={{display:"flex",alignItems:"center",gap:16,marginTop:12}}>
                            <div>
                              <div className="card-score" style={{color: b.resultat==="Victoire"?"#4ade80":b.resultat==="Défaite"?"#f87171":"var(--gold)"}}>
                                {b.score_moi} <span style={{fontSize:16,color:"var(--muted)"}}>— {b.score_adversaire}</span>
                              </div>
                            </div>
                            <div>
                              <span className={`card-badge badge-${(b.resultat||"").toLowerCase().replace("é","e").replace("è","e")}`}>{b.resultat}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── BATAILLES ── */}
            {tab === "batailles" && (
              <div>
                <div className="section-header">
                  <div className="section-title">Rapports de Bataille</div>
                  <button className="btn btn-primary" onClick={()=>setShowNewBattleForm(true)}>
                    ➕ Nouvelle partie
                  </button>
                </div>
                {batailles.length === 0
                  ? <div className="empty"><div className="empty-icon">📋</div><div className="empty-text">Aucun rapport. À toi de jouer !</div></div>
                  : (
                    <div className="grid">
                      {batailles.map(b => (
                        <div key={b.id} className="card" onClick={()=>setDetailBataille(b)}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                            <div>
                              <div className="card-title">{b.adversaire_faction || "Adversaire inconnu"}</div>
                              <div className="card-meta">{fmt(b.date)}</div>
                              {b.adversaire_detachement && <div className="card-meta">{b.adversaire_detachement}</div>}
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div className="card-score" style={{color: b.resultat==="Victoire"?"#4ade80":b.resultat==="Défaite"?"#f87171":"var(--gold)"}}>
                                {b.score_moi}<span style={{fontSize:14,color:"var(--muted)"}}>-{b.score_adversaire}</span>
                              </div>
                            </div>
                          </div>
                          {b.scenario && <div className="card-meta" style={{marginTop:8}}>📍 {b.scenario}</div>}
                          <span className={`card-badge badge-${(b.resultat||"").toLowerCase().replace("é","e").replace("è","e")}`}>{b.resultat}</span>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            )}

            {/* ── LISTES ── */}
            {tab === "listes" && (
              <div>
                <div className="section-header">
                  <div className="section-title">Mes Listes</div>
                  <button className="btn btn-primary" onClick={()=>{setEditListe(null);setShowListeForm(true);}}>
                    + Nouvelle liste
                  </button>
                </div>
                {listes.length === 0
                  ? <div className="empty"><div className="empty-icon">📜</div><div className="empty-text">Aucune liste. Crée ta première armée !</div></div>
                  : (
                    <div className="grid">
                      {listes.map(l => {
                        const partiesAvecCetteListe = batailles.filter(b=>b.liste_id===l.id).length;
                        const victoiresAvecListe = batailles.filter(b=>b.liste_id===l.id && b.resultat==="Victoire").length;
                        return (
                          <div key={l.id} className="card">
                            <div className="card-title">{l.nom}</div>
                            <div className="card-meta">{l.faction} · {l.detachement}</div>
                            <div className="card-meta">{l.points} pts</div>
                            <div style={{display:"flex",gap:8,margin:"12px 0",flexWrap:"wrap"}}>
                              <span style={{fontSize:13,color:"var(--muted)"}}>{partiesAvecCetteListe} parties</span>
                              {partiesAvecCetteListe > 0 && <span style={{fontSize:13,color:"#4ade80"}}>{victoiresAvecListe}V / {partiesAvecCetteListe-victoiresAvecListe}D</span>}
                            </div>
                            {l.notes && <div style={{fontSize:13,color:"var(--muted)",marginBottom:12,fontStyle:"italic",borderLeft:"2px solid var(--border)",paddingLeft:10}}>{l.notes.slice(0,120)}{l.notes.length>120?"...":""}</div>}
                            <div style={{display:"flex",gap:8}}>
                              <button className="btn btn-ghost btn-sm" onClick={()=>{setEditListe(l);setShowListeForm(true);}}>✏ Modifier</button>
                              <button className="btn btn-danger btn-sm" onClick={()=>deleteListe(l.id)}>🗑</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                }
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showListeForm && (
        <ListeForm
          liste={editListe}
          onSave={() => { setShowListeForm(false); setEditListe(null); loadAll(); }}
          onClose={() => { setShowListeForm(false); setEditListe(null); }}
        />
      )}
      {showBatailleForm && (
        <BatailleForm
          listes={listes}
          bataille={editBataille}
          onSave={() => { setShowBatailleForm(false); setEditBataille(null); loadAll(); }}
          onClose={() => { setShowBatailleForm(false); setEditBataille(null); }}
        />
      )}
      {detailBataille && (
        <BatailleDetail
          bataille={detailBataille}
          onClose={() => setDetailBataille(null)}
          onEdit={(b) => { setDetailBataille(null); setEditBataille(b); setShowBatailleForm(true); }}
          onDelete={deleteBataille}
        />
      )}
      {showNewBattleForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{ maxWidth: '900px', width: '100%', marginY: 'auto' }}>
            <BattleReportForm
              mode="create"
              supabase={supabase}
              onSave={(data) => {
                console.log('Partie créée:', data);
                setShowNewBattleForm(false);
                loadAll();
              }}
              onClose={() => setShowNewBattleForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

