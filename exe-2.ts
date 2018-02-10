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
      // Does not compile.
      // const currLine = calcLine(point1, point2);
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


// Tests
expect(lineCrossingMostPoints([]), undefined);