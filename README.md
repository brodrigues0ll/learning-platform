# 📘 Cronograma Interativo - Marketing e Lançamento

Aplicação interativa para acompanhamento de estudos sobre tráfego orgânico e pago para lançamento de infoprodutos.

## 🚀 Como Usar

### Instalar Dependências

```bash
npm install
```

### Rodar em Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build para Produção

```bash
npm run build
npm start
```

## ✨ Funcionalidades

### 📊 Progresso Visual
- Acompanhe seu progresso total no topo da página
- Cada fase tem sua própria barra de progresso
- Indicadores visuais de conclusão por fase

### ✅ Sistema de Checkboxes
- Marque cada tópico como concluído ao estudá-lo
- O progresso é salvo automaticamente no navegador
- Visualização clara de itens pendentes vs concluídos

### 🎯 Navegação por Fases
- 6 fases organizadas do básico ao avançado:
  1. 🧠 Base do Negócio (Obrigatória)
  2. 📢 Tráfego Orgânico (Validação)
  3. 📩 Captura de Leads
  4. 💌 Relacionamento e Venda
  5. 💰 Tráfego Pago
  6. 🚀 Lançamento

### 📖 Conteúdo Expandível
- Cada tópico pode ser expandido para ver:
  - **Conceito**: Explicação detalhada
  - **Exemplo Prático**: Aplicação real do conceito

### 💾 Persistência Local
- Seu progresso é salvo automaticamente no navegador
- Botão para resetar o progresso quando necessário
- Funciona offline após o primeiro carregamento

### 🎨 Design Responsivo
- Otimizado para desktop, tablet e mobile
- Dark mode automático baseado nas preferências do sistema
- Interface moderna com gradientes e animações

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **Tailwind CSS 4** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

## 📱 Como Estudar

1. **Siga a Ordem**: As fases estão organizadas de forma progressiva
2. **Marque Concluídos**: Use os checkboxes para acompanhar seu progresso
3. **Leia os Exemplos**: Cada conceito tem um exemplo prático aplicado
4. **Revise Quando Necessário**: Os tópicos marcados ficam riscados mas podem ser revisados

## 🔄 Resetar Progresso

Clique no botão "Resetar" no card de Progresso Total para começar novamente.

## 📝 Estrutura do Projeto

```
src/
├── app/
│   ├── page.js              # Página principal
│   └── globals.css          # Estilos globais
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   └── CronogramaInterativo.jsx  # Componente principal
└── data/
    └── cronograma.js        # Dados do cronograma
```

## 🎓 Conteúdo Abordado

O cronograma cobre todo o caminho desde entender seu cliente ideal até executar um lançamento completo:

- Avatar e Jornada do Cliente
- Funil de Vendas
- Estratégias de Conteúdo Orgânico
- Captura e Nutrição de Leads
- Métricas de Tráfego Pago (CPC, CTR, CPM, CPA, ROAS)
- Processo de Lançamento

## 🤝 Contribuindo

Sinta-se livre para personalizar o cronograma editando o arquivo `src/data/cronograma.js`.

---

Desenvolvido com ❤️ usando Next.js e shadcn/ui
