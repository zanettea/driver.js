import { describe, expect, it } from "vitest";
import { Rectangle, subdivide, unionPolygon, roundSvgPath } from "../src/utils";

describe("svgpaths", () => {
  it("overllaping rects", () => {
    // Example usage
    const rectangles: Rectangle[] = [
        [[0, 0], [10, 10]],
        [[5, 5], [15, 15]],
        [[100, 100], [115, 115]],
    ];
    const subdivided = subdivide(rectangles)
    console.log(subdivided);

    // the compute union
    const union = unionPolygon(subdivided);
    console.log(">>>>>>> union")
    console.log(union);

    // render to svg the paths
    const radius = 2;
    const roundedPolygon = union.map(
        poly => roundSvgPath(
          // Non rounded path to be rounded
          poly.map(
            (point, i) => `${i === 0 ? 'M' : 'L'}${point.join(' ')}${i === poly.length - 1 ? 'z' : ''}`
          ).join(
            ' '
          ),
          radius * 2
        )
      ).join(' ');
      console.log(">>>>>>> rounded")
      console.log(roundedPolygon);
  



  });
});
