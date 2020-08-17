export class CheckPoint {

    cssId: string;
    docPosition: number;
    positionV: V3;
    angleDeg: number;
    angleRad: number;

    constructor(id: string, docPosY, xPos: number, yPos: number, zPos:number, angleDeg: number){
        this.cssId = id;
        this.docPosition = docPosY;
        this.positionV = new V3(xPos, yPos, zPos);
        this.angleDeg = angleDeg;
        this.angleRad = angleDeg * Math.PI / 180;
    }
}

export class V3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}