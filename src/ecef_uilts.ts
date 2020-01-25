import * as constants from "./constants";
import * as utils from "./utils";

/**
 * Point structure for Earth Centered Earth Fixed points.
 * x is the x coordinate of the point in meters
 * y is the y coordinate of the point in meters
 * z is the z coordinate of the point in meters
 */
export interface ECEFPoint {
    x: number,
    y: number,
    z: number
}

/**
 * Point structure for Latitude, Longitude, Altitude points.
 * lat is the latitude of the point in degrees
 * lon is the longitude of the point in degrees
 * alt is the height above the ellipsoid in meters
 */
export interface LLAPoint {
    lat: number,
    lon: number,
    alt: number
}

/**
 * Projects a lat, lon, alt point to ECEF x, y, z coordinates
 *
 * @param {LLAPoint} llaPt
 * @returns {ECEFPoint}
 */
export function LLAToECEF (llaPt: LLAPoint): ECEFPoint {
    const latRad = utils.degToRad(llaPt.lat);
    const lonRad = utils.degToRad(llaPt.lon);
    const N = radiusOfCurvature(latRad);

    const x = (N + llaPt.alt) * Math.cos(latRad) * Math.cos(lonRad);
    const y = (N + llaPt.alt) * Math.cos(latRad) * Math.sin(lonRad);
    const z = (N * (Math.pow(constants.POLAR_RADIUS, 2) / Math.pow(constants.RADIUS, 2)) + llaPt.alt) * Math.sin(latRad);

    const ecefPt: ECEFPoint = {x: x, y: y, z: z};
    return ecefPt;
}

/**
 * Projects an ECEF x, y, z point to lat, lon, alt coordinates
 *
 * @param {ECEFPoint} ecefPt
 * @returns {LLAPoint}
 */
export function ECEFToLLA (ecefPt: ECEFPoint): LLAPoint {
    const llaPt: LLAPoint = {lat: 0, lon: 0, alt: 0};
    return llaPt;
}

function radiusOfCurvature(lat:number): number {
    const radiusOfCurvature: number = constants.RADIUS / Math.sqrt(1 - (Math.pow(constants.FIRST_ECCENTRICITY, 2) * Math.pow(Math.sin(lat), 2)))

    return radiusOfCurvature;
}

