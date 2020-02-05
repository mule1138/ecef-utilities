import * as projector from '../src/ecef_uilts';
import { assert } from 'chai';
import 'mocha';

describe('ECEF_Utils', () => {
    describe('LLAToECEF', () => {
        it('should reproject a LLA point as an ECEF point', () => {
            const testLLAPt = { lat: 28.4187, lon: -81.5812, alt: 33.0 };
            const testECEFPt = {x:821905.3405, y:-5553322.6958, z:3017411.1335};

            const ecefPt = projector.LLAToECEF(testLLAPt);
            assert.deepEqual(ecefPt, testECEFPt);
        });
    });

    describe('ECEFToLLA', () => {
        it('should reproject a LLA point as an ECEF point', () => {
            const testLLAPt = { lat: 28.4187, lon: -81.5812, alt: 33.0019 };
            const testECEFPt = {x:821905.34, y:-5553322.70, z:3017411.13};

            const llaPt = projector.ECEFToLLA(testECEFPt);
            assert.deepEqual(llaPt, testLLAPt);
        });
    });

    describe('ECEFToNED', () => {
        it('should reproject a ECEF vector as a NED vector', () => {
            const testNEDVel = { vn: -1.7539, ve: 0.277, vd: -636.3845};
            const testECEFVel = {vx:82.34, vy:-554.45, vz:301.32};

            const nedVel = projector.ECEFToNED(testECEFVel, 28.4187, -81.5812);
            assert.deepEqual(nedVel, testNEDVel);
        });

        it('should reproject a pure Y vector as East vector', () => {
            const testNEDVel = { vn: 0.0, ve: 554.45, vd: 0.0};
            const testECEFVel = {vx:0.0, vy:554.45, vz:0.0};

            const nedVel = projector.ECEFToNED(testECEFVel, 0.0, 0.0);
            assert.deepEqual(nedVel, testNEDVel);
        });

        it('should reproject a pure Z vector as North vector', () => {
            const testNEDVel = { vn: 123.456, ve: 0.0, vd: 0.0};
            const testECEFVel = {vx:0.0, vy:0.0, vz:123.456};

            const nedVel = projector.ECEFToNED(testECEFVel, 0.0, 0.0);
            assert.deepEqual(nedVel, testNEDVel);
        });

        it('should reproject a pure down vector', () => {
            const testNEDVel = { vn: 0.0, ve: 0.0, vd: 123};
            const testECEFVel = {vx:-123.0, vy:0.0, vz:0.0};

            const nedVel = projector.ECEFToNED(testECEFVel, 0.0, 0.0);
            assert.deepEqual(nedVel, testNEDVel);
        });
    });

    describe('NEDToECEF', () => {
        it('should reproject a NED vector as an ECEF vector', () => {
            const testNEDVel = { vn: -1.7539, ve: 0.277, vd: -636.3845};
            const testECEFVel = {vx:82.34, vy:-554.45, vz:301.32};

            const ecefVel = projector.NEDtoECEF(testNEDVel, 28.4187, -81.5812);
            assert.deepEqual(ecefVel, testECEFVel);
        });
    });
});