import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, ArrowLeft, Save, Eye, GripVertical, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveCourseAPI, fetchCoursesAPI, deleteCourseAPI } from "@/api/admin";
import CoursesPage from "./CoursesPage";
import { normalize } from "path";
import * as yup from 'yup';
import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  SubscriptionPlan,
  Achievement
} from "@/api/subscriptions";

// ----------------------------------------------------------------------
// INTERFACES (Adaptadas al Backend Rust)
// ----------------------------------------------------------------------

interface Lesson {
  id: string | null; // UUID o null si es nuevo
  title: string;
  duration: string;
  completed?: boolean;
  type: "video" | "exercise" | "quiz"; // Según CreateLessonDTO
  content_url: string;
  description: string;
  order: number;
}

interface Module {
  id: string | null; // UUID o null si es nuevo
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  level: "básico" | "intermedio" | "avanzado";
  price: number;
  duration: string;
  students: number;
  rating: number;
  image: string;
  category: "premium" | "básico";
  modules: Module[];
  features: string[];
  created_at: string;
}

// Esquema de validación con Yup
const courseValidationSchema = yup.object().shape({
  title: yup.string().required('El título del curso es requerido'),
  description: yup.string().required('La descripción corta es requerida'),
  longDescription: yup.string(),
  level: yup.string().required('El nivel es requerido').oneOf(['básico', 'intermedio', 'avanzado'], 'Nivel inválido'),
  price: yup.number().min(0, 'El precio debe ser mayor a 0').required('El precio es requerido'),
  duration: yup.string(),
  students: yup.number(),
  rating: yup.number(),
  image: yup.string().url('La URL de la imagen no es válida'),
  category: yup.string().required('La categoría es requerida').oneOf(['básico', 'premium'], 'Categoría inválida'),
  features: yup.array().of(yup.string()),
  modules: yup.array().of(
    yup.object().shape({
      title: yup.string().required('El título del módulo es requerido'),
      order: yup.number().min(1, 'El orden debe ser al menos 1'),
      lessons: yup.array().of(
        yup.object().shape({
          title: yup.string().required('El título de la lección es requerido'),
          duration: yup.string(),
          type: yup.string().oneOf(['video', 'exercise', 'quiz'], 'Tipo de lección inválido'),
          content_url: yup.string().url('La URL del contenido no es válida'),
          description: yup.string(),
          order: yup.number().min(1, 'El orden debe ser al menos 1'),
        })
      ),
    })
  ),
});

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState("manage");
  const [search, setSearch] = useState("");
  const isValidUrl = (url) =>
  /^https?:\/\/.+/i.test(url);

  // Filtros
  const [filterCategory, setFilterCategory] = useState<"all" | "básico" | "premium">("all");
  const [filterLevel, setFilterLevel] = useState<"all" | "básico" | "intermedio" | "avanzado">("all");
  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);

  // Estado del curso actual (Edición/Creación)
  const [currentCourse, setCurrentCourse] = useState<Course>({
    id: "",
    title: "",
    description: "",
    longDescription: "",
    level: "básico",
    price: 0,
    duration: "",
    students: 0,
    rating: 5,
    image: "",
    category: "básico",
    modules: [],
    features: [],
    created_at: "",
  });

  const [newFeature, setNewFeature] = useState("");
  const [editingCourse, setEditingCourse] = useState<string | null>(null);

  // Control de acordeón visual para módulos
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));

  // Estado para suscripciones
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState<Partial<SubscriptionPlan>>({
    name: "",
    description: "",
    price: 0,
    duration_months: 1,
    features: [],
    paypal_plan_id: "",
    active: true,
  });
  const [editingSubscriptionPlan, setEditingSubscriptionPlan] = useState<string | null>(null);

  // Estado para logros
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Partial<Achievement>>({
    name: "",
    description: "",
    icon: "",
    trigger_type: "course_completed",
    trigger_value: 1,
    active: true,
  });
  const [editingAchievement, setEditingAchievement] = useState<string | null>(null);

  const toggleModule = (index: number) => {
    const newSet = new Set(expandedModules);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setExpandedModules(newSet);
  };

  // ----------------------------------------------------------------------
  // LOAD COURSES FROM API
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (search === "") {
      loadCoursesFromDB();
    }
  }, [search]);

  // ----------------------------------------------------------------------
  // LOAD SUBSCRIPTION PLANS AND ACHIEVEMENTS
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (activeTab === "subscriptions") {
      loadSubscriptionPlans();
    } else if (activeTab === "achievements") {
      loadAchievements();
    }
  }, [activeTab]);

  // ----------------------------------------------------------------------
  // FILTER COURSES
  // ----------------------------------------------------------------------
  const filteredCourses = courses
    .filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => filterCategory === "all" || c.category === filterCategory)
    .filter((c) => filterLevel === "all" || c.level === filterLevel)
    .filter((c) => {
      if (!filterDateFrom && !filterDateTo) return true;
      const courseDate = new Date(c.created_at).getTime();
      const from = filterDateFrom ? filterDateFrom.getTime() : -Infinity;
      const to = filterDateTo ? filterDateTo.getTime() : Infinity;
      return courseDate >= from && courseDate <= to;
    });

  const Normalized = async (data) => {
    const normalized: Course[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        // Backend usa snake_case (long_description), mapeamos a camelCase
        longDescription: item.long_description || item.longDescription || "",
        level: item.level,
        price: item.price,
        duration: item.duration || "",
        students: item.students || 0,
        rating: item.rating || 5,
        image: item.image || "",
        category: item.category,
        features: Array.isArray(item.features) ? item.features : [],
        created_at: item.created_at,

        // Mapeo profundo de Módulos y Lecciones
        modules: (item.modules || []).map((m: any) => ({
          id: m.id,
          title: m.title,
          order: m.order,
          lessons: (m.lessons || []).map((l: any) => ({
            id: l.id,
            title: l.title,
            duration: l.duration || "",
            type: l.type || l.r_type || "video", // Rust 'type' field handling
            content_url: l.content_url || "",
            description: l.description || "",
            order: l.order
          }))
        }))
      })).sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      return normalized;
  }

  const Payload = async (data) => {
    return {
        //id: currentCourse.id || undefined, // undefined para creación
        title: data.title,
        description: data.description,
        long_description: data.longDescription, // snake_case OK
        level: data.level,
        price: data.price,
        duration: data.duration,
        students: data.students|| undefined,
        rating: data.rating|| undefined,
        image: data.image,
        category: data.category,
        features: data.features,

        // Mapeo de Módulos -> UpdateModuleDTO / CreateModuleDTO
        modules: data.modules.map(m => ({
          id: m.id ? m.id : undefined, // undefined si es nuevo
          title: m.title,
          order: m.order,
          lessons: m.lessons.map(l => ({
            id: l.id ? l.id : undefined, // undefined si es nueva
            title: l.title,
            duration: l.duration,
            completed: l.completed ?? false,
            type: l.type,        // video | exercise | quiz
            content_url: l.content_url,
            description: l.description,
            order: l.order
          }))
        }))
      };
  }

  // ----------------------------------------------------------------------
  // LOAD COURSES FROM DB FUNCTION
  // ----------------------------------------------------------------------
  const loadCoursesFromDB = async () => {
    try {
      // Se asume que fetchCoursesAPI llama a /api/courses/with-videos (get_courses_with_videos)
      // y devuelve Vec<CourseWithModulesDto>
      setCourses(await Normalized(await fetchCoursesAPI()));
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los cursos",
        variant: "destructive",
      });
    }
  };

  // ----------------------------------------------------------------------
  // SUBSCRIPTION MANAGEMENT
  // ----------------------------------------------------------------------
  const loadSubscriptionPlans = async () => {
    try {
      const plans = await getSubscriptionPlans();
      setSubscriptionPlans(plans);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los planes de suscripción",
        variant: "destructive",
      });
    }
  };

  const saveSubscriptionPlan = async () => {
    try {
      if (!currentSubscriptionPlan.name || !currentSubscriptionPlan.paypal_plan_id) {
        toast({
          title: "Error",
          description: "Por favor completa los campos obligatorios",
          variant: "destructive",
        });
        return;
      }

      if (editingSubscriptionPlan) {
        await updateSubscriptionPlan(editingSubscriptionPlan, currentSubscriptionPlan as SubscriptionPlan);
        toast({ title: "Éxito", description: "Plan de suscripción actualizado correctamente" });
      } else {
        await createSubscriptionPlan(currentSubscriptionPlan as Omit<SubscriptionPlan, 'id' | 'created_at'>);
        toast({ title: "Éxito", description: "Plan de suscripción creado correctamente" });
      }

      await loadSubscriptionPlans();
      resetSubscriptionForm();
      setActiveTab("subscriptions");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el plan de suscripción",
        variant: "destructive",
      });
    }
  };

  const deleteSubscriptionPlan = async (planId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este plan de suscripción?")) return;

    try {
      await deleteSubscriptionPlan(planId);
      await loadSubscriptionPlans();
      toast({ title: "Éxito", description: "Plan de suscripción eliminado correctamente" });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el plan de suscripción",
        variant: "destructive",
      });
    }
  };

  const resetSubscriptionForm = () => {
    setCurrentSubscriptionPlan({
      name: "",
      description: "",
      price: 0,
      duration_months: 1,
      features: [],
      paypal_plan_id: "",
      active: true,
    });
    setEditingSubscriptionPlan(null);
  };

  // ----------------------------------------------------------------------
  // ACHIEVEMENT MANAGEMENT
  // ----------------------------------------------------------------------
  const loadAchievements = async () => {
    try {
      const achievementsData = await getAchievements();
      setAchievements(achievementsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los logros",
        variant: "destructive",
      });
    }
  };

  const saveAchievement = async () => {
    try {
      if (!currentAchievement.name || !currentAchievement.trigger_type) {
        toast({
          title: "Error",
          description: "Por favor completa los campos obligatorios",
          variant: "destructive",
        });
        return;
      }

      if (editingAchievement) {
        await updateAchievement(editingAchievement, currentAchievement as Achievement);
        toast({ title: "Éxito", description: "Logro actualizado correctamente" });
      } else {
        await createAchievement(currentAchievement as Omit<Achievement, 'id' | 'created_at'>);
        toast({ title: "Éxito", description: "Logro creado correctamente" });
      }

      await loadAchievements();
      resetAchievementForm();
      setActiveTab("achievements");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el logro",
        variant: "destructive",
      });
    }
  };

  const deleteAchievement = async (achievementId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este logro?")) return;

    try {
      await deleteAchievement(achievementId);
      await loadAchievements();
      toast({ title: "Éxito", description: "Logro eliminado correctamente" });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el logro",
        variant: "destructive",
      });
    }
  };

  const resetAchievementForm = () => {
    setCurrentAchievement({
      name: "",
      description: "",
      icon: "",
      trigger_type: "course_completed",
      trigger_value: 1,
      active: true,
    });
    setEditingAchievement(null);
  };

  // ----------------------------------------------------------------------
  // MODULE MANAGEMENT
  // ----------------------------------------------------------------------
  const addModule = () => {
    const newModule: Module = {
      id: null,
      title: "Nuevo Módulo",
      order: currentCourse.modules.length + 1,
      lessons: []
    };

    setCurrentCourse({
      ...currentCourse,
      modules: [...currentCourse.modules, newModule]
    });

    // Expandir automáticamente el nuevo módulo
    const newIndex = currentCourse.modules.length;
    setExpandedModules(new Set(expandedModules).add(newIndex));
  };

  const updateModule = (index: number, field: keyof Module, value: any) => {
    const updatedModules = [...currentCourse.modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setCurrentCourse({ ...currentCourse, modules: updatedModules });
  };

  const removeModule = (index: number) => {
    const updatedModules = currentCourse.modules.filter((_, i) => i !== index);
    // Reordenar
    updatedModules.forEach((m, i) => { m.order = i + 1; });
    setCurrentCourse({ ...currentCourse, modules: updatedModules });
  };

  // ----------------------------------------------------------------------
  // LESSON MANAGEMENT
  // ----------------------------------------------------------------------
  const addLesson = (moduleIndex: number) => {
    const module = currentCourse.modules[moduleIndex];
    const newLesson: Lesson = {
      id: null,
      title: "",
      duration: "",
      type: "video",
      content_url: "",
      description: "",
      order: module.lessons.length + 1
    };

    const updatedModules = [...currentCourse.modules];
    updatedModules[moduleIndex] = {
      ...module,
      lessons: [...module.lessons, newLesson]
    };

    setCurrentCourse({ ...currentCourse, modules: updatedModules });
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, value: any) => {
    const updatedModules = [...currentCourse.modules];
    const updatedLessons = [...updatedModules[moduleIndex].lessons];
    updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], [field]: value };
    updatedModules[moduleIndex].lessons = updatedLessons;

    setCurrentCourse({ ...currentCourse, modules: updatedModules });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...currentCourse.modules];
    const filteredLessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
    // Reordenar
    filteredLessons.forEach((l, i) => { l.order = i + 1; });
    updatedModules[moduleIndex].lessons = filteredLessons;

    setCurrentCourse({ ...currentCourse, modules: updatedModules });
  };

  // ----------------------------------------------------------------------
  // FEATURES MANAGEMENT
  // ----------------------------------------------------------------------
  const addFeature = () => {
    if (newFeature.trim() !== "") {
      setCurrentCourse({
        ...currentCourse,
        features: [...currentCourse.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = currentCourse.features.filter((_, i) => i !== index);
    setCurrentCourse({ ...currentCourse, features: newFeatures });
  };

  // ----------------------------------------------------------------------
  // SAVE COURSE (CREATE / UPDATE)
  // ----------------------------------------------------------------------
  const saveCourse = async () => {
    try {
      await courseValidationSchema.validate(currentCourse, { abortEarly: false });

      if (!currentCourse.title || !currentCourse.description) {
        toast({
          title: "Error",
          description: "Por favor completa los campos obligatorios",
          variant: "destructive",
        });
        return;
      }

      const isUpdating = !!currentCourse.id; // Verifica si tiene un ID
      const endpointId = currentCourse.id || undefined; // Usa el ID para la URL si existe
      try {
        // Construir Payload compatible con Rust DTOs
        const payload = await Payload(currentCourse)

        await saveCourseAPI(payload, endpointId);

        await loadCoursesFromDB();
        resetForm();
        toast({ title: "Éxito", description: "Curso guardado correctamente" });
        setActiveTab("manage");
      } catch (error: any) {
        // Manejo específico si es un 500/404 que indica que el curso ya no existe.
        // Si recibes un 500 o 404 y estabas actualizando, resetear el ID es clave.
        if (isUpdating) {
            // Si el servidor falla al actualizar un curso existente,
            // el curso podría haberse borrado. Desvinculamos el ID.
            setEditingCourse(null);
            setCurrentCourse(prev => ({ ...prev, id: "" }));
            toast({
                title: "Error de Sincronización",
                description: `El curso con Title ${currentCourse.title} no se pudo actualizar. Se ha limpiado el formulario. Por favor, crea uno nuevo o recarga la lista.`,
                variant: "destructive",
            });
        } else {
          toast({
            title: "Error",
            description: error.message ?? "Error al guardar el curso",
            variant: "destructive",
          });
        }
      }
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const errorMessage = validationError.errors.join(', ');
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  // ----------------------------------------------------------------------
  // EDIT & DELETE
  // ----------------------------------------------------------------------
  const editCourse = (course: Course) => {
    setCurrentCourse({ ...course });
    setEditingCourse(course.id);
    setActiveTab("create");
    // Expandir el primer módulo por defecto
    if(course.modules.length > 0) setExpandedModules(new Set([0]));
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return;
    try {
      await deleteCourseAPI(courseId);
      setCourses(courses.filter((course) => course.id !== courseId));
      toast({ title: "Eliminado", description: "Curso eliminado correctamente" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "Error al eliminar el curso",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCurrentCourse({
      id: "",
      title: "",
      description: "",
      longDescription: "",
      level: "básico",
      price: 0,
      duration: "",
      students: 0,
      rating: 5,
      image: "",
      category: "básico",
      modules: [],
      features: [],
      created_at: "",
    });
    setEditingCourse(null);
    setExpandedModules(new Set([0]));
  };

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border w-full">
        <div className="container mx-auto px-2 py-2 md:px-4 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold text-vallenato-red">
                Panel de Administración
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full h-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="create">
              {editingCourse ? "Editar Curso" : "Crear Curso"}
            </TabsTrigger>
            <TabsTrigger value="manage">Gestionar Cursos</TabsTrigger>
            <TabsTrigger value="create-subscription">
              {editingSubscriptionPlan ? "Editar Plan" : "Crear Plan"}
            </TabsTrigger>
            <TabsTrigger value="subscriptions">Planes</TabsTrigger>
            <TabsTrigger value="create-achievement">
              {editingAchievement ? "Editar Logro" : "Crear Logro"}
            </TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
          </TabsList>

          {/* CREAR / EDITAR CURSO */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-vallenato-red">
                  {editingCourse ? "Editar Curso" : "Crear Nuevo Curso"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* 1. INFORMACIÓN BÁSICA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del Curso *</Label>
                    <Input
                      id="title"
                      value={currentCourse.title}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                      placeholder="Ej: Curso de Acordeón Vallenato"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={currentCourse.price}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nivel</Label>
                    <Select
                      value={currentCourse.level}
                      onValueChange={(val: any) => setCurrentCourse({ ...currentCourse, level: val })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="básico">Básico</SelectItem>
                        <SelectItem value="intermedio">Intermedio</SelectItem>
                        <SelectItem value="avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select
                      value={currentCourse.category}
                      onValueChange={(val: any) => setCurrentCourse({ ...currentCourse, category: val })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="básico">Básico</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duración</Label>
                    <Input
                      value={currentCourse.duration}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, duration: e.target.value })}
                      placeholder="Ej: 4 semanas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL de Imagen</Label>
                    <Input
                      type="url"
                      required
                      placeholder="https://ejemplo.com/imagen.png"
                      value={currentCourse.image}
                      onChange={(e) =>
                        setCurrentCourse({ ...currentCourse, image: e.target.value })
                      }
                      pattern="https?://.*"
                      title="La URL debe comenzar con http:// o https://"
                      className={
                        currentCourse.image && !isValidUrl(currentCourse.image)
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descripción Corta *</Label>
                  <Textarea
                    value={currentCourse.description}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descripción Detallada</Label>
                  <Textarea
                    value={currentCourse.longDescription}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, longDescription: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* 2. CARACTERÍSTICAS */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-vallenato-red uppercase tracking-wider">Características</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Ej: Certificado incluido"
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                    />
                    <Button onClick={addFeature} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentCourse.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="gap-2 pl-3">
                        {feature}
                        <Trash2
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeFeature(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 3. MÓDULOS Y LECCIONES */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-vallenato-red">Plan de Estudios (Módulos)</h3>
                    <Button onClick={addModule} className="bg-vallenato-red hover:bg-vallenato-red-deep text-white">
                      <Plus className="h-4 w-4 mr-2" /> Agregar Módulo
                    </Button>
                  </div>

                  {currentCourse.modules.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                      No hay módulos creados. Agrega uno para comenzar.
                    </div>
                  )}

                  <div className="space-y-4">
                    {currentCourse.modules.map((module, mIndex) => {
                      const isExpanded = expandedModules.has(mIndex);
                      return (
                        <Card key={mIndex} className="border-l-4 border-l-vallenato-red shadow-sm">
                          <div className="p-4 bg-card rounded-t-lg flex flex-col gap-4">

                            {/* Header del Módulo */}
                            <div className="flex items-center gap-3">
                              <div className="cursor-grab text-muted-foreground">
                                <GripVertical className="h-5 w-5" />
                              </div>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">Título del Módulo</Label>
                                  <Input
                                    value={module.title}
                                    onChange={(e) => updateModule(mIndex, "title", e.target.value)}
                                    className="font-semibold"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">Orden</Label>
                                  <Input
                                    type="number"
                                    value={module.order}
                                    onChange={(e) => updateModule(mIndex, "order", Number(e.target.value))}
                                    className="w-20"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 items-center self-end md:self-center">
                                <Button variant="ghost" size="sm" onClick={() => toggleModule(mIndex)}>
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => removeModule(mIndex)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Contenido del Módulo (Lecciones) */}
                            {isExpanded && (
                              <div className="pl-4 md:pl-8 pt-4 border-t mt-2 space-y-4 bg-muted/10 rounded-b-lg pb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-sm font-medium text-muted-foreground uppercase">Lecciones del Módulo</h4>
                                  <Button size="sm" variant="outline" onClick={() => addLesson(mIndex)}>
                                    <Plus className="h-3 w-3 mr-1" /> Lección
                                  </Button>
                                </div>

                                {module.lessons.map((lesson, lIndex) => (
                                  <div key={lIndex} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start p-3 bg-background border rounded-md shadow-sm">
                                    {/* Título y Orden */}
                                    <div className="md:col-span-3 space-y-1">
                                      <Label className="text-[10px] uppercase text-muted-foreground">Título</Label>
                                      <Input
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(mIndex, lIndex, "title", e.target.value)}
                                        placeholder="Intro..."
                                        className="h-8 text-sm"
                                      />
                                    </div>

                                    {/* Tipo */}
                                    <div className="md:col-span-2 space-y-1">
                                      <Label className="text-[10px] uppercase text-muted-foreground">Tipo</Label>
                                      <Select
                                        value={lesson.type}
                                        onValueChange={(val) => updateLesson(mIndex, lIndex, "type", val)}
                                      >
                                        <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="video">Video</SelectItem>
                                          <SelectItem value="exercise">Ejercicio</SelectItem>
                                          <SelectItem value="quiz">Quiz</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* URL Contenido */}
                                    <div className="md:col-span-3 space-y-1">
                                      <Label className="text-[10px] uppercase text-muted-foreground">URL Contenido / Video</Label>
                                      <Input
                                        value={lesson.content_url}
                                        onChange={(e) => updateLesson(mIndex, lIndex, "content_url", e.target.value)}
                                        placeholder="https://..."
                                        className="h-8 text-sm"
                                      />
                                    </div>

                                    {/* Duración */}
                                    <div className="md:col-span-2 space-y-1">
                                      <Label className="text-[10px] uppercase text-muted-foreground">Duración</Label>
                                      <Input
                                        value={lesson.duration}
                                        onChange={(e) => updateLesson(mIndex, lIndex, "duration", e.target.value)}
                                        placeholder="10:00"
                                        className="h-8 text-sm"
                                      />
                                    </div>

                                    {/* Botón Eliminar */}
                                    <div className="md:col-span-1 flex justify-end pt-5">
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeLesson(mIndex, lIndex)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    {/* Descripción (Opcional, expandible o debajo) */}
                                    <div className="md:col-span-12 mt-1">
                                       <Input
                                        value={lesson.description}
                                        onChange={(e) => updateLesson(mIndex, lIndex, "description", e.target.value)}
                                        placeholder="Descripción breve de la lección..."
                                        className="h-7 text-xs bg-muted/20 border-transparent focus:bg-background focus:border-input"
                                      />
                                    </div>
                                  </div>
                                ))}
                                {module.lessons.length === 0 && <p className="text-xs text-center text-muted-foreground italic">No hay lecciones en este módulo.</p>}
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={saveCourse} className="bg-vallenato-red hover:bg-vallenato-red-deep w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {editingCourse ? "Actualizar Todo el Curso" : "Guardar Curso"}
                  </Button>
                  {editingCourse && (
                    <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GESTIONAR CURSOS (LISTADO) */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-vallenato-red">Cursos Disponibles ({filteredCourses.length})</CardTitle>

                {/* Controles de Filtro */}
                <div className="flex flex-col xl:flex-row gap-4 mt-4">
                  <Input
                    placeholder="Buscar por título..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex flex-wrap gap-2">
                     <Select value={filterCategory} onValueChange={(v:any) => setFilterCategory(v)}>
                      <SelectTrigger className="w-[140px]"><SelectValue placeholder="Categoría" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas Cat.</SelectItem>
                        <SelectItem value="básico">Básico</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterLevel} onValueChange={(v:any) => setFilterLevel(v)}>
                      <SelectTrigger className="w-[140px]"><SelectValue placeholder="Nivel" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos Niv.</SelectItem>
                        <SelectItem value="básico">Básico</SelectItem>
                        <SelectItem value="intermedio">Intermedio</SelectItem>
                        <SelectItem value="avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <DatePicker
                        selected={filterDateFrom}
                        // SOLUCIÓN: Tipar explícitamente el argumento como (date: Date | null)
                        onChange={(date: Date | null) => setFilterDateFrom(date)}
                        placeholderText="Desde"
                        className="flex h-10 w-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <DatePicker
                        selected={filterDateTo}
                        // SOLUCIÓN: Lo mismo aquí
                        onChange={(date: Date | null) => setFilterDateTo(date)}
                        placeholderText="Hasta"
                        className="flex h-10 w-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredCourses.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">No se encontraron cursos con estos filtros.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="group hover:shadow-lg transition-all duration-300">
                        <div className="aspect-video w-full bg-gray-100 overflow-hidden relative">
                            {course.image ? (
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Sin Imagen</div>
                            )}
                            <Badge className="absolute top-2 right-2" variant={course.category === 'premium' ? 'default' : 'secondary'}>
                                {course.category}
                            </Badge>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-vallenato-red transition-colors">{course.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{course.description}</p>
                            </div>

                            <div className="flex items-center justify-between text-sm pt-2 border-t">
                                <span className="font-mono font-bold">${course.price}</span>
                                <span className="text-muted-foreground">{course.modules.length} Módulos</span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => editCourse(course)}>
                                    Editar
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/curso/${course.id}`)}>
                                  Ver
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteCourse(course.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        </Card>
                    ))}
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUBSCRIPTIONS TAB */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Planes de Suscripción</span>
                  <Button onClick={() => { resetSubscriptionForm(); setActiveTab("create-subscription"); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Plan
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {subscriptionPlans.map((plan) => (
                    <Card key={plan.id} className="relative">
                      <CardHeader>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold text-primary">
                          ${plan.price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{plan.duration_months} {plan.duration_months === 1 ? 'mes' : 'meses'}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                        <div className="space-y-2 mb-4">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setCurrentSubscriptionPlan(plan);
                              setEditingSubscriptionPlan(plan.id);
                              setActiveTab("create-subscription");
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSubscriptionPlan(plan.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACHIEVEMENTS TAB */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Logros</span>
                  <Button onClick={() => { resetAchievementForm(); setActiveTab("create-achievement"); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Logro
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className="relative">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          {achievement.icon && <span className="mr-2">{achievement.icon}</span>}
                          {achievement.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Tipo de activación:</span> {achievement.trigger_type}
                          </div>
                          <div>
                            <span className="font-medium">Valor requerido:</span> {achievement.trigger_value}
                          </div>
                          <div>
                            <span className="font-medium">Estado:</span>{" "}
                            <Badge variant={achievement.active ? "default" : "secondary"}>
                              {achievement.active ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setCurrentAchievement(achievement);
                              setEditingAchievement(achievement.id);
                              setActiveTab("create-achievement");
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAchievement(achievement.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CREATE SUBSCRIPTION PLAN TAB */}
          <TabsContent value="create-subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingSubscriptionPlan ? "Editar Plan de Suscripción" : "Crear Plan de Suscripción"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input
                      value={currentSubscriptionPlan.name}
                      onChange={(e) => setCurrentSubscriptionPlan({ ...currentSubscriptionPlan, name: e.target.value })}
                      placeholder="Plan Premium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio *</Label>
                    <Input
                      type="number"
                      value={currentSubscriptionPlan.price}
                      onChange={(e) => setCurrentSubscriptionPlan({ ...currentSubscriptionPlan, price: parseFloat(e.target.value) || 0 })}
                      placeholder="29.99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duración (meses)</Label>
                    <Input
                      type="number"
                      value={currentSubscriptionPlan.duration_months}
                      onChange={(e) => setCurrentSubscriptionPlan({ ...currentSubscriptionPlan, duration_months: parseInt(e.target.value) || 1 })}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ID del Plan PayPal *</Label>
                    <Input
                      value={currentSubscriptionPlan.paypal_plan_id}
                      onChange={(e) => setCurrentSubscriptionPlan({ ...currentSubscriptionPlan, paypal_plan_id: e.target.value })}
                      placeholder="P-XXXXXXXXXXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={currentSubscriptionPlan.description}
                    onChange={(e) => setCurrentSubscriptionPlan({ ...currentSubscriptionPlan, description: e.target.value })}
                    placeholder="Descripción del plan..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Características</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Acceso ilimitado a cursos"
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                    />
                    <Button onClick={addFeature} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentSubscriptionPlan.features?.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="gap-2 pl-3">
                        {feature}
                        <Trash2
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeFeature(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={currentSubscriptionPlan.active}
                    onChange={(e) => setCurrentSubscriptionPlan({ ...currentSubscriptionPlan, active: e.target.checked })}
                  />
                  <Label htmlFor="active">Plan activo</Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveSubscriptionPlan}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingSubscriptionPlan ? "Actualizar" : "Crear"} Plan
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("subscriptions")}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CREATE ACHIEVEMENT TAB */}
          <TabsContent value="create-achievement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingAchievement ? "Editar Logro" : "Crear Logro"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input
                      value={currentAchievement.name}
                      onChange={(e) => setCurrentAchievement({ ...currentAchievement, name: e.target.value })}
                      placeholder="Primer Curso Completado"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ícono</Label>
                    <Input
                      value={currentAchievement.icon}
                      onChange={(e) => setCurrentAchievement({ ...currentAchievement, icon: e.target.value })}
                      placeholder="🏆"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de activación *</Label>
                    <Select
                      value={currentAchievement.trigger_type}
                      onValueChange={(value) => setCurrentAchievement({ ...currentAchievement, trigger_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course_completed">Curso completado</SelectItem>
                        <SelectItem value="lesson_completed">Lección completada</SelectItem>
                        <SelectItem value="login_streak">Racha de logins</SelectItem>
                        <SelectItem value="courses_enrolled">Cursos inscritos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor requerido</Label>
                    <Input
                      type="number"
                      value={currentAchievement.trigger_value}
                      onChange={(e) => setCurrentAchievement({ ...currentAchievement, trigger_value: parseInt(e.target.value) || 1 })}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={currentAchievement.description}
                    onChange={(e) => setCurrentAchievement({ ...currentAchievement, description: e.target.value })}
                    placeholder="Descripción del logro..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="achievement-active"
                    checked={currentAchievement.active}
                    onChange={(e) => setCurrentAchievement({ ...currentAchievement, active: e.target.checked })}
                  />
                  <Label htmlFor="achievement-active">Logro activo</Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveAchievement}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingAchievement ? "Actualizar" : "Crear"} Logro
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("achievements")}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
