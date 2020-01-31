import * as projector from '../src/ecef_uilts';
import { assert } from 'chai';
import 'mocha';

describe('ECEF_Utils', () => {
    describe('LLAToECEF', () => {
        it('should reproject a LLA point as an ECEF point', () => {
            const testLLAPt = { lat: 28.4187, lon: -81.5812, alt: 33.0 };
            const testECEFPt = {x:821905.34, y:-5553322.70, z:3017411.13};

            const ecefPt = projector.LLAToECEF(testLLAPt);
            assert.deepEqual(ecefPt, testECEFPt);
        });
    });

    describe('ECEFToLLA', () => {
        it('should reproject a LLA point as an ECEF point', () => {
            const testLLAPt = { lat: 28.4187, lon: -81.5812, alt: 33.0 };
            const testECEFPt = {x:821905.34, y:-5553322.70, z:3017411.13};

            const llaPt = projector.ECEFToLLA(testECEFPt);
            assert.deepEqual(llaPt, testLLAPt);
        });
    });
});