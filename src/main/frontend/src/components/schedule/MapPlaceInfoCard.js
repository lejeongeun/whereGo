import React from 'react';
import { CiImageOff } from 'react-icons/ci';
import './MapPlaceInfoCard.css';

function MapPlaceInfoCard({ place, onAdd }) {
  if (!place) return null;

  // 장소 상세 정보가 있는 경우 추가 정보 표시
  const hasDetails = place.details !== undefined;
  
  // rating이 숫자인지 확인하고 처리
  const rating = place.rating;
  const hasRating = rating !== undefined && rating !== null;
  const numericRating = hasRating ? (typeof rating === 'number' ? rating : parseFloat(rating)) : 0;
  const isValidRating = !isNaN(numericRating) && numericRating > 0;
  
  // 리뷰 수
  const reviewCount = place.num_reviews || place.reviews_count || '10';
  
  // 랭킹 정보
  const ranking = place.ranking || '#8 of 1,882 Restaurants in Seongnam';
  
  // 태그 (종류)
  const tags = ['Asian', 'Korean'];
  if (place.cuisine && Array.isArray(place.cuisine)) {
    tags.length = 0;
    place.cuisine.forEach(item => tags.push(item.name));
  }
  
  // 전화번호
  const phone = hasDetails && place.details.formattedPhoneNumber 
    ? place.details.formattedPhoneNumber 
    : (place.phone || '+82 31-602-1847');
  
  // 웹사이트
  const website = hasDetails && place.details.website 
    ? place.details.website 
    : (place.website || '#');
  
  return (
    <div className="map-place-info-card">
      {/* 카드 상단: 이미지와 기본 정보 */}
      <div className="card-top">
        {/* 이미지 표시 (정사각형) */}
        <div className="place-image">
          {place.photo ? (
            <img src={place.photo} alt={place.name} />
          ) : (
            <div className="no-image">
              <CiImageOff size={40} />
            </div>
          )}
        </div>
        
        {/* 기본 정보 */}
        <div className="basic-info">
          {/* 장소 이름 */}
          <h3>{place.name || 'Ilpyeondaksim'}</h3>
          
          {/* 평점 표시 */}
          {isValidRating && (
            <div className="rating">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <span key={index} className="rating-star">★</span>
              ))}
              <span className="reviews-count">{reviewCount} reviews</span>
            </div>
          )}

          {/* 가격 정보 */}
          <div className="info-section">
            <p className="info-title">Price</p>
            <p className="info-content">
              {place.price_level ? '₩'.repeat(place.price_level) : ''}
            </p>
          </div>
          
          {/* 랭킹 정보 */}
          <div className="info-section">
            <p className="info-title">Ranking</p>
            <p className="ranking">{ranking}</p>
          </div>
          
          {/* 태그 (종류) */}
          <div className="tags-container">
            {tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* 상세 정보 */}
      <div className="details-info">
        {/* 주소 */}
        <div className="address-container">
          <span className="address-icon">📍</span>
          <p className="address">
            {place.address || '22 Pangyoyeok-ro 192beon-gil, Seongnam, Gyeonggi-do South Korea'}
          </p>
        </div>
        
        {/* 전화번호 */}
        <div className="phone-container">
          <span className="phone-icon">📞</span>
          <span className="phone">{phone}</span>
        </div>
      </div>
      
      {/* 링크 버튼 */}
      <div className="links-container">
        <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer" className="link-button">
          TRIP ADVISOR
        </a>
        <a href={website} target="_blank" rel="noopener noreferrer" className="link-button">
          WEBSITE
        </a>
      </div>
      
      {/* 일정에 추가 버튼 */}
      <div className="button-container">
        <button 
          className="add-button"
          onClick={() => onAdd(place)}
        >
          일정에 추가
        </button>
      </div>
    </div>
  );
}

export default MapPlaceInfoCard;