/**
 * This module contains functions to convert between WGS84 Lat Lon Alt
 * and ECEF X Y Z coordinate systems.
 *
 * The fomulae are based on the paper, "Datum Transformations of GPS Positions"
 * The PDF of the paper can be found here:
 * http://www.nalresearch.com/files/Standard%20Modems/A3LA-XG/A3LA-XG%20SW%20Version%201.0.0/GPS%20Technical%20Documents/GPS.G1-X-00006%20(Datum%20Transformations).pdf
 */

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
export function LLAToECEF(llaPt: LLAPoint): ECEFPoint {
    const latRad = utils.degToRad(llaPt.lat);
    const lonRad = utils.degToRad(llaPt.lon);
    const N = radiusOfCurvature(latRad);

    const x = (N + llaPt.alt) * Math.cos(latRad) * Math.cos(lonRad);
    const y = (N + llaPt.alt) * Math.cos(latRad) * Math.sin(lonRad);
    const z = (N * (Math.pow(constants.POLAR_RADIUS, 2) / Math.pow(constants.RADIUS, 2)) + llaPt.alt) * Math.sin(latRad);

    const ecefPt: ECEFPoint = { x: x, y: y, z: z };
    return ecefPt;
}

/**
 * Projects an ECEF x, y, z point to lat, lon, alt coordinates
 * This is an implementation of the closed set formula described in section 2.2
 * of the paper.
 *
 * @param {ECEFPoint} ecefPt
 * @returns {LLAPoint}
 */
export function ECEFToLLA(ecefPt: ECEFPoint): LLAPoint {
    // Calculate auxiliary values
    const p = Math.sqrt((ecefPt.x * ecefPt.x) + (ecefPt.y * ecefPt.y));
    const theta = Math.atan((ecefPt.z * constants.RADIUS) / (p * constants.POLAR_RADIUS));

    // Calculate longitude
    const lonRad = Math.atan(ecefPt.y / ecefPt.x);

    // Calculate latitude
    const numerator = ecefPt.z + Math.pow(constants.SECOND_ECCENTRICITY, 2) * constants.POLAR_RADIUS * Math.pow(Math.sin(theta), 3);
    const denominator = p - Math.pow(constants.FIRST_ECCENTRICITY, 2) * constants.RADIUS * Math.pow(Math.cos(theta), 3);
    const latRad = Math.atan(numerator / denominator);

    // Calculate altitude above the ellipsoid
    const N = radiusOfCurvature(latRad);
    const alt = (p / Math.cos(latRad)) - N;

    // Convert lat and lon to degrees and return the LLA point
    const llaPt: LLAPoint = { lat: utils.radToDeg(latRad), lon: utils.radToDeg(lonRad), alt: alt };
    return llaPt;
}

function radiusOfCurvature(lat: number): number {
    const radiusOfCurvature = constants.RADIUS / Math.sqrt(1 - (Math.pow(constants.FIRST_ECCENTRICITY, 2) * Math.pow(Math.sin(lat), 2)));
    return radiusOfCurvature;
}
