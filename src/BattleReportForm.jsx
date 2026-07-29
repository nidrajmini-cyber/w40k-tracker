import React, { useState } from 'react';

const BattleReportForm = ({ mode = 'create', battleId, onSave, onClose, supabase }) => {
  const [level, setLevel] = useState('1');
  const [formData, setFormData] = useState({
    // NIVEAU 1 - BASE
    adversaire_faction: '',
    ta_liste: '',
    mission: '',
    premier_joueur: '',
    tour_final: '',
    resultat: 'Défaite',
    score_moi: 0,
    score_adversaire: 0,
    peint: '10',
    tournant: '',
    unite_star: '',
    unite_decevante: '',
    lecon_principale: '',
    
    // NIVEAU 2 - COMPLET
    cadre: 'Club',
    liste_adverse: '',
    t1_objectifs: '',
    t1_execution: '',
    t1_resultat: 'Oui',
    t1_regrets: '',
    t1_adv_plan: '',
    t1_adv_menace: '',
    t2_resume: '',
    t3_resume: '',
    decision_1: '',
    decision_1_alt: '',
    decision_1_verdict: 'Bonne',
    decision_2: '',
    decision_2_alt: '',
    decision_2_verdict: 'Bonne',
    erreur_1: '',
    erreur_1_impact: '',
    erreur_2: '',
    erreur_2_impact: '',
    pattern_detecte: '',
    matchup_insight: '',
    ajustement_liste: '',
    a_tester: '',
    notes_libres: '',
    confiance_prochaine: 50,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (mode === 'create' && supabase) {
        // Construire les notes complètes selon le niveau
        let notes = '';
        
        if (level === '1' || level === '2' || level === '3') {
          notes = `TOURNANT: ${formData.tournant}\n`;
          notes += `UNITE STAR: ${formData.unite_star}\n`;
          notes += `UNITE DECEVANTE: ${formData.unite_decevante}\n`;
          notes += `LECON: ${formData.lecon_principale}`;
        }
        
        if (level === '2') {
          notes += `\n\n═ DETAILS NIVEAU 2 ═\n`;
          notes += `T1 OBJECTIFS: ${formData.t1_objectifs}\n`;
          notes += `T1 EXECUTION: ${formData.t1_execution}\n`;
          notes += `T1 PLAN ADVERSE: ${formData.t1_adv_plan}\n`;
          notes += `DECISIONS CLÉS:\n`;
          notes += `- ${formData.decision_1}\n`;
          if (formData.decision_2) notes += `- ${formData.decision_2}\n`;
          notes += `\nNOTES: ${formData.notes_libres}`;
        }

        // Créer la bataille
        const { data, error } = await supabase
          .from('w40k_batailles')
          .insert([{
            date: new Date().toISOString().split('T')[0],
            adversaire_faction: formData.adversaire_faction,
            liste_id: null, // À lier manuellement si nécessaire
            mission_principale: formData.mission,
            premier_joueur: formData.premier_joueur,
            score_moi: parseInt(formData.score_moi),
            score_adversaire: parseInt(formData.score_adversaire),
            resultat: formData.resultat,
            tour_fin: formData.tour_final ? parseInt(formData.tour_final.replace('T', '')) : null,
            notes: notes,
            created_at: new Date().toISOString(),
          }])
          .select();

        if (error) {
          console.error('Erreur Supabase:', error);
          alert(`❌ Erreur: ${error.message}`);
          return;
        }

        console.log('✅ Partie créée:', data);
        alert(`✅ Partie créée vs ${formData.adversaire_faction}!`);
        if (onSave) onSave(data[0]);
        if (onClose) onClose();
      } else {
        // Mode rapport (pas encore implémenté)
        console.log('Sauvegarde rapport:', { battleId, level, formData });
        if (onSave) onSave({ battleId, level, ...formData });
        alert(`✅ Rapport niveau ${level} sauvegardé!`);
      }
    } catch (err) {
      console.error('Erreur:', err);
      alert(`❌ Erreur: ${err.message}`);
    }
  };

  const levelLabels = {
    '1': '⚡ Rapide (5 min)',
    '2': '📊 Complet (15 min)',
    '3': '🔥 Minimaliste (2 min)'
  };

  const title = mode === 'create' ? '⚔️ Nouvelle Partie' : '⚔️ Retour de Partie';

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '24px',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2416 100%)',
      borderRadius: '12px',
      border: '2px solid #c9a84c',
      color: '#e0e0e0',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#c9a84c' }}>{title}</h2>
        {onClose && <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#c9a84c', fontSize: '24px', cursor: 'pointer' }}
        >✕</button>}
      </div>

      {/* CHOIX NIVEAU */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {Object.entries(levelLabels).map(([lvl, label]) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            style={{
              padding: '10px 16px',
              background: level === lvl ? '#c9a84c' : '#3a3a3a',
              color: level === lvl ? '#000' : '#c9a84c',
              border: `2px solid #c9a84c`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* FORMULAIRE DYNAMIQUE */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxHeight: '60vh',
        overflowY: 'auto',
        paddingRight: '12px'
      }}>

        {/* NIVEAU 1 & 2 & 3 - INFOS DE BASE */}
        {['1', '2', '3'].includes(level) && (
          <>
            <div style={{ 
              background: '#2a2a2a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Faction adversaire *</label>
              <input
                type="text"
                name="adversaire_faction"
                value={formData.adversaire_faction}
                onChange={handleChange}
                placeholder="Ex: Blood Angels, Tau Empire, Emperor's Children..."
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px' 
            }}>
              <div style={{ 
                background: '#2a2a2a', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: '4px solid #c9a84c'
              }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Ta liste</label>
                <input
                  type="text"
                  name="ta_liste"
                  value={formData.ta_liste}
                  onChange={handleChange}
                  placeholder="Ex: 09.2BB"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ 
                background: '#2a2a2a', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: '4px solid #c9a84c'
              }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Mission *</label>
                <select
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="">-- Sélectionne --</option>
                  <option value="Reconnaissance">Reconnaissance (Table Quarters)</option>
                  <option value="Purge the Foe">Purge the Foe</option>
                  <option value="Priority Assets">Priority Assets</option>
                  <option value="Triangulation">Triangulation</option>
                  <option value="Take and Hold">Take and Hold</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              gap: '12px' 
            }}>
              <div style={{ 
                background: '#2a2a2a', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: '4px solid #c9a84c'
              }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Premier joueur</label>
                <select
                  name="premier_joueur"
                  value={formData.premier_joueur}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="">-- Sélectionne --</option>
                  <option value="Toi">Toi</option>
                  <option value="Adversaire">Adversaire</option>
                </select>
              </div>

              <div style={{ 
                background: '#2a2a2a', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: '4px solid #c9a84c'
              }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Tour final *</label>
                <select
                  name="tour_final"
                  value={formData.tour_final}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="">-- Sélectionne --</option>
                  <option value="T1">T1</option>
                  <option value="T2">T2</option>
                  <option value="T3">T3</option>
                  <option value="T4">T4</option>
                  <option value="T5">T5</option>
                </select>
              </div>

              <div style={{ 
                background: '#2a2a2a', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: '4px solid #c9a84c'
              }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Résultat *</label>
                <select
                  name="resultat"
                  value={formData.resultat}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="Victoire">✅ Victoire</option>
                  <option value="Défaite">❌ Défaite</option>
                  <option value="Draw">🤝 Draw</option>
                </select>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px' 
            }}>
              <div style={{ 
                background: '#2a2a2a', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: '4px solid #c9a84c'
              }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Score toi *</label>
                <input
                  type="number"
                  name="score_moi"
                  value={formData.score_moi}
                  onChange={handleChange}
                  min="0"
                  max="90"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ 
                background: '#2a2a2a', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: '4px solid #c9a84c'
              }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Score adversaire *</label>
                <input
                  type="number"
                  name="score_adversaire"
                  value={formData.score_adversaire}
                  onChange={handleChange}
                  min="0"
                  max="90"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ 
              background: '#2a2a2a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Peint</label>
              <select
                name="peint"
                value={formData.peint}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit'
                }}
              >
                <option value="10">✅ 10/10 Battle Ready</option>
                <option value="5">⚠️ 5/10 Primed</option>
                <option value="0">❌ Unpainted</option>
              </select>
            </div>

            <div style={{ 
              background: '#2a2a2a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>⚡ Tournant décisif (T + description)</label>
              <input
                type="text"
                name="tournant"
                value={formData.tournant}
                onChange={handleChange}
                placeholder="Ex: T2 - Stormsword détruit, perte de létalité"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px' 
            }}>
              <div style={{ 
                background: '#2a2a2a', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: '4px solid #c9a84c'
              }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>⭐ Unité star</label>
                <input
                  type="text"
                  name="unite_star"
                  value={formData.unite_star}
                  onChange={handleChange}
                  placeholder="Quelle unité a fait la diff"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ 
                background: '#2a2a2a', 
                padding: '16px', 
                borderRadius: '8px',
                borderLeft: '4px solid #c9a84c'
              }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>❌ Unité décevante</label>
                <input
                  type="text"
                  name="unite_decevante"
                  value={formData.unite_decevante}
                  onChange={handleChange}
                  placeholder="Qui a underperformed"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#1a1a1a',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ 
              background: '#2a2a2a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>💡 Leçon principale</label>
              <textarea
                name="lecon_principale"
                value={formData.lecon_principale}
                onChange={handleChange}
                placeholder="Ce qu'on retient pour la prochaine..."
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit',
                  minHeight: '60px',
                  resize: 'vertical'
                }}
              />
            </div>
          </>
        )}

        {/* NIVEAU 2 SUPPLÉMENTAIRE */}
        {level === '2' && (
          <>
            <hr style={{ borderColor: '#c9a84c', opacity: 0.3 }} />
            
            <div style={{ 
              background: '#3a2a1a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c',
              marginTop: '12px'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#c9a84c' }}>T1 - Ton T1</h4>
              
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Objectifs</label>
              <input
                type="text"
                name="t1_objectifs"
                value={formData.t1_objectifs}
                onChange={handleChange}
                placeholder="Qu'est-ce que tu voulais faire"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit',
                  marginBottom: '12px'
                }}
              />

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Exécution</label>
              <input
                type="text"
                name="t1_execution"
                value={formData.t1_execution}
                onChange={handleChange}
                placeholder="Qu'est-ce que tu as fait réellement"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit',
                  marginBottom: '12px'
                }}
              />
            </div>

            <div style={{ 
              background: '#3a2a1a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#c9a84c' }}>Décisions clés</h4>
              
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Décision #1</label>
              <input
                type="text"
                name="decision_1"
                value={formData.decision_1}
                onChange={handleChange}
                placeholder="Ton choix"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit',
                  marginBottom: '8px'
                }}
              />
              <input
                type="text"
                name="decision_1_alt"
                value={formData.decision_1_alt}
                onChange={handleChange}
                placeholder="Alternative possible"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ 
              background: '#2a2a2a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>📝 Notes détaillées</label>
              <textarea
                name="notes_libres"
                value={formData.notes_libres}
                onChange={handleChange}
                placeholder="T2/T3, erreurs, apprentissages..."
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit',
                  minHeight: '100px'
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* BOUTONS ACTION */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: '1px solid #c9a84c'
      }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: '#c9a84c',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ✅ Créer la partie
        </button>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: '#3a3a3a',
              color: '#c9a84c',
              border: '2px solid #c9a84c',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
};

export default BattleReportForm;
