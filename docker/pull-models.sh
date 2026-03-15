#!/bin/bash

echo "⏳ Pulling Ollama models (this may take a while on first run)..."

# Pull models
docker exec ollama ollama pull llama2 &
docker exec ollama ollama pull mistral &
docker exec ollama ollama pull codellama &

wait

echo "✅ All models have been pulled successfully!"
echo ""
echo "Models are now available at: http://localhost:11434"
echo ""
echo "Available local models:"
docker exec ollama ollama list
