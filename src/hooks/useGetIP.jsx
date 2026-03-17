import { useEffect, useState } from 'react';

const useGetIP = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        // Menggunakan freeipapi.com (Mendukung HTTPS secara native)
        const response = await fetch('https://freeipapi.com/api/json');
        
        if (!response.ok) throw new Error('Endpoint tidak merespon');
        
        const result = await response.json();
        
        // Mapping data agar konsisten dengan template EmailJS Anda
        setData({
          ip: result.ipAddress,
          city: result.cityName,
          regionName: result.regionName,
          country: result.countryName,
          lat: result.latitude,
          lon: result.longitude,
          isp: result.asnOrg || 'N/A', // Nama Provider/ISP
          asn: `AS${result.asn || ''}`,
          zip: result.zipCode || ''
        });
      } catch (err) {
        console.error("Fetch Error:", err);
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