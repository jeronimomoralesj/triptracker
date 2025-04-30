// data/orlandoParks.ts
import { MapPin, PalmTree, UmbrellaBeach, Star, Coffee, Utensils } from 'lucide-react';

export const orlandoParksData = [
  {
    id: "universal-studios",
    nombre: "Universal Studios Orlando",
    fecha: "10 de Mayo, 2025",
    icono: <PalmTree />,
    descripcion: "Disfruta de las atracciones temáticas de películas y series en Universal Studios, incluyendo The Wizarding World of Harry Potter y muchas más.",
    actividades: [
      "Hagrid's Magical Creatures Motorbike Adventure",
      "Harry Potter and the Escape from Gringotts",
      "Hollywood Rip Ride Rockit",
      "Revenge of the Mummy"
    ],
    restaurants: [
      {
        id: "three-broomsticks",
        name: "The Three Broomsticks",
        cuisine: "Británica",
        price: "$$",
        location: "The Wizarding World of Harry Potter - Hogsmeade",
        imageUrl: "/images/three-broomsticks.jpg", // You'll need to add these images to your project
        menu: [
          {
            name: "Gran Festín",
            description: "Costillas, pollo rostizado, papas y mazorca de maíz",
            price: "$29.99",
            isPopular: true
          },
          {
            name: "Pastel de carne y verduras",
            description: "Pastel tradicional británico con ensalada",
            price: "$19.99"
          },
          {
            name: "Cerveza de mantequilla",
            description: "Bebida tradicional del mundo mágico",
            price: "$7.99",
            isPopular: true
          },
          {
            name: "Pollo rostizado",
            description: "Media porción con papas y verduras",
            price: "$17.99"
          }
        ]
      },
      {
        id: "leaky-cauldron",
        name: "The Leaky Cauldron",
        cuisine: "Británica",
        price: "$$",
        location: "The Wizarding World of Harry Potter - Diagon Alley",
        imageUrl: "/images/leaky-cauldron.jpg",
        menu: [
          {
            name: "Desayuno tradicional",
            description: "Huevos, salchichas, frijoles, tomate y pan tostado",
            price: "$17.99",
            isPopular: true
          },
          {
            name: "Fish and Chips",
            description: "Pescado frito con papas y salsa tártara",
            price: "$18.99",
            isPopular: true
          },
          {
            name: "Toad in the Hole",
            description: "Salchichas en masa de Yorkshire pudding",
            price: "$16.99"
          },
          {
            name: "Pudín de chocolate",
            description: "Con salsa de butterscotch",
            price: "$8.99"
          }
        ]
      }
    ]
  },
  {
    id: "islands-adventure",
    nombre: "Islands of Adventure",
    fecha: "11 de Mayo, 2025",
    icono: <Star />,
    descripcion: "Experimenta aventuras épicas en las islas temáticas, desde Jurassic Park hasta Marvel Super Hero Island.",
    actividades: [
      "The Incredible Hulk Coaster",
      "Jurassic World VelociCoaster",
      "Hagrid's Magical Creatures Motorbike Adventure",
      "The Amazing Adventures of Spider-Man"
    ],
    restaurants: [
      {
        id: "mythos",
        name: "Mythos Restaurant",
        cuisine: "Mediterránea e Internacional",
        price: "$$$",
        location: "The Lost Continent",
        imageUrl: "/images/mythos.jpg",
        menu: [
          {
            name: "Risotto de champiñones",
            description: "Con queso parmesano y aceite de trufa",
            price: "$24.99",
            isPopular: true
          },
          {
            name: "Pad Thai de camarones",
            description: "Fideos tradicionales tailandeses con camarones y verduras",
            price: "$27.99"
          },
          {
            name: "Filete de salmón",
            description: "Con puré de papas y vegetales de temporada",
            price: "$29.99",
            isPopular: true
          },
          {
            name: "Crème Brûlée",
            description: "Postre francés clásico",
            price: "$10.99"
          }
        ]
      },
      {
        id: "thunder-falls",
        name: "Thunder Falls Terrace",
        cuisine: "Americana",
        price: "$$",
        location: "Jurassic Park",
        imageUrl: "/images/thunder-falls.jpg",
        menu: [
          {
            name: "Costillas BBQ",
            description: "Costillas de cerdo con salsa barbacoa y papas fritas",
            price: "$19.99",
            isPopular: true
          },
          {
            name: "Pollo a la rotisserie",
            description: "Pollo entero con papas y elote",
            price: "$18.99"
          },
          {
            name: "Ensalada César con pollo",
            description: "Lechuga romana, crutones, parmesano y pollo a la parrilla",
            price: "$15.99"
          },
          {
            name: "Turkey Leg",
            description: "Pierna de pavo ahumada",
            price: "$16.99",
            isPopular: true
          }
        ]
      }
    ]
  },
  {
    id: "magic-kingdom",
    nombre: "Magic Kingdom - Disney World",
    fecha: "12-13 de Mayo, 2025",
    icono: <Star />,
    descripcion: "El parque mágico original de Disney con Cinderella's Castle y atracciones clásicas para toda la familia.",
    actividades: [
      "Space Mountain",
      "Pirates of the Caribbean",
      "Haunted Mansion",
      "Seven Dwarfs Mine Train",
      "Disney Enchantment Fireworks"
    ],
    restaurants: [
      {
        id: "be-our-guest",
        name: "Be Our Guest Restaurant",
        cuisine: "Francesa",
        price: "$$$",
        location: "Fantasyland",
        imageUrl: "/images/be-our-guest.jpg",
        menu: [
          {
            name: "Filet Mignon",
            description: "Con puré de papas y verduras asadas",
            price: "$42.99",
            isPopular: true
          },
          {
            name: "Pollo a la Provenzal",
            description: "Con hierbas, vegetales y puré de papas",
            price: "$36.99"
          },
          {
            name: "The Grey Stuff",
            description: "Mousse de chocolate sobre galleta",
            price: "$9.99",
            isPopular: true
          },
          {
            name: "Sopa de cebolla francesa",
            description: "Con queso gruyere gratinado",
            price: "$12.99"
          }
        ]
      },
      {
        id: "cinderellas-royal-table",
        name: "Cinderella's Royal Table",
        cuisine: "Americana Gourmet",
        price: "$$$$",
        location: "Cinderella Castle",
        imageUrl: "/images/cinderellas-table.jpg",
        menu: [
          {
            name: "Solomillo de cerdo",
            description: "Con puré de patatas dulces y vegetales",
            price: "$45.99"
          },
          {
            name: "Pescado del día",
            description: "Con risotto de limón y espárragos",
            price: "$48.99",
            isPopular: true
          },
          {
            name: "The Clock Strikes Twelve",
            description: "Mousse de chocolate con centro de fresa",
            price: "$16.99",
            isPopular: true
          },
          {
            name: "Sopa de calabaza",
            description: "Con crema y especias",
            price: "$13.99"
          }
        ]
      }
    ]
  },
  {
    id: "epcot",
    nombre: "EPCOT",
    fecha: "14 de Mayo, 2025",
    icono: <UmbrellaBeach />,
    descripcion: "Explora el futuro y culturas de todo el mundo en el parque temático EPCOT, conocido por sus pabellones internacionales.",
    actividades: [
      "Soarin' Around the World",
      "Test Track",
      "Remy's Ratatouille Adventure",
      "Spaceship Earth",
      "World Showcase Exploration"
    ],
    restaurants: [
      {
        id: "le-cellier",
        name: "Le Cellier Steakhouse",
        cuisine: "Canadiense/Carnes",
        price: "$$$$",
        location: "Canada Pavilion",
        imageUrl: "/images/le-cellier.jpg",
        menu: [
          {
            name: "Canadian Cheddar Cheese Soup",
            description: "Con cerveza Moosehead y tocino ahumado",
            price: "$14.99",
            isPopular: true
          },
          {
            name: "Filet Mignon",
            description: "Con papas gratinadas y setas silvestres",
            price: "$59.99",
            isPopular: true
          },
          {
            name: "Poutine",
            description: "Papas fritas con queso en grano y salsa gravy",
            price: "$16.99"
          },
          {
            name: "Maple Crème Brûlée",
            description: "Con galletas de maple",
            price: "$12.99"
          }
        ]
      },
      {
        id: "takumi-tei",
        name: "Takumi-Tei",
        cuisine: "Japonesa Gourmet",
        price: "$$$$",
        location: "Japan Pavilion",
        imageUrl: "/images/takumi-tei.jpg",
        menu: [
          {
            name: "Omakase Tasting Menu",
            description: "Menú degustación del chef de varios tiempos",
            price: "$150.00",
            isPopular: true
          },
          {
            name: "Wagyu A5",
            description: "Corte premium de carne japonesa con verduras",
            price: "$120.00",
            isPopular: true
          },
          {
            name: "Tempura de vegetales",
            description: "Vegetales de temporada en tempura ligera",
            price: "$22.00"
          },
          {
            name: "Sushi Platter",
            description: "Selección del chef de nigiri y rollos premium",
            price: "$65.00"
          }
        ]
      }
    ]
  },
  {
    id: "animal-kingdom",
    nombre: "Disney's Animal Kingdom",
    fecha: "15 de Mayo, 2025",
    icono: <PalmTree />,
    descripcion: "Aventúrate en este único parque temático centrado en la naturaleza y los animales, con atracciones inspiradas en África, Asia y más.",
    actividades: [
      "Avatar Flight of Passage",
      "Kilimanjaro Safaris",
      "Expedition Everest",
      "Festival of the Lion King Show",
      "Dinosaur"
    ],
    restaurants: [
      {
        id: "tiffins",
        name: "Tiffins Restaurant",
        cuisine: "Internacional/Fusión",
        price: "$$$",
        location: "Discovery Island",
        imageUrl: "/images/tiffins.jpg",
        menu: [
          {
            name: "Whole-fried Sustainable Fish",
            description: "Con salsa fermentada de tomate y vegetales de temporada",
            price: "$42.00",
            isPopular: true
          },
          {
            name: "Berbere-spiced Lamb Chop",
            description: "Con puré de boniato y vegetales africanos",
            price: "$46.00"
          },
          {
            name: "South American Chocolate Ganache",
            description: "Con sorbete de maracuyá",
            price: "$14.00",
            isPopular: true
          },
          {
            name: "Archaeologist Salad",
            description: "Mezcla de vegetales exóticos con vinagreta de mango",
            price: "$16.00"
          }
        ]
      },
      {
        id: "yak-and-yeti",
        name: "Yak & Yeti Restaurant",
        cuisine: "Pan-Asiática",
        price: "$$",
        location: "Asia",
        imageUrl: "/images/yak-and-yeti.jpg",
        menu: [
          {
            name: "Ahi Tuna Nachos",
            description: "Atún fresco, guacamole y wonton crisps",
            price: "$19.99",
            isPopular: true
          },
          {
            name: "Lo Mein con Camarones",
            description: "Fideos con verduras y camarones en salsa hoisin",
            price: "$24.99"
          },
          {
            name: "Pollo Tikka Masala",
            description: "Pollo en salsa cremosa de tomate y especias con arroz basmati",
            price: "$26.99",
            isPopular: true
          },
          {
            name: "Mango Pie",
            description: "Tarta cremosa de mango con cobertura de crema batida",
            price: "$10.99"
          }
        ]
      }
    ]
  }
];