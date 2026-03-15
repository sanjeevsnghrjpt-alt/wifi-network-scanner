'use client'

interface ModelSelectorProps {
  selected: string
  onChange: (model: string) => void
}

const AVAILABLE_MODELS = [
  { id: 'gpt-4-groq', name: 'LLaMA 3 (Groq)', category: 'Free API' },
  { id: 'mixtral-groq', name: 'Mixtral (Groq)', category: 'Free API' },
  { id: 'deepseek', name: 'DeepSeek Chat', category: 'Free API' },
  { id: 'codellama-ollama', name: 'CodeLLaMA (Ollama)', category: 'Self-Hosted' },
  { id: 'llama2-ollama', name: 'LLaMA 2 (Ollama)', category: 'Self-Hosted' },
  { id: 'mistral-ollama', name: 'Mistral (Ollama)', category: 'Self-Hosted' },
]

export function ModelSelector({ selected, onChange }: ModelSelectorProps) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-dark-tertiary border border-dark-tertiary rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue"
    >
      <optgroup label="Free APIs">
        {AVAILABLE_MODELS.filter((m) => m.category === 'Free API').map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </optgroup>
      <optgroup label="Self-Hosted (Ollama)">
        {AVAILABLE_MODELS.filter((m) => m.category === 'Self-Hosted').map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </optgroup>
    </select>
  )
}
