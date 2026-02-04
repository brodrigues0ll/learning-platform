'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { getCategoryById } from '@/data/database';

export default function ManualCard({ manual, userProgress, onClick }) {
  const category = getCategoryById(manual.category);

  const difficultyConfig = {
    Iniciante: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
    Intermediário: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500' },
    Avançado: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' },
  };

  const categoryColors = {
    programming: 'border-blue-500',
    databases: 'border-green-500',
    devops: 'border-purple-500',
    design: 'border-pink-500',
    marketing: 'border-yellow-500',
  };

  const difficulty = difficultyConfig[manual.difficulty] || difficultyConfig.Iniciante;
  const borderColor = categoryColors[manual.category] || 'border-gray-500';

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-4 ${borderColor}`}
    >
      <CardHeader className="text-center pb-4">
        <div className="text-6xl mb-3">{manual.image}</div>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl text-gray-900 line-clamp-2">{manual.title}</h3>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="outline" className="text-xs">
              {category?.icon} {category?.name}
            </Badge>
            <Badge className={`${difficulty.bg} ${difficulty.text} border-0`}>{manual.difficulty}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-gray-600 line-clamp-2">{manual.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        <div className="flex items-center gap-4 w-full text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{manual.duration}</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {manual.topics.slice(0, 3).map((topic, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
            {manual.topics.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{manual.topics.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {userProgress && userProgress.progress > 0 && (
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progresso</span>
              <span>{Math.round(userProgress.progress)}%</span>
            </div>
            <Progress value={userProgress.progress} className="h-2" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
