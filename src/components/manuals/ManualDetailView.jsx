"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCategoryById } from "@/data/database";

export default function ManualDetailView({ manual, detailedContent }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = getCategoryById(manual.category);

  const difficultyConfig = {
    Iniciante: { bg: "bg-green-100", text: "text-green-700" },
    Intermediário: { bg: "bg-yellow-100", text: "text-yellow-700" },
    Avançado: { bg: "bg-red-100", text: "text-red-700" },
  };

  const difficulty =
    difficultyConfig[manual.difficulty] || difficultyConfig.Iniciante;

  // Configuração de cores para as fases
  const phaseColors = {
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    green: {
      border: "border-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    pink: {
      border: "border-pink-500",
      bg: "bg-pink-50",
      text: "text-pink-600",
    },
    yellow: {
      border: "border-yellow-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    red: { border: "border-red-500", bg: "bg-red-50", text: "text-red-600" },
  };

  // Calcular total de tópicos (contando todos os tópicos de todas as fases se houver detailedContent)
  const totalTopics = useMemo(() => {
    if (detailedContent?.fases) {
      return detailedContent.fases.reduce(
        (acc, fase) => acc + fase.topicos.length,
        0,
      );
    }
    return manual.topics.length;
  }, [detailedContent, manual.topics]);

  // Carregar progresso
  useEffect(() => {
    const loadProgress = async () => {
      if (session) {
        try {
          const res = await fetch(`/api/progress/${manual.id}`);
          const data = await res.json();
          if (data) {
            setProgress(data.progress || 0);
            setCompletedTopics(data.completedTopics || []);
          }
        } catch (error) {
          console.error("Erro ao carregar progresso:", error);
        }
      } else {
        const saved = localStorage.getItem("manuals-progress");
        if (saved) {
          try {
            const allProgress = JSON.parse(saved);
            const manualProgress = allProgress[manual.id];
            if (manualProgress) {
              setProgress(manualProgress.progress || 0);
              setCompletedTopics(manualProgress.completedTopics || []);
            }
          } catch (error) {
            console.error("Erro ao parsear progresso:", error);
          }
        }
      }
      setLoading(false);
    };

    loadProgress();
  }, [session, manual.id]);

  // Salvar progresso
  const saveProgress = async (newProgress, newCompletedTopics) => {
    if (session) {
      try {
        await fetch("/api/progress/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            manualId: manual.id,
            progress: newProgress,
            completedTopics: newCompletedTopics,
          }),
        });
      } catch (error) {
        console.error("Erro ao salvar progresso:", error);
      }
    } else {
      const saved = localStorage.getItem("manuals-progress");
      const allProgress = saved ? JSON.parse(saved) : {};
      allProgress[manual.id] = {
        progress: newProgress,
        completedTopics: newCompletedTopics,
        lastAccessed: new Date().toISOString(),
      };
      localStorage.setItem("manuals-progress", JSON.stringify(allProgress));
    }
  };

  // Toggle tópico
  const toggleTopic = (topicIndex) => {
    const newCompleted = completedTopics.includes(topicIndex)
      ? completedTopics.filter((i) => i !== topicIndex)
      : [...completedTopics, topicIndex];

    setCompletedTopics(newCompleted);

    const newProgress =
      totalTopics > 0 ? (newCompleted.length / totalTopics) * 100 : 0;
    setProgress(newProgress);

    saveProgress(newProgress, newCompleted);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="text-center">
            <div className="text-7xl mb-4">{manual.image}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {detailedContent?.title || manual.title}
              </span>
            </h1>
            {detailedContent?.subtitle && (
              <p className="text-lg text-gray-600 mb-4">
                {detailedContent.subtitle}
              </p>
            )}

            <div className="flex gap-2 justify-center flex-wrap">
              <Badge variant="outline" className="text-sm">
                {category?.icon} {category?.name}
              </Badge>
              <Badge className={`${difficulty.bg} ${difficulty.text} border-0`}>
                {manual.difficulty}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Clock className="h-3 w-3 mr-1" />
                {manual.duration}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Calendar className="h-3 w-3 mr-1" />
                Atualizado:{" "}
                {new Date(manual.lastUpdated).toLocaleDateString("pt-BR")}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Seu Progresso</span>
                <span className="font-semibold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-xs text-gray-500">
                {completedTopics.length} de {totalTopics} tópicos concluídos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Description Card */}
        {(detailedContent?.description || manual.description) && (
          <Card>
            <CardHeader>
              <CardTitle>Sobre este Manual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {detailedContent?.description || manual.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Detailed Content with Phases */}
        {detailedContent?.fases ? (
          <div className="space-y-6">
            {detailedContent.fases.map((fase, faseIdx) => {
              const colors = phaseColors[fase.cor] || phaseColors.blue;
              let topicIndexOffset = 0;

              // Calcular offset para índices globais
              for (let i = 0; i < faseIdx; i++) {
                topicIndexOffset += detailedContent.fases[i].topicos.length;
              }

              return (
                <Card key={fase.id} className={`border-l-4 ${colors.border}`}>
                  <CardHeader className={colors.bg}>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{fase.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Fase {fase.numero}</Badge>
                          {fase.subtitulo && (
                            <Badge
                              className={`${colors.bg} ${colors.text} border-0`}
                            >
                              {fase.subtitulo}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="mt-2">{fase.titulo}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Accordion type="multiple" className="w-full">
                      {fase.topicos.map((topico, topicoIdx) => {
                        const globalIndex = topicIndexOffset + topicoIdx;
                        const isCompleted =
                          completedTopics.includes(globalIndex);

                        return (
                          <AccordionItem key={topico.id} value={topico.id}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3 text-left">
                                <Checkbox
                                  checked={isCompleted}
                                  onCheckedChange={() =>
                                    toggleTopic(globalIndex)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="text-2xl">{topico.icon}</span>
                                <span
                                  className={
                                    isCompleted
                                      ? "line-through text-gray-500"
                                      : "font-medium"
                                  }
                                >
                                  {topico.titulo}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-14 pt-2 space-y-4">
                                {/* Descrição */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    Resumo
                                  </h4>
                                  <p className="text-gray-700 leading-relaxed">
                                    {topico.descricao}
                                  </p>
                                </div>

                                {/* Texto Detalhado */}
                                {topico.textoDetalhado && (
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                      Conteúdo Completo
                                    </h4>
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                      {topico.textoDetalhado}
                                    </div>
                                  </div>
                                )}

                                {/* Exemplo Prático */}
                                {topico.exemploPratico && (
                                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                    <h4 className="font-semibold text-blue-900 mb-2">
                                      💡 Exemplo Prático
                                    </h4>
                                    <p className="text-blue-800 leading-relaxed">
                                      {topico.exemploPratico}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Fallback: Simple Topics List */
          <Card>
            <CardHeader>
              <CardTitle>Tópicos do Manual</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {manual.topics.map((topic, idx) => {
                  const isCompleted = completedTopics.includes(idx);
                  return (
                    <AccordionItem key={idx} value={`topic-${idx}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => toggleTopic(idx)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span
                            className={
                              isCompleted ? "line-through text-gray-500" : ""
                            }
                          >
                            {topic}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-9 pt-2 text-gray-600">
                          <p>
                            Conteúdo detalhado sobre <strong>{topic}</strong>{" "}
                            será adicionado em breve.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Completion Message */}
        {progress === 100 && (
          <Card className="bg-linear-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Parabéns! Você completou este manual!
                </h3>
                <p className="text-green-700">
                  Continue aprendendo explorando outros manuais na plataforma.
                </p>
                <Button onClick={() => router.push("/")} className="mt-4">
                  Ver Todos os Manuais
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
