@echo off
echo === Enviando prompt vía REST (curl) ===
curl http://localhost:11434/api/generate -H "Content-Type: application/json" -d "{\"model\": \"llama2\", \"prompt\": \"¿Qué es una arquitectura de software?\", \"stream\": false}"
pause
