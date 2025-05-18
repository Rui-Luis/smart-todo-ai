// app/api/analyze/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { description } = await req.json();

  const prompt = `
Given the following task's description:
"${description}"

Respond only with a JSON with this format (no explanations, no text before or after):
{
  "title": "Short title",
  "duration": "Estimated duration for the task. (examples: 30 minutes, 3 minutes, 1 hour)",
  "tags": ["tag1", "tag2", "tag3"]
}
Please respond only in English, without translating the input.
Please, do not use code blocks in the answer, only pure JSON. 
`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.3-8b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  console.log('Resposta completa da API:', data); // 👈 Isto vai mostrar TUDO o que a IA respondeu

  try {
    const content = data.choices?.[0]?.message?.content?.trim();
    console.log('Resposta da AI:', content); // 👈 IMPORTANTE para veres no terminal

    const json = JSON.parse(content || '{}');

    // Se algum campo estiver em falta, podes fazer fallback:
    return NextResponse.json({
      title: json.title || 'No title',
      duration: json.duration || 'No estimate',
      tags: json.tags || [],
    });
  } catch (err) {
    console.error('Erro ao fazer parse do JSON:', err);
    console.error('Resposta bruta:', data);
    return NextResponse.json(
      { error: 'Erro ao interpretar resposta da AI', raw: data },
      { status: 500 }
    );
  }
}
