import LazyHeader from "@/components/LazyHeader";
import Hero from "@/components/Hero";
import Biography from "@/components/Biography";
import PhotoCarousel from "@/components/PhotoCarousel";
import Courses from "@/components/Courses";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <LazyHeader />
      <Hero />
      <Biography />
      <PhotoCarousel />
      <Courses />
      <Footer />
    </div>
  );
};

export default Index;
