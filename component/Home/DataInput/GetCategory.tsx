import Image from 'next/image'

const PREFERENCE_TO_PLACE_TYPES: Record<string, string[]> = {
  'Hotels': ['lodging', 'campground'],
  'Restaurants': ['restaurant'],
  'Museums': ['museum', 'art_gallery', 'library'],
  'Coffee Shops': ['cafe', 'bakery'],
  'Shopping Centers': ['shopping_mall', 'department_store', 'clothing_store'],
  'Place of Worship': ['church', 'mosque', 'hindu_temple', 'synagogue'],
  'Attractions': ['tourist_attraction', 'amusement_park', 'zoo', 'aquarium'],
  'Local Stops': ['store', 'convenience_store', 'supermarket'],
  'Park' : ['park']
}

interface GetCategoryProps {
  categories: string[];
  setCategories: (categories: string[]) => void;
}

export default function GetCategory({ categories, setCategories }: GetCategoryProps) {
  const categoryOptions = Object.keys(PREFERENCE_TO_PLACE_TYPES)

  const toggleCategory = (cat: string) => {
    setCategories(
      categories.includes(cat) ? categories.filter(c => c !== cat) : [...categories, cat]
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-5 sm:h-6 bg-linear-to-b from-amber-500 to-orange-500 rounded-full"></div>
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
          Preferred Category
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {categoryOptions.map((cat) => {
          const isSelected = categories.includes(cat)
          
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`relative p-2 rounded-xl border-2 transition-all duration-200 group cursor-pointer ${
                isSelected
                  ? 'border-orange-400 bg-linear-to-br from-orange-50 to-amber-50 shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm active:scale-[0.98]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              )}
              <div className="flex items-center gap-2">
                <Image 
                  src={`/place_type/${cat}.png`}
                  alt={cat}
                  width={32}
                  height={32}
                />
                <span className={`text-xs sm:text-sm font-medium ${
                  isSelected ? 'text-orange-700' : 'text-slate-700'
                }`}>
                  {cat}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { PREFERENCE_TO_PLACE_TYPES }
