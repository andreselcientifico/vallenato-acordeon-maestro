import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Biography from "@/components/Biography";
import VideoCarousel from "@/components/VideoCarousel";
import Courses from "@/components/Courses";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Biography />
      <VideoCarousel />
      <Courses />
      <Footer />
    </div>
  );
};

export default Index;
