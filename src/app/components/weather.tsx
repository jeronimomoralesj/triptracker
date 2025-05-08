'use client';

import React, { useState, useEffect } from 'react';

interface HourData {
  time: string;
  precipitation: number;
  probability: number;
}

interface DayConfig {
  date: string;
  label: string;
  lat: number;
  lon: number;
}

interface WeatherSectionProps {
  bg: string;
  card: string;
  border: string;
  header: string;
  text: string;
}

export default function WeatherSection({
  bg,
  card,
  border,
  header,
  text,
}: WeatherSectionProps) {
  // Configure the three park-days
  const configs: DayConfig[] = [
    {
      date: '2025-06-01',
      label: 'Hollywood Studios',
      lat: 28.3575,
      lon: -81.5589,
    },
    {
      date: '2025-06-02',
      label: 'Islands of Adventure',
      lat: 28.4722,
      lon: -81.4702,
    },
    {
      date: '2025-06-03',
      label: 'Universal Studios',
      lat: 28.4732,
      lon: -81.4655,
    },
  ];

  const [data, setData] = useState<Record<string, HourData[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPark, setSelectedPark] = useState<string>(configs[0].label);

  useEffect(() => {
    async function fetchAll() {
      const result: Record<string, HourData[]> = {};

      for (const cfg of configs) {
        const url = [
          `https://api.open-meteo.com/v1/forecast`,
          `?latitude=${cfg.lat}`,
          `&longitude=${cfg.lon}`,
          `&hourly=precipitation,precipitation_probability`,
          `&start_date=${cfg.date}`,
          `&end_date=${cfg.date}`,
          `&timezone=America%2FNew_York`,
        ].join('');

        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.error(`Forecast fetch failed for ${cfg.label}: ${res.status}`);
            continue;
          }
          const json = await res.json();

          // only process if we have exactly what we need
          if (
            json.hourly &&
            Array.isArray(json.hourly.time) &&
            Array.isArray(json.hourly.precipitation) &&
            Array.isArray(json.hourly.precipitation_probability)
          ) {
            const { time, precipitation, precipitation_probability } = json.hourly;
            const n = Math.min(time.length, precipitation.length, precipitation_probability.length);
            result[cfg.label] = [];
            for (let i = 0; i < n; i++) {
              // only keep entries for the exact date
              if (time[i].startsWith(cfg.date)) {
                result[cfg.label].push({
                  time: time[i].slice(11),         // "HH:MM:SS"
                  precipitation: precipitation[i],
                  probability: precipitation_probability[i],
                });
              }
            }
          } else {
            console.error(`Invalid API response format for ${cfg.label}:`, json);
          }
        } catch (e) {
          console.error(`Error fetching weather for ${cfg.label}:`, e);
        }
      }

      setData(result);
      setLoading(false);
    }

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className={`py-10 text-center ${text}`}>
        Cargando pronóstico…
      </div>
    );
  }

  return (
    <div className={`animate-fadeIn ${bg}`}>
      <h2 className={`text-3xl font-bold text-center mb-6 ${header}`}>
        Pronóstico del Clima
      </h2>

      {/* Park selector */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className={`p-4 ${card} border ${border} rounded-lg`}>
          <label className={`block mb-2 font-semibold ${text}`}>Seleccione un parque:</label>
          <div className="flex flex-wrap gap-2">
            {configs.map(cfg => (
              <button
                key={cfg.label}
                onClick={() => setSelectedPark(cfg.label)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedPark === cfg.label
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table or empty state */}
      {data[selectedPark] && data[selectedPark].length > 0 ? (
        <div className="space-y-8">
          <div className={`max-w-3xl mx-auto ${card} border ${border} rounded-lg overflow-hidden`}>
            <div className="p-4 border-b">
              <h3 className={`text-2xl font-semibold ${text}`}>
                {selectedPark} — {configs.find(c => c.label === selectedPark)?.date}
              </h3>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-black">
                  <tr>
                    <th className="p-2 text-left">Hora</th>
                    <th className="p-2 text-right">Lluvia (mm)</th>
                    <th className="p-2 text-right">Prob. (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {data[selectedPark].map((h, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{h.time}</td>
                      <td className="p-2 text-right">{h.precipitation.toFixed(1)}</td>
                      <td className="p-2 text-right">{h.probability}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className={`max-w-3xl mx-auto p-4 ${card} border ${border} rounded-lg text-center ${text}`}>
          No hay datos disponibles todavia para {selectedPark}.
        </div>
      )}
    </div>
  );
}
