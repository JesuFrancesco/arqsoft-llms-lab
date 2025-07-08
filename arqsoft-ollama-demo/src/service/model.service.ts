export const askOllamaModel = async (modelName: string, prompt: string) => {
  const response = await fetch(`http://localhost:11434/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      prompt: prompt,
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error fetching from Ollama API: ${response.statusText}`);
  }

  return response;
};
