import { useEffect, useState } from 'react';

const useGetIP = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        // Endpoint ip-api.com (Note: Free version is HTTP only)
        const response = await fetch('http://ip-api.com/json/');
        
        if (!response.ok) throw new Error('Gagal fetch data dari ip-api');
        
        const result = await response.json();

        if (result.status === 'fail') {
          throw new Error(result.message);
        }
        
        // Mapping sesuai dokumentasi ip-api.com
        setData({
          ip: result.query,          // ip-api menggunakan 'query' untuk IP
          city: result.city,
          regionName: result.regionName,
          country: result.country,
          lat: result.lat,
          lon: result.lon,
          isp: result.isp,           // ip-api memberikan data ISP lengkap
          org: result.org,           // Nama Organisasi
          asn: result.as,            // Format: "AS12345 Nama Provider"
          zip: result.zip
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