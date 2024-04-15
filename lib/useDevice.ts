export const useDetectDevice = () => {
  const res = fetch('/api/deviceType')
    .then(async result => {
      const data = await result.json();
      const isMobile = data.userAgent!.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i) ?? false
      console.log(`IsMobile: ${isMobile}`)
      return { data, isMobile };
    })
    .catch(err => {
      console.log('Error: ', err);
      return {}
    })

  return res;
}