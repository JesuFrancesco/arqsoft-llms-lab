@echo off
setlocal
set PROMPT=Define el concepto de microservicios

echo === Comparando llama2 ===
curl -s http://localhost:11434/api/generate -H "Content-Type: application/json" -d "{\"model\": \"llama2\", \"prompt\": \"%PROMPT%\", \"stream\": false}" > llama2.txt

echo === Comparando mistral ===
curl -s http://localhost:11434/api/generate -H "Content-Type: application/json" -d "{\"model\": \"mistral\", \"prompt\": \"%PROMPT%\", \"stream\": false}" > mistral.txt

echo === Comparando gemma ===
curl -s http://localhost:11434/api/generate -H "Content-Type: application/json" -d "{\"model\": \"gemma:2b\", \"prompt\": \"%PROMPT%\", \"stream\": false}" > gemma.txt

echo Resultados guardados en llama2.txt, mistral.txt y gemma.txt
pause
