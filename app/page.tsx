"use client"

import { useState, useEffect, useRef } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "landing" | "onboarding" | "dashboard" | "workout" | "diet" | "progress" | "community"
type Goal = "emagrecer" | "hipertrofia" | "condicionamento" | ""
type Level = "iniciante" | "intermediario" | "avancado" | ""

interface UserProfile {
  name: string
  goal: Goal
  level: Level
  weight: string
  restrictions: string
}

interface WorkoutDay {
  day: string
  focus: string
  exercises: { name: string; sets: string; rest: string }[]
}

interface Meal {
  name: string
  foods: string[]
  calories: number
}

interface ProgressEntry {
  date: string
  weight: number
  note: string
}

interface CommunityPost {
  id: number
  user: string
  avatar: string
  content: string
  likes: number
  time: string
  liked: boolean
}

// ─── Mock AI generation ──────────────────────────────────────────────────────
// Em produção: substituir por chamadas à OpenAI API via /api/generate-workout e /api/generate-diet

function generateWorkout(profile: UserProfile): WorkoutDay[] {
  const isHyper = profile.goal === "hipertrofia"
  const isFat = profile.goal === "emagrecer"

  if (isHyper) return [
    { day: "Segunda", focus: "Peito & Tríceps", exercises: [
      { name: "Supino reto", sets: "4x10-12", rest: "90s" },
      { name: "Supino inclinado halteres", sets: "3x12", rest: "75s" },
      { name: "Crossover", sets: "3x15", rest: "60s" },
      { name: "Tríceps corda", sets: "4x12", rest: "60s" },
      { name: "Tríceps testa", sets: "3x12", rest: "60s" },
    ]},
    { day: "Terça", focus: "Costas & Bíceps", exercises: [
      { name: "Puxada frontal", sets: "4x10-12", rest: "90s" },
      { name: "Remada curvada", sets: "4x10", rest: "90s" },
      { name: "Serrote haltere", sets: "3x12", rest: "60s" },
      { name: "Rosca direta", sets: "4x12", rest: "60s" },
      { name: "Rosca concentrada", sets: "3x12", rest: "60s" },
    ]},
    { day: "Quarta", focus: "Descanso ativo", exercises: [
      { name: "Caminhada 30min", sets: "1x30min", rest: "—" },
      { name: "Alongamento full body", sets: "1x15min", rest: "—" },
    ]},
    { day: "Quinta", focus: "Pernas", exercises: [
      { name: "Agachamento livre", sets: "4x10-12", rest: "120s" },
      { name: "Leg press 45°", sets: "4x12", rest: "90s" },
      { name: "Cadeira extensora", sets: "3x15", rest: "60s" },
      { name: "Mesa flexora", sets: "3x15", rest: "60s" },
      { name: "Panturrilha em pé", sets: "4x20", rest: "45s" },
    ]},
    { day: "Sexta", focus: "Ombros & Trapézio", exercises: [
      { name: "Desenvolvimento halteres", sets: "4x12", rest: "90s" },
      { name: "Elevação lateral", sets: "4x15", rest: "60s" },
      { name: "Elevação frontal", sets: "3x12", rest: "60s" },
      { name: "Encolhimento halteres", sets: "4x15", rest: "60s" },
    ]},
    { day: "Sábado", focus: "Full Body leve", exercises: [
      { name: "Agachamento goblet", sets: "3x15", rest: "60s" },
      { name: "Flexão", sets: "3x15", rest: "60s" },
      { name: "Remada elástico", sets: "3x15", rest: "60s" },
    ]},
    { day: "Domingo", focus: "Descanso total", exercises: [
      { name: "Recuperação ativa", sets: "—", rest: "—" },
    ]},
  ]

  if (isFat) return [
    { day: "Segunda", focus: "HIIT + Core", exercises: [
      { name: "Burpees", sets: "4x30s", rest: "15s" },
      { name: "Mountain climbers", sets: "4x30s", rest: "15s" },
      { name: "Jumping jacks", sets: "4x45s", rest: "15s" },
      { name: "Prancha", sets: "3x45s", rest: "30s" },
      { name: "Abdominal bicicleta", sets: "3x20", rest: "30s" },
    ]},
    { day: "Terça", focus: "Força Membros Inferiores", exercises: [
      { name: "Agachamento sumo", sets: "4x15", rest: "60s" },
      { name: "Afundo alternado", sets: "3x12 cada", rest: "60s" },
      { name: "Stiff halteres", sets: "3x15", rest: "60s" },
      { name: "Panturrilha", sets: "3x20", rest: "45s" },
    ]},
    { day: "Quarta", focus: "Cardio moderado", exercises: [
      { name: "Caminhada rápida ou bike", sets: "1x40min", rest: "—" },
    ]},
    { day: "Quinta", focus: "HIIT + Membros Superiores", exercises: [
      { name: "Flexão", sets: "4x12", rest: "45s" },
      { name: "Remada haltere", sets: "3x15", rest: "45s" },
      { name: "Desenvolvimento halteres", sets: "3x12", rest: "45s" },
      { name: "Sprint na esteira 30s/30s", sets: "8 séries", rest: "30s" },
    ]},
    { day: "Sexta", focus: "Full Body circuito", exercises: [
      { name: "Circuito: Squat→Flexão→Abdominal→Polichinelo", sets: "4 rounds", rest: "60s" },
    ]},
    { day: "Sábado", focus: "Atividade prazerosa", exercises: [
      { name: "Dança, futebol, natação ou bike", sets: "1x60min", rest: "—" },
    ]},
    { day: "Domingo", focus: "Descanso", exercises: [
      { name: "Recuperação total", sets: "—", rest: "—" },
    ]},
  ]

  // condicionamento
  return [
    { day: "Segunda", focus: "Corrida + Core", exercises: [
      { name: "Corrida contínua", sets: "1x30min", rest: "—" },
      { name: "Prancha lateral", sets: "3x30s", rest: "30s" },
      { name: "Dead bug", sets: "3x10", rest: "30s" },
    ]},
    { day: "Terça", focus: "Força funcional", exercises: [
      { name: "Agachamento goblet", sets: "4x12", rest: "60s" },
      { name: "Flexão com rotação", sets: "3x10", rest: "60s" },
      { name: "Turkish get-up", sets: "3x5 cada", rest: "90s" },
    ]},
    { day: "Quarta", focus: "Natação ou Bike", exercises: [
      { name: "Aeróbico de baixa intensidade", sets: "1x45min", rest: "—" },
    ]},
    { day: "Quinta", focus: "Intervalado", exercises: [
      { name: "Intervalado 1min forte / 2min leve", sets: "8 séries", rest: "2min" },
      { name: "Abdominais", sets: "3x20", rest: "45s" },
    ]},
    { day: "Sexta", focus: "Mobilidade + Força", exercises: [
      { name: "Yoga flow", sets: "1x20min", rest: "—" },
      { name: "Barra fixa negativa", sets: "3x5", rest: "90s" },
      { name: "Afundo caminhado", sets: "3x20m", rest: "60s" },
    ]},
    { day: "Sábado", focus: "Longa distância", exercises: [
      { name: "Corrida/caminhada longa", sets: "1x60-90min", rest: "—" },
    ]},
    { day: "Domingo", focus: "Descanso", exercises: [
      { name: "Recuperação ativa", sets: "—", rest: "—" },
    ]},
  ]
}

