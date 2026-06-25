export type Location = {
  id: string;
  name: string;
  subtitle: string;
  coords: string;
  weather: string;
  walkArea: string;
  suitability: string;
  info: string;
  images: string[];
};

export const sampleLocations: Location[] = [
  {
    id: 'lakeview',
    name: 'Lakeview Camp',
    subtitle: 'Calm water, soft shoreline',
    coords: '8.5 km west of the trailhead',
    weather: 'Sunny, 22°C',
    walkArea: 'Easy, 1.2 km loop',
    suitability: 'Ideal for families and first-time campers.',
    info: 'A peaceful lakeside location with easy trails, quiet evenings, and a safe swim area. Perfect for a short weekend escape.',
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'pinecrest',
    name: 'Pinecrest Ridge',
    subtitle: 'Ridge camping with sky views',
    coords: '12 km north of base camp',
    weather: 'Partly cloudy, 18°C',
    walkArea: 'Moderate, 2.4 km ridge trail',
    suitability: 'Best for experienced hikers and stargazers.',
    info: 'An elevated ridgeline campsite with open vistas, cool breezes, and a scenic sunrise spot. Great for an adventurous overnight stay.',
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1530629013299-6cb0e1c72d2d?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'forestbay',
    name: 'Forest Bay',
    subtitle: 'Sheltered woodland camp',
    coords: '4.8 km south of the visitor center',
    weather: 'Cloudy, 16°C',
    walkArea: 'Easy, boardwalk trails',
    suitability: 'Great for nature lovers and quiet reflection.',
    info: 'A serene campsite nestled in dense forest with nearby boardwalk trails and a quiet bay. Excellent for wildlife watching and a relaxed pace.',
    images: [
      'https://images.unsplash.com/photo-1516515429570-680fda2b21d1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80',
    ],
  },
];
