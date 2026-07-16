## Descrição

Esta Pull Request introduz o **System Design Playground** (Fase 1 completa). Ela implementa a fundação de um canvas infinito interativo onde os usuários podem arrastar, soltar e conectar componentes arquiteturais (APIs, Bancos de Dados, Filas, Load Balancers) para simular o comportamento de tráfego e identificar gargalos na arquitetura de sistemas.

O desenvolvimento desta ferramenta foi motivado pela necessidade de um simulador visual focado em engenharia de software (System Design) que não apenas sirva para desenhar, mas que possua um motor matemático embutido capaz de simular limites teóricos, saturação e throughput (req/s). 

## Tipo de mudança

- [x] 🆕 Nova funcionalidade (`feat`)
- [ ] 🐛 Correção de bug (`fix`)
- [ ] ♻️ Refatoração sem mudança de comportamento (`refactor`)

## O que foi feito

- Setup do ambiente com React 19, Vite e TypeScript.
- Implementação do Canvas infinito usando `@xyflow/react`.
- Criação de um motor de tráfego (`propagator.ts`) e cálculo de capacidade (`calculator.ts`).
- Adição do catálogo completo: Client, Load Balancer, Service, Worker, Queue, Cache, Database e Storage.
- Painel de propriedades dinâmico reativo.
- Sistema de Exportação e Importação de arquiteturas em JSON e exportação de C4 Model (Mermaid).
- Barra de Cenários/Desafios.
- Gerenciamento de estado e persistência no localStorage utilizando `Zustand`.

## Como testar

1. Rode a aplicação com `npm run dev`.
2. Acesse `http://localhost:5173`.
3. Arraste um componente da barra lateral, conecte os vértices e verifique as setas animadas.
4. Clique num nó e altere suas propriedades (ex: instâncias, engine) para ver as métricas atualizarem.
5. Pressione os botões de "Export" na barra superior para validar JSON e C4.

## Checklist

- [x] Código segue os padrões do projeto
- [x] Todos os testes e compilações passam localmente
- [x] PR não contém arquivos de debug ou console.log esquecidos
