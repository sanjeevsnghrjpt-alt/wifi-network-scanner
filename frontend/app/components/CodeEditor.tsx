'use client'

import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-dark-secondary border-b border-dark-tertiary px-4 py-2">
        <h3 className="font-bold text-sm">Code Editor</h3>
      </div>
      <div className="flex-1 overflow-hidden editor-container">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => onChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            fontFamily: 'Monaco, monospace',
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  )
}
