import { useEffect, useState } from 'react';

const useGetIP = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Menggunakan ip-api.com (Tanpa API Key)
        const response = await fetch('http://ip-api.com/json/?fields=status,message,country,regionName,city,district,lat,lon,isp,as,query');
        const result = await response.json();
        
        if (result.status === 'success') {
          setData(result);
        }
      } catch (error) {
        console.error("Gagal mengambil data IP-API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { data, loading };
};

export default useGetIP;