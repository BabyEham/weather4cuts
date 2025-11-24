export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { date, time, nx, ny } = req.query;
    const apiKey = process.env.VITE_WEATHER_API_KEY;

    if (!apiKey) {
      console.error('API key not configured');
      return res.status(500).json({ 
        error: 'API key not configured',
        details: 'VITE_WEATHER_API_KEY environment variable is missing'
      });
    }

    const params = new URLSearchParams({
      serviceKey: decodeURIComponent(apiKey),
      numOfRows: '10',
      pageNo: '1',
      base_date: date,
      base_time: time,
      nx: nx,
      ny: ny,
      dataType: 'JSON',
    });

    const apiUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?${params.toString()}`;
    
    console.log('Fetching weather data from:', apiUrl.replace(apiKey, 'HIDDEN'));

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Weather API request failed',
        status: response.status,
        details: errorText
      });
    }

    const data = await response.json();
    
    console.log('Weather API response:', data.response?.header);

    res.status(200).json(data);
  } catch (error) {
    console.error('Weather API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
}
