import axios from 'axios';

let cachedRate = null;
let lastFetched = 0;
const CACHE_DURATION = 3600000; // 1 hour

export const CurrencyService = {
  getExchangeRate: async (from = 'USD', to = 'INR') => {
    const now = Date.now();
    if (cachedRate && (now - lastFetched < CACHE_DURATION)) {
      return cachedRate;
    }

    try {
      // Using a reliable free API. In a real production app, consider a paid one or an env var for the API key.
      const response = await axios.get(`https://open.er-api.com/v6/latest/${from}`);
      if (response.data && response.data.rates && response.data.rates[to]) {
        cachedRate = response.data.rates[to];
        lastFetched = now;
        return cachedRate;
      }
      throw new Error('Invalid response from currency API');
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error.message);
      // Fallback to a reasonable default if API fails
      return cachedRate || 83.0; 
    }
  }
};
