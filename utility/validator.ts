import { cityBoundary } from "@/component/Home/ItineraryPlan/CityMap/boundary";

export function isPointInPolygon(
  point: { lat: number; lng: number },
): boolean {
  let inside = false;
  const x = point.lng;
  const y = point.lat;

  for (let i = 0, j = cityBoundary.length - 1; i < cityBoundary.length; j = i++) {
    const xi = cityBoundary[i].lng;
    const yi = cityBoundary[i].lat;
    const xj = cityBoundary[j].lng;
    const yj = cityBoundary[j].lat;
    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}