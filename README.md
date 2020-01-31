# ECEFUtils
This package contains functions to convert between Earth Centered Earth Fixed coordinates and Latitude, Longitude, Altitude coordinates. It also contains functions to project ECEF velocity vectors to North East Down (NED) velocity, and functions to determine heading and ground speed from the NED velocity.

## Types
* ECEFPoint (x, y, z)
  * x: ECEF X coordinate
  * y: ECEF Y coordinate
  * z: ECEF Z coordinate
* LLAPoint (lat, lon, alt)
  * lat: Latitude in degrees
  * lon: Longitude in degrees
  * alt: altitude above WGS84 ellipsoid
* ECEFVelocity (vx, vy, vz)
  * vx: ECEF velocity X component
  * vy: ECEF velocity Y component
  * vz: ECEF velocity Z component
* NEDVelocity (vn, ve, vd)
  * vn: Tangential velocity North component
  * ve: Tangential velocity East component
  * vd: Tangential velocity Down component

## Functions
* LLAToECEF(llaPt: LLAPoint): ECEFPoint
  * Converts a Lat Lon Alt point to an ECEF point
* ECEFToLLA(ecefPt: ECEFPoint): LLAPoint
  * Converts an ECEF point to a Lat Lon Alt point
* ECEFToNED(ecefVel: ECEFVelocity, lat: number, lon: number)
: NEDVelocity
  * Rotates an ECEF vector to a North East Down vector
* NEDtoECEF(nedVel: NEDVelocity, lat: number, lon: number): ECEFVelocity
  * Rotates a North East Down vector to an ECEF vector
* getGroundSpeed(nedVel: NEDVelocity): number
  * Calculates ground speed from a NED vector
* getHeading(nedVel: NEDVelocity): number
  * Calculates the heading for the NED vector. The heading will be in degrees from North in the range 0-360.