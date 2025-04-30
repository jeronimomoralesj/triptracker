'use client';

import React from 'react';

type Destination = {
  id: string;
  nombre: string;
  fecha: string;
  icono: React.ReactNode;
  descripcion: string;
  actividades: string[];
};

interface ItineraryProps {
  destinos: Destination[];
  card: string;
  shadow: string;
  border: string;
  highlight: string;
  accent: string;
  header: string;
}

export default function Itinerary({
  destinos,
  card,
  shadow,
  border,
  highlight,
  accent,
  header,
}: ItineraryProps) {
  // map restaurant names (substring) → their menu pages
  const menuLinks: Record<string, string> = {
    "50's Prime Time Café": 
      'https://disneyworld.disney.go.com/dining/hollywood-studios/50s-prime-time-cafe/menus/lunch/',
    'Docking Bay 7': 
      'https://disneyworld.disney.go.com/dining/hollywood-studios/docking-bay-7-food-and-cargo/menus',
    'Ronto Roasters': 
      'https://disneyworld.disney.go.com/dining/hollywood-studios/ronto-roasters/menus/',
    'Sci-Fi Dine-In Theater': 
      'https://disneyworld.disney.go.com/dining/hollywood-studios/sci-fi-dine-in-theater/menus/',
    "Woody's Lunch Box": 
      'https://disneyworld.disney.go.com/dining/hollywood-studios/woodys-lunchbox/menus/',
    "Bumblebee Man's Taco Truck":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/bumblebee-mans-taco-truck/menu.html',
    "Finnegan's Bar & Grill":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/finnegans-bar-grill/menu.html',
    "Krusty Burger":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/krusty-burger/menu.html',
    "Mel's Drive-In":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/mels-drive-in/menu.html',
    "Leaky Cauldron":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/leaky-cauldron/menu.html',
    "Three Broomsticks":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/three-broomsticks/menu.html',
    "Thunder Falls Terrace":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/thunder-falls-terrace/menu.html',
    "Mythos Restaurant":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/mythos-restaurant/menu.html',
    "Pizza Predattoria":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/pizza-predattoria/menu.html',
    "Green Eggs and Ham":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/green-eggs-and-ham-cafe/menu.html',
    "Confisco Grille":
    'https://www.universalorlando.com/web/en/us/things-to-do/dining/confisco-grille/menu.html'
  };

  return (
    <div className="animate-fadeIn">
      <h2 className={`text-3xl font-bold text-center mb-8 ${header}`}>
        Nuestro Itinerario
      </h2>
      <div className="grid gap-8">
        {destinos.map((destino, idx) => (
          <div
            key={destino.id}
            className={`relative flex flex-col md:flex-row gap-6 p-6 rounded-xl ${card} border ${shadow} transition-all`}
          >
            {idx < destinos.length - 1 && (
              <div className="absolute left-10 md:left-12 top-20 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700" />
            )}

            <div
              className={`flex-shrink-0 w-20 h-20 rounded-full ${highlight} flex items-center justify-center z-10`}
            >
              {React.cloneElement(
                destino.icono as React.ReactElement,
                { size: 32 }
              )}
            </div>

            <div className="flex-grow">
              <div className="flex items-center mb-4">
                <h3 className={`text-xl md:text-2xl font-bold ${header}`}>
                  {destino.nombre}
                </h3>
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-sm ${highlight} ${accent}`}
                >
                  {destino.fecha}
                </span>
              </div>

              <p className="mb-4">{destino.descripcion}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destino.actividades.map((act, i) => {
                  // find if this activity matches one of our keys
                  const foundKey = Object.keys(menuLinks).find((key) =>
                    act.includes(key)
                  );
                  const menuUrl = foundKey ? menuLinks[foundKey] : null;

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${highlight} flex flex-col`}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-current mr-2" />
                        <span>{act}</span>
                      </div>

                      {menuUrl && (
                        <a
                          href={menuUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block px-3 py-1 border border-blue-500 rounded text-blue-500 hover:bg-blue-50 text-sm"
                        >
                          Ver menú
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
