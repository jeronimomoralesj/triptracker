import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { collection, addDoc, onSnapshot, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { ChevronDown, X, PlusCircle, MapPin, Camera, Trash, Edit, ExternalLink, Info, Car, Sun } from 'lucide-react';
import WeatherSection from './weather';

interface Parking {
  id: string;
  ubicacion: string;
  parqueadero: string;
  indicaciones?: string;
  imageUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Timestamp;
}

enum Mode { Parqueadero = 'parqueadero',Datos = 'datos', Clima = 'clima', }

interface ExtrasProps {
    bg: string;
    card: string;
    border: string;
    header: string;
    text: string;
  }

export default function Extras({ bg, card, border, header, text }: ExtrasProps) {
  const [mode, setMode] = useState<Mode>(Mode.Datos);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // form state
  const [ubicacion, setUbicacion] = useState('');
  const [parqueadero, setParqueadero] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // subscribe to Firestore parkings
  useEffect(() => {
    const q = collection(db, 'parkings');
    return onSnapshot(q, snap => {
      const items: Parking[] = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setParkings(items.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    });
  }, []);

  // preview file
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const resetForm = () => {
    setUbicacion('');
    setParqueadero('');
    setIndicaciones('');
    setFile(null);
    setPreview(null);
    setCoordinates(null);
    setLocationError(null);
    setIsEditing(false);
    setEditId(null);
    if (formRef.current) formRef.current.reset();
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalización no es soportada en este navegador');
      return;
    }

    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMsg;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Usuario denegó acceso a la ubicación';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Información de ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMsg = 'Tiempo de espera agotado al obtener la ubicación';
            break;
          default:
            errorMsg = 'Error desconocido al obtener ubicación';
        }
        setLocationError(errorMsg);
      }
    );
  };

  const parkTips: Record<string, string[]> = {
    'Hollywood Studios': [
      'Casi todas las atracciones principales ofrecen lockers gratuitos justo al lado de la entrada, de tamaño aproximado 33 cm × 23 cm × 38 cm.',
      'El mobile ordering está disponible en Docking Bay 7 y 50\'s Prime Time Café para ahorrar tiempo en fila. ¡Ideal para recargar energías rápidamente!',
      'La atracción con mayor tiempo de espera promedio suele ser Rise of the Resistance y Slinky Dog Dash.',
      'Hollywood Brown Derby Lounge ofrece cócteles artesanales y aperitivos deliciosos en un ambiente elegante.',
      'Zapatos: Zapatos cómodos y con buen soporte! Zapatos deportivos. Eviten zapatos nuevos.',
      'Qué llevar: Protector solar de alto espectro y reapliquen cada pocas horas.',
      'Gafas de sol y/o gorra para protegerse del sol, incluso en días nublados.',
      'Una botella de agua reutilizable es esencial para mantenerse hidratados. Hay fuentes de agua disponibles para rellenar.',
      'Llevar un pequeño paraguas o impermeables ligeros, especialmente en la temporada de lluvias (generalmente en verano).',
      'Batería portátil para sus teléfonos.',
      'Snacks ligeros como barras de granola o frutos secos pueden ayudar a aguantar entre comidas.',
    ],
    'Universal Studios Florida': [
      'Los lockers gratuitos tienen dos tamaños: pequeño (aproximadamente 33 cm × 23 cm × 41 cm) y grande (aproximadamente 38 cm × 41 cm × 56 cm).',
      'En algunas atracciones se ofrecen cubetas de calzado gratuitas junto a los lockers para dejar mochilas pequeñas o chaquetas.',
      'Hollywood Rip Ride Rockit les permite elegir la banda sonora de su montaña rusa. ¡Una experiencia única!',
      'Springfield U.S.A. probar una cerveza Duff en Moe\'s Tavern.',
    ],
    'Islands of Adventure': [
      'Los lockers gratuitos frente a las atracciones principales suelen medir aproximadamente 30 cm × 30 cm × 41 cm.',
      'Las estaciones médicas están ubicadas en Port of Entry y en Marvel Super Hero Island.',
    ],
    'Pre viaje': [
      'En centro 93 en el parqueadero el dolar lo venden barato Cl. 93a #14-17',
    ],
  };

  const openInMaps = (lat: number, lng: number) => {
    // Check if device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      window.open(`maps://maps.apple.com/maps?q=${lat},${lng}`);
    } else {
      window.open(`https://maps.google.com/maps?q=${lat},${lng}`);
    }
  };

  const editParking = (parking: Parking) => {
    setUbicacion(parking.ubicacion);
    setParqueadero(parking.parqueadero);
    setIndicaciones(parking.indicaciones || '');
    setPreview(parking.imageUrl || null);
    setCoordinates(parking.coordinates || null);
    setIsEditing(true);
    setEditId(parking.id);
    setShowForm(true);
  };

  const deleteParking = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este parqueadero?')) {
      await deleteDoc(doc(db, 'parkings', id));
    }
  };

  // Handle viewing full image
  const viewFullImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // upload and submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let imageUrl: string | undefined = preview || undefined;
      
      if (file) {
        const path = `parkings/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytesResumable(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      const parkingData = {
        ubicacion,
        parqueadero,
        indicaciones: indicaciones || null,
        imageUrl: imageUrl || null,
        coordinates: coordinates || null,
        createdAt: isEditing ? Timestamp.now() : Timestamp.now(), // Using server timestamp would be better
      };
      
      if (isEditing && editId) {
        await updateDoc(doc(db, 'parkings', editId), parkingData);
      } else {
        await addDoc(collection(db, 'parkings'), parkingData);
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving parking:", error);
      alert("Error al guardar el parqueadero");
    } finally {
      setIsLoading(false);
    }
  };


  const parks = Object.keys(parkTips);
  const [selectedPark, setSelectedPark] = useState(parks[0]);

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto">
      <div className="flex mb-6 space-x-2 md:space-x-4">
        {Object.values(Mode).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setShowForm(false); resetForm(); }}
            className={`px-4 py-2 md:px-5 md:py-3 rounded-lg transition font-medium text-sm md:text-base flex items-center gap-2 shadow-sm
              ${mode === m 
                ? 'bg-muted/80 text-muted-foreground hover:bg-muted border border' 
                : 'bg-primary text-primary-foreground '}`}
          >
            {m === Mode.Datos ? (
  <>
    <Info className="h-4 w-4" />
    <span>Tips</span>
  </>
) : m === Mode.Clima ? ( // Aquí agregamos el 'else if'
  <>
    {/* Reemplaza OtroIcono y "Otra Opción" con lo que necesites */}
    <Sun className="h-4 w-4" />
    <span>Clima</span>
  </>
) : ( // Este es el 'else' que se ejecuta si ninguna de las condiciones anteriores es verdadera
  <>
    <Car className="h-4 w-4" />
    <span>Parqueaderos</span>
  </>
)}
          </button>
        ))}
      </div>

      {mode === Mode.Datos && (
<div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl md:text-2xl font-bold text-card-foreground flex items-center gap-2">
      <Info className="h-5 w-5" /> Datos Importantes
    </h2>
    <div className="relative inline-block text-left">
      <select
        value={selectedPark}
        onChange={e => setSelectedPark(e.target.value)}
        className="appearance-none bg-muted/50 text-card-foreground px-3 py-2 rounded focus:outline-none"
      >
        {parks.map(park => (
          <option key={park} value={park}>
            {park}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-card-foreground" />
    </div>
  </div>

  <ul className="list-disc pl-5 space-y-2 text-card-foreground/90 mb-6">
    {parkTips[selectedPark].map((tip, idx) => (
      <li key={idx}>{tip}</li>
    ))}
  </ul>

</div>

      )}

      {mode === Mode.Parqueadero && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Parqueaderos</h2>
            <button
              onClick={() => { setShowForm(true); resetForm(); }}
              className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors py-2 px-3 rounded-md shadow-sm"
            >
              <PlusCircle className="h-4 w-4 md:h-5 md:w-5" /> 
              <span className="hidden md:inline">Añadir</span>
            </button>
          </div>

          {parkings.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Acá podremos agregar donde se dejo el carro con foto y todo para acordarse</p>
              <button 
                onClick={() => { setShowForm(true); resetForm(); }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="h-4 w-4" /> Añadir parqueadero
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parkings.map(p => (
                <div
                  key={p.id}
                  className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow group"
                >
                  <div 
                    className="relative h-40 cursor-pointer" 
                    onClick={() => p.imageUrl && viewFullImage(p.imageUrl)}
                  >
                    {p.imageUrl ? (
                      <>
                        <img 
                          src={p.imageUrl} 
                          alt={p.ubicacion} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full">
                            Ver imagen
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Camera className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); editParking(p); }}
                        className="p-1 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background"
                        aria-label="Editar"
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteParking(p.id); }}
                        className="p-1 bg-background/80 backdrop-blur-sm rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        aria-label="Eliminar"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-card-foreground">{p.ubicacion}</h3>
                    <p className="text-card-foreground/80 mb-2">{p.parqueadero}</p>
                    
                    {p.indicaciones && (
                      <p className="text-sm text-card-foreground/70 mt-1">{p.indicaciones}</p>
                    )}
                    
                    {p.coordinates && (
                      <button
                        onClick={() => openInMaps(p.coordinates!.latitude, p.coordinates!.longitude)}
                        className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <MapPin className="h-3 w-3" />
                        Ver ubicación en Mapa
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
              {/* Modal container - prevent click propagation */}
              <div 
                className="bg-background rounded-lg max-h-[90vh] w-full max-w-md overflow-y-auto shadow-lg" 
                onClick={e => e.stopPropagation()}
              >
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="p-5 space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {isEditing ? 'Editar' : 'Nuevo'} Parqueadero
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setShowForm(false)}
                      className="p-1 rounded-full hover:bg-muted transition-colors"
                    >
                      <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                  
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">Ubicación (opcional)</span>
                    <input
                      type="text"
                      value={ubicacion}
                      onChange={e => setUbicacion(e.target.value)}
                      placeholder="ej. Magic Kingdom"
                      className="mt-1 w-full border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </label>
                  
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">Parqueadero (opcional)</span>
                    <input
                      type="text"
                      value={parqueadero}
                      onChange={e => setParqueadero(e.target.value)}
                      placeholder="ej. Piso 2 Jurassic Park 20"
                      className="mt-1 w-full border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </label>
                  
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">Indicaciones (opcional)</span>
                    <textarea
                      value={indicaciones}
                      onChange={e => setIndicaciones(e.target.value)}
                      placeholder="ej. Cerca a la entrada principal"
                      className="mt-1 w-full border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                    />
                  </label>

                  {/* Location */}
                  <div className="block">
                    <span className="text-sm font-medium text-foreground mb-1 block">Ubicación actual (opcional)</span>
                    <div className="flex flex-col gap-2">
                      <button 
                        type="button"
                        onClick={getCurrentLocation}
                        className="flex items-center gap-2 px-3 py-2 border border-input bg-muted/50 text-foreground rounded-md text-sm hover:bg-muted transition-colors"
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        {coordinates ? 'Actualizar mi ubicación actual' : 'Usar mi ubicación actual'}
                      </button>
                      
                      {coordinates && (
                        <div className="text-xs text-muted-foreground">
                          <p>Latitud: {coordinates.latitude.toFixed(6)}</p>
                          <p>Longitud: {coordinates.longitude.toFixed(6)}</p>
                        </div>
                      )}
                      
                      {locationError && (
                        <div className="text-xs text-destructive">
                          {locationError}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="block">
                    <span className="text-sm font-medium text-foreground mb-1 block">Imagen (opcional)</span>
                    <div className="flex flex-col gap-2">
                      <label 
                        className="flex items-center gap-2 px-3 py-2 border border-input bg-muted/50 text-foreground rounded-md text-sm hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Camera className="h-4 w-4 text-primary" />
                        {file ? file.name : 'Seleccionar imagen'}
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      
                      {preview && (
                        <div className="relative mt-2">
                          <img 
                            src={preview} 
                            alt="Vista previa" 
                            className="w-full h-32 object-cover rounded-md" 
                          />
                          <button
                            type="button"
                            onClick={() => { setFile(null); setPreview(null); }}
                            className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm hover:bg-muted/80 transition-colors"
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center gap-1"
                    >
                      {isLoading ? (
                        <>
                          <span className="inline-block h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <span>{isEditing ? 'Actualizar' : 'Guardar'}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Image Viewer Modal */}
          {selectedImage && (
            <div 
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" 
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                <img 
                  src={selectedImage} 
                  alt="Imagen completa" 
                  className="max-w-full max-h-[85vh] object-contain" 
                />
                <button 
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

{mode === Mode.Clima && (
        <WeatherSection
        bg={bg}
        card={card}
        border={border}
        header={header}
        text={text}
      />
      )}

    </div>
  );
}