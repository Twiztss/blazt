import { useCallback, useEffect, useState } from "react"

export const useFetch = <T>(url : string, options? : RequestInit) => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true),
        setError(null)

        try {
            const result = await fetchAPI(url, options)
            setData(result.data)

        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }, [url, options])
    
    useEffect(() => {
        fetchData(), [fetchData]
    })

    return { data, loading, error, refetch : fetchData}
}

export const fetchAPI = async (url : string, options? : RequestInit) => {
    
    try {
        const response = await fetch(url, options)
        if (!response.ok) {
            new Error(`HTTP Error Status : ${response.status}`)
        }

        return await response.json()
    } catch (err) {
        console.error("Fetch error", err)
        throw err
    }
}

export const getLocationName = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_KEY}`);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      // You can choose what to display: city, street, formatted address, etc.
      return data.features[0].properties.formatted; // Full address
      // Or: return data.features[0].properties.city; // Just the city
    } else {
      console.warn('No address found for these coordinates');
      return null;
    }
  } catch (err) {
    console.error('Reverse geocoding failed', err);
    throw err;
  }
};