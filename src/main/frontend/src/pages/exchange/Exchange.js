import React, { useState, useEffect } from 'react';
import api from '../../api'; 
import './Exchange.css';

const Exchange = () => {
  const [baseRate, setBaseRate] = useState({
    base: 'KRW',
    target: 'USD',
    rate: 0,
    timestamp: ''
  });
  const [conversionData, setConversionData] = useState({
    from: 'KRW',
    to: 'USD',
    amount: 1000,
    result: 0,
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);
  
  // 모든 통화 옵션 (대한민국을 맨 앞에 두고 나머지는 한글 초성 순서로 정렬)
  const currencyOptions = [
    { value: 'KRW', label: '대한민국 (KRW)' },
    { value: 'TWD', label: '대만 (TWD)' },
    { value: 'RUB', label: '러시아 (RUB)' },
    { value: 'MYR', label: '말레이시아 (MYR)' },
    { value: 'MXN', label: '멕시코 (MXN)' },
    { value: 'USD', label: '미국 (USD)' },
    { value: 'VND', label: '베트남 (VND)' },
    { value: 'BRL', label: '브라질 (BRL)' },
    { value: 'SAR', label: '사우디아라비아 (SAR)' },
    { value: 'CHF', label: '스위스 (CHF)' },
    { value: 'SGD', label: '싱가포르 (SGD)' },
    { value: 'AED', label: '아랍에미리트 (AED)' },
    { value: 'GBP', label: '영국 (GBP)' },
    { value: 'EUR', label: '유럽 (EUR)' },
    { value: 'INR', label: '인도 (INR)' },
    { value: 'IDR', label: '인도네시아 (IDR)' },
    { value: 'JPY', label: '일본 (JPY)' },
    { value: 'CNY', label: '중국 (CNY)' },
    { value: 'CAD', label: '캐나다 (CAD)' },
    { value: 'THB', label: '태국 (THB)' },
    { value: 'TRY', label: '터키 (TRY)' },
    { value: 'NZD', label: '뉴질랜드 (NZD)' },
    { value: 'PHP', label: '필리핀 (PHP)' },
    { value: 'AUD', label: '호주 (AUD)' },
    { value: 'HKD', label: '홍콩 (HKD)' },
    { value: 'ZAR', label: '남아프리카공화국 (ZAR)' }
  ];

  // 서버에서 지원하는 통화 목록 가져오기
  const fetchSupportedCurrencies = async () => {
    setLoadingCurrencies(true);
    try {
      setCurrencies(currencyOptions);
    } catch (err) {
      console.error('통화 목록 조회 에러:', err);
      // 기본 통화 옵션으로 대체
      setCurrencies([
        { value: 'KRW', label: '대한민국 (KRW)' },
        { value: 'USD', label: '미국 (USD)' },
        { value: 'EUR', label: '유럽 (EUR)' },
        { value: 'JPY', label: '일본 (JPY)' },
        { value: 'VND', label: '베트남 (VND)' }
      ]);
    } finally {
      setLoadingCurrencies(false);
    }
  };

  // 컴포넌트 마운트 시 통화 목록과 환율 정보 가져오기
  useEffect(() => {
    fetchSupportedCurrencies();
    
    setBaseRate(prev => ({
      ...prev,
      rate: 0,
      timestamp: ''
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 환율 정보 API 호출
  const fetchExchangeRate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/exchange/rate?base=${baseRate.base}&target=${baseRate.target}`);
      setBaseRate(response.data);
    } catch (err) {
      let errorMessage = '환율 정보를 불러오는데 실패했습니다';
      
      // 오류 메시지에 통화 코드 문제가 있는지 확인
      if (err.response && err.response.data && err.response.data.message) {
        if (err.response.data.message.includes('Invalid currency code')) {
          errorMessage = '지원하지 않는 통화 코드입니다. 기본 통화 중 하나를 선택해주세요.';
        } else {
          errorMessage += ': ' + err.response.data.message;
        }
      } else {
        errorMessage += ': ' + err.message;
      }
      
      setError(errorMessage);
      console.error('환율 정보 조회 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  // 통화 변환 API 호출
  const convertCurrency = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(
        `/exchange/convert?from=${conversionData.from}&to=${conversionData.to}&amount=${conversionData.amount}`
      );
      setConversionData(response.data);
    } catch (err) {
      let errorMessage = '통화 변환에 실패했습니다';
      
      // 오류 메시지에 통화 코드 문제가 있는지 확인
      if (err.response && err.response.data && err.response.data.message) {
        if (err.response.data.message.includes('Invalid currency code')) {
          errorMessage = '지원하지 않는 통화 코드입니다. 기본 통화 중 하나를 선택해주세요.';
        } else {
          errorMessage += ': ' + err.response.data.message;
        }
      } else {
        errorMessage += ': ' + err.message;
      }
      
      setError(errorMessage);
      console.error('통화 변환 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  // 환율 정보 폼 제출 핸들러
  const handleRateSubmit = (e) => {
    e.preventDefault();
    fetchExchangeRate();
  };

  // 변환 폼 제출 핸들러
  const handleConvertSubmit = (e) => {
    e.preventDefault();
    convertCurrency();
  };

  // 입력 변경 핸들러
  const handleRateChange = (e) => {
    const { name, value } = e.target;
    setBaseRate(prev => ({ ...prev, [name]: value }));
  };

  const handleConversionChange = (e) => {
    const { name, value } = e.target;
    setConversionData(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? parseFloat(value) || 0 : value 
    }));
  };

  return (
    <div className="exchange-container">
      {/* <h1>환율 정보 서비스</h1> */}
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="exchange-card">
        <h2>현재 환율 조회</h2>
        <form onSubmit={handleRateSubmit}>
          <div className="form-group">
            <label>기준 통화:</label>
            <div className="static-field">한국 원화 (KRW)</div>
            <input type="hidden" name="base" value="KRW" />
          </div>
          
          <div className="form-group">
            <label>대상 통화:</label>
            <select 
              name="target" 
              value={baseRate.target} 
              onChange={handleRateChange}
              disabled={loadingCurrencies}
            >
              {currencies.filter(option => option.value !== 'KRW').map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button className="exchange-button" type="submit" disabled={loading || loadingCurrencies}>
            {loading ? '로딩 중...' : '환율 조회'}
          </button>
        </form>
        
        {baseRate.rate > 0 && (
          <div className="result-box">
            <p>
              <strong>1 {baseRate.target}</strong> = <strong>{(1/baseRate.rate).toFixed(2)} 대한민국원</strong>
            </p>
            {baseRate.timestamp && (
              <p className="timestamp">기준 시간: {new Date(baseRate.timestamp * 1000).toLocaleString()}</p>
            )}
          </div>
        )}
      </div>
      
      <div className="exchange-card">
        <h2>통화 변환 계산기</h2>
        <form onSubmit={handleConvertSubmit}>
          <div className="form-group">
            <label>변환할 금액:</label>
            <input
              type="number"
              name="amount"
              value={conversionData.amount}
              onChange={handleConversionChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label>출발 통화:</label>
            <select 
              name="from" 
              value={conversionData.from} 
              onChange={handleConversionChange}
              disabled={loadingCurrencies}
            >
              {currencies.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>도착 통화:</label>
            <select 
              name="to" 
              value={conversionData.to} 
              onChange={handleConversionChange}
              disabled={loadingCurrencies}
            >
              {currencies.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button className="exchange-button" type="submit" disabled={loading || loadingCurrencies}>
            {loading ? '변환 중...' : '금액 변환'}
          </button>
        </form>
        
        {conversionData.result > 0 && (
          <div className="result-box">
            <p>
              <strong>{conversionData.amount.toFixed(2)} {conversionData.from}</strong>는 
              <strong> {conversionData.result.toFixed(2)} {conversionData.to}</strong> 입니다.
            </p>
            {conversionData.date && (
              <p className="timestamp">기준 날짜: {conversionData.date}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exchange;