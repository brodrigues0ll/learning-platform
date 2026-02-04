'use client';

import { Badge } from '@/components/ui/badge';

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  manuals,
}) {
  const getCount = (categoryId) => {
    if (categoryId === 'all') return manuals.length;
    return manuals.filter((m) => m.category === categoryId).length;
  };

  const categoryColors = {
    programming: 'border-blue-500 bg-blue-50 hover:bg-blue-100',
    databases: 'border-green-500 bg-green-50 hover:bg-green-100',
    devops: 'border-purple-500 bg-purple-50 hover:bg-purple-100',
    design: 'border-pink-500 bg-pink-50 hover:bg-pink-100',
    marketing: 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100',
  };

  const allCategories = [{ id: 'all', name: 'Todos', icon: '📚' }, ...categories];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const colorClass = categoryColors[category.id] || 'border-gray-300 bg-gray-50 hover:bg-gray-100';

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap
                ${
                  isSelected
                    ? `${colorClass} shadow-md scale-105`
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }
              `}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium text-sm">{category.name}</span>
              <Badge variant="secondary" className="ml-1">
                {getCount(category.id)}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
