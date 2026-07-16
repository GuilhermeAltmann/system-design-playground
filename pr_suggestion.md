## Descrição
Esta Pull Request corrige um pequeno bug visual (UI/UX) no componente `BaseNode`. O `Client` atua exclusivamente como um gerador inicial de tráfego, mas estava sendo renderizado com um ponto de conexão de entrada no topo.

## Tipo de mudança
- [x] 🐛 Correção de bug (`fix`)

## O que foi feito
- Inclusão de um render condicional (`type !== 'client'`) no `BaseNode.tsx` para ocultar o `<Handle type="target" />`.

## Como testar
1. Acesse `http://localhost:5173`.
2. Arraste o `Client` para a tela e veja que ele não possui a bolinha de entrada superior, apenas a de saída na base.

## Checklist
- [x] Código segue os padrões do projeto
- [x] Interface limpa de erros e logs
