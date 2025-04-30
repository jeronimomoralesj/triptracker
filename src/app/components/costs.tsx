'use client'

import React, { useState, useEffect } from 'react'

interface BudgetItem {
  name: string
  price: number
  link?: string
  date?: string
  productDetails?: {
    title: string
    imageUrl: string
    price: string
    currency: string
  }
}

interface BudgetData {
  breakfast: number
  lunch: number
  extras: number
  breakfastItems?: BudgetItem[]
  lunchItems?: BudgetItem[]
  extrasItems?: BudgetItem[]
}

interface CostsProps {
  card: string
  border: string
  highlight: string
  accent: string
  header: string
}

export default function Costs({ card, border, highlight, accent, header }: CostsProps) {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    breakfast: 0,
    lunch: 0,
    extras: 0
  })
  const [loading, setLoading] = useState(true)
  const [showPopup, setShowPopup] = useState<string | null>(null)
  const [detailItems, setDetailItems] = useState<BudgetItem[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [productDetailView, setProductDetailView] = useState<BudgetItem | null>(null)
  const [productDetailLoading, setProductDetailLoading] = useState(false)
  const [itemsWithImages, setItemsWithImages] = useState<Record<string, BudgetItem>>({})

  useEffect(() => {
    // Fetch initial budget summary
    fetch('/api/budget')
      .then(res => res.json())
      .then(({ breakfast, lunch, extras }) => {
        setBudgetData({
          breakfast: Number(breakfast),
          lunch: Number(lunch),
          extras: Number(extras)
        })
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading budget:', err)
        setLoading(false)
      })
  }, [])

  // Preload product images for items with links
  const preloadProductImages = async (items: BudgetItem[]) => {
    const itemsWithLinks = items.filter(item => item.link)
    
    if (itemsWithLinks.length === 0) return
    
    const newItemsWithImages = { ...itemsWithImages }
    
    // Process items in batches to avoid too many concurrent requests
    for (let i = 0; i < itemsWithLinks.length; i++) {
      const item = itemsWithLinks[i]
      
      if (!item.link || newItemsWithImages[item.name]) continue
      
      try {
        const res = await fetch(`/api/walmart?url=${encodeURIComponent(item.link)}`)
        if (res.ok) {
          const productData = await res.json()
          newItemsWithImages[item.name] = {
            ...item,
            productDetails: productData
          }
        }
      } catch (error) {
        console.error(`Error loading product details for ${item.name}:`, error)
      }
    }
    
    setItemsWithImages(newItemsWithImages)
  }

  // Handle category click to show detailed items
  const handleCategoryClick = (category: 'breakfast'|'lunch'|'extras') => {
    // map client category to API `type`
    const map: Record<string,string> = {
      breakfast: 'desayuno',
      lunch:     'cena',
      extras:    'extras',
    }
    const type = map[category]
    setShowPopup(category)
    setDetailLoading(true)
    fetch(`/api/budget?type=${type}`)
      .then(r => r.json())
      .then(data => {
        const items = data.items || []
        setDetailItems(items)
        
        // Preload product images for items with links
        preloadProductImages(items)
      })
      .catch(err => {
        console.error(`Error loading ${type}`, err)
        setDetailItems([])
      })
      .finally(() => setDetailLoading(false))
  }

  // Load Walmart product details
  const loadProductDetails = async (item: BudgetItem) => {
    if (!item.link) return
    
    setProductDetailView(item)
    setProductDetailLoading(true)
    
    // Check if we already have the product details cached
    if (itemsWithImages[item.name]?.productDetails) {
      setProductDetailView(itemsWithImages[item.name])
      setProductDetailLoading(false)
      return
    }
    
    try {
      const res = await fetch(`/api/walmart?url=${encodeURIComponent(item.link)}`)
      const productData = await res.json()
      
      if (res.ok) {
        const updatedItem = {
          ...item,
          productDetails: productData
        }
        
        // Update the item with product details
        setProductDetailView(updatedItem)
        
        // Cache the item with images
        setItemsWithImages(prev => ({
          ...prev,
          [item.name]: updatedItem
        }))
      } else {
        console.error('Failed to fetch product details:', productData.error)
      }
    } catch (error) {
      console.error('Error loading product details:', error)
    } finally {
      setProductDetailLoading(false)
    }
  }

  const closePopup = () => {
    setShowPopup(null)
    setDetailItems([])
  }

  const closeProductDetail = () => {
    setProductDetailView(null)
  }

  // Group items by date/category for better organization
  const groupItemsByDate = (items: BudgetItem[]) => {
    const groups: Record<string, BudgetItem[]> = {}
    
    items.forEach(item => {
      const key = item.date || 'Other'
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    })
    
    return groups
  }

  const total = (budgetData.breakfast + budgetData.lunch + budgetData.extras) * 1.065
  const porPersona = total/5

  if (loading) {
    return (
      <div className="animate-pulse max-w-3xl mx-auto p-8">
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'breakfast': return 'Desayunos';
      case 'lunch': return 'Cena';
      case 'extras': return 'Complementario';
      default: return '';
    }
  }

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'breakfast': 
        return 'El desayuno incluye huevos, salchicha, fruta y bebidas como Milo. Los detalles muestran los productos específicos.';
      case 'lunch': 
        return 'La cena incluye opciones como pasta boloñesa y pollo con arroz. Los detalles muestran los ingredientes.';
      case 'extras': 
        return 'Los complementos incluyen snacks, mantequilla de maní, barras energéticas y bebidas.';
      default: return '';
    }
  }

  const groupedItems = groupItemsByDate(detailItems)

  return (
    <div className="animate-fadeIn">
      <h2 className={`text-3xl font-bold text-center mb-8 ${header}`}>
        Presupuesto del Viaje
      </h2>

      <div className={`max-w-3xl mx-auto rounded-xl ${card} border ${border} overflow-hidden`}>
        <div className="p-6 space-y-4">
          <div 
            className={`p-4 rounded-lg ${highlight} flex justify-between items-center cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => handleCategoryClick('breakfast')}
          >
            <span>Desayunos</span>
            <span className={`font-semibold ${accent}`}>
              ${budgetData.breakfast.toLocaleString()}
            </span>
          </div>

          <div 
            className={`p-4 rounded-lg ${highlight} flex justify-between items-center cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => handleCategoryClick('lunch')}
          >
            <span>Cena</span>
            <span className={`font-semibold ${accent}`}>
              ${budgetData.lunch.toLocaleString()}
            </span>
          </div>

          <div 
            className={`p-4 rounded-lg ${highlight} flex justify-between items-center cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => handleCategoryClick('extras')}
          >
            <span>Complementario</span>
            <span className={`font-semibold ${accent}`}>
              ${budgetData.extras.toLocaleString()}
            </span>
          </div>

          <div className={`flex justify-between items-center p-4 rounded-lg font-bold text-lg border-t ${border}`}>
            <span>Total</span>
            <span className={accent}>
              ${total.toLocaleString()}
            </span>
          </div>
          <div className={`flex justify-between items-center p-4 rounded-lg font-bold text-lg border-t ${border}`}>
            <span>Total por persona</span>
            <span className={accent}>
              ${porPersona.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Popup for detailed information */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto ${card}`}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold">{getCategoryTitle(showPopup)}</h3>
              <button 
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="mb-4 text-gray-700">{getCategoryDescription(showPopup)}</p>
              
              {detailLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse h-12 bg-gray-100 rounded"></div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Group items by date/category */}
                  {Object.keys(groupedItems).length > 0 ? (
                    Object.entries(groupedItems).map(([date, items]) => (
                      <div key={date} className="mb-6">
                        <h4 className="text-lg font-semibold mb-3">{date}</h4>
                        
                        {/* Breakdown table */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="grid grid-cols-5 bg-gray-50 font-medium">
                            <div className="p-3 col-span-3 text-black">Producto</div>
                            <div className="p-3 text-right text-black">Precio</div>
                            <div className="p-3 text-center text-black">Detalles</div>
                          </div>
                          
                          {items.map((item, index) => {
                            const cachedItem = itemsWithImages[item.name];
                            const imageUrl = cachedItem?.productDetails?.imageUrl || null;
                            
                            return (
                              <div 
                                key={index} 
                                className="grid grid-cols-5 border-t border-gray-100 hover:bg-gray-50"
                              >
                                <div className="p-3 col-span-3 flex items-center gap-2">
                                  {imageUrl ? (
                                    <div className="w-10 h-10 rounded bg-white flex items-center justify-center overflow-hidden">
                                      <img 
                                        src={imageUrl} 
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                                      <span>Img</span>
                                    </div>
                                  )}
                                  <span className='text-black'>{item.name}</span>
                                </div>
                                <div className="p-3 text-right text-black">${item.price.toLocaleString()}</div>
                                <div className="p-3 text-center">
                                  {item.link ? (
                                    <button 
                                      onClick={() => loadProductDetails(item)}
                                      className="text-blue-500 hover:underline text-black"
                                    >
                                      Ver
                                    </button>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No hay detalles disponibles
                    </div>
                  )}
                  
                  {/* Show combined total */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span className="font-medium text-black">Total {getCategoryTitle(showPopup)}</span>
                    <span className="font-bold text-black">
                      ${showPopup === 'breakfast' 
                        ? budgetData.breakfast.toLocaleString() 
                        : showPopup === 'lunch' 
                          ? budgetData.lunch.toLocaleString()
                          : budgetData.extras.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={closePopup}
                className={`py-2 px-4 rounded-lg ${highlight} hover:opacity-90 transition-opacity`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product detail popup */}
      {productDetailView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl max-w-xl w-full max-h-screen overflow-y-auto ${card}`}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold truncate flex-1">
                {productDetailView.productDetails?.title || productDetailView.name}
              </h3>
              <button 
                onClick={closeProductDetail}
                className="text-gray-500 hover:text-gray-700 focus:outline-none ml-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {productDetailLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-48 bg-gray-200 rounded w-full mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : productDetailView.productDetails ? (
                <div className="flex flex-col items-center">
                  {productDetailView.productDetails.imageUrl ? (
                    <img 
                      src={productDetailView.productDetails.imageUrl} 
                      alt={productDetailView.productDetails.title || productDetailView.name}
                      className="max-h-64 object-contain mb-4"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                      No image available
                    </div>
                  )}
                  
                  <h4 className="text-lg font-medium text-center mb-2">
                    {productDetailView.productDetails.title || productDetailView.name}
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-4 w-full mt-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-500 text-black">Precio presupuestado:</span>
                      <div className="font-bold text-black">${productDetailView.price.toLocaleString()}</div>
                    </div>
                    
                    {productDetailView.productDetails.price && (
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="text-sm text-gray-500">Precio actual en Walmart:</span>
                        <div className="font-bold">
                          {productDetailView.productDetails.price} {productDetailView.productDetails.currency}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 w-full">
                    <a 
                      href={productDetailView.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`block w-full py-2 px-4 rounded-lg text-center ${highlight} hover:opacity-90 transition-opacity`}
                    >
                      Ver en Walmart
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  {productDetailView.link ? (
                    <>
                      <p className="mb-4">No se pudieron cargar los detalles del producto.</p>
                      <a 
                        href={productDetailView.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Ver en Walmart
                      </a>
                    </>
                  ) : (
                    <p>No hay información adicional disponible para este producto.</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={closeProductDetail}
                className={`py-2 px-4 rounded-lg ${highlight} hover:opacity-90 transition-opacity`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}