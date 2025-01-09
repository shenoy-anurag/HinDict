#!/bin/sh
OUTPUT="$(ollama list)"
MODEL='llama3.2:3b'
if echo "$OUTPUT" | grep -q "$MODEL"; then
    echo "Model has already been downloaded and set up! Skipping to running the model..."
else
    echo "Pulling model ${MODEL}"
    ollama pull llama3.2:3b
fi
ollama run llama3.2:3b
