// Sistema de colores para etiquetas
const TAG_COLORS = [
  "hsl(210, 100%, 60%)", // Azul
  "hsl(150, 80%, 50%)",  // Verde
  "hsl(280, 100%, 65%)", // Púrpura
  "hsl(45, 100%, 55%)",  // Amarillo
  "hsl(15, 100%, 60%)",  // Naranja
  "hsl(340, 100%, 60%)", // Rosa
  "hsl(190, 80%, 50%)",  // Cian
  "hsl(120, 60%, 50%)",  // Verde lima
  "hsl(260, 80%, 60%)",  // Índigo
  "hsl(30, 90%, 55%)",   // Naranja cálido
  "hsl(300, 70%, 60%)",  // Magenta
  "hsl(180, 70%, 45%)",  // Turquesa
];

// Función para obtener un color consistente para cada etiqueta
export function getTagColor(tag: string): string {
  // Generar un hash simple del nombre de la etiqueta
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    const char = tag.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a entero de 32 bits
  }
  
  // Usar el hash para seleccionar un color de forma consistente
  const colorIndex = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[colorIndex];
}

// Función para obtener una versión más clara del color para backgrounds
export function getTagBackgroundColor(tag: string): string {
  const baseColor = getTagColor(tag);
  // Extraer los valores HSL y reducir la saturación y aumentar la luminosidad
  const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (hslMatch) {
    const [, h, s, l] = hslMatch;
    return `hsl(${h}, ${Math.max(30, parseInt(s) * 0.3)}%, ${Math.min(90, parseInt(l) + 40)}%)`;
  }
  return baseColor;
}