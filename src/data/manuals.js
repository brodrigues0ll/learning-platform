export const categories = [
  // {
  //   id: 'programming',
  //   name: 'Programação',
  //   icon: '💻',
  //   description: 'Linguagens e frameworks de programação',
  // },
  // {
  //   id: 'databases',
  //   name: 'Banco de Dados',
  //   icon: '🗄️',
  //   description: 'SQL, NoSQL e gerenciamento de dados',
  // },
  // {
  //   id: 'devops',
  //   name: 'DevOps',
  //   icon: '⚙️',
  //   description: 'Deploy, CI/CD e infraestrutura',
  // },
  // {
  //   id: 'design',
  //   name: 'Design',
  //   icon: '🎨',
  //   description: 'UI/UX e design de interfaces',
  // },
  {
    id: "marketing",
    name: "Marketing",
    icon: "📊",
    description: "Marketing digital e estratégias",
  },
];

export const manuals = [
  // {
  //   id: "javascript-basics",
  //   title: "JavaScript Fundamentos",
  //   category: "programming",
  //   description:
  //     "Aprenda os conceitos básicos de JavaScript, desde variáveis até funções avançadas.",
  //   difficulty: "Iniciante",
  //   duration: "4 horas",
  //   topics: ["Variáveis", "Funções", "Arrays", "Objetos", "ES6+"],
  //   image: "📘",
  //   lastUpdated: "2026-02-01",
  // },
  // {
  //   id: "react-advanced",
  //   title: "React Avançado",
  //   category: "programming",
  //   description:
  //     "Domine hooks, context API, performance e padrões avançados do React.",
  //   difficulty: "Avançado",
  //   duration: "8 horas",
  //   topics: ["Hooks", "Context", "Performance", "Patterns", "Testing"],
  //   image: "⚛️",
  //   lastUpdated: "2026-01-28",
  // },
  // {
  //   id: "mongodb-guide",
  //   title: "MongoDB Completo",
  //   category: "databases",
  //   description:
  //     "Guia completo de MongoDB, desde básico até queries complexas e otimização.",
  //   difficulty: "Intermediário",
  //   duration: "6 horas",
  //   topics: ["CRUD", "Aggregation", "Indexes", "Schemas", "Mongoose"],
  //   image: "🍃",
  //   lastUpdated: "2026-02-03",
  // },
  // {
  //   id: "docker-kubernetes",
  //   title: "Docker & Kubernetes",
  //   category: "devops",
  //   description:
  //     "Containerização e orquestração de aplicações com Docker e Kubernetes.",
  //   difficulty: "Avançado",
  //   duration: "10 horas",
  //   topics: ["Containers", "Images", "Compose", "Pods", "Services"],
  //   image: "🐳",
  //   lastUpdated: "2026-01-25",
  // },
  // {
  //   id: "ui-ux-design",
  //   title: "UI/UX Design Principles",
  //   category: "design",
  //   description:
  //     "Princípios fundamentais de design de interfaces e experiência do usuário.",
  //   difficulty: "Iniciante",
  //   duration: "5 horas",
  //   topics: ["Typography", "Colors", "Layout", "Accessibility", "Prototyping"],
  //   image: "🎨",
  //   lastUpdated: "2026-01-30",
  // },
  // {
  //   id: "nextjs-fullstack",
  //   title: "Next.js Full-Stack",
  //   category: "programming",
  //   description:
  //     "Construa aplicações full-stack modernas com Next.js 14 e App Router.",
  //   difficulty: "Intermediário",
  //   duration: "9 horas",
  //   topics: [
  //     "App Router",
  //     "Server Components",
  //     "API Routes",
  //     "Authentication",
  //     "Deployment",
  //   ],
  //   image: "▲",
  //   lastUpdated: "2026-02-04",
  // },
  // {
  //   id: "sql-mastery",
  //   title: "SQL Mastery",
  //   category: "databases",
  //   description:
  //     "Domine SQL desde queries básicas até otimização e procedures complexas.",
  //   difficulty: "Intermediário",
  //   duration: "8 horas",
  //   topics: ["Queries", "Joins", "Subqueries", "Optimization", "Transactions"],
  //   image: "🗃️",
  //   lastUpdated: "2026-01-26",
  // },
  {
    id: "digital-marketing",
    title: "Marketing Digital",
    category: "marketing",
    description:
      "Estratégias de marketing digital, SEO, redes sociais e análise de dados.",
    difficulty: "Intermediário",
    duration: "7 horas",
    topics: ["SEO", "Social Media", "Analytics", "Content", "Conversion"],
    image: "📈",
    lastUpdated: "2026-02-02",
    hasDetails: true, // Indica que este manual tem conteúdo detalhado
  },
];

export function getManualsByCategory(categoryId) {
  return manuals.filter((manual) => manual.category === categoryId);
}

export function getManualById(id) {
  return manuals.find((manual) => manual.id === id);
}

export function getCategoryById(id) {
  return categories.find((category) => category.id === id);
}

// Função para carregar dados detalhados de um manual
export async function getManualDetails(manualId) {
  try {
    // Mapear IDs de manuais para seus arquivos de detalhes
    const detailsMap = {
      'digital-marketing': () => import('./manual-marketing').then(m => m.cronogramaData),
    };

    if (detailsMap[manualId]) {
      return await detailsMap[manualId]();
    }

    return null;
  } catch (error) {
    console.error('Erro ao carregar detalhes do manual:', error);
    return null;
  }
}
