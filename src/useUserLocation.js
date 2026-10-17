import { useState } from 'react'

// Location stays in React state only: never stored or sent anywhere.
export function useUserLocation() {
  const [state, setState] = useState({ status: 'idle', coords: null })

  const request = () => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'unavailable', coords: null })
      return
    }
    setState({ status: 'asking', coords: null })
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ status: 'granted', coords: { lat: pos.coords.latitude, lng: pos.coords.longitude } }),
      (err) => setState({ status: err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable', coords: null }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  }

  const clear = () => setState({ status: 'idle', coords: null })

  return { ...state, request, clear }
}
