import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Play, CheckCircle, Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Simulando estados de usuario
type UserState = 'guest' | 'logged-in' | 'premium';

const CoursesPage = () => {
  const navigate = useNavigate();
  const [userState, setUserState] = useState<UserState>('guest');
  const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);

  const courses = [
    {
      id: 1,
      title: "Fundamentos del Acordeón",
      description: "Aprende desde cero a tocar el acordeón con técnicas básicas y primeras canciones.",
      level: "Principiante",
      duration: "8 semanas",
      students: 156,
      rating: 4.9,
      price: "$89",
      lessons: 24,
      features: [
        "Postura y técnica básica",
        "Escalas fundamentales", 
        "5 canciones tradicionales",
        "Ejercicios de digitación",
        "Certificado de finalización"
      ],
      color: "vallenato-gold"
    },
    {
      id: 2,
      title: "Vallenato Clásico",
      description: "Domina los grandes clásicos del vallenato con técnicas intermedias y avanzadas.",
      level: "Intermedio",
      duration: "12 semanas",
      students: 89,
      rating: 4.8,
      price: "$149",
      lessons: 36,
      features: [
        "10 clásicos del vallenato",
        "Técnicas de improvisación",
        "Acompañamiento musical",
        "Teoría musical aplicada",
        "Masterclass en vivo"
      ],
      color: "vallenato-red"
    },
    {
      id: 3,
      title: "Maestría en Acordeón",
      description: "Conviértete en un maestro con técnicas profesionales y composición propia.",
      level: "Avanzado",
      duration: "16 semanas",
      students: 34,
      rating: 5.0,
      price: "$299",
      lessons: 48,
      features: [
        "Técnicas profesionales",
        "Composición y arreglos",
        "Grabación y producción",
        "Mentoría personalizada",
        "Oportunidades de presentación"
      ],
      color: "primary"
    }
  ];

  const handlePurchaseCourse = (courseId: number) => {
    setPurchasedCourses([...purchasedCourses, courseId]);
  };

  const isCourseAccessible = (courseId: number) => {
    return userState === 'premium' || purchasedCourses.includes(courseId);
  };

  const getActionButton = (course: any) => {
    if (userState === 'guest') {
      return (
        <Button 
          variant="outline" 
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => setUserState('logged-in')}
        >
          <Lock className="h-4 w-4 mr-2" />
          Inicia Sesión para Ver
        </Button>
      );
    }

    if (!isCourseAccessible(course.id)) {
      return (
        <div className="space-y-2">
          <Button 
            variant="hero" 
            className="w-full shadow-elegant"
            size="lg"
            onClick={() => handlePurchaseCourse(course.id)}
          >
            <Lock className="h-4 w-4 mr-2" />
            Comprar por {course.price}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            🔒 {course.lessons} lecciones bloqueadas
          </p>
        </div>
      );
    }

    return (
                  <Button 
                    variant="hero" 
                    className="w-full shadow-elegant"
                    size="lg"
                    onClick={() => navigate(`/curso/${course.id}`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continuar Curso
                  </Button>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-primary">Cursos</span>{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                de Acordeón
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Programas estructurados para llevarte desde principiante hasta maestro del vallenato
            </p>

            {/* User State Demo Controls */}
            <div className="flex justify-center gap-4 mb-8 p-4 bg-muted rounded-lg max-w-md mx-auto">
              <Button 
                variant={userState === 'guest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {setUserState('guest'); setPurchasedCourses([]);}}
              >
                Invitado
              </Button>
              <Button 
                variant={userState === 'logged-in' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUserState('logged-in')}
              >
                Usuario
              </Button>
              <Button 
                variant={userState === 'premium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUserState('premium')}
              >
                Premium
              </Button>
            </div>

            {userState !== 'guest' && (
              <div className="text-center mb-8">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  ✓ Sesión iniciada como {userState === 'premium' ? 'Usuario Premium' : 'Usuario Registrado'}
                </Badge>
              </div>
            )}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const isAccessible = isCourseAccessible(course.id);
              
              return (
                <Card 
                  key={course.id} 
                  className={`bg-gradient-card shadow-elegant border-primary/20 overflow-hidden group hover:shadow-warm transition-all duration-300 hover:scale-105 ${
                    !isAccessible && userState !== 'guest' ? 'opacity-75' : ''
                  }`}
                >
                  <div className={`h-2 bg-${course.color}`}></div>
                  
                  <div className="p-8 relative">
                    {/* Lock Overlay for inaccessible courses */}
                    {!isAccessible && userState !== 'guest' && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-muted/90 backdrop-blur-sm rounded-full p-2">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    )}

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

                    {/* Course Features */}
                    <div className="space-y-3 mb-8">
                      {course.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                      {course.features.length > 3 && (
                        <p className="text-xs text-muted-foreground pl-7">
                          +{course.features.length - 3} características más
                        </p>
                      )}
                    </div>

                    {/* Progress for accessible courses */}
                    {isAccessible && userState !== 'guest' && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="text-primary font-medium">
                            {Math.floor(Math.random() * 80) + 10}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{width: `${Math.floor(Math.random() * 80) + 10}%`}}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {userState !== 'guest' && !isAccessible && (
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-primary">{course.price}</span>
                          <span className="text-sm text-muted-foreground">por curso</span>
                        </div>
                      )}
                      
                      {getActionButton(course)}
                      
                      {userState !== 'guest' && (
                        <Button 
                          variant="outline" 
                          className="w-full border-primary/30 text-muted-foreground hover:bg-muted"
                        >
                          Ver Detalles del Curso
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Call to Action */}
          {userState === 'guest' && (
            <div className="text-center mt-16">
              <Card className="bg-gradient-accent text-white p-8 max-w-2xl mx-auto shadow-elegant">
                <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar tu journey musical?</h3>
                <p className="mb-6 opacity-90">
                  Únete a nuestra academia y aprende a tocar el acordeón vallenato con los mejores maestros.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => setUserState('logged-in')}
                >
                  Crear Cuenta Gratis
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CoursesPage;