# System Design Playground

Um simulador interativo de arquitetura de software (System Design) que não apenas permite desenhar diagramas de infraestrutura, mas também simula matematicamente limites teóricos de throughput (req/s), latência e gargalos em tempo real.

## 🚀 Principais Funcionalidades

- **Canvas Interativo (Drag & Drop):** Desenhe sua topologia arrastando componentes diretamente para a tela.
- **Motor de Simulação Matemático:** As linhas (arestas) calculam o tráfego em tempo real, ficando verdes, amarelas ou vermelhas (saturadas) dependendo do peso das requisições e da capacidade dos componentes downstream.
- **Catálogo Completo:**
  - `Client` (Geradores de carga)
  - `Load Balancer` (L4, L7, divisão exata de carga)
  - `Service` (APIs escaláveis em Go, NodeJS, Java)
  - `Worker` (Processamento de background, consome filas)
  - `Database` (PostgreSQL, MongoDB, etc., cálculo de shards/réplicas)
  - `Queue`, `Cache` e `Storage`.
- **Painel de Propriedades Dinâmico:** Ajuste o número de instâncias, engines, camadas de balanceamento e shards instantaneamente e veja a arquitetura reagir.
- **Exportação & Importação:** Exporte o estado da arquitetura como JSON ou baixe diretamente o diagrama como **C4 Model** pronto (Mermaid.js).
- **Cenários/Desafios:** Modos de jogo pré-construídos para testar conhecimentos de arquitetura ao vivo.

## 🛠️ Stack Tecnológico

- **Frontend Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand) (com middleware de persistência)
- **Engine do Canvas:** [React Flow (@xyflow/react)](https://reactflow.dev/)
- **Ícones:** [Lucide React](https://lucide.dev/)

---

## 💻 Como Iniciar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** instalado na sua máquina (versão 18+ recomendada).

### 2. Clonar o Repositório
```bash
git clone https://github.com/GuilhermeAltmann/system-design-playground.git
cd system-design-playground
```

### 3. Instalar as Dependências
Na raiz do projeto, instale os pacotes necessários:
```bash
npm install
```

### 4. Rodar o Servidor de Desenvolvimento
Inicie a aplicação utilizando o Vite:
```bash
npm run dev
```

O terminal exibirá a URL local (geralmente `http://localhost:5173`). Abra essa URL no seu navegador e comece a desenhar sua arquitetura!

---

## 📦 Como Construir para Produção

Se desejar compilar o código para produção, basta rodar:
```bash
npm run build
```
O build final será gerado na pasta `/dist`, pronto para ser hospedado em plataformas como Vercel, Netlify ou S3.
