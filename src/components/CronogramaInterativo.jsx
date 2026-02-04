"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { cronogramaData as defaultCronogramaData } from "@/data/database";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, RotateCcw } from "lucide-react";

const cores = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};

const coresBorder = {
  blue: "border-blue-500",
  green: "border-green-500",
  purple: "border-purple-500",
  pink: "border-pink-500",
  yellow: "border-yellow-500",
  red: "border-red-500",
};

const coresText = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  pink: "text-pink-600",
  yellow: "text-yellow-600",
  red: "text-red-600",
};

export default function CronogramaInterativo({ data, manualId = 'digital-marketing' }) {
  // Usar dados recebidos via props ou dados padrão
  const cronogramaData = data || defaultCronogramaData;
  const { data: session } = useSession();
  const [progresso, setProgresso] = useState({});
  const [faseAtiva, setFaseAtiva] = useState("fase-1");
  const [isLoading, setIsLoading] = useState(true);

  // Carregar progresso (do banco se autenticado, senão do localStorage)
  useEffect(() => {
    const loadProgress = async () => {
      if (session) {
        // Usuário autenticado: buscar do banco
        try {
          const res = await fetch(`/api/progress/${manualId}`);
          const data = await res.json();

          if (data && data.completedTopics) {
            // Converter array de índices para formato do componente
            const progressoObj = {};

            // Criar mapeamento de índice global para topicoId
            let globalIndex = 0;
            cronogramaData.fases.forEach(fase => {
              fase.topicos.forEach(topico => {
                if (data.completedTopics.includes(globalIndex)) {
                  progressoObj[topico.id] = true;
                }
                globalIndex++;
              });
            });

            setProgresso(progressoObj);
          }
        } catch (error) {
          console.error('Erro ao carregar progresso:', error);
        }
      } else {
        // Usuário não autenticado: buscar do localStorage
        const progressoSalvo = localStorage.getItem(`cronograma-progresso-${manualId}`);
        if (progressoSalvo) {
          setProgresso(JSON.parse(progressoSalvo));
        }
      }
      setIsLoading(false);
    };

    loadProgress();
  }, [session, manualId, cronogramaData]);

  // Salvar progresso (no banco se autenticado, senão no localStorage)
  useEffect(() => {
    if (isLoading) return; // Não salvar durante carregamento inicial

    const saveProgress = async () => {
      if (session) {
        // Usuário autenticado: salvar no banco
        try {
          // Converter formato do componente para array de índices
          const completedTopics = [];
          let globalIndex = 0;

          cronogramaData.fases.forEach(fase => {
            fase.topicos.forEach(topico => {
              if (progresso[topico.id]) {
                completedTopics.push(globalIndex);
              }
              globalIndex++;
            });
          });

          const progressPercent = calcularProgressoTotal();

          await fetch('/api/progress/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              manualId,
              progress: progressPercent,
              completedTopics,
            }),
          });
        } catch (error) {
          console.error('Erro ao salvar progresso:', error);
        }
      } else {
        // Usuário não autenticado: salvar no localStorage
        if (Object.keys(progresso).length > 0) {
          localStorage.setItem(`cronograma-progresso-${manualId}`, JSON.stringify(progresso));
        }
      }
    };

    saveProgress();
  }, [progresso, session, manualId, isLoading, cronogramaData]);

  const toggleTopico = (topicoId) => {
    setProgresso((prev) => ({
      ...prev,
      [topicoId]: !prev[topicoId],
    }));
  };

  const calcularProgressoFase = (fase) => {
    const total = fase.topicos.length;
    const concluidos = fase.topicos.filter((t) => progresso[t.id]).length;
    return total > 0 ? (concluidos / total) * 100 : 0;
  };

  const calcularProgressoTotal = () => {
    const totalTopicos = cronogramaData.fases.reduce(
      (acc, fase) => acc + fase.topicos.length,
      0,
    );
    const topicosConcluidos = Object.values(progresso).filter(
      (v) => v === true,
    ).length;
    return totalTopicos > 0 ? (topicosConcluidos / totalTopicos) * 100 : 0;
  };

  const resetarProgresso = async () => {
    if (
      confirm(
        "Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.",
      )
    ) {
      setProgresso({});

      if (session) {
        // Resetar no banco
        try {
          await fetch('/api/progress/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              manualId,
              progress: 0,
              completedTopics: [],
            }),
          });
        } catch (error) {
          console.error('Erro ao resetar progresso:', error);
        }
      } else {
        // Resetar no localStorage
        localStorage.removeItem(`cronograma-progresso-${manualId}`);
      }
    }
  };

  const progressoTotal = calcularProgressoTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {cronogramaData.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 mb-2">
            {cronogramaData.subtitle}
          </p>
          <p className="text-sm md:text-base text-gray-700 max-w-3xl mx-auto">
            {cronogramaData.description}
          </p>
        </div>

        {/* Progresso Total */}
        <Card className="mb-8 shadow-lg border-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Progresso Total</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={resetarProgresso}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Resetar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Seu progresso geral</span>
                <span className="font-semibold">
                  {progressoTotal.toFixed(0)}%
                </span>
              </div>
              <Progress value={progressoTotal} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Navegação de Fases */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {cronogramaData.fases.map((fase) => {
            const progressoFase = calcularProgressoFase(fase);
            const isAtiva = faseAtiva === fase.id;
            return (
              <Button
                key={fase.id}
                variant={isAtiva ? "default" : "outline"}
                onClick={() => setFaseAtiva(fase.id)}
                className="flex-shrink-0 gap-2"
              >
                <span>{fase.icon}</span>
                <span className="hidden md:inline">Fase {fase.numero}</span>
                {progressoFase === 100 && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Fases */}
        <div className="space-y-6">
          {cronogramaData.fases
            .filter((fase) => fase.id === faseAtiva)
            .map((fase) => {
              const progressoFase = calcularProgressoFase(fase);
              return (
                <Card
                  key={fase.id}
                  className={`shadow-xl border-l-4 ${coresBorder[fase.cor]}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{fase.icon}</span>
                      <div className="flex-1">
                        <CardTitle className="text-2xl md:text-3xl">
                          {fase.titulo}
                        </CardTitle>
                        {fase.subtitulo && (
                          <Badge variant="secondary" className="mt-1">
                            {fase.subtitulo}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Progresso da Fase {fase.numero}</span>
                        <span className="font-semibold">
                          {progressoFase.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={progressoFase}
                        className={`h-2 ${cores[fase.cor]}`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-3">
                      {fase.topicos.map((topico) => {
                        const isConcluido = progresso[topico.id];
                        return (
                          <AccordionItem
                            key={topico.id}
                            value={topico.id}
                            className="border rounded-lg bg-white"
                          >
                            <div className="flex items-center gap-3 px-4">
                              <Checkbox
                                checked={isConcluido}
                                onCheckedChange={() => toggleTopico(topico.id)}
                                className="shrink-0"
                              />
                              <AccordionTrigger className="hover:no-underline flex-1">
                                <div className="flex items-center gap-3 w-full">
                                  <span className="text-2xl shrink-0">
                                    {topico.icon}
                                  </span>
                                  <span
                                    className={`text-left font-semibold ${
                                      isConcluido
                                        ? "line-through text-gray-400"
                                        : ""
                                    }`}
                                  >
                                    {topico.titulo}
                                  </span>
                                </div>
                              </AccordionTrigger>
                            </div>
                            <AccordionContent className="pt-4 pb-4">
                              <div className="space-y-4 pl-12">
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-2">
                                    Conceito:
                                  </h4>
                                  <p className="text-gray-700">
                                    {topico.descricao}
                                  </p>
                                </div>

                                {topico.textoDetalhado && (
                                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-lg border-l-4 border-purple-500">
                                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                      <span>📖</span> Explicação Completa
                                    </h4>
                                    <div className="text-gray-700 space-y-3 leading-relaxed">
                                      {topico.textoDetalhado
                                        .split("\n\n")
                                        .map((paragrafo, index) => (
                                          <p
                                            key={index}
                                            className="text-justify"
                                          >
                                            {paragrafo}
                                          </p>
                                        ))}
                                    </div>
                                  </div>
                                )}

                                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                    <span>💡</span> Exemplo Prático
                                  </h4>
                                  <p className="text-blue-700">
                                    {topico.exemploPratico}
                                  </p>
                                </div>
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

        {/* Resumo Final */}
        <Card className="mt-8 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
              <span>🧠</span> RESUMO FINAL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {cronogramaData.resumo.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-base py-1 px-3 font-semibold bg-white text-gray-800"
                  >
                    {item}
                  </Badge>
                  {index < cronogramaData.resumo.length - 1 && (
                    <span className="text-gray-600">→</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
