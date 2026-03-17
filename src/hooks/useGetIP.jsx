import { useEffect, useState } from 'react';

const useGetIP = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        // Tambahkan https dan pastikan endpoint benar
        const response = await fetch('https://freeipapi.com/api/json');
        
        if (!response.ok) throw new Error('Gagal fetch data');
        
        const result = await response.json();
        
        // Mapping Khusus FreeIPAPI
        setData({
          ip: result.ipAddress,
          city: result.cityName,
          regionName: result.regionName,
          country: result.countryName,
          lat: result.latitude,
          lon: result.longitude,
          isp: 'N/A', // FreeIPAPI versi gratis sering tidak memberikan nama ISP/Org secara detail
          asn: `AS${result.asn || ''}`,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { data, loading, error };
};

export default useGetIP;