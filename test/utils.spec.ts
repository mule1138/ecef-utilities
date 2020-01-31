import * as utils from '../src/utils';
import { assert } from 'chai';
import 'mocha';

describe("utils", () => {
    describe('degToRad', () => {
        it('should properly convert a deg measure to radians', () => {
            const testRad = utils.degToRad(28.4187);
            assert.equal(testRad, 0.4959998841365125);
        });

        it('should convert 0 deg to 0 rad', () => {
            const testRad = utils.degToRad(0.0);
            assert.equal(testRad, 0.0);
        });

        it('should convert 180 deg to PI rad', () => {
            const testRad = utils.degToRad(180.0);
            assert.equal(testRad, Math.PI);
        });

        it('should convert 360 deg to 2*PI rad', () => {
            const testRad = utils.degToRad(360.0);
            assert.equal(testRad, 2 * Math.PI);
        });
    });

    describe('radToDeg', () => {
        it('should properly convert a radian value to deg', () => {
            const testDeg = utils.radToDeg(-1.42386054800000106);
            assert.equal(testDeg, -81.58120001558464);
        });

        it('should convert 0 rad to 0 deg', () => {
            const testDeg = utils.radToDeg(0.0);
            assert.equal(testDeg, 0.0);
        });

        it('should convert PI rad to 180 deg', () => {
            const testDeg = utils.radToDeg(Math.PI);
            assert.equal(testDeg, 180.0);
        });

        it('should convert 2*PI rad to 360 deg', () => {
            const testDeg = utils.radToDeg(2 * Math.PI);
            assert.equal(testDeg, 360.0);
        });
    });

    describe('trimDecimalValue', () => {
        it('should trim a decimal value to the given significant digits', () => {
            const trimedValue = utils.trimDecimalValue(28394.2028437465, 3);
            assert.equal(trimedValue, 28394.203);
        });

        it('should trim a decimal value to 0 significant digits', () => {
            const trimedValue = utils.trimDecimalValue(28394.2028437465, 0);
            assert.equal(trimedValue, 28394.0);
        });

        it('should trim a decimal value to 0 significant digits if significantDigits value is negative', () => {
            const trimedValue = utils.trimDecimalValue(28394.2028437465, -3);
            assert.equal(trimedValue, 28394.0);
        });

        it('should trim a decimal value to only integer significant digits', () => {
            const trimedValue = utils.trimDecimalValue(28394.2028437465, 3.456);
            assert.equal(trimedValue, 28394.203);
        });
    });
});