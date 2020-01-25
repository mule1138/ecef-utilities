import * as projector from '../src/ecef_uilts';
import { assert } from 'chai';
import 'mocha';

describe('ECEF_Utils', () => {
    describe('LLAToECEF', () => {
        it('should reproject a LLA point as an ECEF point', () => {
            const testLLAPt = { lat: 42, lon: 30, alt: 300 };
            const testECEFPt = {x:0, y:0, z:0};

            const ecefPt = projector.LLAToECEF(testLLAPt);
            assert.deepEqual(ecefPt, testECEFPt);
        });
    });
});