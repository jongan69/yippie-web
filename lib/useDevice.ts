import { useEffect, useState } from 'react';

interface DeviceData {
  userAgent?: string;
}

interface DetectDeviceResponse {
  data: DeviceData | unknown;
  isMobileRes: boolean;
}

export const useDetectDevice = (): DetectDeviceResponse => {
  const [detectData, setDetectData] = useState<DetectDeviceResponse>({
    data: {},
    isMobileRes: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/deviceType');
        const data = await response.json();

        const isMobileRes = data.userAgent ? /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(data.userAgent) : false;
        console.log(`IsMobile: ${isMobileRes}`);
        setDetectData({ data, isMobileRes });
      } catch (error) {
        console.log('Error: ', error);
        setDetectData({ data: error, isMobileRes: false });
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

  return detectData;
};
