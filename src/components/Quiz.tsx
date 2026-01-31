import { useState, useEffect } from "react";
import {
  getQuizQuestions,
  submitQuiz,
  getQuizAttempts,
  getQuizAttemptDetails,
  QuizQuestion,
  QuizAnswer,
  QuizResultDto,
  Quiz,
  downloadCertificatePDF,
} from "@/api/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast, useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Award,
} from "lucide-react";

interface QuizProps {
  quiz: Quiz;
  onQuizComplete?: (result: QuizResultDto) => void;
}

export const Quizz: React.FC<QuizProps> = ({ quiz, onQuizComplete }) => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResultDto | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState<QuizResultDto[]>([]);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    loadQuizData();
  }, [quiz.id]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      const [questionsData, attemptsData] = await Promise.all([
        getQuizQuestions(quiz.id),
        getQuizAttempts(quiz.id),
      ]);

      setQuestions(questionsData.sort((a, b) => a.order - b.order));

      // Cargar detalles de intentos previos
      const attemptDetails = await Promise.all(
        attemptsData.map((attempt) =>
          getQuizAttemptDetails(attempt.id)
        )
      );
      setPreviousAttempts(attemptDetails);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar el quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionId: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, optionId);
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      // Validar que todas las preguntas fueron respondidas
      if (answers.size !== questions.length) {
        toast({
          title: "Incompleto",
          description: "Por favor responde todas las preguntas",
          variant: "destructive",
        });
        return;
      }

      setSubmitting(true);
      const quizAnswers: QuizAnswer[] = Array.from(answers.entries()).map(
        ([questionId, optionId]) => ({
          question_id: questionId,
          selected_option_id: optionId,
        })
      );

      const result = await submitQuiz(quiz.id, quizAnswers);
      setQuizResult(result);
      onQuizComplete?.(result);

      toast({
        title: result.passed ? "¡Quiz completado!" : "Quiz no aprobado",
        description: `Puntuación: ${result.percentage.toFixed(1)}%`,
        variant: result.passed ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al enviar el quiz",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin">
              <Clock className="w-8 h-8" />
            </div>
            <p>Cargando quiz...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Mostrar resultado
  if (quizResult) {
    return <QuizResult result={quizResult} onRetry={resetQuiz} />;
  }

  // Mostrar revisión
  if (showReview && previousAttempts.length > 0) {
    return (
      <QuizReview
        attempts={previousAttempts}
        onBack={() => setShowReview(false)}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.size;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
            {quiz.description && (
              <p className="text-gray-600 mt-2">{quiz.description}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Porcentaje para aprobar: <Badge>{quiz.pass_percentage}%</Badge>
            </p>
          </div>
          {previousAttempts.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowReview(true)}
              className="whitespace-nowrap"
            >
              Ver intentos anteriores
            </Button>
          )}
        </div>
      </Card>

      {/* Progress */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progreso</span>
            <span className="font-semibold">
              {answeredCount}/{questions.length} preguntas respondidas
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Question Card */}
      <Card className="p-8">
        <div className="space-y-6">
          {/* Question Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </h3>
            <Badge variant="outline">
              {currentQuestionIndex + 1}/{questions.length}
            </Badge>
          </div>

          {/* Question Text */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              {currentQuestion.question}
            </h4>
            {currentQuestion.description && (
              <p className="text-gray-600 text-sm">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options
              .sort((a, b) => a.order - b.order)
              .map((option) => {
                const isSelected = answers.get(currentQuestion.id) === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          isSelected
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-900">{option.text}</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="gap-2"
        >
          Anterior
        </Button>

        <div className="flex gap-4">
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={handleNextQuestion}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitQuiz}
              disabled={submitting || answers.size !== questions.length}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {submitting ? "Enviando..." : "Enviar Quiz"}
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  function resetQuiz() {
    setQuizResult(null);
    setCurrentQuestionIndex(0);
    setAnswers(new Map());
    loadQuizData();
  }
};

// ===== Quiz Result Component =====
interface QuizResultProps {
  result: QuizResultDto;
  onRetry: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ result, onRetry }) => {
  const passed = result.passed;
  const quizResult = result;

  return (
    <div className="space-y-6">
      {/* Result Summary */}
      <Card className={`p-8 border-2 ${
        passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
      }`}>
        <div className="flex items-center gap-6">
          {passed ? (
            <Award className="w-16 h-16 text-green-600" />
          ) : (
            <AlertCircle className="w-16 h-16 text-red-600" />
          )}
          <div>
            <h2 className={`text-3xl font-bold ${
              passed ? "text-green-900" : "text-red-900"
            }`}>
              {passed ? "¡Quiz Aprobado!" : "Quiz No Aprobado"}
            </h2>
            <p className={`text-lg ${
              passed ? "text-green-800" : "text-red-800"
            } mt-2`}>
              Puntuación: {result.percentage.toFixed(1)}% ({result.score}/{result.total_score})
            </p>
          </div>
        </div>
      </Card>

      {/* Results Details */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Detalles de tus respuestas:</h3>
        <div className="space-y-4">
          {result.results.map((questionResult, index) => (
            <div
              key={questionResult.question_id}
              className={`p-4 rounded-lg border-l-4 ${
                questionResult.is_correct
                  ? "bg-green-50 border-l-green-500"
                  : "bg-red-50 border-l-red-500"
              }`}
            >
              <div className="flex items-start gap-4">
                {questionResult.is_correct ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    Pregunta {index + 1}: {questionResult.question}
                  </p>
                  {!questionResult.is_correct && (
                    <p className="text-sm text-gray-600 mt-2">
                      Respuesta correcta: Opción correcta (ID: {questionResult.correct_option_id})
                    </p>
                  )}
                  {questionResult.explanation && (
                    <p className="text-sm text-gray-700 mt-2 bg-white p-3 rounded italic">
                      💡 {questionResult.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Certificado Info */}
      {passed && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8 text-blue-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">
                ¡Has desbloqueado tu certificado!
              </h3>
              <p className="text-sm text-blue-800">
                Puedes descargar tu certificado desde la sección de perfil
              </p>
            </div>
            {quizResult?.certificate && (
              <div className="flex-shrink-0">
                <Button onClick={async () => {
                  try {
                    const blob = await downloadCertificatePDF(quizResult.certificate!.id);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `certificate-${quizResult.certificate!.certificate_number}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error(err);
                    toast({ title: 'Error', description: 'No se pudo descargar el certificado', variant: 'destructive' });
                  }
                }} className="gap-2">Descargar certificado</Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={onRetry} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
};

// ===== Quiz Review Component =====
interface QuizReviewProps {
  attempts: QuizResultDto[];
  onBack: () => void;
}

const QuizReview: React.FC<QuizReviewProps> = ({ attempts, onBack }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Historial de intentos</h2>
          <Button variant="outline" onClick={onBack}>
            Volver
          </Button>
        </div>

        <div className="space-y-4">
          {attempts.map((attempt, index) => (
            <Card key={attempt.submission_id} className="p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {attempt.passed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <p className="font-semibold">
                      Intento {attempts.length - index}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(attempt.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {attempt.percentage.toFixed(1)}%
                  </p>
                  <Badge variant={attempt.passed ? "default" : "destructive"}>
                    {attempt.passed ? "Aprobado" : "Desaprobado"}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
