import { NextRequest, NextResponse } from 'next/server'

// POST /api/generate-diet
export async function POST(req: NextRequest) {
  const { name, goal, level, weight, restrictions } = await req.json()

  const goalMap: Record<string, string> = {
    emagrecer: 'perda de gordura — déficit calórico moderado de 300-500kcal',
    hipertrofia: 'ganho de massa muscular — superávit calórico de 200-400kcal',
    condicionamento: 'manutenção e performance — calorias de manutenção',
  }

  const prompt = `
Você é um nutricionista esportivo expert brasileiro. Crie um plano alimentar diário personalizado.

Perfil:
- Nome: ${name}
- Objetivo nutricional: ${goalMap[goal] || goal}
- Nível de treino: ${level}
- Peso atual: ${weight}kg
- Restrições alimentares/alergias: ${restrictions || 'Nenhuma'}

Crie um plano com 5 refeições do dia adequado ao objetivo.
Use alimentos acessíveis e comuns no Brasil.

Responda APENAS com JSON válido, sem markdown, no seguinte formato:
{
  "totalCalories": 2200,
  "meals": [
    {
      "name": "Café da manhã",
      "calories": 400,
      "foods": ["2 ovos mexidos", "1 fatia pão integral", "1 banana"]
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
      max_tokens: 1500,
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
