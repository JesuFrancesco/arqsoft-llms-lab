import { useState } from "react";
import "../App.css";
import { askOllamaModel } from "../service/model.service";
import { ChatResponseWidget } from "../widgets/ChatResponseWidget";
import { useNavigate } from "react-router-dom";

function App() {
  const [llamaResponse, setLlamaResponse] = useState("");
  const [gemmaResponse, setGemmaResponse] = useState("");
  const [mistralResponse, setMistralResponse] = useState("");

  const [prompt, setPrompt] = useState("");

  const navigator = useNavigate();

  async function askModels() {
    if (!prompt) {
      return;
    }

    setPrompt("");
    setLlamaResponse("...");
    setGemmaResponse("...");
    setMistralResponse("...");

    try {
      const askModel = async (
        model: string,
        setter: React.Dispatch<React.SetStateAction<string>>
      ) => {
        setter("");
        const response = await askOllamaModel(model, prompt);
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          chunk
            .trim()
            .split("\n")
            .forEach((line) => {
              if (!line) return;

              const json = JSON.parse(line);
              if (json.done) return;
              setter((prev) => prev + (json.response || ""));
            });
        }
      };

      await Promise.all([
        askModel("llama2", setLlamaResponse),
        askModel("gemma:2b", setGemmaResponse),
        askModel("mistral", setMistralResponse),
      ]);
    } catch (error) {
      console.error("ERROR PREGUNTANDO A MODELO:", error);
      setLlamaResponse("❌ Error al procesar la solicitud.");
      setGemmaResponse("❌ Error al procesar la solicitud.");
      setMistralResponse("❌ Error al procesar la solicitud.");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl">Probando LLMs en local</h1>

      <button onClick={() => navigator("/two")} className="btn">
        Ir a comparación de tres modelos
      </button>

      <div className="flex flex-row gap-4 justify-around w-full h-[400px] grow m-4">
        <ChatResponseWidget title="Llama 2 Response" response={llamaResponse} />
        <ChatResponseWidget
          title="Gemma:2b Response"
          response={gemmaResponse}
        />
        <ChatResponseWidget
          title="Mistral Response"
          response={mistralResponse}
        />
      </div>

      <form
        className="flex flex-row w-full gap-2 max-w-3xl"
        onSubmit={(e) => {
          e.preventDefault();
          askModels();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setPrompt(e.currentTarget.value)}
          value={prompt}
          className="grow"
          placeholder="Ingreso de consulta..."
        />
        <button type="submit">Enviar</button>
      </form>
    </main>
  );
}

export default App;
