import "./About.css";
import { motion } from "framer-motion";
import nosotrosImg1 from "../assets/nosotrosImg1.jpeg";
import nosotrosImg2 from "../assets/nosotrosImg2.jpeg";
import nosotrosImg3 from "../assets/nosotrosImg3.jpeg";

const About = () => {
  return (
    <section id="nosotros" className="nosotros-section">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Sobre Nosotros
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        En Infusión, fusionamos ingredientes naturales con la esencia
        del bienestar. Cada taza es una experiencia sensorial única.
      </motion.p>

      <div className="nosotros-grid">
        <motion.div
          className="nosotros-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={nosotrosImg1} alt="Historia" />
          <h3>Nuestra Historia</h3>
          <p>
            Desde nuestros inicios, nos dedicamos a seleccionar las mejores
            hierbas y especias.
          </p>
        </motion.div>

        <motion.div
          className="nosotros-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={nosotrosImg2} alt="Misión" />
          <h3>Nuestra Misión</h3>
          <p>Brindar infusiones únicas que fortalezcan cuerpo y alma.</p>
        </motion.div>

        <motion.div
          className="nosotros-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={nosotrosImg3} alt="Compromiso" />
          <h3>Compromiso</h3>
          <p>
            100% ingredientes naturales, cultivados con respeto a la naturaleza.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
