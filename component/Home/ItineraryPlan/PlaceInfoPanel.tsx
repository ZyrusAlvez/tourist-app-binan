import { useState } from 'react';
import { SearchResult } from '@/services/searchService';
import { IoClose } from 'react-icons/io5';

interface PlaceInfoPanelProps {
  place: SearchResult;
  onClose: () => void;
}

const PlaceInfoPanel = ({ place, onClose }: PlaceInfoPanelProps) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  return (
    <>
      <div className='h-full w-96 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden flex flex-col'>
      <div className='p-2 overflow-y-auto flex-1'>
        <button 
          onClick={onClose}
          className='cursor-pointer float-right text-orange-500 hover:text-orange-600 text-2xl'
        >
          <IoClose />
        </button>
        
        <h2 className='text-xl font-bold text-gray-900 mb-2'>
          {place.displayName}
        </h2>
        
        {place.formattedAddress && (
          <p className='text-sm text-gray-600 mb-2'>{place.formattedAddress}</p>
        )}
        
        {place.rating && (
          <div className='flex items-center gap-2 mb-3'>
            <span className='text-yellow-500 text-lg'>★</span>
            <span className='font-semibold'>{place.rating}</span>
            {place.userRatingCount && (
              <span className='text-gray-500 text-sm'>({place.userRatingCount} reviews)</span>
            )}
          </div>
        )}
        
        {place.priceLevel && (
          <p className='text-sm text-gray-700 mb-3'>Price: {place.priceLevel}</p>
        )}
        
        {place.nationalPhoneNumber && (
          <p className='text-sm text-gray-700 mb-3'>📞 {place.nationalPhoneNumber}</p>
        )}
        
        {place.regularOpeningHours && (
          <div className='mb-3'>
            <h3 className='font-semibold text-gray-900 mb-2'>Opening Hours</h3>
            <div className='space-y-1'>
              {place.regularOpeningHours.weekdayDescriptions?.map((day: string, idx: number) => {
                const [dayName, hours] = day.split(': ');
                return (
                  <div key={idx} className='flex justify-between text-sm'>
                    <span className='text-gray-700 font-medium'>{dayName}</span>
                    <span className='text-gray-600'>{hours}</span>
                  </div>
                );
              }) || <p className='text-sm text-gray-500'>Hours not available</p>}
            </div>
          </div>
        )}
        
        {place.photos && place.photos.length > 0 && (
          <div className='mb-3'>
            <h3 className='font-semibold text-gray-900 mb-2'>Photos</h3>
            <div className='grid grid-cols-2 gap-2'>
              {place.photos.slice(0, 4).map((photo, idx) => {
                const photoUri = photo.getURI({ maxWidth: 200, maxHeight: 200 });
                return (
                  <img 
                    key={idx}
                    src={photoUri}
                    alt={`Photo ${idx + 1}`}
                    className='w-full h-32 object-cover rounded cursor-pointer hover:opacity-80'
                    onClick={() => setExpandedImage(photo.getURI({ maxWidth: 800, maxHeight: 800 }))}
                  />
                );
              })}
            </div>
          </div>
        )}
        
        {place.reviews && place.reviews.length > 0 && (
          <div className='mb-3'>
            <h3 className='font-semibold text-gray-900 mb-2'>Reviews</h3>
            {place.reviews.map((review, idx) => (
              <div key={idx} className='mb-4 pb-3 border-b'>
                <div className='flex items-center gap-2 mb-2'>
                  {review.authorAttribution?.photoURI && (
                    <img 
                      src={review.authorAttribution.photoURI} 
                      alt={review.authorAttribution.displayName}
                      className='w-8 h-8 rounded-full'
                    />
                  )}
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-sm'>{review.authorAttribution?.displayName}</span>
                      <span className='text-yellow-500 text-sm'>★ {review.sh}</span>
                    </div>
                    <span className='text-xs text-gray-500'>{review.th}</span>
                  </div>
                </div>
                <p className='text-sm text-gray-700 mb-1'>{review.qh}</p>
                {review.uh && review.uh !== review.qh && (
                  <p className='text-xs text-gray-500 italic'>Translated: {review.uh}</p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {place.googleMapsURI && (
          <a 
            href={place.googleMapsURI}
            target='_blank'
            rel='noopener noreferrer'
            className='block w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
          >
            View on Google Maps
          </a>
        )}
      </div>
      </div>

      {expandedImage && (
        <div 
          className='fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50'
          onClick={() => setExpandedImage(null)}
        >
          <img 
            src={expandedImage} 
            alt='Expanded view'
            className='max-w-[90%] max-h-[90%] object-contain shadow-2xl rounded'
          />
        </div>
      )}
    </>
  );
};

export default PlaceInfoPanel;