function generateDiet(profile: UserProfile): Meal[] {
  const weight = parseFloat(profile.weight) || 70
  const isFat = profile.goal === "emagrecer"
  const isHyper = profile.goal === "hipertrofia"
  const baseCalories = isHyper ? Math.round(weight * 35) : isFat ? Math.round(weight * 25) : Math.round(weight * 30)

  return [
    {
      name: "Café da manhã",
      calories: Math.round(baseCalories * 0.25),
      foods: isHyper
        ? ["3 ovos mexidos", "2 fatias pão integral", "1 banana", "200ml leite integral", "1 col. pasta de amendoim"]
        : isFat
        ? ["2 ovos cozidos", "1 fatia pão integral", "1 copo iogurte natural sem açúcar", "1 fruta pequena"]
        : ["2 ovos", "1 fatia pão integral", "1 fruta", "200ml leite desnatado"]
    },
    {
      name: "Lanche da manhã",
      calories: Math.round(baseCalories * 0.10),
      foods: isHyper
        ? ["1 banana", "30g whey protein", "1 punhado de castanhas"]
        : isFat
        ? ["1 maçã", "10 amêndoas"]
        : ["1 fruta", "1 punhado de castanhas"]
    },
    {
      name: "Almoço",
      calories: Math.round(baseCalories * 0.30),
      foods: isHyper
        ? ["200g frango grelhado", "150g arroz integral", "150g feijão", "Salada verde à vontade", "1 fio de azeite"]
        : isFat
        ? ["150g frango ou peixe grelhado", "80g arroz integral", "Salada com azeite e limão", "150g legumes no vapor"]
        : ["150g proteína magra", "100g arroz integral", "Salada à vontade", "Legumes variados"]
    },
    {
      name: "Lanche pré-treino",
      calories: Math.round(baseCalories * 0.15),
      foods: isHyper
        ? ["1 banana com mel", "30g whey", "1 torrada integral"]
        : isFat
        ? ["1 iogurte grego natural", "1 fruta pequena"]
        : ["1 fruta + proteína magra"]
    },
    {
      name: "Jantar",
      calories: Math.round(baseCalories * 0.20),
      foods: isHyper
        ? ["200g carne vermelha magra", "200g batata-doce", "Legumes refogados"]
        : isFat
        ? ["150g peixe ou frango", "Salada grande", "100g batata-doce"]
        : ["150g proteína", "Vegetais refogados", "80g batata-doce"]
    },
  ]
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FitForge() {
  const [screen, setScreen] = useState<Screen>("landing")
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<UserProfile>({ name: "", goal: "", level: "", weight: "", restrictions: "" })
  const [workout, setWorkout] = useState<WorkoutDay[]>([])
  const [diet, setDiet] = useState<Meal[]>([])
  const [generating, setGenerating] = useState(false)
  const [selectedDay, setSelectedDay] = useState(0)
  const [progressData, setProgressData] = useState<ProgressEntry[]>([
    { date: "01/04", weight: 78.5, note: "Início" },
    { date: "08/04", weight: 77.8, note: "Boa semana" },
    { date: "15/04", weight: 77.2, note: "Treinos em dia" },
    { date: "22/04", weight: 76.4, note: "Sentindo diferença!" },
  ])
  const [newWeight, setNewWeight] = useState("")
  const [newNote, setNewNote] = useState("")
  const [posts, setPosts] = useState<CommunityPost[]>([
    { id: 1, user: "Mariana S.", avatar: "MS", content: "Semana 3 concluída! -2kg e me sentindo muito melhor 💪", likes: 24, time: "2h", liked: false },
    { id: 2, user: "Carlos R.", avatar: "CR", content: "Dica: separar a marmita no domingo facilita muito a dieta durante a semana!", likes: 31, time: "5h", liked: false },
    { id: 3, user: "Ana L.", avatar: "AL", content: "Primeira semana de treino completa! Quem diria que ia conseguir 🔥", likes: 18, time: "8h", liked: false },
    { id: 4, user: "Pedro M.", avatar: "PM", content: "Bateu 3 meses de consistência. Isso é o que muda tudo. Não desistam!", likes: 57, time: "1d", liked: false },
  ])
  const [newPost, setNewPost] = useState("")

  const goals = [
    { id: "emagrecer", label: "Emagrecer", icon: "🔥", desc: "Queimar gordura e definir o corpo" },
    { id: "hipertrofia", label: "Hipertrofiar", icon: "💪", desc: "Ganhar massa muscular e força" },
    { id: "condicionamento", label: "Condicionamento", icon: "⚡", desc: "Melhorar resistência e energia" },
  ]
  const levels = [
    { id: "iniciante", label: "Iniciante", desc: "Menos de 6 meses de treino" },
    { id: "intermediario", label: "Intermediário", desc: "6 meses a 2 anos" },
    { id: "avancado", label: "Avançado", desc: "Mais de 2 anos" },
  ]

  async function handleGeneratePlan() {
    setGenerating(true)
    // Simula latência da API de IA (em produção: fetch('/api/generate-workout', { method: 'POST', body: JSON.stringify(profile) }))
    await new Promise(r => setTimeout(r, 2200))
    setWorkout(generateWorkout(profile))
    setDiet(generateDiet(profile))
    setGenerating(false)
    setScreen("dashboard")
  }

  function addProgress() {
    if (!newWeight) return
    const today = new Date()
    setProgressData(prev => [...prev, {
      date: `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}`,
      weight: parseFloat(newWeight),
      note: newNote,
    }])
    setNewWeight("")
    setNewNote("")
  }

  function toggleLike(id: number) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.liked ? p.likes-1 : p.likes+1, liked: !p.liked } : p))
  }

  function submitPost() {
    if (!newPost.trim()) return
    setPosts(prev => [{
      id: Date.now(), user: profile.name || "Você", avatar: (profile.name || "VO").slice(0,2).toUpperCase(),
      content: newPost, likes: 0, time: "agora", liked: false
    }, ...prev])
    setNewPost("")
  }

  const navItems: { id: Screen; icon: string; label: string }[] = [
    { id: "dashboard", icon: "⊡", label: "Início" },
    { id: "workout", icon: "🏋️", label: "Treino" },
    { id: "diet", icon: "🥗", label: "Dieta" },
    { id: "progress", icon: "📈", label: "Progresso" },
    { id: "community", icon: "👥", label: "Comunidade" },
  ]

  const goalLabel = goals.find(g => g.id === profile.goal)
  const totalCalories = diet.reduce((s, m) => s + m.calories, 0)
  const weightChange = progressData.length > 1 ? (progressData[progressData.length-1].weight - progressData[0].weight).toFixed(1) : "0"

  // ── Styles ──
  const s = {
    wrap: { minHeight: "100vh", background: "#0a0a0f", color: "#f0f0f0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflowX: "hidden" as const },
    // Landing
    landing: { minHeight: "100vh", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" as const, background: "linear-gradient(160deg, #0a0a0f 0%, #0f0a1e 50%, #0a0a0f 100%)" },
    landingTitle: { fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 1rem", background: "linear-gradient(135deg, #fff 0%, #a78bfa 60%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    landingSubtitle: { fontSize: "1.1rem", color: "#888", maxWidth: 480, lineHeight: 1.6, margin: "0 auto 2.5rem" },
    ctaBtn: { background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "#fff", border: "none", borderRadius: 14, padding: "1rem 2.5rem", fontSize: "1.05rem", fontWeight: 600, cursor: "pointer", letterSpacing: "-0.01em" },
    // Onboarding
    onboard: { minHeight: "100vh", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: "2rem", background: "#0a0a0f" },
    onboardCard: { width: "100%", maxWidth: 500, background: "#111118", borderRadius: 20, padding: "2rem", border: "1px solid #1e1e2e" },
    stepTitle: { fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem", color: "#fff" },
    stepSub: { fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem" },
    optionBtn: (active: boolean) => ({ background: active ? "#1e1030" : "#0f0f18", border: `1.5px solid ${active ? "#7c3aed" : "#1e1e2e"}`, borderRadius: 12, padding: "1rem 1.25rem", cursor: "pointer", textAlign: "left" as const, color: "#f0f0f0", width: "100%", marginBottom: 8, transition: "all 0.15s" }),
    input: { background: "#0f0f18", border: "1px solid #1e1e2e", borderRadius: 10, padding: "0.75rem 1rem", color: "#f0f0f0", fontSize: "1rem", width: "100%", outline: "none", boxSizing: "border-box" as const },
    nextBtn: { background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, padding: "0.8rem 2rem", fontSize: "1rem", fontWeight: 600, cursor: "pointer", width: "100%", marginTop: 16 },
    // App shell
    appShell: { display: "flex", flexDirection: "column" as const, minHeight: "100vh", background: "#0a0a0f" },
    nav: { position: "fixed" as const, bottom: 0, left: 0, right: 0, background: "#0f0f18", borderTop: "1px solid #1e1e2e", display: "flex", zIndex: 100 },
    navBtn: (active: boolean) => ({ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", padding: "0.6rem 0.25rem", border: "none", background: "transparent", cursor: "pointer", color: active ? "#7c3aed" : "#555", fontSize: "0.65rem", gap: 3, transition: "color 0.15s" }),
    content: { flex: 1, padding: "1.5rem 1rem 5.5rem", maxWidth: 680, margin: "0 auto", width: "100%" },
    card: { background: "#111118", borderRadius: 16, padding: "1.25rem", border: "1px solid #1e1e2e", marginBottom: 12 },
    sectionTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" },
    badge: { display: "inline-block", background: "#1e1030", color: "#a78bfa", borderRadius: 20, padding: "2px 10px", fontSize: "0.75rem", fontWeight: 500 },
    statRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 },
    stat: { background: "#0f0f18", borderRadius: 12, padding: "0.85rem", textAlign: "center" as const, border: "1px solid #1e1e2e" },
    statVal: { fontSize: "1.4rem", fontWeight: 700, color: "#a78bfa" },
    statLabel: { fontSize: "0.7rem", color: "#555", marginTop: 2 },
  }

  // ── SCREENS ──

  if (screen === "landing") return (
    <div style={s.wrap}>
      <div style={s.landing}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔥</div>
        <h1 style={s.landingTitle}>Seu treino e dieta<br />personalizados por IA</h1>
        <p style={s.landingSubtitle}>Planos criados para o seu corpo e objetivo, com acompanhamento de evolução e uma comunidade pra te manter motivado.</p>
        <button style={s.ctaBtn} onClick={() => setScreen("onboarding")}>Começar grátis →</button>
        <div style={{ display: "flex", gap: "2rem", marginTop: "3rem", color: "#444", fontSize: "0.85rem" }}>
          <span>✓ Treino semanal completo</span>
          <span>✓ Plano alimentar</span>
          <span>✓ Sem anúncios</span>
        </div>
      </div>
    </div>
  )

  if (screen === "onboarding") return (
    <div style={s.wrap}>
      <div style={s.onboard}>
        <div style={{ width: "100%", maxWidth: 500, marginBottom: "1rem" }}>
          <div style={{ height: 4, background: "#1e1e2e", borderRadius: 9 }}>
            <div style={{ height: 4, background: "#7c3aed", borderRadius: 9, width: `${((step+1)/5)*100}%`, transition: "width 0.3s" }} />
          </div>
          <p style={{ color: "#444", fontSize: "0.8rem", marginTop: 6 }}>Passo {step+1} de 5</p>
        </div>

        <div style={s.onboardCard}>
          {step === 0 && (<>
            <h2 style={s.stepTitle}>Como você se chama?</h2>
            <p style={s.stepSub}>Vamos personalizar sua experiência</p>
            <input style={s.input} placeholder="Seu nome" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} />
            <button style={{...s.nextBtn, opacity: profile.name ? 1 : 0.4}} onClick={() => profile.name && setStep(1)}>Continuar →</button>
          </>)}

          {step === 1 && (<>
            <h2 style={s.stepTitle}>Qual é seu objetivo?</h2>
            <p style={s.stepSub}>Isso define seu treino e dieta</p>
            {goals.map(g => (
              <button key={g.id} style={s.optionBtn(profile.goal === g.id)} onClick={() => setProfile(p => ({...p, goal: g.id as Goal}))}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "1.5rem" }}>{g.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{g.label}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666", marginTop: 2 }}>{g.desc}</div>
                  </div>
                </div>
              </button>
            ))}
            <button style={{...s.nextBtn, opacity: profile.goal ? 1 : 0.4}} onClick={() => profile.goal && setStep(2)}>Continuar →</button>
          </>)}

          {step === 2 && (<>
            <h2 style={s.stepTitle}>Qual é seu nível?</h2>
            <p style={s.stepSub}>Não tem resposta certa, seja honesto</p>
            {levels.map(l => (
              <button key={l.id} style={s.optionBtn(profile.level === l.id)} onClick={() => setProfile(p => ({...p, level: l.id as Level}))}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{l.label}</div>
                <div style={{ fontSize: "0.8rem", color: "#666", marginTop: 2 }}>{l.desc}</div>
              </button>
            ))}
            <button style={{...s.nextBtn, opacity: profile.level ? 1 : 0.4}} onClick={() => profile.level && setStep(3)}>Continuar →</button>
          </>)}

          {step === 3 && (<>
            <h2 style={s.stepTitle}>Qual é seu peso atual?</h2>
            <p style={s.stepSub}>Usamos para calcular suas calorias</p>
            <input style={s.input} type="number" placeholder="Ex: 75" value={profile.weight} onChange={e => setProfile(p => ({...p, weight: e.target.value}))} />
            <p style={{ color: "#444", fontSize: "0.8rem", marginTop: 6 }}>kg</p>
            <button style={{...s.nextBtn, opacity: profile.weight ? 1 : 0.4}} onClick={() => profile.weight && setStep(4)}>Continuar →</button>
          </>)}

          {step === 4 && (<>
            <h2 style={s.stepTitle}>Restrições ou lesões?</h2>
            <p style={s.stepSub}>Opcional — alergias, lesões, equipamento sem acesso</p>
            <textarea style={{...s.input, height: 90, resize: "none"}} placeholder="Ex: lesão no joelho, alergia a lactose, sem acesso a academia..." value={profile.restrictions} onChange={e => setProfile(p => ({...p, restrictions: e.target.value}))} />
            <button style={{...s.nextBtn, opacity: generating ? 0.7 : 1}} onClick={handleGeneratePlan} disabled={generating}>
              {generating ? "🤖 Gerando seu plano com IA..." : "✨ Criar meu plano →"}
            </button>
          </>)}
        </div>

        {step > 0 && <button onClick={() => setStep(s => s-1)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", marginTop: "1rem", fontSize: "0.9rem" }}>← Voltar</button>}
      </div>
    </div>
  )

  // App with nav
  return (
    <div style={s.wrap}>
      <div style={s.appShell}>
        <div style={s.content}>

          {/* DASHBOARD */}
          {screen === "dashboard" && (<>
            <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.25rem" }}>Olá, {profile.name} 👋</h1>
              <p style={{ color: "#555", fontSize: "0.9rem", margin: 0 }}>Semana 1 · {goalLabel?.icon} {goalLabel?.label}</p>
            </div>

            <div style={s.statRow}>
              <div style={s.stat}>
                <div style={s.statVal}>{weightChange}</div>
                <div style={s.statLabel}>kg variação</div>
              </div>
              <div style={s.stat}>
                <div style={s.statVal}>{totalCalories}</div>
                <div style={s.statLabel}>kcal/dia</div>
              </div>
              <div style={s.stat}>
                <div style={s.statVal}>5</div>
                <div style={s.statLabel}>treinos/sem</div>
              </div>
            </div>

            <div style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={s.sectionTitle}>Treino de hoje</span>
                <span style={s.badge}>{workout[new Date().getDay()]?.focus || workout[1]?.focus}</span>
              </div>
              {(workout[new Date().getDay()] || workout[1])?.exercises.slice(0,3).map((ex, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid #1e1e2e" : "none" }}>
                  <span style={{ fontSize: "0.9rem" }}>{ex.name}</span>
                  <span style={{ color: "#666", fontSize: "0.85rem" }}>{ex.sets}</span>
                </div>
              ))}
              <button onClick={() => setScreen("workout")} style={{ marginTop: 12, background: "#1e1030", color: "#a78bfa", border: "none", borderRadius: 8, padding: "0.6rem 1rem", cursor: "pointer", fontSize: "0.85rem", width: "100%", fontWeight: 500 }}>Ver treino completo →</button>
            </div>

            <div style={s.card}>
              <span style={s.sectionTitle}>Próxima refeição</span>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{diet[1]?.name} · {diet[1]?.calories} kcal</div>
                {diet[1]?.foods.slice(0,2).map((f,i) => <div key={i} style={{ fontSize: "0.85rem", color: "#666", marginBottom: 2 }}>• {f}</div>)}
              </div>
              <button onClick={() => setScreen("diet")} style={{ marginTop: 12, background: "#1e1030", color: "#a78bfa", border: "none", borderRadius: 8, padding: "0.6rem 1rem", cursor: "pointer", fontSize: "0.85rem", width: "100%", fontWeight: 500 }}>Ver plano alimentar →</button>
            </div>

            <div style={s.card}>
              <span style={s.sectionTitle}>Comunidade</span>
              <div style={{ marginTop: 8 }}>
                {posts.slice(0,2).map(p => (
                  <div key={p.id} style={{ padding: "8px 0", borderBottom: "1px solid #1e1e2e" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1e1030", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#a78bfa", fontWeight: 700 }}>{p.avatar}</div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{p.user}</span>
                      <span style={{ fontSize: "0.75rem", color: "#444" }}>{p.time}</span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#aaa", margin: 0 }}>{p.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </>)}

          {/* WORKOUT */}
          {screen === "workout" && (<>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}>🏋️ Seu treino semanal</h1>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: "1.25rem", paddingBottom: 4 }}>
              {workout.map((d, i) => (
                <button key={i} onClick={() => setSelectedDay(i)} style={{ flexShrink: 0, background: selectedDay === i ? "#7c3aed" : "#111118", color: selectedDay === i ? "#fff" : "#666", border: `1px solid ${selectedDay === i ? "#7c3aed" : "#1e1e2e"}`, borderRadius: 10, padding: "0.5rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: selectedDay === i ? 600 : 400 }}>
                  {d.day.slice(0,3)}
                </button>
              ))}
            </div>

            {workout[selectedDay] && (
              <div style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{workout[selectedDay].day}</div>
                    <span style={s.badge}>{workout[selectedDay].focus}</span>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "#555" }}>{workout[selectedDay].exercises.length} exercícios</span>
                </div>
                {workout[selectedDay].exercises.map((ex, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < workout[selectedDay].exercises.length-1 ? "1px solid #1e1e2e" : "none" }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>{ex.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "#555", marginTop: 2 }}>Descanso: {ex.rest}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#a78bfa", fontWeight: 600, fontSize: "0.95rem" }}>{ex.sets}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>)}

          {/* DIET */}
          {screen === "diet" && (<>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>🥗 Plano alimentar</h1>
            <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1.25rem" }}>Meta: {totalCalories} kcal/dia</p>
            {diet.map((meal, i) => (
              <div key={i} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>{meal.name}</span>
                  <span style={{ background: "#0f0f18", borderRadius: 8, padding: "3px 10px", fontSize: "0.8rem", color: "#a78bfa", fontWeight: 600 }}>{meal.calories} kcal</span>
                </div>
                {meal.foods.map((food, j) => (
                  <div key={j} style={{ fontSize: "0.875rem", color: "#888", padding: "4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#333" }}>•</span> {food}
                  </div>
                ))}
              </div>
            ))}
          </>)}

          {/* PROGRESS */}
          {screen === "progress" && (<>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.25rem" }}>📈 Evolução</h1>

            {/* Simple chart */}
            <div style={s.card}>
              <div style={s.sectionTitle}>Peso (kg)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, marginTop: 12 }}>
                {progressData.map((entry, i) => {
                  const max = Math.max(...progressData.map(e => e.weight))
                  const min = Math.min(...progressData.map(e => e.weight))
                  const range = max - min || 1
                  const pct = ((entry.weight - min) / range)
                  const height = 20 + pct * 70
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: "0.65rem", color: "#555" }}>{entry.weight}</div>
                      <div style={{ width: "100%", background: i === progressData.length-1 ? "#7c3aed" : "#1e1e2e", borderRadius: "4px 4px 0 0", height: height, transition: "height 0.3s" }} />
                      <div style={{ fontSize: "0.65rem", color: "#444" }}>{entry.date}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Registrar hoje</div>
              <input style={{...s.input, marginBottom: 8}} type="number" placeholder="Peso atual (kg)" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
              <input style={s.input} placeholder="Nota (opcional)" value={newNote} onChange={e => setNewNote(e.target.value)} />
              <button onClick={addProgress} style={{...s.nextBtn, marginTop: 12}}>Salvar registro</button>
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Histórico</div>
              {[...progressData].reverse().map((entry, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < progressData.length-1 ? "1px solid #1e1e2e" : "none" }}>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>{entry.date}</div>
                    {entry.note && <div style={{ fontSize: "0.8rem", color: "#555" }}>{entry.note}</div>}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#a78bfa" }}>{entry.weight} kg</div>
                </div>
              ))}
            </div>
          </>)}

          {/* COMMUNITY */}
          {screen === "community" && (<>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.25rem" }}>👥 Comunidade</h1>

            <div style={s.card}>
              <textarea
                style={{...s.input, height: 80, resize: "none"}}
                placeholder="Compartilhe seu progresso ou uma dica..."
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
              />
              <button onClick={submitPost} style={{...s.nextBtn, marginTop: 8}}>Publicar</button>
            </div>

            {posts.map(post => (
              <div key={post.id} style={s.card}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1e1030", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "#a78bfa", fontWeight: 700 }}>{post.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{post.user}</div>
                    <div style={{ fontSize: "0.75rem", color: "#444" }}>{post.time}</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.9rem", color: "#ccc", margin: "0 0 12px", lineHeight: 1.5 }}>{post.content}</p>
                <button onClick={() => toggleLike(post.id)} style={{ background: "none", border: "none", color: post.liked ? "#7c3aed" : "#444", cursor: "pointer", fontSize: "0.85rem", padding: 0, display: "flex", alignItems: "center", gap: 5 }}>
                  <span>{post.liked ? "💜" : "🤍"}</span> {post.likes}
                </button>
              </div>
            ))}
          </>)}
        </div>

        {/* Bottom nav */}
        <nav style={s.nav}>
          {navItems.map(item => (
            <button key={item.id} style={s.navBtn(screen === item.id)} onClick={() => setScreen(item.id)}>
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
