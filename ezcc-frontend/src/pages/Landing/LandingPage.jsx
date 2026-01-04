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
  Sparkles,
  Quote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax effect for hero
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  // Bible verses data - inspiring verses for faith, hope, and love
  const bibleVerses = [
    {
      id: 1,
      verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
      reference: "Jeremiah 29:11",
      theme: "Hope",
      gradient: "from-amber-500 to-orange-500",
      bgColor: "from-amber-500/20 to-orange-500/20"
    },
    {
      id: 2,
      verse: "Be strong and courageous. Do not be afraid or terrified because of them, for the LORD your God goes with you; he will never leave you nor forsake you.",
      reference: "Deuteronomy 31:6",
      theme: "Courage",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: 3,
      verse: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?",
      reference: "Psalm 27:1",
      theme: "Faith",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: 4,
      verse: "Come to Me, all you who labor and are heavy laden, and I will give you rest.",
      reference: "Matthew 11:28",
      theme: "Peace",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/20 to-emerald-500/20"
    },
    {
      id: 5,
      verse: "For we walk by faith, not by sight.",
      reference: "2 Corinthians 5:7",
      theme: "Trust",
      gradient: "from-indigo-500 to-violet-500",
      bgColor: "from-indigo-500/20 to-violet-500/20"
    },
    {
      id: 6,
      verse: "Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
      reference: "1 Corinthians 13:6-7",
      theme: "Love",
      gradient: "from-rose-500 to-red-500",
      bgColor: "from-rose-500/20 to-red-500/20"
    }
  ];

  // Additional inspiring verses
  const featuredVerses = [
    {
      id: 1,
      verse: "You, dear children, are from God and have overcome them, because the one who is in you is greater than the one who is in the world.",
      reference: "1 John 4:4",
      theme: "Victory",
      icon: Sparkles
    },
    {
      id: 2,
      verse: "Remain in me, as I also remain in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me.",
      reference: "John 15:4",
      theme: "Abiding",
      icon: Heart
    },
    {
      id: 3,
      verse: "Praise be to the God and Father of our Lord Jesus Christ! In his great mercy he has given us new birth into a living hope through the resurrection of Jesus Christ from the dead.",
      reference: "1 Peter 1:3",
      theme: "New Life",
      icon: BookOpen
    }
  ];

  // Ministries data (keeping this section)
  const ministries = [
    {
      id: 1,
      name: "Sunday School",
      description: "Nurturing young hearts in God's love through engaging lessons and activities",
      icon: Heart,
      participants: "150+",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      id: 2,
      name: "Youth Gathering",
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
            src="https://res.cloudinary.com/dunrzq7tv/image/upload/v1767488340/Gemini_Generated_Image_y4k5r3y4k5r3y4k5_ds8chf.png" 
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
              Welcome Home EZCC 
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
              onClick={()=>navigate("/login")}
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

      {/* Bible Verses Section - Featured Verses */}
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
                <BookOpen className="w-12 h-12 text-amber-400 mx-auto" />
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Words of Life
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Let these sacred scriptures guide your journey and strengthen your faith
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
            {featuredVerses.map((verse, index) => {
              const IconComponent = verse.icon;
              return (
                <FadeInSection key={verse.id} delay={index * 0.15}>
                  <motion.div
                    className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 shadow-2xl p-8"
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
                    
                    <div className="relative z-10">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className="w-8 h-8 text-amber-400" />
                      </motion.div>

                      <Quote className="w-8 h-8 text-amber-400/40 mb-4" />

                      <p className="text-lg text-gray-200 italic font-serif leading-relaxed mb-6">
                        "{verse.verse}"
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-amber-400 font-semibold">
                          {verse.reference}
                        </p>
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-sm rounded-full border border-amber-500/20">
                          {verse.theme}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </FadeInSection>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Inspiring Bible Verses Grid Section */}
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
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Scripture for Every Season
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                God's promises for hope, courage, faith, and peace
              </p>
            </div>
          </FadeInSection>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {bibleVerses.map((verse, index) => {
              return (
                <FadeInSection key={verse.id} delay={index * 0.1}>
                  <motion.div
                    className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden min-h-[320px] flex flex-col"
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
                    <div className={`absolute inset-0 bg-gradient-to-br ${verse.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10 flex-1 flex flex-col">
                      {/* Theme Badge */}
                      <motion.div 
                        className={`inline-flex items-center gap-2 self-start px-4 py-2 bg-gradient-to-r ${verse.gradient} rounded-full mb-6 shadow-lg`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <BookOpen className="w-4 h-4 text-white" />
                        <span className="text-white font-semibold text-sm">{verse.theme}</span>
                      </motion.div>

                      {/* Verse Quote Icon */}
                      <Quote className="w-10 h-10 text-amber-400/30 mb-4" />

                      {/* Verse Text */}
                      <p className="text-base md:text-lg text-gray-200 italic font-serif leading-relaxed mb-6 flex-1">
                        "{verse.verse}"
                      </p>

                      {/* Reference */}
                      <div className="pt-4 border-t border-white/10">
                        <p className={`text-transparent bg-clip-text bg-gradient-to-r ${verse.gradient} font-bold text-lg`}>
                          {verse.reference}
                        </p>
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

      {/* Ministries Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto max-w-7xl">
          <FadeInSection>
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
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
                  onClick={()=>navigate("/signup")}
                  variants={scaleIn}
                  className="group px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-amber-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Join us
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
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
