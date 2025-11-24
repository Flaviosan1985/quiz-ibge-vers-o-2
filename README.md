# 📊 IBGE Master Quiz AI

Um quiz interativo e gamificado focado em temas do IBGE (Instituto Brasileiro de Geografia e Estatística), potencializado pela Inteligência Artificial do Google Gemini.

![IBGE Quiz Banner](https://via.placeholder.com/1200x400/0f172a/3b82f6?text=IBGE+Master+Quiz+AI)

## 🚀 Funcionalidades

- **Modo Clássico**: Perguntas desafiadoras baseadas em provas reais de concursos do IBGE.
- **Tutor IA**: Explicações detalhadas e personalizadas geradas pelo Gemini para cada questão respondida.
- **Gerador de Questões**: A IA cria novas rodadas de perguntas inéditas sob demanda.
- **Design Moderno**: Interface responsiva, animações suaves e tema escuro (Dark Mode).
- **Gamificação**: Sistema de pontuação, feedback visual e compartilhamento de resultados.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS.
- **Build Tool**: Vite.
- **AI**: Google Gemini API (`@google/genai` SDK).
- **Ícones**: Lucide React.
- **Efeitos**: Canvas Confetti.

## 📦 Como rodar localmente (VS Code)

Para rodar este projeto no VS Code, você precisa do [Node.js](https://nodejs.org/) instalado.

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/ibge-quiz.git
   cd ibge-quiz
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure a API Key**:
   - Crie um arquivo chamado `.env` na raiz do projeto (copie o exemplo abaixo).
   - Obtenha sua chave no [Google AI Studio](https://aistudio.google.com/).
   ```env
   VITE_API_KEY=sua_chave_do_google_aqui
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   - O terminal mostrará um link (geralmente `http://localhost:5173`). Clique nele para abrir o App.

## 📄 Licença

Este projeto é de código aberto e está sob a licença MIT.

---

Desenvolvido com 💙 e IA