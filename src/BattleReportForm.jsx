import React, { useState } from 'react';

const BattleReportForm = ({ battleId, onSave, onClose }) => {
  const [level, setLevel] = useState('1'); // '1', '2', '3'
  const [formData, setFormData] = useState({
    // NIVEAU 1 - BASE
    adversaire_faction: '',
    ta_liste: '',
    mission: '',
    deployment: '',
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
    
    // NIVEAU 3 - MINI
    // Réutilise les champs de base seulement
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // TODO: Intégrer avec Supabase plus tard
    console.log('Sauvegarde rapport:', { battleId, level, formData });
    if (onSave) onSave({ battleId, level, ...formData });
    alert(`✅ Rapport niveau ${level} sauvegardé!`);
  };

  const levelLabels = {
    '1': '⚡ Rapide (5 min)',
    '2': '📊 Complet (15 min)',
    '3': '🔥 Minimaliste (2 min)'
  };

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
        <h2 style={{ margin: 0, color: '#c9a84c' }}>⚔️ Retour de Partie</h2>
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Faction adversaire</label>
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Mission</label>
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Tour final</label>
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Résultat</label>
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Score toi</label>
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
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Score adversaire</label>
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
              background: '#2a2a2a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>📋 Cadre</label>
              <select
                name="cadre"
                value={formData.cadre}
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
                <option value="Club">Club</option>
                <option value="Tournoi">Tournoi</option>
                <option value="Casual">Casual</option>
              </select>
            </div>

            <div style={{ 
              background: '#2a2a2a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Liste adverse (si connue)</label>
              <textarea
                name="liste_adverse"
                value={formData.liste_adverse}
                onChange={handleChange}
                placeholder="Donne la composition si tu la connais..."
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit',
                  minHeight: '80px'
                }}
              />
            </div>

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

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Résultat?</label>
              <select
                name="t1_resultat"
                value={formData.t1_resultat}
                onChange={handleChange}
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
              >
                <option value="Oui">✅ Oui</option>
                <option value="Partiellement">🤔 Partiellement</option>
                <option value="Non">❌ Non</option>
              </select>

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Regrets</label>
              <input
                type="text"
                name="t1_regrets"
                value={formData.t1_regrets}
                onChange={handleChange}
                placeholder="Aurais-tu dû faire autrement?"
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
              background: '#3a2a1a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#c9a84c' }}>T1 - Plan adverse</h4>
              
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Son plan apparent</label>
              <input
                type="text"
                name="t1_adv_plan"
                value={formData.t1_adv_plan}
                onChange={handleChange}
                placeholder="Qu'est-ce qu'il essaie de faire"
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

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Menaces créées</label>
              <textarea
                name="t1_adv_menace"
                value={formData.t1_adv_menace}
                onChange={handleChange}
                placeholder="Quelles unités/positions te posent problème"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit',
                  minHeight: '60px'
                }}
              />
            </div>

            <div style={{ 
              background: '#3a2a1a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#c9a84c' }}>T2-T3 Résumé rapide</h4>
              
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>T2 - Points clés</label>
              <textarea
                name="t2_resume"
                value={formData.t2_resume}
                onChange={handleChange}
                placeholder="Les moments clés du tour 2"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit',
                  minHeight: '60px',
                  marginBottom: '12px'
                }}
              />

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>T3+ - Conclusion</label>
              <textarea
                name="t3_resume"
                value={formData.t3_resume}
                onChange={handleChange}
                placeholder="Comment ça s'est terminé"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit',
                  minHeight: '60px'
                }}
              />
            </div>

            <div style={{ 
              background: '#3a2a1a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#c9a84c' }}>⚡ Décisions clés</h4>
              
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
                  fontFamily: 'inherit',
                  marginBottom: '8px'
                }}
              />
              <select
                name="decision_1_verdict"
                value={formData.decision_1_verdict}
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
                <option value="Bonne">✅ Bonne call</option>
                <option value="Mauvaise">❌ Mauvaise</option>
                <option value="50-50">🤔 50-50</option>
              </select>
            </div>

            <div style={{ 
              background: '#3a2a1a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#c9a84c' }}>🔴 Erreurs</h4>
              
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Erreur #1</label>
              <input
                type="text"
                name="erreur_1"
                value={formData.erreur_1}
                onChange={handleChange}
                placeholder="Règles / Position / Gestion..."
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
                name="erreur_1_impact"
                value={formData.erreur_1_impact}
                onChange={handleChange}
                placeholder="Impact: combien de pts perdu"
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
              background: '#3a2a1a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#c9a84c' }}>💡 Apprentissages</h4>
              
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Pattern détecté</label>
              <input
                type="text"
                name="pattern_detecte"
                value={formData.pattern_detecte}
                onChange={handleChange}
                placeholder="Si récurrent..."
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

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Insight vs cette faction</label>
              <input
                type="text"
                name="matchup_insight"
                value={formData.matchup_insight}
                onChange={handleChange}
                placeholder="Spécifique au matchup..."
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

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Ajustement liste</label>
              <input
                type="text"
                name="ajustement_liste"
                value={formData.ajustement_liste}
                onChange={handleChange}
                placeholder="Si besoin..."
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

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>À tester prochainement</label>
              <input
                type="text"
                name="a_tester"
                value={formData.a_tester}
                onChange={handleChange}
                placeholder="Idée pour la prochaine..."
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>📝 Notes libres</label>
              <textarea
                name="notes_libres"
                value={formData.notes_libres}
                onChange={handleChange}
                placeholder="Tout ce qui vient à l'esprit..."
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  fontFamily: 'inherit',
                  minHeight: '80px'
                }}
              />
            </div>

            <div style={{ 
              background: '#2a2a2a', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #c9a84c'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>✅ Confiance prochaine partie (0-100)</label>
              <input
                type="range"
                name="confiance_prochaine"
                min="0"
                max="100"
                value={formData.confiance_prochaine}
                onChange={handleChange}
                style={{
                  width: '100%',
                  marginBottom: '8px'
                }}
              />
              <div style={{ color: '#c9a84c', fontSize: '14px', fontWeight: 'bold' }}>
                {formData.confiance_prochaine}% confiance vs {formData.adversaire_faction || '[faction]'}
              </div>
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
          ✅ Sauvegarder
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
            Fermer
          </button>
        )}
      </div>
    </div>
  );
};

export default BattleReportForm;
