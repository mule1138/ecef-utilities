/**
 * This module contains functions to convert between WGS84 Lat Lon Alt
 * and ECEF X Y Z coordinate systems.
 *
 * The fomulae in this module are primarily based on the paper, "Datum
 * Transformations of GPS Positions". The paper can be found here:
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
 * Interface for tangent velocity types. Implemented in East North Up and North
 * East Down types
 */
interface tanVelocity {
    vn: number,
    ve: number
};

/**
 * Vector structure for North East Down velocity.
 * vn is the North component of the velocity
 * ve is the East component of the velocity
 * vd is the Down component of the velocity
 */
export type NEDVelocity = tanVelocity & { vd: number };

/**
 * Vector structure for East North Up velocity.
 * ve is the East component of the velocity
 * vn is the North component of the velocity
 * vu is the Up component of the velocity
 */
export type ENUVelocity = tanVelocity & { vu: number };

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

    const p = utils.hypot(ecefPt.x, ecefPt.y);;
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
        lat: utils.radToDeg(latRad),
        lon: utils.radToDeg(lonRad),
        alt: alt
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

    return { vn: vn, ve: ve, vd: vd };
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

    // Multiply the components by the transpose of the ECEFToNED DCM to rotate the components back to ECEF
    const vx = -(nedVel.vn * (Math.sin(latRad) * Math.cos(lonRad))) - (nedVel.ve * (Math.sin(lonRad))) - (nedVel.vd * (Math.cos(latRad) * Math.cos(lonRad)));
    const vy = -(nedVel.vn * (Math.sin(latRad) * Math.sin(lonRad))) + (nedVel.ve * Math.cos(lonRad)) - (nedVel.vd * (Math.cos(latRad) * Math.sin(lonRad)));
    const vz = (nedVel.vn * Math.cos(latRad)) - (nedVel.vd * Math.sin(latRad));

    return { vx: vx, vy: vy, vz: vz };
}

/**
 * Rotates ECEF velocity components into East North Up components
 *
 * @param ecefVel Components of the ECEF velocity vector
 * @param lat Latitude of the point in degrees
 * @param lon Longitude of the point in degrees
 */
export function ECEFToENU(ecefVel: ECEFVelocity, lat: number, lon: number): ENUVelocity {
    const latRad = utils.degToRad(lat);
    const lonRad = utils.degToRad(lon);

    // Multiply the vector components by a Direction Cosine Matrix (DCM) to rotate the components to NED
    const ve = (-ecefVel.vx * Math.sin(lonRad)) + (ecefVel.vy * Math.cos(lonRad));
    const vn = (-ecefVel.vx * Math.sin(latRad) * Math.cos(lonRad)) - (ecefVel.vy * Math.sin(latRad) * Math.sin(lonRad)) + (ecefVel.vz * Math.cos(latRad));
    const vu = (ecefVel.vx * Math.cos(latRad) * Math.cos(lonRad)) + (ecefVel.vy * Math.cos(latRad) * Math.sin(lonRad)) + (ecefVel.vz * Math.sin(latRad));

    return { vn: vn, ve: ve, vu: vu };
}

/**
 * Rotates the East North Up velocity components into ECEF components
 *
 * @param enuVel Components of the ENU velocity
 * @param lat Latitude of the point in degrees
 * @param lon Longitude of the point in degrees
 */
export function ENUtoECEF(enuVel: ENUVelocity, lat: number, lon: number): ECEFVelocity {
    const latRad = utils.degToRad(lat);
    const lonRad = utils.degToRad(lon);

    // Multiply the components by the transpose of the ECEFToENU DCM to rotate the components back to ECEF
    const vx = (-enuVel.ve * Math.sin(lonRad)) - (enuVel.vn * Math.sin(latRad) * Math.cos(lonRad)) + (enuVel.vu * Math.cos(latRad) * Math.cos(lonRad));
    const vy = (enuVel.ve * Math.cos(lonRad)) - (enuVel.vn * Math.sin(latRad) * Math.sin(lonRad)) + (enuVel.vu * Math.cos(latRad) * Math.sin(lonRad));
    const vz = (enuVel.vn * Math.cos(latRad)) + (enuVel.vu * Math.sin(latRad));

    return { vx: vx, vy: vy, vz: vz };
}

/**
 * Calculate the ground speed of a given NED or ENU velocity
 *
 * @param tanVel The tangent plane velocity vector
 * @returns the ground speed
 */
export function getGroundSpeed(tanVel: tanVelocity): number {
    return utils.hypot(tanVel.vn, tanVel.ve);
}

/**
 * Calculate the heading of a given NED or ENU velocity
 *
 * @param tanVel The tangent plane velocity vector
 * @returns The heading in degrees from north in the range 0-360
 */
export function getHeading(tanVel: tanVelocity): number {
    const headingRad = Math.atan(tanVel.ve / tanVel.vn);
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
 * This radius is the length of the line normal to the surface that intercepts
 * the Z axis. For squashed ellipsoids like Earth, the intercept of a northern
 * latitude is below the center of the Earth (-Z).
 *
 * See https://core.ac.uk/reader/36732690 for a more technical description of
 * the different radii that can be used in geodesy.
 *
 * @param latRad Latitude of the point in radians
 * @returns the radius of the ellipsoid at the latitiude in meters
 */
function radiusOfCurvature(latRad: number): number {
    const radiusOfCurvature = constants.RADIUS / Math.sqrt(1 - (Math.pow(constants.FIRST_ECCENTRICITY, 2) * Math.pow(Math.sin(latRad), 2)));
    return radiusOfCurvature;
}

