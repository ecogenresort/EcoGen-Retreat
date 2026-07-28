export interface GuestData {
  name: string;
  phone: string;
  email: string;
  req: string;
  guests: number;
}

export type BookingStage = 'dates' | 'details' | 'confirmed';

export interface EventItem {
  title: string;
  description: string;
  image: string;
}

export interface Review {
  name: string;
  text: string;
  rating: number;
}