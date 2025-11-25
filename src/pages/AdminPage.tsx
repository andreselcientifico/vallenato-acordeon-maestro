import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, ArrowLeft, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveCourseAPI, fetchCoursesAPI } from "@/api/admin";

interface Video {
  id: string;
  order: number;
  title: string;
  url: string;
  duration: string;
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
  videos: Video[];
  features: string[];
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
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
    videos: [],
    features: [],
  });
  const [newFeature, setNewFeature] = useState("");
  const [editingCourse, setEditingCourse] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const cursos = await fetchCoursesAPI();
        const normalized = cursos.map((item) => ({
          ...item.course,
          videos: item.videos ?? [],
          features: item.course.features ?? []
        }));

        setCourses(normalized);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los cursos",
          variant: "destructive",
        });
      }
    };

    loadCourses();
  }, []);

  const addVideo = () => {
    const newVideo: Video = {
      id: Date.now().toString(),
      order: currentCourse.videos.length + 1,
      title: "",
      url: "",
      duration: "",
    };
    setCurrentCourse({
      ...currentCourse,
      videos: [...currentCourse.videos, newVideo],
    });
  };

  const updateVideo = (
    videoId: string,
    field: keyof Video,
    value: string | number
  ) => {
    setCurrentCourse({
      ...currentCourse,
      videos: currentCourse.videos.map((video) =>
        video.id === videoId ? { ...video, [field]: value } : video
      ),
    });
  };

  const removeVideo = (videoId: string) => {
    const updatedVideos = currentCourse.videos
      .filter((video) => video.id !== videoId)
      .map((video, index) => ({ ...video, order: index + 1 }));

    setCurrentCourse({
      ...currentCourse,
      videos: updatedVideos,
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setCurrentCourse({
        ...currentCourse,
        features: [...currentCourse.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setCurrentCourse({
      ...currentCourse,
      features: currentCourse.features.filter((_, i) => i !== index),
    });
  };

  const saveCourse = async () => {
    if (!currentCourse.title || !currentCourse.description) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Llamamos a la API para guardar/actualizar
      const savedCourse = await saveCourseAPI(currentCourse);

      if (editingCourse) {
        setCourses(
          courses.map((c) => (c.id === editingCourse ? savedCourse : c))
        );
        setEditingCourse(null);
      } else {
        setCourses([...courses, savedCourse]);
      }

      resetForm();
      toast({
        title: "Éxito",
        description: "Curso guardado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const editCourse = (course: Course) => {
    setCurrentCourse(course);
    setEditingCourse(course.id);
  };

  const deleteCourse = (courseId: string) => {
    setCourses(courses.filter((course) => course.id !== courseId));
    toast({
      title: "Eliminado",
      description: "Curso eliminado correctamente",
    });
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
      videos: [],
      features: [],
    });
    setEditingCourse(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
              <h1 className="text-2xl font-bold text-vallenato-red">
                Panel de Administración
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Crear/Editar Curso</TabsTrigger>
            <TabsTrigger value="manage">Gestionar Cursos</TabsTrigger>
          </TabsList>

          {/* Crear/Editar Curso */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-vallenato-red">
                  {editingCourse ? "Editar Curso" : "Crear Nuevo Curso"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Información Básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del Curso *</Label>
                    <Input
                      id="title"
                      value={currentCourse.title}
                      onChange={(e) =>
                        setCurrentCourse({
                          ...currentCourse,
                          title: e.target.value,
                        })
                      }
                      placeholder="Nombre del curso"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={currentCourse.price}
                      onChange={(e) =>
                        setCurrentCourse({
                          ...currentCourse,
                          price: Number(e.target.value),
                        })
                      }
                      placeholder="99"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Nivel</Label>
                    <Select
                      value={currentCourse.level}
                      onValueChange={(
                        value: "básico" | "intermedio" | "avanzado"
                      ) => setCurrentCourse({ ...currentCourse, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="básico">Básico</SelectItem>
                        <SelectItem value="intermedio">Intermedio</SelectItem>
                        <SelectItem value="avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={currentCourse.category}
                      onValueChange={(value: "premium" | "básico") =>
                        setCurrentCourse({ ...currentCourse, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="básico">Básico</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración</Label>
                    <Input
                      id="duration"
                      value={currentCourse.duration}
                      onChange={(e) =>
                        setCurrentCourse({
                          ...currentCourse,
                          duration: e.target.value,
                        })
                      }
                      placeholder="4 semanas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">URL de Imagen</Label>
                    <Input
                      id="image"
                      value={currentCourse.image}
                      onChange={(e) =>
                        setCurrentCourse({
                          ...currentCourse,
                          image: e.target.value,
                        })
                      }
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Corta *</Label>
                  <Textarea
                    id="description"
                    value={currentCourse.description}
                    onChange={(e) =>
                      setCurrentCourse({
                        ...currentCourse,
                        description: e.target.value,
                      })
                    }
                    placeholder="Descripción breve del curso"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Descripción Detallada</Label>
                  <Textarea
                    id="longDescription"
                    value={currentCourse.longDescription}
                    onChange={(e) =>
                      setCurrentCourse({
                        ...currentCourse,
                        longDescription: e.target.value,
                      })
                    }
                    placeholder="Descripción completa del curso"
                    rows={5}
                  />
                </div>

                {/* Características del Curso */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-vallenato-red">
                    Características del Curso
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Agregar característica"
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                    />
                    <Button onClick={addFeature} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentCourse.features.map((feature, index) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        {feature}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Videos del Curso */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-vallenato-red">
                      Videos del Curso
                    </h3>
                    <Button onClick={addVideo} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Video
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {currentCourse.videos.map((video) => (
                      <Card key={video.id} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div className="space-y-2">
                            <Label>Orden</Label>
                            <Input
                              type="number"
                              value={video.order}
                              onChange={(e) =>
                                updateVideo(
                                  video.id,
                                  "order",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Título del Video</Label>
                            <Input
                              value={video.title}
                              onChange={(e) =>
                                updateVideo(video.id, "title", e.target.value)
                              }
                              placeholder="Lección 1: Introducción"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>URL del Video</Label>
                            <Input
                              value={video.url}
                              onChange={(e) =>
                                updateVideo(video.id, "url", e.target.value)
                              }
                              placeholder="https://youtube.com/watch?v=..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <div className="space-y-2 flex-1">
                              <Label>Duración</Label>
                              <Input
                                value={video.duration}
                                onChange={(e) =>
                                  updateVideo(
                                    video.id,
                                    "duration",
                                    e.target.value
                                  )
                                }
                                placeholder="15:30"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeVideo(video.id)}
                              className="mt-7"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={saveCourse}
                    className="bg-vallenato-red hover:bg-vallenato-red-deep"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingCourse ? "Actualizar Curso" : "Guardar Curso"}
                  </Button>
                  {editingCourse && (
                    <Button onClick={resetForm} variant="outline">
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestionar Cursos */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-vallenato-red">
                  Cursos Creados ({courses.length})
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* Mensaje cuando no hay cursos */}
                {courses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No hay cursos creados aún. Usa la pestaña "Crear/Editar
                    Curso" para agregar tu primer curso.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                      const safeFeatures = Array.isArray(course.features)
                        ? course.features
                        : [];

                      // videos viene en item.videos
                      const safeVideos = Array.isArray(course.videos)
                        ? course.videos
                        : [];

                      return (
                        <Card
                          key={course.id} // ✔ key única y estable
                          className="overflow-hidden hover:shadow-warm transition-shadow"
                        >
                          <div className="p-4">
                            {/* Badges */}
                            <div className="flex items-start justify-between mb-3">
                              <Badge
                                variant={
                                  course.category === "premium"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {course.category}
                              </Badge>

                              <Badge variant="outline">{course.level}</Badge>
                            </div>

                            {/* Títulos y descripción */}
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {course.title}
                            </h3>

                            <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                              {course.description}
                            </p>

                            {/* Datos del curso */}
                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                              <div className="flex justify-between">
                                <span>Precio:</span>
                                <span className="font-semibold text-vallenato-red">
                                  ${course.price}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span>Videos:</span>
                                <span>{safeVideos.length}</span>
                              </div>

                              <div className="flex justify-between">
                                <span>Duración:</span>
                                <span>{course.duration ?? "N/A"}</span>
                              </div>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => editCourse(course)}
                                className="flex-1"
                              >
                                Editar
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/curso/${course.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
