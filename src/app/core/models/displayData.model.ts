export class DisplayData {

    componentName: string;
    offsetValueStart: number;
    offsetValueEnd: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    isRotating: boolean;
    angle: number;

    constructor(name: string, offsetVStart: number, offsetVEnd: number, subjectPositionX: number, subjectPositionY: number, subjectPositionZ:number, isRotating: boolean, angle: number) {
        this.componentName = name;
        this.offsetValueStart = offsetVStart
        this.offsetValueEnd = offsetVEnd;
        this.positionX = subjectPositionX;
        this.positionY = subjectPositionY;
        this.positionZ = subjectPositionZ;
        this.angle = angle;

    }
}