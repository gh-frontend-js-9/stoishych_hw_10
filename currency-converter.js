const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await axios.get('http://www.apilayer.net/api/live?access_key=942d5225faad8049870ad7bfdf0235d0&format=1');
    const rate = response.data.quotes;
    const usd = 1 / rate[fromCurrency + fromCurrency];
    const exchangeRate = usd * rate[fromCurrency + toCurrency];
    return exchangeRate;
  } catch (error) {
    throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
  }
};

const getCountries = async (currencyCode) => {
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
    return response.data.map(country => country.name);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  let exchangeRate;
  let countries;

  await Promise.all([getExchangeRate(fromCurrency, toCurrency), getCountries(toCurrency)])
    .then(([resultOfExchange, resultOfCountries]) => {
      exchangeRate = resultOfExchange;
      countries = resultOfCountries;
    });

  // const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  // const countries = await getCountries(toCurrency);

  const convertedAmount = (amount * exchangeRate).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
};

convertCurrency('USD', 'EUR', 20)
  .then((message) => {
    console.log(message);
  }).catch((error) => {
    console.log(error.message);
  });