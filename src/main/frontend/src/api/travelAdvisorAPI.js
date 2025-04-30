import axios from 'axios';

const API_KEY = process.env.REACT_APP_RAPID_API_TRAVEL_API_KEY;

// Trip Advisor API 호출을 위한 기본 설정
const travelAdvisorAPI = {
  // 지역 경계 내 레스토랑 검색
  getRestaurants: async (bounds) => {
    const options = {
      method: 'GET',
      url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary',
      params: {
        bl_latitude: bounds.bl_latitude || '11.847676',
        tr_latitude: bounds.tr_latitude || '12.838442',
        bl_longitude: bounds.bl_longitude || '109.095887',
        tr_longitude: bounds.tr_longitude || '109.149359',
        restaurant_tagcategory: '10591',
        limit: '15',
        currency: 'USD',
        open_now: 'false',
        lunit: 'km',
        lang: 'ko_KR'
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      return (response.data.data || []).map(item => ({
        id: item.location_id,
        name: item.name || '이름 없음',
        address: item.address || '',
        latitude: parseFloat(item.latitude) || 0,
        longitude: parseFloat(item.longitude) || 0,
        description: item.description || '',
        rating: item.rating ? parseFloat(item.rating) : null,
        photo: item.photo ? item.photo.images.medium.url : null,
        website: item.website || '',
        phone: item.phone || '',
        price_level: item.price_level || '',
        price: item.price || '',
        ranking: item.ranking || '',
        num_reviews: item.num_reviews || 0,
        type: 'restaurants'
      }));
    } catch (error) {
      console.error('레스토랑 정보 가져오기 오류:', error);
      return [];
    }
  },

  // 지역 경계 내 호텔 검색
  getHotels: async (bounds) => {
    const options = {
      method: 'GET',
      url: 'https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng',
      params: {
        latitude: parseFloat(bounds.bl_latitude) + (parseFloat(bounds.tr_latitude) - parseFloat(bounds.bl_latitude))/2,
        longitude: parseFloat(bounds.bl_longitude) + (parseFloat(bounds.tr_longitude) - parseFloat(bounds.bl_longitude))/2,
        limit: '15',
        currency: 'USD',
        distance: '5',
        lang: 'ko_KR'
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      return (response.data.data || []).map(item => ({
        id: item.location_id,
        name: item.name || '이름 없음',
        address: item.address || '',
        latitude: parseFloat(item.latitude) || 0,
        longitude: parseFloat(item.longitude) || 0,
        description: item.description || '',
        rating: item.rating ? parseFloat(item.rating) : null,
        photo: item.photo ? item.photo.images.medium.url : null,
        website: item.website || '',
        phone: item.phone || '',
        price: item.price || '',
        ranking: item.ranking || '',
        num_reviews: item.num_reviews || 0,
        type: 'hotels'
      }));
    } catch (error) {
      console.error('호텔 정보 가져오기 오류:', error);
      return [];
    }
  },

  // 지역 경계 내 관광지 검색
  getAttractions: async (bounds) => {
    const options = {
      method: 'GET',
      url: 'https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary',
      params: {
        bl_latitude: bounds.bl_latitude || '11.847676',
        tr_latitude: bounds.tr_latitude || '12.838442',
        bl_longitude: bounds.bl_longitude || '109.095887',
        tr_longitude: bounds.tr_longitude || '109.149359',
        limit: '15',
        currency: 'USD',
        lunit: 'km',
        lang: 'ko_KR'
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      return (response.data.data || []).map(item => ({
        id: item.location_id,
        name: item.name || '이름 없음',
        address: item.address || '',
        latitude: parseFloat(item.latitude) || 0,
        longitude: parseFloat(item.longitude) || 0,
        description: item.description || '',
        rating: item.rating ? parseFloat(item.rating) : null,
        photo: item.photo ? item.photo.images.medium.url : null,
        website: item.website || '',
        phone: item.phone || '',
        ranking: item.ranking || '',
        num_reviews: item.num_reviews || 0,
        type: 'attractions'
      }));
    } catch (error) {
      console.error('관광지 정보 가져오기 오류:', error);
      return [];
    }
  }
};

export default travelAdvisorAPI;