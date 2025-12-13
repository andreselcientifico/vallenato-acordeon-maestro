import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Users, Star, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { fetchCourses_API } from "@/api/admin";  // Asume que esta es la ruta correcta
import { toast } from "sonner";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);  // Aquí guardamos los cursos

  useEffect(() => {
    // Llamar a la API cuando el componente se monte
    const loadCourses = async () => {
      try {
        const coursesData = await fetchCourses_API();  // Obtener los cursos ordenados por rating
        setCourses(coursesData);  // Guardar los cursos en el estado
      } catch (error) {
        toast.error(`Error al cargar los cursos. ${(error as Error).message}`);
      }
    };
    
    loadCourses();  // Llamar la función para cargar los cursos
  }, []);  // El efecto solo se ejecuta una vez cuando el componente se monta

  return (
    <section id="cursos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-primary">Cursos</span>{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              de Acordeón
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Programas estructurados para llevarte desde principiante hasta maestro del vallenato
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="bg-gradient-card shadow-elegant border-primary/20 overflow-hidden group hover:shadow-warm transition-all duration-300 hover:scale-105">
              <div className={`h-2 bg-${course.color}`}></div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="secondary" 
                    className={`bg-${course.color}/10 text-${course.color} border-${course.color}/20`}
                  >
                    {course.level}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-primary mb-3">
                  {course.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students} estudiantes</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {course.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-primary">{course.price}</span>
                    <span className="text-sm text-muted-foreground">por curso</span>
                  </div>

                  <Button 
                    variant="hero" 
                    className="w-full shadow-elegant"
                    size="lg"
                    onClick={() => navigate('/cursos')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Ver Cursos
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => navigate('/cursos')}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Card className="bg-gradient-accent text-white p-8 max-w-2xl mx-auto shadow-elegant">
            <h3 className="text-2xl font-bold mb-4">¿No estás seguro qué curso elegir?</h3>
            <p className="mb-6 opacity-90">
              Agenda una consulta gratuita de 15 minutos y te ayudo a encontrar el curso perfecto para tu nivel.
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/cursos')}
            >
              Explorar Cursos
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Courses;
