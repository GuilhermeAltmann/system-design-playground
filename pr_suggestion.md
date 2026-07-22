## Descrição
Esta Pull Request adiciona opções avançadas de dimensionamento e configuração ao componente `Load Balancer`, permitindo aos arquitetos simular com mais fidelidade os gargalos de rede e *capacity planning* do mundo real.

## Tipo de mudança
- [x] 🆕 Nova funcionalidade (`feat`)

## O que foi feito
- Adicionadas as propriedades `provider`, `instances`, `sslTermination` e `wafEnabled` ao `LoadBalancerProps`.
- Atualizado o `PropertiesPanel` para renderizar seletores, entradas numéricas e checkboxes dinâmicos para booleanos.
- Atualizado o motor de cálculo (`calculator.ts`) aplicando penalidades de throughput e latência para SSL Termination (-30% req/s) e WAF (-60% req/s, +10ms latência), além de suporte à escala horizontal em modo `Self-Hosted`.

## Como testar
1. Abra a aplicação localmente (`npm run dev`).
2. Adicione um `Load Balancer` no canvas e conecte um Client a ele.
3. No painel de propriedades, selecione `Self-Hosted` e varie a quantidade de instâncias.
4. Marque `SSL Termination` e `WAF Enabled` e observe as mudanças de throughput e cor das conexões no canvas.

## Checklist
- [x] Código segue os padrões do projeto
- [x] Alterações integradas ao motor matemático de simulação
