export const AMENITIES = [
  { key: 'parking', label: 'Parking' },
  { key: 'gym', label: 'Gym' },
  { key: 'laundry_in_unit', label: 'In-Unit Laundry' },
  { key: 'laundry_shared', label: 'Shared Laundry' },
  { key: 'pet_friendly', label: 'Pet Friendly' },
  { key: 'dishwasher', label: 'Dishwasher' },
  { key: 'ac', label: 'A/C' },
  { key: 'balcony', label: 'Balcony/Patio' },
  { key: 'utilities_included', label: 'Utilities Included' },
  { key: 'storage', label: 'Storage' },
  { key: 'rooftop', label: 'Rooftop Access' },
  { key: 'concierge', label: 'Concierge' },
  { key: 'pool', label: 'Pool' },
  { key: 'hardwood', label: 'Hardwood Floors' },
  { key: 'high_ceilings', label: 'High Ceilings' },
  { key: 'elevator', label: 'Elevator' },
]

export const STATUS_CONFIG = {
  considering: {
    label: 'Considering',
    bgClass: 'bg-blue-100 text-blue-700',
    dotClass: 'bg-blue-500',
  },
  visited: {
    label: 'Visited',
    bgClass: 'bg-violet-100 text-violet-700',
    dotClass: 'bg-violet-500',
  },
  top_pick: {
    label: 'Top Pick',
    bgClass: 'bg-emerald-100 text-emerald-700',
    dotClass: 'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    bgClass: 'bg-rose-100 text-rose-700',
    dotClass: 'bg-rose-500',
  },
}

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Rating: High to Low' },
]
