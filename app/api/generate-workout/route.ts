import { NextRequest, NextResponse } from 'next/server'

// POST /api/generate-workout
// Recebe perfil do usuário, retorna plano de treino gerado por IA
export async function POST(req: NextRequest) {
  const { name, goal, level, weight, restrictions } = await req.json()

  const goalMap: Record<string, string> = {
    emagrecer: 'perda de gordura e definição muscular',
    hipertrofia: 'ganho de massa muscular e força',
    condicionamento: 'melhora de resistência cardiovascular e condicionamento físico geral',
  }

  const prompt = `
Você é um personal trainer expert brasileiro. Crie um plano de treino semanal personalizado.

Perfil do aluno:
- Nome: ${name}
- Objetivo: ${goalMap[goal] || goal}
- Nível: ${level}
- Peso: ${weight}kg
- Restrições/observações: ${restrictions || 'Nenhuma'}

Crie um plano de treino para 7 dias (Segunda a Domingo). 
Para cada dia, inclua: foco do treino, lista de exercícios com séries/repetições e tempo de descanso.
Domingo pode ser descanso ativo ou total.

Responda APENAS com JSON válido, sem markdown, no seguinte formato:
{
  "days": [
    {
      "day": "Segunda",
      "focus": "Nome do foco",
      "exercises": [
        { "name": "Nome do exercício", "sets": "4x12", "rest": "60s" }
      ]
    }
  ]
}
`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  const text = data.content?.[0]?.text || '{}'

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'Falha ao parsear resposta da IA' }, { status: 500 })
  }
}
