export function degToRad(deg: number): number {
    return deg * Math.PI / 180;
}

export function radToDeg(rad: number): number {
    return rad * 180 / Math.PI;
}

export function trimDecimalValue(value: number, significantDigits: number): number {
    let newValue = NaN;

    const sigDigits = Math.trunc(significantDigits);

    if (sigDigits > 0) {
        const multiplier = Math.pow(10, sigDigits);
        newValue = Math.round(value * multiplier) / multiplier;
    } else {
        // Treat all values less than or equal to 0 as 0
        newValue = Math.round(value);
    }

    return newValue;
}