'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { manuals, categories } from '@/data/database';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import ManualCard from './ManualCard';

export default function ManualsDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userProgress, setUserProgress] = useState({});

  // Carregar progresso do usuário
  useEffect(() => {
    if (session) {
      // Usuário autenticado: buscar do banco de dados
      fetch('/api/progress/user')
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data === 'object') {
            setUserProgress(data);
          }
        })
        .catch((error) => console.error('Erro ao carregar progresso:', error));
    } else {
      // Usuário não autenticado: carregar do localStorage
      const saved = localStorage.getItem('manuals-progress');
      if (saved) {
        try {
          setUserProgress(JSON.parse(saved));
        } catch (error) {
          console.error('Erro ao parsear progresso do localStorage:', error);
        }
      }
    }
  }, [session]);

  // Filtrar manuais
  const filteredManuals = useMemo(() => {
    return manuals.filter((manual) => {
      const matchesCategory = selectedCategory === 'all' || manual.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manual.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manual.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleManualClick = (manualId) => {
    router.push(`/manuals/${manualId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Manuais de Estudo
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Explore {manuals.length} manuais em {categories.length} categorias diferentes
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        manuals={manuals}
      />

      {/* Manuals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredManuals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredManuals.map((manual) => (
              <ManualCard
                key={manual.id}
                manual={manual}
                userProgress={userProgress[manual.id]}
                onClick={() => handleManualClick(manual.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum manual encontrado</h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou a busca para encontrar o que procura.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
