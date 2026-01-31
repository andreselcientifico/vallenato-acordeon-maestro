import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check } from "lucide-react";
import { createQuiz, updateQuiz } from "@/api/quiz_admin";
import { getQuizByLesson, getQuizQuestions, QuizQuestion } from "@/api/quiz";

type OptionState = { id?: string; text: string; is_correct: boolean; order: number };
type QuestionState = { id?: string; question: string; description?: string; explanation?: string; order: number; options: OptionState[] };

export default function AdminQuizEditor({ lessonId, open, onClose }: { lessonId: string; open: boolean; onClose: () => void; }) {
  const [loading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passPercentage, setPassPercentage] = useState<number>(70);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lessonId]);

  async function loadQuiz() {
    setLoading(true);
    try {
      const quiz = await getQuizByLesson(lessonId);
      if (quiz && quiz.id) {
        setQuizId(quiz.id);
        setTitle(quiz.title || "");
        setDescription(quiz.description || "");
        setPassPercentage(quiz.pass_percentage || 70);
        const qs = await getQuizQuestions(quiz.id);
        setQuestions(qs.map(q => ({ id: q.id, question: q.question, description: q.description || undefined, explanation: q.explanation || undefined, order: q.order, options: q.options.map((o, idx) => ({ id: o.id, text: o.text, is_correct: o.id === q.correct_option_id, order: o.order })) })));
      } else {
        // Reset
        setQuizId(null);
        setTitle("");
        setDescription("");
        setPassPercentage(70);
        setQuestions([]);
      }
    } catch (error) {
      // If not found or error, reset to empty editor for this lesson
      console.error("Error loading quiz", error);
      setQuizId(null);
      setTitle("");
      setDescription("");
      setPassPercentage(70);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  function addQuestion() {
    setQuestions(prev => [...prev, { question: "", description: "", explanation: "", order: prev.length + 1, options: [{ text: "", is_correct: false, order: 1 }, { text: "", is_correct: false, order: 2 }] }]);
  }

  function removeQuestion(index: number) {
    setQuestions(prev => prev.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 })));
  }

  function updateQuestionField(index: number, field: keyof QuestionState, value: any) {
    const newQs = [...questions];
    // @ts-ignore
    newQs[index][field] = value;
    setQuestions(newQs);
  }

  function addOption(qIndex: number) {
    setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, options: [...q.options, { text: "", is_correct: false, order: q.options.length + 1 }] } : q));
  }

  function removeOption(qIndex: number, optIndex: number) {
    setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, options: q.options.filter((_, oi) => oi !== optIndex).map((o, i2) => ({ ...o, order: i2 + 1 })) } : q));
  }

  function updateOption(qIndex: number, optIndex: number, field: keyof OptionState, value: any) {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex) return q;
      const options = q.options.map((opt, oi) => oi === optIndex ? { ...opt, [field]: value } : { ...opt, is_correct: field === 'is_correct' && value ? false : opt.is_correct });
      // If we set is_correct true, ensure others are false (single-correct only)
      if (field === 'is_correct' && value) {
        return { ...q, options: options.map((o, idx) => idx === optIndex ? { ...o, is_correct: true } : { ...o, is_correct: false }) };
      }
      return { ...q, options };
    }));
  }

  async function handleSave() {
    // Basic validation
    if (!title.trim()) { alert('El título del quiz es requerido'); return; }
    if (questions.length === 0) { alert('Agrega al menos una pregunta'); return; }
    for (const q of questions) {
      if (q.options.length < 2) { alert('Cada pregunta necesita al menos 2 opciones'); return; }
      if (!q.options.some(o => o.is_correct)) { alert('Cada pregunta necesita una opción correcta'); return; }
    }

    const payload = {
      lesson_id: lessonId,
      title,
      description,
      pass_percentage: passPercentage,
      questions: questions.map(q => ({ question: q.question, description: q.description, explanation: q.explanation, order: q.order, options: q.options.map(o => ({ text: o.text, is_correct: o.is_correct, order: o.order })) }))
    };

    try {
      setSaving(true);
      if (quizId) {
        console.log(payload);
        await updateQuiz(quizId, payload);
        alert('Quiz actualizado');
      } else {
        console.log(payload);
        await createQuiz(payload);
        alert('Quiz creado');
      }
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error al guardar quiz');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-4xl overflow-auto max-h-[90vh]">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{quizId ? 'Editar Quiz' : 'Crear Quiz'}</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">{saving ? 'Guardando...' : 'Guardar'} <Check className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del quiz" />
            <Input type="number" value={passPercentage} onChange={(e) => setPassPercentage(Number(e.target.value))} placeholder="Porcentaje para pasar" />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción (opcional)" className="col-span-2" />
          </div>

          <div className="mt-6 space-y-4">
            {questions.map((q, qi) => (
              <Card key={qi} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Input value={q.question} onChange={(e) => updateQuestionField(qi, 'question', e.target.value)} placeholder={`Pregunta ${qi + 1}`} className="mb-2" />
                    <Textarea value={q.description || ''} onChange={(e) => updateQuestionField(qi, 'description', e.target.value)} placeholder="Descripción (opcional)" className="mb-2" />
                    <Textarea value={q.explanation || ''} onChange={(e) => updateQuestionField(qi, 'explanation', e.target.value)} placeholder="Explicación (opcional)" className="mb-2" />

                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex gap-2 items-center">
                          <input type="radio" checked={opt.is_correct} onChange={() => updateOption(qi, oi, 'is_correct', true)} className="mt-1" />
                          <Input value={opt.text} onChange={(e) => updateOption(qi, oi, 'text', e.target.value)} placeholder={`Opción ${oi + 1}`} />
                          <Button variant="ghost" onClick={() => removeOption(qi, oi)}><Trash2 /></Button>
                        </div>
                      ))}

                      <Button variant="outline" onClick={() => addOption(qi)} className="mt-2"><Plus className="w-4 h-4" /> Añadir opción</Button>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button variant="destructive" onClick={() => removeQuestion(qi)}><Trash2 /></Button>
                  </div>
                </div>
              </Card>
            ))}

            <Button onClick={addQuestion} variant="outline"><Plus /> Añadir pregunta</Button>
          </div>

        </Card>
      </div>
    </div>
  );
}