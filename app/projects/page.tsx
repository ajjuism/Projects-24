'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Space_Grotesk } from 'next/font/google'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Grid, List, Code, Briefcase, Music, Palette, Headphones, Aperture, Layers, Users, Mail, PiggyBank } from 'lucide-react'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

interface Project {
  title: string
  description: string
  link: string
  icon: React.ReactNode
}

const projects: Project[] = [
  {
    title: "Notfy",
    description: "Notfy is a straightforward payment reminder app that allows you to schedule upcoming payments and receive reminders through your preferred channels, such as Telegram, email, and more, based on the intervals you select.",
    link: "https://notfy.vercel.app/",
    icon: <PiggyBank size={24} />
  },
  {
    title: "Pxl8.studio",
    description: "Pxl8 Studio sprang from a desire to tackle everyday challenges with straightforward solutions. It&apos;s a passion project where fun meets function, simplifying personal tasks with creative flair.",
    link: "https://www.pxl8.studio/",
    icon: <Code size={24} />
  },
  {
    title: "Juno",
    description: "Born out of necessity, Juno is a no-nonsense task manager that keeps things simple. It&apos;s a work in progress, now equipped with user authentication using Firebase, and built on React to streamline tasks.",
    link: "https://gsd-kohl.vercel.app/",
    icon: <Briefcase size={24} />
  },
  {
    title: "8bit Wedding invite",
    description: "My own wedding invite, designed to be as fun and interactive as possible. Using framer motion for animations, it also features a few custom sound bits made just for this project.",
    link: "https://wedding.ajjuism.com/",
    icon: <Music size={24} />
  },
  {
    title: "Tonelab",
    description: "Tonelab began as an experiment and evolved into a playground for sound. Manipulate and hear sounds in real-time through a dynamic, interactive web canvas.",
    link: "https://tonelab.vercel.app/",
    icon: <Palette size={24} />
  },
  {
    title: "Sample Lab",
    description: "Sample Lab is a web-based drum machine that allows you to upload and play your own samples. Utilize your keyboard to trigger sounds or interact directly with the interface on touch-enabled devices.",
    link: "https://samplelab.vercel.app/",
    icon: <Headphones size={24} />
  },
  {
    title: "Mandala Maker",
    description: "Mandala Maker allows you to craft intricate mandala patterns from your own designs. It offers adjustable settings for segment count, element spacing, design rotation, and overall mandala size.",
    link: "https://www.figma.com/community/plugin/1304874310414952650/mandala-maker",
    icon: <Aperture size={24} />
  },
  {
    title: "Circular Clone",
    description: "Circular Clone allows you to arrange clones of objects on your Figma canvas along a circular shape. You can control the number of segments, width, and rotation angle of the circular shape as well as the angle of rotation of the cloned objects.",
    link: "https://www.figma.com/community/plugin/1293975517470860904/circular-clone",
    icon: <Layers size={24} />
  },
  {
    title: "Jagath Narayan - Portfolio",
    description: "A quick weekend project to showcase Jagath's work. Built with vanilla JavaScript and Bootstrap.",
    link: "https://jagathnarayanan.com/",
    icon: <Users size={24} />
  },
  {
    title: "Lazymail - WIP",
    description: "Lazymail is all about making email template management easy. Still a work in progress, it lets you fill out and use templates quickly, built with React and powered by Airtable.",
    link: "https://lazymail-eosin.vercel.app/",
    icon: <Mail size={24} />
  }
]

export default function ProjectShowcase() {
  const [isLoading, setIsLoading] = useState(true)
  const [isGridView, setIsGridView] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const initThreeJS = useCallback(() => {
    if (!canvasRef.current) return

    sceneRef.current = new THREE.Scene()
    cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    rendererRef.current = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true })

    rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    rendererRef.current.setClearColor(0x111111)

    cameraRef.current.position.z = 30

    // Particle setup
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 10000
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.1 })
    particlesRef.current = new THREE.Points(particlesGeometry, particlesMaterial)
    sceneRef.current.add(particlesRef.current)

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose()
        ;(particlesRef.current.material as THREE.Material).dispose()
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !particlesRef.current) return

    particlesRef.current.rotation.x += 0.0001
    particlesRef.current.rotation.y += 0.0001

    rendererRef.current.render(sceneRef.current, cameraRef.current)
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    initThreeJS()
    animate()

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      clearTimeout(timer)
    }
  }, [initThreeJS, animate])

  return (
    <div className={`relative w-full min-h-screen overflow-hidden ${spaceGrotesk.className}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-t-4 border-white rounded-full animate-spin"
            ></motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
      <div className="relative z-10">
        <nav className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <div className="text-white pl-4 sm:pl-8">
            <Link href="/" className="flex items-center text-white hover:text-gray-300 transition-colors">
              <ArrowLeft className="mr-2" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>
          <div className="flex space-x-4 pr-4 sm:pr-8">
            {!isMobile && (
              <button
                onClick={() => setIsGridView(!isGridView)}
                className="text-white hover:text-gray-300 transition-colors flex items-center"
              >
                {isGridView ? <List className="mr-2" size={20} /> : <Grid className="mr-2" size={20} />}
                <span className="text-sm font-medium">{isGridView ? 'List View' : 'Grid View'}</span>
              </button>
            )}
          </div>
        </nav>
        <main className="container mx-auto py-24">
          <div className="max-w-[calc(100%-2rem)] mx-auto px-4 sm:px-8">
            <h1 className="text-4xl font-bold mb-8 text-white">Projects</h1>
            <div className={`${isMobile || !isGridView ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-800 bg-opacity-50 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:bg-opacity-70 transition-all duration-300 flex flex-col"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-center mb-4">
                      <motion.div
                        className="bg-zinc-300 rounded-full p-2 mr-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        {project.icon}
                      </motion.div>
                      <h2 className="text-xl font-bold text-white">{project.title}</h2>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                  </div>
                  <div className="p-6 pt-0">
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-zinc-700 text-white text-sm font-semibold py-2 px-4 rounded-full hover:bg-zinc-600 transition-colors"
                      >
                        View Project
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 bg-zinc-800 bg-opacity-50 backdrop-blur-md rounded-lg overflow-hidden shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Let's Collaborate</h2>
              <p className="text-gray-300 mb-6">
                If you have an interesting idea related to audio, lens-based, or web projects, I'd love to hear from you. Drop me a message.
              </p>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <a
                  href="mailto:ajjuism@gmail.com"
                  className="inline-flex items-center bg-zinc-700 text-white text-sm font-semibold py-3 px-6 rounded-full hover:bg-zinc-600 transition-colors"
                >
                  Contact Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}