import Footer from "../components/Footer";
import About from "../components/About";
import RestaurantHero from "../components/RestaurantHero";
import MenuSection from "../components/MenuSection";
import MovieSection from "../components/MovieSection";
import LocationSection from "../components/LocationSection";

function Home() {

  return (
    <div>

      <RestaurantHero />

      <MenuSection />

      <MovieSection />

      <About />

      <LocationSection />

      <Footer />

    </div>
  );
}

export default Home;
