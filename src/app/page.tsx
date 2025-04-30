"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  GraduationCap, 
  Star, 
  Sparkles, 
  Car, 
  Palmtree, 
  Clock, 
  Users, 
  Calendar, 
  Upload, 
  DollarSign,
  Sun,
  Wand2
} from 'lucide-react';
import { useRef } from 'react'
import { collection, addDoc, onSnapshot } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from "../../firebase";
import Chat from './chat';
import Costs from './components/costs';
import Itinerary from './components/itinerary';

export default function Home() {
  const [countdownType, setCountdownType] = useState('detailed');
  const [activeDestination, setActiveDestination] = useState('boston');
  const [countdown, setCountdown] = useState({
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [theme, setTheme] = useState('modern');
  const [activeTab, setActiveTab] = useState('countdown');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const destinos = [
    {
      id: 'boston',
      nombre: 'Boston',
      fecha: '28 de Mayo, 2025',
      icono: <MapPin className="text-amber-300" />,
      descripcion: '¡Iniciando en Boston!',
      actividades: [
        'Comer Chick Fil a', 'Recorrer la Freedom Trail', 'Cenar en Quincy Market', 'Harvard', 'mit', 'Shake Shack'
      ]
    },
    {
      id: 'graduacion',
      nombre: 'Graduación MIT',
      fecha: '29 de Mayo, 2025',
      icono: <GraduationCap className="text-amber-300" />,
      descripcion: 'Graduación de Mateo de MIT',
      actividades: [
        'Ceremonia de graduación', 'Mateo hace nada', 'Se come rico'
      ]
    },
    {
      id: 'hollywoodStudios',
      nombre: 'Disney Hollywood Studios',
      fecha: '1 de Junio, 2025',
      icono: <Star className="text-amber-300" />,
      descripcion: 'Disney Hollywood Studios opciones comida',
      actividades: [
        '50\'s Prime Time Café ($15 - $34.99) 8.5/10 Formal', 'Sci-Fi Dine-In Theater ($15 - $34.99) 8/10 Formal', 'Docking Bay 7 ($15 - $34.99) 9/10 Rapido', 'Ronto Roasters ($14.99 y menos) 9/10 Rapido', 'Woody\'s Lunch Box ($14.99 y menos) 9/10 Rapido'
      ]
    },
    {
      id: 'islandsOfAdventure',
      nombre: 'Islands of adventure',
      fecha: '2 de Junio, 2025',
      icono: <Sparkles className="text-amber-300" />,
      descripcion: 'Islands of adventure opciones comida',
      actividades: [
        'Mythos Restaurant ($35 - $59.99) 9.5/10 Formal', 'Three Broomsticks ($15 - $34.99) 9/10 Formal', 'Confisco Grille ($15 - $34.99) 7.5/10 Formal', 'Pizza Predattoria ($14.99 y menos) 7/10 Rapido', 'Green Eggs and Ham Cafe ($14.99 y menos) 7/10 Rapido', 'Thunder Falls Terrace ($14.99 y menos) 8.5/10 Rapido'
      ]
    },
    {
      id: 'universalStudios',
      nombre: 'Universal Studios',
      fecha: '3 de Junio, 2025',
      icono: <Sparkles className="text-amber-300" />,
      descripcion: 'Universal Studios opciones comida',
      actividades: [
        'Leaky Cauldron ($15 - $34.99) 9/10 Formal', 'Finnegan\'s Bar & Grill ($15 - $34.99) 8/10 Formal', 'Krusty Burger ($14.99 y menos) 7.5/10 Rapido', 'Mel\'s Drive-In ($14.99 y menos) 8/10 Rapido', 'Bumblebee Man\'s Taco Truck ($14.99 y menos) 8/10 Rapido'
      ]
    },
    {
      id: 'miami',
      nombre: 'Miami',
      fecha: '4 de Junio, 2025',
      icono: <Car className="text-amber-300" />,
      descripcion: '¡Viaje por carretera a Miami!',
      actividades: [
        'South Beach', 'No se', 'Dejar a mateo con mauel'
      ]
    },
    {
      id: 'puntaCana',
      nombre: 'Punta Cana',
      fecha: '7 de Junio, 2025',
      icono: <Palmtree className="text-amber-300" />,
      descripcion: 'Punta Cana',
      actividades: [
        'Paradisus', 'Comer carne', 'Comer sushi', 'Descansar'
      ]
    }
  ];

  const viajeros = [
    {
      nombre: 'Jeronimo',
      personaje: 'Spiderman',
      descripcion: 'El crack',
      casa: 'Spiderman',
      imagen: "https://wallpapers.com/images/hd/spiderman-background-oycfyb1ksermw921.jpg"
    },
    {
      nombre: 'Sofia',
      personaje: 'Baby Groot',
      descripcion: 'Fiofilda',
      casa: 'Guardianes de la Galaxia',
      imagen: "https://media.vanityfair.com/photos/590f7d985caad73f2ce0cc98/master/pass/bb-groot.jpg"
    },
    {
      nombre: 'Juan',
      personaje: 'Tom Marvolo Riddle',
      descripcion: 'Juancho',
      casa: 'Death eaters',
      imagen: "https://contentful.harrypotter.com/usf1vwtuqyxm/yMwYMbczYDjbnbk1MpoHI/de2fec43140e0bb77fa40be23b1303ef/lord-voldemort-tom-riddle_1_1800x1248.png"
    },
    {
      nombre: 'Mateo',
      personaje: 'Darth Vader',
      descripcion: 'Mapedo',
      casa: 'Galactic Evil Empire',
      imagen: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Darth_Vader_-_2007_Disney_Weekends.jpg"
    },
    {
      nombre: 'Valeria',
      personaje: 'Slinky',
      descripcion: 'Vale',
      casa: 'Toy Story',
      imagen: "https://lumiere-a.akamaihd.net/v1/images/open-uri20150422-20810-pzhioy_5a17fe4b.jpeg"
    },
  ];

  const fechasViaje = {
    boston: new Date('May 28, 2025 03:59:00'),
    graduacion: new Date('May 29, 2025 10:00:00'),
    hollywoodStudios: new Date('June 1, 2025 011:00:00'),
    islandsOfAdventure: new Date('June 2, 2025 08:00:00'),
    universalStudios: new Date('June 3, 2025 08:00:00'),
    miami: new Date('June 4, 2025 08:00:00'),
    puntaCana: new Date('June 7, 2025 09:55:00')
  };
  

  // Harry Potter theme houses
  const hpHouses = {
    gryffindor: { color: 'text-yellow-600', bgColor: 'bg-yellow-600', borderColor: 'border-yellow-400', accent: 'text-yellow-400' },
    hufflepuff: { color: 'text-yellow-500', bgColor: 'bg-yellow-500', borderColor: 'border-black', accent: 'text-black' },
    ravenclaw: { color: 'text-blue-600', bgColor: 'bg-blue-600', borderColor: 'border-bronze', accent: 'text-amber-700' },
    slytherin: { color: 'text-green-600', bgColor: 'bg-green-600', borderColor: 'border-silver', accent: 'text-gray-400' }
  };

  const [activeHouse, setActiveHouse] = useState<keyof typeof hpHouses>('gryffindor')

  // Current active house for Harry Potter theme (could be set by user in an expanded version)

// state to hold the photo URLs
const [fotos, setFotos] = useState<string[]>([])

// ref for hidden file input
const photoInputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  const photosCol = collection(db, 'photos')
  // real-time sync
  const unsubscribe = onSnapshot(photosCol, (snap) => {
    const urls = snap.docs.map(doc => doc.data().url as string)
    setFotos(urls)
  })
  return () => unsubscribe()
}, [])

// Trigger the hidden <input>
const handleAddPhotoClick = () => {
  photoInputRef.current?.click()
}

// Upload selected file → Storage → Firestore
const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const filename = `${Date.now()}_${file.name}`
  const storageRef = ref(storage, `trip-photos/${filename}`)
  const uploadTask = uploadBytesResumable(storageRef, file)

  uploadTask.on('state_changed', console.log, console.error, async () => {
    const url = await getDownloadURL(storageRef)
    // save URL in Firestore
    await addDoc(collection(db, 'photos'), { url, createdAt: Date.now() })
  })

  // reset input
  e.target.value = ''
}


  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const firstDestination = fechasViaje[activeDestination];
      const diff = firstDestination - now;

      if (diff <= 0) {
        setCountdown({
          weeks: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }

      const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({
        weeks,
        days,
        hours,
        minutes,
        seconds
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeDestination]);

  // Add a theme change effect for more responsiveness and animation
  useEffect(() => {
    // This could animate specific elements when theme changes
    const body = document.querySelector('body');
    if (theme === 'harryPotter') {
      body.classList.add('hp-theme-active');
    } else {
      body.classList.remove('hp-theme-active');
    }
    
    return () => {
      body.classList.remove('hp-theme-active');
    };
  }, [theme]);

  const getThemeClasses = () => {
    switch (theme) {
      case 'starWars':
        return {
          bg: 'bg-black',
          text: 'text-yellow-400',
          accent: 'text-yellow-500',
          card: 'bg-gray-900 border-yellow-500',
          button: 'bg-yellow-500 hover:bg-yellow-600 text-black',
          header: 'text-yellow-400',
          font: 'font-mono',
          shadow: 'shadow-yellow-500/50',
          border: 'border-yellow-500',
          highlight: 'bg-yellow-500/10'
        };
      case 'harryPotter':
        // Enhanced Harry Potter theme with house-specific elements
        const house = hpHouses[activeHouse];
        return {
          bg: 'bg-slate-900 bg-[url("/parchment-bg.png")] bg-fixed bg-blend-multiply',
          text: 'text-amber-100',
          accent: house.color || 'text-amber-500',
          card: `bg-slate-800/90 backdrop-blur-sm border-amber-700 hover:border-amber-500`,
          button: `bg-amber-700 hover:bg-amber-600 text-white ${house.borderColor} border hover:scale-105`,
          header: 'text-amber-500 font-hp',
          font: 'font-serif',
          shadow: 'shadow-amber-700/50',
          border: 'border-amber-700',
          highlight: 'bg-amber-700/30',
          scrollbar: 'scrollbar-thin scrollbar-thumb-amber-700 scrollbar-track-amber-900'
        };
      default:
        return {
          bg: 'bg-white dark:bg-gray-900',
          text: 'text-gray-800 dark:text-gray-200',
          accent: 'text-blue-600 dark:text-blue-400',
          card: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          header: 'text-gray-900 dark:text-white',
          font: 'font-sans',
          shadow: 'shadow-blue-500/20',
          border: 'border-gray-200 dark:border-gray-700',
          highlight: 'bg-blue-500/10',
          scrollbar: 'scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 scrollbar-track-gray-100 dark:scrollbar-track-gray-800'
        };
    }
  };

  const { bg, text, accent, card, button, header, font, shadow, border, highlight, scrollbar } = getThemeClasses();

  const renderCountdown = () => {
    switch (countdownType) {
      case 'weeks':
        return (
          <div className="text-center">
            <div className={`text-6xl md:text-8xl font-bold mb-2 ${accent}`}>{countdown.weeks}</div>
            <div className={`text-xl md:text-2xl ${text}`}>semanas</div>
          </div>
        );
      case 'days':
        return (
          <div className="text-center">
            <div className={`text-6xl md:text-8xl font-bold mb-2 ${accent}`}>
              {countdown.weeks * 7 + countdown.days}
            </div>
            <div className={`text-xl md:text-2xl ${text}`}>días</div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
            {[
              { value: countdown.weeks, label: 'SEMANAS' },
              { value: countdown.days, label: 'DÍAS' },
              { value: countdown.hours, label: 'HORAS' },
              { value: countdown.minutes, label: 'MINUTOS' },
              { value: countdown.seconds, label: 'SEGUNDOS' }
            ].map((item, index) => (
              <div key={index} className={`flex flex-col items-center p-2 md:p-4 ${card} rounded-lg border ${shadow} transition-all hover:scale-105`}>
                <div className={`text-xl sm:text-3xl md:text-5xl font-bold mb-1 ${accent}`}>
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className={`text-xs md:text-sm uppercase ${text}`}>{item.label}</div>
              </div>
            ))}
          </div>
        );
    }
  };

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Custom Harry Potter decorative elements
  const renderHpDecorations = () => {
    if (theme === 'harryPotter') {
      return (
        <>
          <div className="fixed top-0 left-0 w-full pointer-events-none z-0 opacity-10">
            <div className="absolute top-0 left-4 w-24 h-24 bg-[url('/hp-corner.png')] bg-contain bg-no-repeat"></div>
            <div className="absolute top-0 right-4 w-24 h-24 bg-[url('/hp-corner.png')] bg-contain bg-no-repeat transform scale-x-[-1]"></div>
            <div className="absolute bottom-0 left-4 w-24 h-24 bg-[url('/hp-corner.png')] bg-contain bg-no-repeat transform scale-y-[-1]"></div>
            <div className="absolute bottom-0 right-4 w-24 h-24 bg-[url('/hp-corner.png')] bg-contain bg-no-repeat transform scale-x-[-1] scale-y-[-1]"></div>
          </div>
          <div className="fixed top-1/2 left-0 transform -translate-y-1/2 w-8 h-96 bg-[url('/hp-border.png')] bg-contain bg-no-repeat opacity-20 pointer-events-none hidden md:block"></div>
          <div className="fixed top-1/2 right-0 transform -translate-y-1/2 w-8 h-96 bg-[url('/hp-border.png')] bg-contain bg-no-repeat scale-x-[-1] opacity-20 pointer-events-none hidden md:block"></div>
        </>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen ${bg} ${text} ${font} transition-all duration-500 overflow-x-hidden ${scrollbar}`}>
      {/* Harry Potter theme decorations */}
      {renderHpDecorations()}
      
      {/* Header */}
      <header className={`sticky top-0 z-30 p-4 ${theme === 'modern' ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md' : theme === 'starWars' ? 'bg-black/90 backdrop-blur-md' : 'bg-slate-900/90 backdrop-blur-md'} border-b ${border}`}>
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            {theme === 'harryPotter' && (
              <div className="w-10 h-10 mr-3 hidden sm:block">
                <div className="w-full h-full bg-[url('/hp-logo.png')] bg-contain bg-no-repeat"></div>
              </div>
            )}
            <h1 className={`text-2xl font-bold ${header} ${theme === 'harryPotter' ? 'font-hp tracking-wider' : ''}`}>
              {theme === 'harryPotter' ? 'Harry Potter' : 'El Viaje 2025'}
            </h1>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setTheme('modern')} 
              className={`p-2 rounded-full transition-all ${theme === 'modern' ? button : 'bg-gray-200 dark:bg-gray-700 hover:scale-110'}`}>
              <Sun size={20} />
            </button>
            <button 
              onClick={() => setTheme('starWars')} 
              className={`p-2 rounded-full transition-all ${theme === 'starWars' ? button : 'bg-gray-200 dark:bg-gray-700 hover:scale-110'}`}>
              <Star size={20} />
            </button>
            <button onClick={() => {
  setTheme('harryPotter')
  // Optionally rotate through houses or allow user to pick:
  setActiveHouse(prev => prev === 'gryffindor' ? 'ravenclaw' : 'gryffindor')
}}
className={`p-2 rounded-full transition-all ${theme==='harryPotter'?button:'bg-gray-200'}`}>
  <Wand2 size={20}/>
</button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center space-x-4 mb-4">
              <button 
                onClick={() => { setTheme('modern'); setIsMobileMenuOpen(false); }} 
                className={`p-2 rounded-full ${theme === 'modern' ? button : 'bg-gray-200 dark:bg-gray-700'}`}>
                <Sun size={20} />
              </button>
              <button 
                onClick={() => { setTheme('starWars'); setIsMobileMenuOpen(false); }} 
                className={`p-2 rounded-full ${theme === 'starWars' ? button : 'bg-gray-200 dark:bg-gray-700'}`}>
                <Star size={20} />
              </button>
              <button 
                onClick={() => { setTheme('harryPotter'); setIsMobileMenuOpen(false); }} 
                className={`p-2 rounded-full ${theme === 'harryPotter' ? button : 'bg-gray-200 dark:bg-gray-700'}`}>
                <Wand2 size={20} />
              </button>
            </div>
            <div className="flex flex-col space-y-2">
              {[
                { id: 'countdown', label: 'Cuenta Regresiva', icon: <Clock size={18} /> },
                { id: 'itinerario', label: 'Itinerario', icon: <Calendar size={18} /> },
                { id: 'viajeros', label: 'Viajeros', icon: <Users size={18} /> },
                { id: 'fotos', label: 'Fotos', icon: <Upload size={18} /> },
                { id: 'presupuesto', label: 'Presupuesto', icon: <DollarSign size={18} /> }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                    activeTab === item.id ? button : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Navigation - Desktop only */}
      <nav className={`border-b ${border} py-2 hidden md:block`}>
        <div className="container mx-auto overflow-x-auto no-scrollbar">
          <div className="flex justify-center space-x-2 md:space-x-6 px-4">
            {[
              { id: 'countdown', label: 'Cuenta Regresiva', icon: <Clock size={18} /> },
              { id: 'itinerario', label: 'Itinerario', icon: <Calendar size={18} /> },
              { id: 'viajeros', label: 'Viajeros', icon: <Users size={18} /> },
              { id: 'fotos', label: 'Fotos', icon: <Upload size={18} /> },
              { id: 'presupuesto', label: 'Presupuesto', icon: <DollarSign size={18} /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  activeTab === item.id 
                    ? `${button} ${theme === 'harryPotter' ? 'animate-pulse-slow' : ''}` 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Countdown Section */}
        {activeTab === 'countdown' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8 md:mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 md:mb-6 ${header} ${theme === 'harryPotter' ? 'font-hp tracking-wider' : ''}`}>
                {theme === 'harryPotter' ? '¡El Encantamiento Comienza En...' : '¡Cuenta regresiva!'}
              </h2>
              <p className={`text-lg md:text-xl mb-6 md:mb-8 ${text}`}>
                El viaje empieza en Boston el 28 de Mayo, 2025
              </p>
              
              <div className="max-w-5xl mx-auto mb-6 md:mb-8">
                {renderCountdown()}
              </div>
              
              <div className="flex justify-center flex-wrap gap-2 mb-8 md:mb-12">
                {['weeks', 'days', 'detailed'].map(type => (
                  <button
                    key={type}
                    onClick={() => setCountdownType(type)}
                    className={`px-3 sm:px-4 py-2 rounded-full transition-all text-sm sm:text-base ${
                      countdownType === type ? button : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type === 'weeks' ? 'Semanas' : type === 'days' ? 'Días' : 'Detallado'}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-center flex-wrap gap-3 pb-4 overflow-hidden">
                {destinos.map(destino => (
                  <button
                    key={destino.id}
                    onClick={() => setActiveDestination(destino.id)}
                    className={`flex flex-col items-center p-2 sm:p-3 rounded-lg transition-all transform ${
                      activeDestination === destino.id 
                        ? `${card} border-2 ${shadow} scale-105 ${theme === 'harryPotter' ? 'animate-float' : ''}` 
                        : `${card} border hover:scale-105`
                    }`}
                  >
                    <div className="mb-1 sm:mb-2">
                      {React.cloneElement(destino.icono, { 
                        size: 20, 
                        className: activeDestination === destino.id ? accent : text 
                      })}
                    </div>
                    <div className={`text-xs sm:text-sm font-medium ${activeDestination === destino.id ? accent : text}`}>
                      {destino.nombre}
                    </div>
                    <div className="text-xs opacity-70 hidden sm:block">{destino.fecha}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Itinerary Section */}
        {activeTab === 'itinerario' && (
          <Itinerary 
          destinos={destinos}
          card={card}
          shadow={shadow}
          border={border}
          highlight={highlight}
          accent={accent}
          header={header}
          />
        )}

        {/* Travelers Section */}
        {activeTab === 'viajeros' && (
          <div className="animate-fadeIn">
            <h2 className={`text-3xl font-bold text-center mb-8 ${header}`}>
              Los Viajeros
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {viajeros.map((viajero, index) => (
                <div 
                  key={index}
                  className={`relative rounded-xl overflow-hidden ${card} border transition-transform hover:scale-105 ${shadow}`}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={viajero.imagen} 
                      alt={viajero.nombre} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-5">
                    <h3 className={`text-xl font-bold ${header}`}>{viajero.nombre}</h3>
                    <div className={`mb-2 ${accent}`}>{viajero.personaje}</div>
                    <div className="flex justify-between">
                      <span>{viajero.descripcion}</span>
                      <span className="opacity-70">{viajero.casa}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

{/* Photos Section */}
{activeTab === 'fotos' && (
  <div className="animate-fadeIn">
    <h2 className={`text-3xl font-bold text-center mb-8 ${header}`}>
      Nuestras Fotos
    </h2>

    {/* hidden file input */}
    <input
      type="file"
      accept="image/*"
      ref={photoInputRef}
      onChange={handlePhotoUpload}
      className="hidden"
    />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fotos.map((url, idx) => (
        <div
          key={idx}
          className={`rounded-xl overflow-hidden ${card} border ${shadow}`}
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-64"
          >
            {/* center & contain the image */}
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <img
                src={url}
                alt={`Foto ${idx + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </a>
        </div>
      ))}

      {/* Add-photo card */}
      <button
        onClick={handleAddPhotoClick}
        className={`flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed ${border} hover:${highlight} transition-all`}
      >
        <Upload size={32} className={accent} />
        <span className="mt-2">Añadir foto</span>
      </button>
    </div>

    <div className="mt-8 text-center">
      <button
        onClick={handleAddPhotoClick}
        className={`px-6 py-3 rounded-full ${button}`}
      >
        Subir más fotos
      </button>
    </div>
  </div>
)}

        {/* Budget Section */}
{activeTab === 'presupuesto' && (
  <Costs
    card={card}
    border={border}
    highlight={highlight}
    accent={accent}
    header={header}
    shadow={shadow}
  />
)}
      </main>

      {/* Footer */}
      <footer className={`mt-12 py-8 border-t ${border}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`mb-4 ${accent} font-medium`}>El Viaje 2025</p>
          <p className="opacity-60 text-sm">De Boston a Punta Cana</p>
        </div>
      </footer>
      <Chat />
    </div>
  );
}