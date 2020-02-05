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
export type ECEFPoint = {
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
export type LLAPoint = {
    lat: number,
    lon: number,
    alt: number
}

/**
 * Vector structure for Earth Centered Earth Fixed velocity.
 * vx is the x component of the velocity
 * vy is the y component of the velocity
 * vz is the z component of the velocity
 */
export type ECEFVelocity = {
    vx: number,
    vy: number,
    vz: number
}

/**
 * Vector structure for North East Down velocity.
 * vn is the North component of the velocity
 * ve is the East component of the velocity
 * vd is the Down component of the velocity
 */
export type NEDVelocity = {
    vn: number,
    ve: number,
    vd: number
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

    const ecefPt: ECEFPoint = {
        x: utils.trimDecimalValue(x, 4),
        y: utils.trimDecimalValue(y, 4),
        z: utils.trimDecimalValue(z, 4)
    };
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

    const p = Math.hypot(ecefPt.x, ecefPt.y);;
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
    const llaPt: LLAPoint = {
        lat: utils.trimDecimalValue(utils.radToDeg(latRad), 7),
        lon: utils.trimDecimalValue(utils.radToDeg(lonRad), 7),
        alt: utils.trimDecimalValue(alt, 4)
    };
    return llaPt;
}

/**
 * Rotates ECEF velocity components into North East Down components
 *
 * @param ecefVel Components of the ECEF velocity vector
 * @param lat Latitude of the point in degrees
 * @param lon Longitude of the point in degrees
 */
export function ECEFToNED(ecefVel: ECEFVelocity, lat: number, lon: number): NEDVelocity {
    const latRad = utils.degToRad(lat);
    const lonRad = utils.degToRad(lon);

    // Multiply the vector components by a Direction Cosine Matrix (DCM) to rotate the components to NED
    const vn = (-ecefVel.vx * Math.sin(latRad) * Math.cos(lonRad)) - (ecefVel.vy * Math.sin(latRad) * Math.sin(lonRad)) + (ecefVel.vz * Math.cos(latRad));
    const ve = (-ecefVel.vx * Math.sin(lonRad)) + (ecefVel.vy * Math.cos(lonRad));
    const vd = (-ecefVel.vx * Math.cos(latRad) * Math.cos(lonRad)) - (ecefVel.vy * Math.cos(latRad) * Math.sin(lonRad)) - (ecefVel.vz * Math.sin(latRad));

    return { vn: utils.trimDecimalValue(vn, 4), ve: utils.trimDecimalValue(ve, 4), vd: utils.trimDecimalValue(vd, 4) };
}

/**
 * Rotates the North East Down velocity components into ECEF components
 *
 * @param nedVel Components of the NED velocity
 * @param lat Latitude of the point in degrees
 * @param lon Longitude of the point in degrees
 */
export function NEDtoECEF(nedVel: NEDVelocity, lat: number, lon: number): ECEFVelocity {
    const latRad = utils.degToRad(lat);
    const lonRad = utils.degToRad(lon);

    // Multiply the components by the transpose of the first DCM to rotate the components back to ECEF
    const vx = -(nedVel.vn * (Math.sin(latRad) * Math.cos(lonRad))) - (nedVel.ve * (Math.sin(lonRad))) - (nedVel.vd * (Math.cos(latRad) * Math.cos(lonRad)));
    const vy = -(nedVel.vn * (Math.sin(latRad) * Math.sin(lonRad))) + (nedVel.ve * Math.cos(lonRad)) - (nedVel.vd * (Math.cos(latRad) * Math.sin(lonRad)));
    const vz = (nedVel.vn * Math.cos(latRad)) - (nedVel.vd * Math.sin(latRad));

    return { vx: utils.trimDecimalValue(vx, 4), vy: utils.trimDecimalValue(vy, 4), vz: utils.trimDecimalValue(vz, 4) };
}

/**
 * Calculate the ground speed of a given NED velocity
 *
 * @param nedVel The North East Down velocity vector
 * @returns the ground speed
 */
export function getGroundSpeed(nedVel: NEDVelocity): number {
    return Math.hypot(nedVel.vn, nedVel.ve);
}

/**
 * Calculate the heading of a given NED velocity
 *
 * @param nedVel The North East Down velocity vector
 * @returns The heading in degrees from north in the range 0-360
 */
export function getHeading(nedVel: NEDVelocity): number {
    const headingRad = Math.atan(nedVel.ve / nedVel.vn);
    let heading = utils.radToDeg(headingRad);

    if (heading < 0) {
        heading += 360;
    }

    return heading;
}

//*** Utility functions ***//

/**
 * Calculates the radius of the WGS84 ellipsoid at the given latitude in meters
 *
 * @param latRad Latitude of the point in radians
 * @returns the radius of the ellipsoid at the latitiude in meters
 */
function radiusOfCurvature(latRad: number): number {
    const radiusOfCurvature = constants.RADIUS / Math.sqrt(1 - (Math.pow(constants.FIRST_ECCENTRICITY, 2) * Math.pow(Math.sin(latRad), 2)));
    return radiusOfCurvature;
}

