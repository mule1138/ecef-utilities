export function degToRad(deg: number): number {
    return deg * Math.PI / 180;
}

export function radToDeg(rad: number): number {
    return rad * 180 / Math.PI;
}

export function trimDecimalValue(value: number, significantDigits: number): number {
    return Number(value.toFixed(significantDigits));
}

/**
 * Takes a set of numbers and returns the square root of the sum of the squares
 * of the argument numbers.
 *
 * From the polyfil for Math.hypot(). This function does not exist in es5.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot
 *
 * @param values list of numbers for which a hypotenuse will be computed
 * @returns number value for the hypotenuse
 */
export function hypot(...values: number[]): number {
    var max = 0;
    var s = 0;
    for (var i = 0; i < arguments.length; i += 1) {
        var arg = Math.abs(arguments[i]);
        if (arg > max) {
            s *= (max / arg) * (max / arg);
            max = arg;
        }
        s += arg === 0 && max === 0 ? 0 : (arg / max) * (arg / max);
    }
    return max === 1 / 0 ? 1 / 0 : max * Math.sqrt(s);
}