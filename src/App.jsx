import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [umlCode, setUmlCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setIsLoading(true);
    setUmlCode('');
    setCopied(false);

    try {
      const response = await axios.post('https://uml-chatbot-backend-1.onrender.com', {
        requisito: prompt,
      });
      setUmlCode(response.data.trim());
    } catch (error) {
      console.error("Error al generar el diagrama:", error);
      const errorMessage = `@startuml
' Error al conectar con la API.
' Asegúrate de que el backend está funcionando en https://uml-chatbot-backend-1.onrender.com
' Detalle: ${error.message}
@enduml`;
      setUmlCode(errorMessage);
    }

    setIsLoading(false);
  };

  const handleCopy = () => {
    if (umlCode) {
      navigator.clipboard.writeText(umlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="text-white min-h-screen flex flex-col items-center p-4 font-sans overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent scroll-smooth">
      <div className="w-full max-w-3xl space-y-8 mt-10 mb-10">
        {/* --- Header --- */}
        <header className="text-center sticky top-0 bg-gray-900/70 backdrop-blur-md p-2 rounded-lg z-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Generador PlantUML
          </h1>
          <p className="text-gray-400 mt-2">
            Describe una arquitectura de software y obtén su diagrama de despliegue al instante.
          </p>
        </header>

        {/* --- Main Content --- */}
        <main className="space-y-6">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center p-4 bg-black/20 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="ml-4 text-gray-300">Generando diagrama, un momento...</p>
            </div>
          )}

          {/* UML Display Area */}
          {umlCode && (
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg transition-all duration-500 ease-in-out max-h-[60vh] overflow-y-auto">
              <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-t-xl border-b border-white/10 sticky top-0 z-10">
                <h2 className="text-sm font-semibold text-gray-300">Código PlantUML</h2>
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors duration-300 flex items-center space-x-2"
                  title="Copiar código"
                >
                  {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
                  <span className="text-xs">{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-200 p-4 overflow-x-auto">
                <code>{umlCode}</code>
              </pre>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={handleGenerate}
            className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg p-2 flex items-center transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Un e-commerce con frontend en React, API en Node.js y base de datos en MongoDB..."
              className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 p-3"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/50 disabled:cursor-not-allowed text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              disabled={isLoading || !prompt}
            >
              Generar
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default App;
