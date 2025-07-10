import { useState } from "react";
import "../App.css";
import { askOllamaModel } from "../service/model.service";
import { ChatResponseWidget } from "../widgets/ChatResponseWidget";
import { useNavigate } from "react-router-dom";

export default function TwoMistralComparison() {
  const navigator = useNavigate();
  const [mistralResponse, setMistralResponse] = useState("");
  const [mistral2Response, setMistral2Response] = useState("");

  const [prompt, setPrompt] = useState("");

  async function askModels() {
    if (!prompt) {
      return;
    }

    setPrompt("");
    setMistralResponse("...");
    setMistral2Response("...");

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
        askModel("mistral", setMistralResponse),
        askModel("mistral", setMistral2Response),
      ]);
    } catch (error) {
      console.error("ERROR PREGUNTANDO A MODELO:", error);
      setMistralResponse("❌ Error al procesar la solicitud.");
      setMistral2Response("❌ Error al procesar la solicitud.");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl">Probando LLMs en local</h1>

      <button onClick={() => navigator("/")} className="btn">
        Ir a comparación de tres modelos
      </button>

      <div className="flex flex-row gap-4 justify-around w-full h-[400px] grow m-4">
        <ChatResponseWidget
          title="Mistral A Response"
          response={mistralResponse}
        />
        <ChatResponseWidget
          title="Mistral B Response"
          response={mistral2Response}
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
