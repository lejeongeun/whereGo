import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import './Exchange.css'; 

function Exchange () {
  // 상태 관리
  const [baseRate, setBaseRate] = useState({
    base: 'USD',
    target: 'KRW',
    rate: 0,
    timestamp: ''
  });
  const [conversionData, setConversionData] = useState({
    from: 'USD',
    to: 'KRW',
    amount: 1,
    result: 0,
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 지원되는 통화 옵션
  const currencyOptions = [
    { value: 'USD', label: '미국 달러 (USD)' },
    { value: 'KRW', label: '한국 원화 (KRW)' },
    { value: 'EUR', label: '유로 (EUR)' },
    { value: 'JPY', label: '일본 엔화 (JPY)' },
    { value: 'VND', label: '베트남 동 (VND)' }
  ];

  // 컴포넌트 마운트 시 환율 정보 가져오기
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  // 환율 정보 API 호출
  const fetchExchangeRate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/exchange/rate?base=${baseRate.base}&target=${baseRate.target}`);
      setBaseRate(response.data);
    } catch (err) {
      setError('환율 정보를 불러오는데 실패했습니다: ' + err);
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
      setError('통화 변환에 실패했습니다: ' + err);
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
      <h1>환율 정보 서비스</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="exchange-card">
        <h2>현재 환율 조회</h2>
        <form onSubmit={handleRateSubmit}>
          <div className="form-group">
            <label>기준 통화:</label>
            <select 
              name="base" 
              value={baseRate.base} 
              onChange={handleRateChange}
            >
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>대상 통화:</label>
            <select 
              name="target" 
              value={baseRate.target} 
              onChange={handleRateChange}
            >
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? '로딩 중...' : '환율 조회'}
          </button>
        </form>
        
        {baseRate.rate > 0 && (
          <div className="result-box">
            <p>
              <strong>1 {baseRate.base}</strong>는 <strong>{baseRate.rate.toFixed(2)} {baseRate.target}</strong> 입니다.
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
            >
              {currencyOptions.map(option => (
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
            >
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" disabled={loading}>
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