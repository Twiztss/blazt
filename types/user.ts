// Types
export type Location = {
  lat: number;
  lng: number;
};

export type User = {
  id: string
  name: string
  timestamp: string
  location: Location
  price: number,
};