import * as projector from '../src/ecef_uilts';
import {trimDecimalValue} from "../src/utils";
import { assert } from 'chai';
import 'mocha';

describe('ECEF_Utils', () => {
    describe('LLAToECEF', () => {
        it('should reproject a LLA point as an ECEF point on the surface', () => {
            const testLLAPt = { lat: 28.4187, lon: -81.5812, alt: 33.0 };
            const testECEFPt = {x:821905.3405, y:-5553322.6958, z:3017411.1335};

            const ecefPt = projector.LLAToECEF(testLLAPt);
            ecefPt.x = trimDecimalValue(ecefPt.x, 4);
            ecefPt.y = trimDecimalValue(ecefPt.y, 4);
            ecefPt.z = trimDecimalValue(ecefPt.z, 4);
            assert.deepEqual(ecefPt, testECEFPt);
        });

        it('should reproject a LLA point as an ECEF point in LEO', () => {
            const testLLAPt = { lat: 28.3734, lon: -81.5465, alt: 354056.0 };
            const testECEFPt = {x:871411.1278, y:-5863295.2438, z:3181232.062};

            const ecefPt = projector.LLAToECEF(testLLAPt);
            ecefPt.x = trimDecimalValue(ecefPt.x, 4);
            ecefPt.y = trimDecimalValue(ecefPt.y, 4);
            ecefPt.z = trimDecimalValue(ecefPt.z, 4);
            assert.deepEqual(ecefPt, testECEFPt);
        });
    });

    describe('ECEFToLLA', () => {
        it('should reproject a LLA point on the surface as an ECEF point', () => {
            const testLLAPt = { lat: 28.4187, lon: -81.5812, alt: 33.0019 };
            const testECEFPt = {x:821905.34, y:-5553322.70, z:3017411.13};

            const llaPt = projector.ECEFToLLA(testECEFPt);
            llaPt.lat = trimDecimalValue(llaPt.lat, 7);
            llaPt.lon = trimDecimalValue(llaPt.lon, 7);
            llaPt.alt = trimDecimalValue(llaPt.alt, 4);
            assert.deepEqual(llaPt, testLLAPt);
        });

        it('should reproject a LLA point on in LEO as an ECEF point', () => {
            const testLLAPt = { lat: 28.3734, lon: -81.5465, alt: 354056.0003 };
            const testECEFPt = {x:871411.1278, y:-5863295.2438, z:3181232.062};

            const llaPt = projector.ECEFToLLA(testECEFPt);
            llaPt.lat = trimDecimalValue(llaPt.lat, 7);
            llaPt.lon = trimDecimalValue(llaPt.lon, 7);
            llaPt.alt = trimDecimalValue(llaPt.alt, 4);
            assert.deepEqual(llaPt, testLLAPt);
        });
    });

    describe('ECEFToNED', () => {
        it('should reproject a ECEF vector as a NED vector', () => {
            const testNEDVel = { vn: -1.7539, ve: 0.277, vd: -636.3845};
            const testECEFVel = {vx:82.34, vy:-554.45, vz:301.32};

            const nedVel = projector.ECEFToNED(testECEFVel, 28.4187, -81.5812);
            nedVel.vn = trimDecimalValue(nedVel.vn, 4);
            nedVel.ve = trimDecimalValue(nedVel.ve, 4);
            nedVel.vd = trimDecimalValue(nedVel.vd, 4);
            assert.deepEqual(nedVel, testNEDVel);
        });

        it('should reproject a pure Y vector as East vector', () => {
            const testNEDVel = { vn: 0.0, ve: 554.45, vd: 0.0};
            const testECEFVel = {vx:0.0, vy:554.45, vz:0.0};

            const nedVel = projector.ECEFToNED(testECEFVel, 0.0, 0.0);
            nedVel.vn = trimDecimalValue(nedVel.vn, 4);
            nedVel.ve = trimDecimalValue(nedVel.ve, 4);
            nedVel.vd = trimDecimalValue(nedVel.vd, 4);
            assert.deepEqual(nedVel, testNEDVel);
        });

        it('should reproject a pure Z vector as North vector', () => {
            const testNEDVel = { vn: 123.456, ve: 0.0, vd: 0.0};
            const testECEFVel = {vx:0.0, vy:0.0, vz:123.456};

            const nedVel = projector.ECEFToNED(testECEFVel, 0.0, 0.0);
            nedVel.vn = trimDecimalValue(nedVel.vn, 4);
            nedVel.ve = trimDecimalValue(nedVel.ve, 4);
            nedVel.vd = trimDecimalValue(nedVel.vd, 4);
            assert.deepEqual(nedVel, testNEDVel);
        });

        it('should reproject a pure down vector', () => {
            const testNEDVel = { vn: 0.0, ve: 0.0, vd: 123};
            const testECEFVel = {vx:-123.0, vy:0.0, vz:0.0};

            const nedVel = projector.ECEFToNED(testECEFVel, 0.0, 0.0);
            nedVel.vn = trimDecimalValue(nedVel.vn, 4);
            nedVel.ve = trimDecimalValue(nedVel.ve, 4);
            nedVel.vd = trimDecimalValue(nedVel.vd, 4);
            assert.deepEqual(nedVel, testNEDVel);
        });
    });

    describe('NEDToECEF', () => {
        it('should reproject a NED vector as an ECEF vector', () => {
            const testNEDVel = { vn: -1.7539, ve: 0.277, vd: -636.3845};
            const testECEFVel = {vx:82.34, vy:-554.45, vz:301.32};

            const ecefVel = projector.NEDtoECEF(testNEDVel, 28.4187, -81.5812);
            ecefVel.vx = trimDecimalValue(ecefVel.vx, 4);
            ecefVel.vy = trimDecimalValue(ecefVel.vy, 4);
            ecefVel.vz = trimDecimalValue(ecefVel.vz, 4);
            assert.deepEqual(ecefVel, testECEFVel);
        });
    });

    describe('getGroundSpeed', () => {
        it('should calculate the ground speed for a given NED vector', () => {
            const testNEDVel = { vn: 34.39, ve: 123.876, vd: -636.3845};

            let speed = projector.getGroundSpeed(testNEDVel);
            speed = trimDecimalValue(speed, 4);
            assert.equal(speed, 128.561);
        });
    });

    describe('getHeading', () => {
        it('should calculate a heading from a NED vector', () => {
            const testNEDVel = { vn: 34.39, ve: 123.876, vd: -636.3845};

            let heading = projector.getHeading(testNEDVel);
            heading = trimDecimalValue(heading, 4);
            assert.equal(heading, 74.4845);
        });

        it('should calculate a heading greater than 180 from a NED vector', () => {
            const testNEDVel = { vn: 34.39, ve: -123.876, vd: -636.3845};

            let heading = projector.getHeading(testNEDVel);
            heading = trimDecimalValue(heading, 4);
            assert.equal(heading, 285.5155);
        });
    });
});