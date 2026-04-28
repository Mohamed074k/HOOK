import { Link } from "react-router-dom";
import { Anchor } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NotFoundPage = () => {
  const [waves, setWaves] = useState([]);
  const [bubbles, setBubbles] = useState([]);

  // Generate wave positions
  useEffect(() => {
    const waveCount = 5;
    const newWaves = Array.from({ length: waveCount }, (_, i) => ({
      id: i,
      delay: i * 0.5,
      duration: 3 + i * 0.5,
      amplitude: 20 + i * 10,
    }));
    setWaves(newWaves);

    // Generate floating bubbles
    const bubbleCount = 20;
    const newBubbles = Array.from({ length: bubbleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 6,
      size: 10 + Math.random() * 20,
      startY: 100 + Math.random() * 20,
    }));
    setBubbles(newBubbles);
  }, []);

  // Floating particles for ambiance
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 3 + Math.random() * 7,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#001526] via-[#00223b] to-[#001526] flex flex-col items-center justify-center text-center p-6 overflow-hidden">
      {/* Animated Background Waves */}
      <svg
        className="absolute bottom-0 left-0 w-full h-64 opacity-20"
        preserveAspectRatio="none"
        viewBox="0 0 1440 320"
      >
        {waves.map((wave) => (
          <motion.path
            key={wave.id}
            fill="rgba(56, 189, 248, 0.3)"
            fillOpacity="0.3"
            d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,176C672,171,768,181,864,197.3C960,213,1056,235,1152,234.7C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,176C672,171,768,181,864,197.3C960,213,1056,235,1152,234.7C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,165.3C96,171,192,181,288,186.7C384,192,480,192,576,181.3C672,171,768,149,864,154.7C960,160,1056,192,1152,208C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,176C672,171,768,181,864,197.3C960,213,1056,235,1152,234.7C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{
              duration: wave.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: wave.delay,
            }}
          />
        ))}
      </svg>

      {/* Floating Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-r from-sky-400/30 to-cyan-400/20"
          style={{
            left: `${bubble.left}%`,
            width: bubble.size,
            height: bubble.size,
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-20vh",
            opacity: [0, 0.6, 0.6, 0],
            scale: [0, 1, 1.2, 1.5],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-sky-400/40"
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-20vh",
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative z-10"
      >
        {/* Animated Anchor Logo */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="flex items-center gap-2 text-4xl font-black text-[#cee5ff] mb-8"
        >
        
       
        </motion.div>

        {/* 404 Number with Glitch Effect */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-9xl md:text-[12rem] font-black text-[#cee5ff] relative"
            style={{
              textShadow: "0 0 20px rgba(56, 189, 248, 0.5)",
            }}
          >
            404
          </motion.h1>
          
          {/* Glitch layers */}
          <motion.h1
            className="absolute top-0 left-0 text-9xl md:text-[12rem] font-black text-sky-400 opacity-50"
            style={{
              clipPath: "inset(0 0 0 0)",
              transform: "translateX(-2px)",
            }}
            animate={{
              clipPath: [
                "inset(0 0 0 0)",
                "inset(20% 0 30% 0)",
                "inset(10% 0 60% 0)",
                "inset(0 0 0 0)",
              ],
              x: [-2, 2, -1, 1, -2],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 3,
            }}
          >
            404
          </motion.h1>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.p
            animate={{
              textShadow: [
                "0 0 0px rgba(56, 189, 248, 0)",
                "0 0 10px rgba(56, 189, 248, 0.5)",
                "0 0 0px rgba(56, 189, 248, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="text-3xl md:text-4xl font-bold text-[#a3cbf2]/80 mt-4"
          >
            Lost at Sea
          </motion.p>
          <p className="text-[#a3cbf2]/50 mt-2 max-w-md text-lg">
            The page you're looking for has drifted off. 
         
          </p>
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10"
        >
          <Link
            to="/"
            className="relative group inline-block"
          >
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative bg-gradient-to-r from-sky-400 to-cyan-500 text-[#003353] px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/25">
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                Back to Home
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.span>
            </div>
          </Link>
        </motion.div>

        {/* Decorative Wave Under Button */}
        <motion.div
          className="mt-12 text-sky-400/30"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="40"
            height="20"
            viewBox="0 0 40 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <path
              d="M0 10 Q10 0 20 10 T40 10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Radial Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#001526] via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default NotFoundPage;