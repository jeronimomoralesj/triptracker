"use client";

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Star, Palmtree, GraduationCap, Sparkles, Car, Wand, Home } from 'lucide-react';

export default function CuentaRegresivaViaje() {
  // Estados generales
  const [tipoCuentaRegresiva, setTipoCuentaRegresiva] = useState('dias');
  const [cuentaRegresiva, setCuentaRegresiva] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0, semanas: 0 });
  const [ubicacionActiva, setUbicacionActiva] = useState<'boston' | 'graduacion' | 'hollywoodStudios' | 'islandsOfAdventure' | 'universalStudios' | 'miami' | 'puntaCana'>('boston');
  const [hoverDestino, setHoverDestino] = useState(null);
  const [mostrarHechizo, setMostrarHechizo] = useState(false);

  // Estados para la selección de casa
  const [casaSeleccionada, setCasaSeleccionada] = useState('Gryffindor');
  const [mostrarSelectorCasa, setMostrarSelectorCasa] = useState(false);

  // Arreglo de casas con sus respectivos colores
  const casas = [
    { nombre: 'Gryffindor', color: 'from-red-800 to-yellow-600', botonColor: 'bg-red-700' },
    { nombre: 'Slytherin', color: 'from-green-800 to-emerald-500', botonColor: 'bg-green-700' },
    { nombre: 'Hufflepuff', color: 'from-yellow-700 to-amber-500', botonColor: 'bg-yellow-700' },
    { nombre: 'Ravenclaw', color: 'from-blue-800 to-blue-400', botonColor: 'bg-blue-700' }
  ];

  // Fechas del viaje
  const fechasViaje = {
    boston: new Date('May 28, 2025 00:00:00'),
    graduacion: new Date('May 29, 2025 10:00:00'),
    hollywoodStudios: new Date('June 1, 2025 08:00:00'),
    islandsOfAdventure: new Date('June 2, 2025 08:00:00'),
    universalStudios: new Date('June 3, 2025 08:00:00'),
    miami: new Date('June 4, 2025 08:00:00'),
    puntaCana: new Date('June 7, 2025 08:00:00')
  };

  // Actualizar cuenta regresiva cada segundo según la ubicación activa
  useEffect(() => {
    const temporizador = setInterval(() => {
      const ahora = new Date();
      const diferencia = fechasViaje[ubicacionActiva].getTime() - ahora.getTime();

      if (diferencia <= 0) {
        clearInterval(temporizador);
        setCuentaRegresiva({ dias: 0, horas: 0, minutos: 0, segundos: 0, semanas: 0 });
        return;
      }

      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
      const semanas = Math.floor(dias / 7);

      setCuentaRegresiva({ dias, horas, minutos, segundos, semanas });
    }, 1000);

    return () => clearInterval(temporizador);
  }, [ubicacionActiva, fechasViaje]);

  // Mostrar hechizo aleatoriamente cada 10 segundos
  useEffect(() => {
    const intervaloHechizo = setInterval(() => {
      setMostrarHechizo(true);
      setTimeout(() => setMostrarHechizo(false), 2000);
    }, 10000);

    return () => clearInterval(intervaloHechizo);
  }, []);

  // Arreglo de destinos y atracciones
  const destinos = [
    { 
      id: 'boston', 
      nombre: 'Boston', 
      fecha: '28 de Mayo, 2025',
      icono: <MapPin className="text-amber-300" />,
      descripcion: '¡Iniciando en Boston!',
      hechizo: 'Portus',
      casaHogwarts: 'Gryffindor',
      colorCasa: 'from-red-800 to-yellow-600',
      actividades: [
        'Visitar el Faneuil Hall', 'Recorrer la Freedom Trail', 'Cenar en Quincy Market', 'Pasear por Boston Common'
      ]
    },
    { 
      id: 'graduacion', 
      nombre: 'Graduación MIT', 
      fecha: '29 de Mayo, 2025',
      icono: <GraduationCap className="text-amber-300" />,
      descripcion: 'Graduación de Mateo de MIT',
      hechizo: 'Wingardium Leviosa',
      casaHogwarts: 'Ravenclaw',
      colorCasa: 'from-blue-800 to-blue-400',
      actividades: [
        'Ceremonia de graduación', 'Fotografías con birrete', 'Celebración familiar', 'Cena de gala'
      ]
    },
    { 
      id: 'hollywoodStudios', 
      nombre: 'Disney Hollywood Studios', 
      fecha: '1 de Junio, 2025',
      icono: <Star className="text-amber-300" />,
      descripcion: 'Disney Hollywood Studios',
      hechizo: 'Lumos Maxima',
      casaHogwarts: 'Hufflepuff',
      colorCasa: 'from-yellow-700 to-amber-500',
      actividades: [
        'Torre del Terror', 'Star Wars: Galaxy\'s Edge', 'Toy Story Land', 'Rock \'n\' Roller Coaster'
      ]
    },
    { 
      id: 'islandsOfAdventure', 
      nombre: 'Islas de la Aventura', 
      fecha: '2 de Junio, 2025',
      icono: <Sparkles className="text-amber-300" />,
      descripcion: 'La magia y la aventura nos esperan en Islas de la Aventura',
      hechizo: 'Expecto Patronum',
      casaHogwarts: 'Gryffindor',
      colorCasa: 'from-red-800 to-yellow-600',
      actividades: [
        'El Mundo Mágico de Harry Potter - Hogsmeade', 'Aventura del Río de Jurassic Park', 'Montaña Rusa de Hulk', 'Aventura en Motocicleta de Hagrid'
      ]
    },
    { 
      id: 'universalStudios', 
      nombre: 'Universal Studios', 
      fecha: '3 de Junio, 2025',
      icono: <Sparkles className="text-amber-300" />,
      descripcion: 'Universal Studios!',
      hechizo: 'Alohomora',
      casaHogwarts: 'Slytherin',
      colorCasa: 'from-green-800 to-emerald-500',
      actividades: [
        'El Mundo Mágico de Harry Potter - Callejón Diagon', 'Hollywood Rip Ride Rockit', 'La Venganza de la Momia', 'Transformers: The Ride 3D'
      ]
    },
    { 
      id: 'miami', 
      nombre: 'Miami', 
      fecha: '4 de Junio, 2025',
      icono: <Car className="text-amber-300" />,
      descripcion: '¡Viaje por carretera a Miami!',
      hechizo: 'Aqua Eructo',
      casaHogwarts: 'Ravenclaw',
      colorCasa: 'from-blue-800 to-blue-400',
      actividades: [
        'South Beach', 'Distrito Art Deco', 'Murales de Wynwood', 'Pequeña Habana'
      ]
    },
    { 
      id: 'puntaCana', 
      nombre: 'Punta Cana', 
      fecha: '7 de Junio, 2025',
      icono: <Palmtree className="text-amber-300" />,
      descripcion: 'Punta Cana',
      hechizo: 'Aguamenti',
      casaHogwarts: 'Hufflepuff',
      colorCasa: 'from-yellow-700 to-amber-500',
      actividades: [
        'Playa Bávaro', 'Hoyo Azul', 'Isla Saona', 'Parque Scape'
      ]
    }
  ];

  // Arreglo de viajeros (sección "viajeros")
  const viajeros = [
    {
      nombre: 'Jerónimo',
      personaje: 'Spiderman',
      descripcion: 'El crack',
      casa: 'Spiderman',
      imagen:"https://wallpapers.com/images/hd/spiderman-background-oycfyb1ksermw921.jpg"
    },
    {
      nombre: 'Sofía',
      personaje: 'Baby Groot',
      descripcion: 'Fiofilda',
      casa: 'Guardianes de la Galaxia',
      imagen:"https://media.vanityfair.com/photos/590f7d985caad73f2ce0cc98/master/pass/bb-groot.jpg"
    },
    {
      nombre: 'Juan',
      personaje: 'Luke Skywalker',
      descripcion: 'Juancho',
      casa: 'Rebels',
      imagen: "https://static1.colliderimages.com/wordpress/wp-content/uploads/2025/04/img_0807.jpeg"
    }
  ];

  const destino = destinos.find(d => d.id === ubicacionActiva);

  // Función para obtener la visualización de la cuenta regresiva
  const obtenerVisualizacionCuentaRegresiva = () => {
    switch(tipoCuentaRegresiva) {
      case 'semanas':
        return (
          <div className="flex items-end">
            <span className="text-6xl md:text-8xl font-bold animate-pulse">{cuentaRegresiva.semanas}</span>
            <span className="text-2xl md:text-4xl ml-2 mb-1">semanas</span>
          </div>
        );
      case 'dias':
        return (
          <div className="flex items-end">
            <span className="text-6xl md:text-8xl font-bold animate-pulse">{cuentaRegresiva.dias}</span>
            <span className="text-2xl md:text-4xl ml-2 mb-1">días</span>
          </div>
        );
      case 'completo':
        return (
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col">
              <span className="text-4xl md:text-6xl font-bold animate-pulse">{cuentaRegresiva.dias}</span>
              <span className="text-lg">Días</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-6xl font-bold animate-pulse">{cuentaRegresiva.horas}</span>
              <span className="text-lg">Horas</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-6xl font-bold animate-pulse">{cuentaRegresiva.minutos}</span>
              <span className="text-lg">Minutos</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-6xl font-bold animate-pulse">{cuentaRegresiva.segundos}</span>
              <span className="text-lg">Segundos</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-end">
            <span className="text-6xl md:text-8xl font-bold animate-pulse">{cuentaRegresiva.dias}</span>
            <span className="text-2xl md:text-4xl ml-2 mb-1">días</span>
          </div>
        );
    }
  };

  return (
    // Fondo dinámico según la casa seleccionada
    <div className={`min-h-screen text-amber-50 font-serif bg-gradient-to-r ${
      casaSeleccionada === 'Gryffindor'
        ? 'from-red-800 to-yellow-600'
        : casaSeleccionada === 'Slytherin'
        ? 'from-green-800 to-emerald-500'
        : casaSeleccionada === 'Hufflepuff'
        ? 'from-yellow-700 to-amber-500'
        : 'from-blue-800 to-blue-400'
    }`}>
      {/* Efectos mágicos de fondo */}
      <div className="fixed inset-0 z-0 opacity-30 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-amber-200 rounded-full top-1/4 left-1/5 animate-float1"></div>
        <div className="absolute w-2 h-2 bg-amber-300 rounded-full top-1/3 left-1/2 animate-float2"></div>
        <div className="absolute w-1 h-1 bg-amber-100 rounded-full top-1/2 left-1/3 animate-float3"></div>
        <div className="absolute w-2 h-2 bg-amber-200 rounded-full top-2/3 left-2/3 animate-float1"></div>
        <div className="absolute w-1 h-1 bg-amber-300 rounded-full bottom-1/4 right-1/4 animate-float2"></div>
        <div className="absolute w-1 h-1 bg-amber-100 rounded-full bottom-1/3 right-1/2 animate-float3"></div>
        <div className="absolute w-2 h-2 bg-amber-200 rounded-full bottom-1/2 right-1/3 animate-float1"></div>
        <div className="absolute w-1 h-1 bg-amber-300 rounded-full bottom-2/3 right-2/3 animate-float2"></div>
        
        {/* Estrellas aleatorias */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-amber-100 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 7}s`
            }}
          ></div>
        ))}
        
        {/* Snitch dorada */}
        <div className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-snitch" style={{ filter: 'blur(1px)' }}>
          <div className="absolute w-8 h-1 bg-yellow-200 rounded-full -left-6 top-1/2 transform -translate-y-1/2 animate-wingleft"></div>
          <div className="absolute w-8 h-1 bg-yellow-200 rounded-full -right-6 top-1/2 transform -translate-y-1/2 animate-wingright"></div>
        </div>
      </div>
      
      {/* Efecto de hechizo */}
      {mostrarHechizo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-600 animate-spellcast">
            ¡{destinos[Math.floor(Math.random() * destinos.length)].hechizo}!
          </div>
        </div>
      )}

      {/* Cabecera con elementos mágicos */}
      <header className="relative py-12 px-4 overflow-hidden border-b-2 border-amber-900/50">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-amber-300 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-amber-600 animate-pulse"></div>
          <div className="absolute bottom-10 left-1/3 w-12 h-12 rounded-full bg-amber-400 animate-pulse"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-700 tracking-wider animate-shimmer">
            Cuenta Regresiva PASEOOOO
          </h1>
          
          <div className="relative flex justify-center mb-6">
            <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent absolute -top-2"></div>
            <div className="relative">
              <Wand size={32} className="text-amber-400 inline-block mr-2 animate-wandwave" />
              <span className="italic text-xl text-amber-200">Ya casi llegamos</span>
              <Wand size={32} className="text-amber-400 inline-block ml-2 animate-wandwave2" />
            </div>
            <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent absolute -bottom-2"></div>
          </div>
          
          <p className="text-xl text-amber-200">Boston • Orlando • Miami • Punta Cana</p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Sección de cuenta regresiva */}
        <section className="mb-16 bg-gradient-to-r from-amber-900/20 to-amber-800/10 p-8 rounded-xl backdrop-blur-sm border border-amber-900/30 shadow-2xl relative overflow-hidden transform hover:scale-102 transition-all duration-500">
          <div className="absolute inset-0 bg-[url('https://cdnjs.cloudflare.com/ajax/libs/parchment/1.0/parchment.png')] opacity-5"></div>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300/0 via-amber-500/50 to-amber-300/0"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300/0 via-amber-500/50 to-amber-300/0"></div>
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-300/0 via-amber-500/50 to-amber-300/0"></div>
          <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-amber-300/0 via-amber-500/50 to-amber-300/0"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between relative">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2 text-amber-300">
                <Clock size={24} className="text-amber-500" />
                Cuenta Regresiva a {destino.nombre}
              </h2>
              <p className="text-amber-200 flex items-center gap-2 mb-4">
                <Calendar size={18} />
                {destino.fecha}
              </p>
              <div className="p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
                <p className="text-lg italic mb-2">{destino.descripcion}</p>
                <div className="flex items-center text-sm">
                  <span className="text-amber-400 mr-2">Hechizo recomendado:</span>
                  <span className="font-bold">{destino.hechizo}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center bg-amber-900/30 p-6 rounded-lg border border-amber-800/50 shadow-inner animate-glow">
              {obtenerVisualizacionCuentaRegresiva()}
              
              <div className="mt-6 flex gap-2">
                <button 
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 hover:shadow-glow ${tipoCuentaRegresiva === 'semanas' ? 'bg-gradient-to-r from-amber-700 to-amber-500 text-amber-100 font-bold' : 'bg-amber-900/50 text-amber-200 hover:bg-amber-800/50'}`}
                  onClick={() => setTipoCuentaRegresiva('semanas')}
                >
                  Semanas
                </button>
                <button 
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 hover:shadow-glow ${tipoCuentaRegresiva === 'dias' ? 'bg-gradient-to-r from-amber-700 to-amber-500 text-amber-100 font-bold' : 'bg-amber-900/50 text-amber-200 hover:bg-amber-800/50'}`}
                  onClick={() => setTipoCuentaRegresiva('dias')}
                >
                  Días
                </button>
                <button 
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 hover:shadow-glow ${tipoCuentaRegresiva === 'completo' ? 'bg-gradient-to-r from-amber-700 to-amber-500 text-amber-100 font-bold' : 'bg-amber-900/50 text-amber-200 hover:bg-amber-800/50'}`}
                  onClick={() => setTipoCuentaRegresiva('completo')}
                >
                  Cuenta Completa
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de ruta de viaje */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-600 inline-block">Nuestro Viaje </h2>
            <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2"></div>
          </div>
          
          <div className="relative">
            {/* Línea de ruta de viaje con diseño varita mágica */}
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-800 to-amber-500 hidden md:block"></div>
            <div className="absolute left-4 top-0 bottom-0 w-1 opacity-75 animate-travelpath hidden md:block" style={{background: 'linear-gradient(to bottom, transparent, #f59e0b, transparent)', backgroundSize: '100% 200%'}}></div>
            
            {/* Destinos */}
            <div className="space-y-12">
              {destinos.map((dest) => (
                <div 
                  key={dest.id} 
                  className="relative"
                  onMouseEnter={() => setHoverDestino(dest.id)}
                  onMouseLeave={() => setHoverDestino(null)}
                >
                  <button 
                    onClick={() => setUbicacionActiva(dest.id)}
                    className={`block w-full text-left transition-all duration-500 
                      ${ubicacionActiva === dest.id ? 
                        `bg-gradient-to-r ${dest.casaHogwarts === 'Gryffindor' ? 'from-red-900/80' : 
                          dest.casaHogwarts === 'Slytherin' ? 'from-green-900/80' : 
                          dest.casaHogwarts === 'Hufflepuff' ? 'from-yellow-900/80' : 
                          'from-blue-900/80'} to-transparent` : 
                        'bg-[#1A202C]/80 hover:bg-[#2D3748]/80'} 
                      rounded-xl p-6 backdrop-blur-sm border 
                      ${ubicacionActiva === dest.id ? 
                        `border-${dest.casaHogwarts === 'Gryffindor' ? 'red' : 
                          dest.casaHogwarts === 'Slytherin' ? 'green' : 
                          dest.casaHogwarts === 'Hufflepuff' ? 'yellow' : 
                          'blue'}-500/50` : 
                        'border-amber-900/30'} 
                      ${ubicacionActiva === dest.id ? 'scale-105' : ''}`}
                  >
                    <div className="md:ml-8 flex flex-col md:flex-row md:items-center gap-4">
                      {/* Icono con número y animación */}
                      <div className={`flex items-center justify-center w-14 h-14 rounded-full 
                        ${ubicacionActiva === dest.id ? 
                          `bg-gradient-to-br ${dest.colorCasa}` : 
                          'bg-amber-900/80'} 
                        text-amber-100 transform transition-transform duration-700 
                        ${ubicacionActiva === dest.id || hoverDestino === dest.id ? 'animate-iconpulse' : ''}`}>
                        {dest.icono}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold 
                          ${ubicacionActiva === dest.id ? 'text-amber-300' : 'text-amber-100'}`}>
                          {dest.nombre}
                        </h3>
                        <p className="text-amber-200/80 text-sm mb-2">{dest.fecha}</p>
                        
                        <div className={`flex items-center gap-2 mb-2 ${ubicacionActiva === dest.id ? 'animate-fadein' : ''}`}>
                          <span className={`px-3 py-1 text-xs rounded-full 
                            ${dest.casaHogwarts === 'Gryffindor' ? 'bg-red-900/50 text-red-200' : 
                              dest.casaHogwarts === 'Slytherin' ? 'bg-green-900/50 text-green-200' : 
                              dest.casaHogwarts === 'Hufflepuff' ? 'bg-yellow-900/50 text-yellow-200' : 
                              'bg-blue-900/50 text-blue-200'}`}>
                            Casa {dest.casaHogwarts}
                          </span>
                        </div>
                        
                        <p className="italic">{dest.descripcion}</p>
                        
                        {/* Actividades con indicador visual claro de interactividad */}
                        <div className={`mt-4 ${ubicacionActiva !== dest.id ? 'hidden' : 'animate-fadein'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-amber-300 font-bold">Actividades:</h4>
                            <div className="text-xs text-amber-200 bg-amber-900/50 px-2 py-1 rounded-full">Toca para expandir</div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {dest.actividades.map((actividad, i) => (
                              <div 
                                key={i} 
                                className="flex items-center gap-2 bg-amber-900/40 px-4 py-3 rounded-lg border border-amber-800/30 hover:border-amber-600/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
                              >
                                <Wand size={16} className="text-amber-400" />
                                <span>{actividad}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Indicador visual claro para destinos no activos */}
                        {ubicacionActiva !== dest.id && (
                          <div className="mt-3 text-amber-400/70 flex items-center gap-1 text-sm animate-pulse">
                            <span>Toca para ver actividades mágicas</span>
                            <Wand size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {/* Efecto de varita mágica al hacer hover */}
                  {(ubicacionActiva === dest.id || hoverDestino === dest.id) && (
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-6 h-6">
                      <div className="animate-wandtip absolute w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-300/50"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Sección de viajeros */}
        <section className="mb-16">
  <div className="text-center mb-8">
    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-600 inline-block">
      El Equipo
    </h2>
    <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2"></div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {viajeros.map((viajero, index) => (
      <div
        key={index}
        className="bg-[#0D1117] rounded-xl p-6 border border-amber-800/50 shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-amber-500 bg-gray-300 animate-avatar-glow">
          <img
            src={viajero.imagen}
            alt={viajero.nombre}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-bold text-center mb-1 text-amber-300">
          {viajero.nombre}
        </h3>
        <p className="text-center text-amber-400 mb-4 italic">
          {viajero.personaje}
        </p>
        <p className="text-center mb-4">{viajero.descripcion}</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs px-3 py-1 rounded-full bg-red-900/50 text-red-200 border border-red-800/30">
            {viajero.casa}
          </span>
        </div>
        
      </div>
    ))}
  </div>
</section>

        
        {/* Sección de Calendario Mágico */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-600 inline-block">Calendario Merodeador</h2>
            <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2"></div>
          </div>
          
          <div className="bg-[#0D1117]/90 border border-amber-900/30 rounded-xl p-6 shadow-lg">
            <div className="flex flex-wrap gap-4 justify-center">
              {destinos.map((dest) => {
                const fechaEvento = new Date(dest.fecha.split(', ')[1]);
                const mesActual = new Date().getMonth();
                const mesEvento = fechaEvento.getMonth();
                const diferenciaMeses = (mesEvento - mesActual + 12) % 12;
                
                return (
                  <div 
                    key={dest.id}
                    className={`p-4 border ${ubicacionActiva === dest.id ? 'border-amber-500/70' : 'border-amber-900/30'} rounded-lg w-full md:w-64 cursor-pointer transition-all duration-500 hover:shadow-amber-600/20 hover:border-amber-600/50 flex flex-col items-center`}
                    onClick={() => setUbicacionActiva(dest.id)}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${ubicacionActiva === dest.id ? 'bg-amber-600' : 'bg-amber-900/50'}`}>
                      {dest.icono}
                    </div>
                    
                    <h4 className="font-bold text-center mb-1">{dest.nombre}</h4>
                    <p className="text-amber-200 text-sm mb-3 text-center">{dest.fecha}</p>
                    
                    <div className="w-full bg-amber-900/20 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                        style={{width: `${Math.max(5, 100 - (diferenciaMeses * 20))}%`}}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Sección de Mapa Merodeador */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-600 inline-block">Mapa del Merodeador</h2>
            <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2"></div>
          </div>
          
          <div className="bg-[url('https://cdnjs.cloudflare.com/ajax/libs/parchment/1.0/parchment.png')] bg-cover bg-center border-8 border-amber-900/50 rounded-xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0D1117]/80"></div>
            
            <div className="relative">
              <div className="text-center mb-4">
                <p className="italic text-amber-300 text-lg">Juro solemnemente que mis intenciones no son buenas</p>
              </div>
              
              <div className="relative h-64 md:h-96 border border-amber-700/30 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-map-reveal">
                    <img 
                      src={`https://i.pinimg.com/474x/34/93/16/349316d1aea192f2d1db5ce15d0ddc1e.jpg`} 
                      alt="Mapa de viaje" 
                      className="w-full h-full object-cover opacity-50" 
                    />
                  </div>
                  
                  <div className="absolute inset-0">
                    {destinos.map((dest, index) => {
                      const posX = 10 + (index * (80 / (destinos.length - 1)));
                      return (
                        <div 
                          key={dest.id}
                          className={`absolute cursor-pointer transition-all duration-500 ${ubicacionActiva === dest.id ? 'scale-125' : 'scale-100'}`}
                          style={{
                            left: `${posX}%`,
                            top: `${30 + Math.sin(index) * 20}%`,
                          }}
                          onClick={() => setUbicacionActiva(dest.id)}
                        >
                          <div className={`w-3 h-3 rounded-full ${ubicacionActiva === dest.id ? 'bg-amber-400' : 'bg-amber-600/70'} animate-pingpulse`}></div>
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <span className={`text-xs ${ubicacionActiva === dest.id ? 'text-amber-300 font-bold' : 'text-amber-200/70'}`}>
                              {dest.nombre}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Líneas conectando los destinos */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#b45309" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
                        </linearGradient>
                      </defs>
                      
                      {destinos.slice(0, -1).map((dest, index) => {
                        const startX = 10 + (index * (80 / (destinos.length - 1)));
                        const startY = 30 + Math.sin(index) * 20;
                        const endX = 10 + ((index + 1) * (80 / (destinos.length - 1)));
                        const endY = 30 + Math.sin(index + 1) * 20;
                        
                        return (
                          <path 
                            key={`path-${index}`}
                            d={`M${startX}% ${startY}% L${endX}% ${endY}%`}
                            stroke="url(#pathGradient)"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            fill="none"
                            className="animate-dashdraw"
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <p className="italic text-amber-300/70 text-sm">Toca un punto en el mapa para ver más detalles</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    
      
      {/* Botón flotante para abrir el selector de casa */}
      <button 
        onClick={() => setMostrarSelectorCasa(true)}
        className="fixed bottom-4 right-4 z-50 p-4 rounded-full bg-amber-500 hover:bg-amber-400 transition-all duration-300 shadow-lg"
      >
        <Home size={24} className="text-white" />
      </button>
      
      {/* Modal para seleccionar la casa */}
      {mostrarSelectorCasa && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <div className="bg-[#0A0D12] p-4 rounded-lg shadow-lg border border-amber-900/50">
            <h3 className="text-lg mb-2">Elige tu casa</h3>
            <div className="flex gap-2">
              {casas.map((casa) => (
                <button 
                  key={casa.nombre} 
                  onClick={() => { setCasaSeleccionada(casa.nombre); setMostrarSelectorCasa(false); }}
                  className={`px-4 py-2 rounded-full text-white font-bold ${casa.botonColor} hover:opacity-80 transition-all duration-300`}
                >
                  {casa.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Estilos globales para animaciones */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.2); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0) scale(0.8); }
          50% { transform: translateY(-15px) scale(1); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0) scale(1.1); }
          50% { transform: translateY(-8px) scale(0.9); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        
        @keyframes snitch {
          0%, 100% { transform: translate(10%, 20%); }
          25% { transform: translate(80%, 30%); }
          50% { transform: translate(60%, 70%); }
          75% { transform: translate(30%, 50%); }
        }
        
        @keyframes wingleft {
          0%, 100% { transform: rotate(-10deg) translateY(-50%); }
          50% { transform: rotate(-30deg) translateY(-50%); }
        }
        
        @keyframes wingright {
          0%, 100% { transform: rotate(10deg) translateY(-50%); }
          50% { transform: rotate(30deg) translateY(-50%); }
        }
        
        @keyframes spellcast {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes wandwave {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes wandwave2 {
          0%, 100% { transform: rotate(5deg); }
          50% { transform: rotate(-5deg); }
        }
        
        @keyframes iconpulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes fadein {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes travelpath {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
        
        @keyframes wandtip {
          0%, 100% { box-shadow: 0 0 5px 2px rgba(251, 191, 36, 0.5); }
          50% { box-shadow: 0 0 15px 5px rgba(251, 191, 36, 0.8); }
        }
        
        @keyframes avatar-glow {
          0%, 100% { box-shadow: 0 0 5px 2px rgba(251, 191, 36, 0.3); }
          50% { box-shadow: 0 0 15px 5px rgba(251, 191, 36, 0.5); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px 1px rgba(251, 191, 36, 0.2); }
          50% { box-shadow: 0 0 10px 3px rgba(251, 191, 36, 0.4); }
        }
        
        @keyframes pingpulse {
          0% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(0.8); opacity: 0.3; }
        }
        
        @keyframes map-reveal {
          0% { filter: blur(10px); opacity: 0.2; }
          100% { filter: blur(0); opacity: 0.5; }
        }
        
        @keyframes dashdraw {
          to { stroke-dashoffset: -20; }
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        
        .animate-float1 {
          animation: float1 5s ease-in-out infinite;
        }
        
        .animate-float2 {
          animation: float2 7s ease-in-out infinite;
        }
        
        .animate-float3 {
          animation: float3 6s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .animate-snitch {
          animation: snitch 20s ease-in-out infinite;
        }
        
        .animate-wingleft {
          animation: wingleft 0.2s ease-in-out infinite;
        }
        
        .animate-wingright {
          animation: wingright 0.2s ease-in-out infinite;
        }
        
        .animate-spellcast {
          animation: spellcast 2s ease-in-out forwards;
        }
        
        .animate-wandwave {
          animation: wandwave 3s ease-in-out infinite;
        }
        
        .animate-wandwave2 {
          animation: wandwave2 3s ease-in-out infinite;
        }
        
        .animate-iconpulse {
          animation: iconpulse 2s ease-in-out infinite;
        }
        
        .animate-fadein {
          animation: fadein 0.5s ease-out forwards;
        }
        
        .animate-travelpath {
          animation: travelpath 5s linear infinite;
        }
        
        .animate-wandtip {
          animation: wandtip 1.5s ease-in-out infinite;
        }
        
        .animate-avatar-glow {
          animation: avatar-glow 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animate-pingpulse {
          animation: pingpulse 3s ease-in-out infinite;
        }
        
        .animate-map-reveal {
          animation: map-reveal 2s ease-out forwards;
        }
        
        .animate-dashdraw {
          animation: dashdraw 30s linear infinite;
        }
        
        .perspective {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .group:hover .card-flip {
          transform: rotateY(180deg);
        }
        
        .shadow-glow {
          box-shadow: 0 0 10px 2px rgba(251, 191, 36, 0.3);
        }
        
        .hover\:shadow-glow:hover {
          box-shadow: 0 0 15px 5px rgba(251, 191, 36, 0.5);
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .hover\:-rotate-y-180:hover {
          transform: rotateY(-180deg);
        }
      `}</style>
    </div>
  );
}
