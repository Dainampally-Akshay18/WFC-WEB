import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  BookOpen, 
  Music, 
  ChevronDown,
  Play,
  ArrowRight,
  Church,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeSermon, setActiveSermon] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax effect for hero
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  // Sermons data
  const sermons = [
    {
      id: 1,
      title: "Walking in Faith",
      speaker: "Pastor John Smith",
      date: "December 24, 2025",
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80",
      description: "Discover the power of unwavering faith in challenging times"
    },
    {
      id: 2,
      title: "Love Without Boundaries",
      speaker: "Pastor Sarah Johnson",
      date: "December 17, 2025",
      duration: "38 min",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
      description: "Embracing God's unconditional love and sharing it with others"
    },
    {
      id: 3,
      title: "The Power of Prayer",
      speaker: "Pastor Michael Brown",
      date: "December 10, 2025",
      duration: "42 min",
      image: "https://images.unsplash.com/photo-1445546137150-c89a2288ed46?w=800&q=80",
      description: "Understanding prayer as a conversation with our Creator"
    }
  ];

  // Events data
  const upcomingEvents = [
    {
      id: 1,
      title: "New Year's Eve Service",
      date: "December 31, 2025",
      time: "10:00 PM",
      location: "Main Sanctuary",
      icon: Calendar,
      color: "from-amber-500/20 to-orange-500/20"
    },
    {
      id: 2,
      title: "Youth Bible Study",
      date: "January 5, 2026",
      time: "6:00 PM",
      location: "Youth Hall",
      icon: BookOpen,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: 3,
      title: "Worship Night",
      date: "January 12, 2026",
      time: "7:00 PM",
      location: "Main Sanctuary",
      icon: Music,
      color: "from-purple-500/20 to-pink-500/20"
    }
  ];

  // Ministries data
  const ministries = [
    {
      id: 1,
      name: "Children's Ministry",
      description: "Nurturing young hearts in God's love through engaging lessons and activities",
      icon: Heart,
      participants: "150+",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      id: 2,
      name: "Youth Ministry",
      description: "Empowering the next generation to live out their faith boldly",
      icon: Users,
      participants: "200+",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      name: "Worship Ministry",
      description: "Leading hearts to encounter God through music and worship",
      icon: Music,
      participants: "80+",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      id: 4,
      name: "Prayer Ministry",
      description: "Interceding for our community and touching heaven with our prayers",
      icon: BookOpen,
      participants: "120+",
      gradient: "from-amber-500 to-orange-500"
    }
  ];

  // Animation variants
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 1, 0.5, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1]
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Intersection Observer component
  const FadeInSection = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUpVariant}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Ambient animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Hero Section with Parallax */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        {/* Hero Background with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&q=80" 
            alt="Church"
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          >
            <motion.div
              variants={floatingAnimation}
              animate="animate"
              className="inline-block mb-6"
            >
              <Church className="w-20 h-20 text-amber-400 mx-auto drop-shadow-2xl" strokeWidth={1.5} />
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome Home
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A place where faith comes alive, hearts are transformed, and love knows no bounds
            </motion.p>

            {/* Scripture Verse with Line-by-Line Reveal */}
            <motion.div 
              className="mb-12 max-w-2xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.p 
                variants={fadeUpVariant}
                className="text-lg md:text-xl text-amber-200 italic font-serif leading-relaxed"
              >
                "For where two or three gather in my name,
              </motion.p>
              <motion.p 
                variants={fadeUpVariant}
                className="text-lg md:text-xl text-amber-200 italic font-serif leading-relaxed"
              >
                there am I with them."
              </motion.p>
              <motion.p 
                variants={fadeUpVariant}
                className="text-sm text-amber-300/80 mt-2 font-light"
              >
                — Matthew 18:20
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button 
                className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold text-lg overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Join Us This Sunday
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button 
                className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Live
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </motion.section>

      {/* Latest Sermons Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto max-w-7xl">
          <FadeInSection>
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-4"
              >
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Latest Sermons
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Messages that inspire, challenge, and transform lives
              </p>
            </div>
          </FadeInSection>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {sermons.map((sermon, index) => (
              <FadeInSection key={sermon.id} delay={index * 0.15}>
                <motion.div
                  className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 shadow-2xl"
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    transform: "perspective(1000px) rotateX(0deg)",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* 3D Card Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative h-64 overflow-hidden">
                    <motion.img 
                      src={sermon.image}
                      alt={sermon.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    
                    {/* Play button overlay */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                    >
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm">
                        <Play className="w-8 h-8 text-slate-900 ml-1" fill="currentColor" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-6 relative z-10">
                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {sermon.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {sermon.duration}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
                      {sermon.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-4">
                      {sermon.description}
                    </p>

                    <p className="text-amber-400 font-medium">
                      {sermon.speaker}
                    </p>

                    <motion.button 
                      className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-xl font-semibold border border-amber-500/30 hover:bg-amber-500/30 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Watch Now
                    </motion.button>
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="relative py-24 px-6 bg-slate-900">
        <div className="container mx-auto max-w-7xl">
          <FadeInSection>
            <div className="text-center mb-16">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="inline-block mb-4"
              >
                <Calendar className="w-12 h-12 text-amber-400 mx-auto" />
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Upcoming Events
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Join us in worship, fellowship, and growth
              </p>
            </div>
          </FadeInSection>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {upcomingEvents.map((event, index) => {
              const IconComponent = event.icon;
              return (
                <FadeInSection key={event.id} delay={index * 0.15}>
                  <motion.div
                    className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 overflow-hidden"
                    whileHover={{ 
                      y: -8,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
                      scale: 1.02
                    }}
                    style={{
                      transform: "perspective(1000px) rotateY(0deg)",
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className="w-8 h-8 text-amber-400" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors duration-300">
                        {event.title}
                      </h3>

                      <div className="space-y-3 text-gray-400">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-amber-400" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-400" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-amber-400" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <motion.button 
                        className="mt-6 w-full py-3 bg-white/5 text-white rounded-xl font-semibold border border-white/10 hover:bg-white/10 hover:border-amber-400/50 transition-all duration-300"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Learn More
                      </motion.button>
                    </div>
                  </motion.div>
                </FadeInSection>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Ministries Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto max-w-7xl">
          <FadeInSection>
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring" }}
                className="inline-block mb-4"
              >
                <Heart className="w-12 h-12 text-amber-400 mx-auto" />
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Our Ministries
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Serving with purpose, growing in faith, impacting lives
              </p>
            </div>
          </FadeInSection>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {ministries.map((ministry, index) => {
              const IconComponent = ministry.icon;
              return (
                <FadeInSection key={ministry.id} delay={index * 0.1}>
                  <motion.div
                    className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/5 overflow-hidden"
                    whileHover={{ 
                      y: -12,
                      boxShadow: "0 30px 60px rgba(0, 0, 0, 0.7)",
                      rotateX: 5
                    }}
                    style={{
                      transform: "perspective(1200px)",
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {/* Animated gradient background */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${ministry.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    <div className="relative z-10">
                      <motion.div 
                        className={`w-20 h-20 bg-gradient-to-br ${ministry.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl`}
                        whileHover={{ 
                          rotate: [0, -10, 10, -10, 0],
                          scale: 1.1
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <IconComponent className="w-10 h-10 text-white" strokeWidth={1.5} />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-orange-400 transition-all duration-300">
                        {ministry.name}
                      </h3>

                      <p className="text-gray-400 mb-4 leading-relaxed">
                        {ministry.description}
                      </p>

                      <div className="flex items-center gap-2 text-amber-400 font-semibold">
                        <Users className="w-5 h-5" />
                        <span>{ministry.participants} Members</span>
                      </div>
                    </div>

                    {/* 3D depth effect */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  </motion.div>
                </FadeInSection>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <FadeInSection>
            <motion.div 
              className="text-center bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-2xl rounded-3xl p-12 md:p-16 border border-white/10 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <Church className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Join Our Family
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience the warmth of Christian fellowship, grow in your faith journey, and discover your purpose in God's kingdom.
              </p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.button 
                  variants={scaleIn}
                  className="group px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-amber-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Plan Your Visit
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>

                <motion.button 
                  variants={scaleIn}
                  className="px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-lg border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Us
                </motion.button>
              </motion.div>
            </motion.div>
          </FadeInSection>

          {/* Login/Signup Buttons Section */}
          <FadeInSection delay={0.3}>
            <motion.div 
              className="mt-16 text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-10 border border-white/10"
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Already a Member?
              </h3>
              <p className="text-gray-400 mb-6">
                Access your account to stay connected with our community
              </p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.button 
                  variants={scaleIn}
                  onClick={() => navigate('/login')}
                  className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Login
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>

                <motion.button 
                  variants={scaleIn}
                  onClick={() => navigate('/signup')}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Sign Up
                    <Sparkles className="w-5 h-5" />
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 bg-slate-950 border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center text-gray-500">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <Church className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            </motion.div>
            <p className="text-sm">
              © 2025 Christian Congregation. All rights reserved.
            </p>
            <p className="text-xs mt-2">
              Built with love and faith ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
