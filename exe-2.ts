import { expect } from './expect';


// Implementation
class Point {
  constructor(public x: number, public y: number) { }
}

function lineCrossingMostPoints(points: Point[]) {
  let maxLine, maxCount;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i; j < points.length; j++) {
      const point1 = points[i];
      const point2 = points[j];
      const currLine = calcLine(point1, point2);
      // Does not compile.
      // const currCount = (map.get(currLine) || 0) + 1;
      // map.put(currLine, currCount);
      // if (currCount > maxCount) {
      //   maxLine = currLine;
      //   maxCount = currCount;
      // }
    }
  }
  return maxLine;
}


function calcLine(p1: Point, p2: Point) {
  // Using the y=mx+b equation.
  const m = (p2.y - p1.y) / (p2.x - p1.x);
  const b = p1.y - m * p1.x;
  const precision = 5;
  return `y=${m.toFixed(precision)}x+${b.toFixed(precision)}`;
}


// Tests
expect(lineCrossingMostPoints([]), undefined);
expect(calcLine(new Point(1, 0), new Point(2, 1)), 'y=1.00000x+-1.00000');
expect(calcLine(new Point(2, 0), new Point(1, 0.5)), 'y=-0.50000x+1.00000');
