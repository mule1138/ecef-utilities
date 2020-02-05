export const RADIUS = 6378137;
export const FLATTENING = 1 / 298.257223563;
export const POLAR_RADIUS = RADIUS * (1 - FLATTENING);
export const FIRST_ECCENTRICITY = Math.sqrt((Math.pow(RADIUS, 2) - Math.pow(POLAR_RADIUS, 2)) / Math.pow(RADIUS, 2));
export const SECOND_ECCENTRICITY = Math.sqrt((Math.pow(RADIUS, 2) - Math.pow(POLAR_RADIUS, 2)) / Math.pow(POLAR_RADIUS, 2));
