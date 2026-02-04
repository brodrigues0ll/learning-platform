# Arquitetura da Aplicação - MKT Learning

## Estrutura de Dados

### Database Central: `src/data/database.js`

O arquivo `database.js` é a fonte única de verdade (single source of truth) para todos os dados da aplicação.

#### Exportações Disponíveis:

```javascript
// 1. Conteúdo Detalhado dos Manuais
export const digitalMarketingCronograma = { ... }  // 750 linhas de conteúdo

// 2. Catálogo
export const categories = [ ... ]  // Lista de categorias
export const manuals = [ ... ]     // Lista de manuais

// 3. Mapeamento
export const manualsDetailsMap = {
  'digital-marketing': digitalMarketingCronograma
}

// 4. Alias (compatibilidade)
export const cronogramaData = digitalMarketingCronograma

// 5. Funções Helper
export function getManualsByCategory(categoryId)
export function getManualById(id)
export function getCategoryById(id)
export function getManualDetails(manualId)
```

## Consumo no Frontend

### 1. Homepage (`src/app/page.js`)
```javascript
// Renderiza o dashboard de manuais
import ManualsDashboard from "@/components/manuals/ManualsDashboard"
```

### 2. Dashboard de Manuais (`src/components/manuals/ManualsDashboard.jsx`)
```javascript
import { manuals, categories } from '@/data/database'

// Usa:
// - manuals: para exibir cards dos manuais
// - categories: para filtros de categoria
```

**Funcionalidades:**
- ✅ Lista todos os manuais
- ✅ Filtro por categoria
- ✅ Busca por título/descrição/tópicos
- ✅ Exibe cards clicáveis
- ✅ Mostra progresso (se autenticado)

### 3. Card de Manual (`src/components/manuals/ManualCard.jsx`)
```javascript
import { getCategoryById } from '@/data/database'

// Usa:
// - getCategoryById(): para pegar ícone e nome da categoria
```

**Funcionalidades:**
- ✅ Exibe informações do manual
- ✅ Mostra badges de categoria e dificuldade
- ✅ Exibe progresso (se houver)
- ✅ Redireciona para página detalhada ao clicar

### 4. Página Dinâmica de Manual (`src/app/manuals/[id]/page.js`)
```javascript
import { getManualById, getManualDetails } from '@/data/database'

// Fluxo:
const manual = getManualById(params.id)          // Pega dados básicos
const detailedContent = getManualDetails(params.id)  // Pega conteúdo detalhado

if (detailedContent) {
  return <CronogramaInterativo data={detailedContent} />  // Exibe cronograma
} else {
  return <ManualDetailView manual={manual} />  // Exibe view padrão
}
```

**Lógica:**
1. Se manual tem `hasDetails: true` → carrega conteúdo detalhado
2. Se encontrou conteúdo → renderiza `CronogramaInterativo`
3. Caso contrário → renderiza `ManualDetailView` (fallback)

### 5. Cronograma Interativo (`src/components/CronogramaInterativo.jsx`)
```javascript
import { cronogramaData as defaultCronogramaData } from "@/data/database"

export default function CronogramaInterativo({ data }) {
  const cronogramaData = data || defaultCronogramaData  // Props ou default
}
```

**Funcionalidades:**
- ✅ Exibe fases do cronograma
- ✅ Lista tópicos de cada fase
- ✅ Checkboxes para marcar conclusão
- ✅ Barra de progresso
- ✅ Salva progresso em localStorage
- ✅ Botão de reset

### 6. Visualização Detalhada (`src/components/manuals/ManualDetailView.jsx`)
```javascript
import { getCategoryById } from '@/data/database'

// Usa:
// - getCategoryById(): para exibir informações da categoria
```

**Funcionalidades:**
- ✅ Exibe informações do manual
- ✅ Lista tópicos simples
- ✅ Tracking de progresso
- ✅ Salva em localStorage ou DB

## Fluxo de Dados

```
database.js
    ↓
    ├─→ ManualsDashboard (lista manuais e categorias)
    │       ↓
    │   ManualCard (exibe cada manual)
    │       ↓
    │   /manuals/[id]
    │       ↓
    │   ┌─────────────────┐
    │   │ Tem detalhes?   │
    │   └─────────────────┘
    │       ↓           ↓
    │   [SIM]        [NÃO]
    │       ↓           ↓
    └→ CronogramaInterativo   ManualDetailView
       (cronograma completo)  (view simples)
```

## Estado e Persistência

### Não Autenticado
- **Storage**: localStorage
- **Key**: `"cronograma-progresso"`
- **Estrutura**: `{ [topicoId]: boolean }`

### Autenticado
- **Storage**: MongoDB via API
- **Model**: UserProgress
- **Campos**: userId, manualId, progress, completedTopics

## Adicionando Novos Manuais

### Passo 1: Criar o conteúdo detalhado (opcional)
```javascript
// Em database.js
export const programacaoCronograma = {
  title: "Manual de Programação",
  subtitle: "...",
  fases: [ ... ]
}
```

### Passo 2: Adicionar no catálogo
```javascript
manuals.push({
  id: "javascript-basics",
  title: "JavaScript Fundamentos",
  category: "programming",
  description: "...",
  difficulty: "Iniciante",
  duration: "4 horas",
  topics: ["Variáveis", "Funções", "Arrays"],
  image: "📘",
  lastUpdated: "2026-02-04",
  hasDetails: true,  // Se tem conteúdo detalhado
})
```

### Passo 3: Mapear conteúdo detalhado
```javascript
manualsDetailsMap['javascript-basics'] = programacaoCronograma
```

### Passo 4: Adicionar categoria (se nova)
```javascript
categories.push({
  id: "programming",
  name: "Programação",
  icon: "💻",
  description: "Linguagens e frameworks"
})
```

## Verificação de Funcionamento

### Checklist:
- ✅ Homepage (`/`) exibe dashboard
- ✅ Cards de manuais aparecem
- ✅ Filtros funcionam
- ✅ Busca funciona
- ✅ Click no card abre `/manuals/digital-marketing`
- ✅ Página do manual exibe `CronogramaInterativo`
- ✅ Checkboxes marcam tópicos
- ✅ Progresso é salvo
- ✅ Barra de progresso atualiza

## Comandos Úteis

```bash
# Limpar cache
rm -rf .next

# Reiniciar servidor
npm run dev

# Verificar imports
grep -r "from.*database" src --include="*.js" --include="*.jsx"

# Verificar exports
grep "^export" src/data/database.js
```

## Estrutura de Arquivos

```
src/
├── data/
│   └── database.js              ← ÚNICA FONTE DE DADOS
├── app/
│   ├── page.js                  → ManualsDashboard
│   └── manuals/
│       └── [id]/
│           └── page.js          → CronogramaInterativo ou ManualDetailView
├── components/
│   ├── CronogramaInterativo.jsx
│   └── manuals/
│       ├── ManualsDashboard.jsx
│       ├── ManualCard.jsx
│       ├── ManualDetailView.jsx
│       ├── SearchBar.jsx
│       └── CategoryFilter.jsx
└── models/
    ├── User.js
    └── UserProgress.js
```

## Status: ✅ FUNCIONANDO

Todos os componentes estão consumindo `database.js` corretamente!
