/**
 * Reference banner, shown exactly as supplied (1600×528, never cropped or recoloured).
 * Files live in /public/images/reference/.
 */
export const HERO = {
  radiation: { src: '/images/reference/radiation.jpg', alt: 'Astronaut in open space between cosmic radiation streams and the Sun’s magnetic field' },
  emergency: { src: '/images/reference/emergency.jpg', alt: 'Astronaut operating a medical monitoring console beside a first-aid kit, with Earth visible through the window' },
  psychological: { src: '/images/reference/psychological.jpg', alt: 'Astronaut relaxing in a crew cabin with a view of Earth' },
  gravity: { src: '/images/reference/gravity.jpg', alt: 'Astronaut floating in microgravity with skeleton overlay, beside a standing astronaut on Mars' },
  nutrition: { src: '/images/reference/nutrition.jpg', alt: 'Astronaut with lung overlay holding food in a habitat with air circulation systems and food storage' },
};
export default function HeroImage({ name }) {
  const h = HERO[name];
  return <img src={h.src} alt={h.alt} width="1600" height="528" className="img-in block w-full h-auto" />;
}
