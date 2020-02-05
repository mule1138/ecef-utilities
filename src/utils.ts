export function degToRad(deg: number): number {
    return deg * Math.PI / 180;
}

export function radToDeg(rad: number): number {
    return rad * 180 / Math.PI;
}

export function trimDecimalValue(value: number, significantDigits: number): number {
    return Number(value.toFixed(significantDigits));
}