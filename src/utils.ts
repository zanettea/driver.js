import { getConfig } from "./config";

export function easeInOutQuad(elapsed: number, initialValue: number, amountOfChange: number, duration: number): number {
  if ((elapsed /= duration / 2) < 1) {
    return (amountOfChange / 2) * elapsed * elapsed + initialValue;
  }
  return (-amountOfChange / 2) * (--elapsed * (elapsed - 2) - 1) + initialValue;
}

export function getFocusableElements(parentEls: Element[] | HTMLElement[]) {
  const focusableQuery =
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';

  return parentEls
    .flatMap(parentEl => {
      const isParentFocusable = parentEl.matches(focusableQuery);
      const focusableEls: HTMLElement[] = Array.from(parentEl.querySelectorAll(focusableQuery));

      return [...(isParentFocusable ? [parentEl as HTMLElement] : []), ...focusableEls];
    })
    .filter(el => {
      return getComputedStyle(el).pointerEvents !== "none" && isElementVisible(el);
    });
}

export function bringInView(element: Element) {
  if (!element || isElementInView(element)) {
    return;
  }

  const shouldSmoothScroll = getConfig("smoothScroll");

  element.scrollIntoView({
    // Removing the smooth scrolling for elements which exist inside the scrollable parent
    // This was causing the highlight to not properly render
    behavior: !shouldSmoothScroll || hasScrollableParent(element) ? "auto" : "smooth",
    inline: "center",
    block: "center",
  });
}

function hasScrollableParent(e: Element) {
  if (!e || !e.parentElement) {
    return;
  }

  const parent = e.parentElement as HTMLElement & { scrollTopMax?: number };

  return parent.scrollHeight > parent.clientHeight;
}

function isElementInView(element: Element) {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function isElementVisible(el: HTMLElement) {
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}



// svg path union (credits to Mathieu Jouhet https://observablehq.com/@daformat/union-polygon-and-area-of-rectangles-line-sweep-algorithm)

enum Axis {
  X = 0,
  Y = 1
}
enum Event {
  OPENING = 0,
  CLOSING = 1
}
  

export type Point = [number, number];
export type Rectangle = [Point, Point];
export type Polygon = Point[];
export type XYPoint = { x: number, y: number };

export function subdivide(rects: Rectangle[]): Rectangle[] {

  const sortEvents = (axis: Axis, prop: string, axis2: Axis, prop2: string, order = 1, order2 = 1) => (w: any) => w.reduce(
    (acc: any, r: Point[], ind: number) => {
      acc.push(...r.map((e: Point, i: Event) => ({
        ind,
        type: i,
        [prop]: e[axis],
        [prop2]: e[axis2],
        length: i === Event.OPENING ? r[Event.CLOSING][axis2] - e[axis2] : e[axis2] - r[Event.OPENING][axis2]
      })));
      return acc;
    }, []
  ).sort(
    (a: any, b: any) => order2 * (a[prop2] - b[prop2])
  ).sort(
    (a: any, b: any) => order * (a[prop] - b[prop])
  );

  const events_v = sortEvents(Axis.X, 'x', Axis.Y, 'y', 1, 1)(rects);
  const events_h = sortEvents(Axis.Y, 'y', Axis.X, 'x', 1, 1)(rects);
  // console.log(`Sorting events took ${t1-t0} ms`);

  // First event is always in set
  let in_set = [];
  in_set[events_v[0].ind] = true;

  let union : Rectangle[] = [];
  let area = 0;

  for (let i = 0; i < events_v.length - 1; i++) {
    const event_v = events_v[i];
    // console.log('-----\n', event_v.ind, 'Event_v', event_v);
    in_set[event_v.ind] = event_v.type === Event.OPENING;

    const next = events_v[i + 1];
    const delta_x = next && next.x - event_v.x;

    if (!delta_x) {
      // console.log('Next event has same x, skipping second scan', next);
      continue;
    }

    let opened = 0;
    const begin_x = event_v.x;
    const end_x = next.x
    let begin_y, end_y;

    for (let j = 0; j < events_h.length; j++) {

      // Horizontal sweep line for active rectangle
      const event_h = events_h[j];

      if (in_set[events_h[j].ind]) {
        // console.log('Event_h', event_h);

        if (event_h.type === Event.OPENING) {
          opened++;
          if (opened === 1) {
            begin_y = event_h.y;
          }
        } else {
          opened--;
          let n = 1;
          let next = events_h[j + n];
          while (j + n < events_h.length && !in_set[events_h[j + n].ind]) {
            n++;
            next = events_h[j + n];
          }
          if (!next || opened === 0 && next.y !== event_h.y) {
            end_y = event_h.y;
            area += (end_x - begin_x) * (end_y - begin_y);
            union.push([
              [begin_x, begin_y],
              [end_x, end_y]
            ]);
          }
        }
      }
    }
  }

  return union;
}


export function unionPolygon(rects: Rectangle[]) : Polygon[] {
  // Remove duplicate vertices
  const set = new Set<string>();
  rects.forEach(r => {
    const pts = [
      [r[Event.OPENING][Axis.X], r[Event.OPENING][Axis.Y]],
      [r[Event.CLOSING][Axis.X], r[Event.OPENING][Axis.Y]],
      [r[Event.CLOSING][Axis.X], r[Event.CLOSING][Axis.Y]],
      [r[Event.OPENING][Axis.X], r[Event.CLOSING][Axis.Y]]
    ];
    pts.forEach(p => {
      const s = p.join(',');
      if (set.has(s)) {
        set.delete(s);
      } else {
        set.add(s);
      }
    })
  });

  // Convert the set back to an array of points [[x, y], ...]
  const points : Point[] = [...set].map( (p: string) => <Point>(p.split(',').map( (pp: string) => +pp) ));

  const xThenY = (a: Point, b: Point) => a[0] < b[0] || (a[0] == b[0] && a[1] < b[1]) ? -1 : 1;
  const yThenX = (a: Point, b: Point) => a[1] < b[1] || (a[1] == b[1] && a[0] < b[0]) ? -1 : 1;
  const sort_x: Point[] = [...points].sort(xThenY);
  const sort_y: Point[] = [...points].sort(yThenX);
  // console.log(sort_x, sort_y);

  const edges_h: Record<string, Point> = {};
  const edges_v: Record<string, Point> = {};

  let i = 0;
  while (i < points.length) {
    const curr_y = sort_y[i][1];
    while (i < points.length && sort_y[i][1] === curr_y) {
      edges_h[sort_y[i].toString()] = sort_y[i + 1];
      edges_h[sort_y[i + 1].toString()] = sort_y[i];
      i += 2;
    }
  }

  i = 0;
  while (i < points.length) {
    const curr_x = sort_x[i][0]
    while (i < points.length && sort_x[i][0] === curr_x) {
      edges_v[sort_x[i].toString()] = sort_x[i + 1];
      edges_v[sort_x[i + 1].toString()] = sort_x[i];
      i += 2;
    }
  }

  let polys: Polygon[] = [], keys;
  while ((keys = Object.keys(edges_h)).length) {
    const [firstKey] = keys;
    const initialVertex: Point = <Point>[...edges_h[firstKey]];
    const polygon = [[initialVertex, 0]];
    delete edges_h[firstKey];
    while (true) {

      // Get last added point in polygon
      const [pts, e] = polygon[polygon.length - 1];
      // Get next vertex
      let next_vertex;
      if (e === 0) {
        next_vertex = edges_v[pts.toString()];
        polygon.push([next_vertex, 1]);
        delete edges_v[pts.toString()];
      } else {
        next_vertex = edges_h[pts.toString()];
        polygon.push([next_vertex, 0]);
        delete edges_h[pts.toString()];
      }

      // Remove last vertex if polygon is closed;
      if (!next_vertex || next_vertex.join(',') === initialVertex.join(',')) {
        polygon.pop();
        break;
      }
    }

    for (let vertex of polygon) {
      const edge_index = vertex[0];
      delete edges_v[edge_index.toString()];
      delete edges_h[edge_index.toString()];
    }

    // console.log([polygon]);
    polygon && polygon[0] && polygon[0][0] && polys.push(polygon.map(p => p[0]) as Polygon);
  }

  return polys;
}

function limitPrecision(num: number, precision: number) {
  return +( (+num).toFixed(precision).replace(/\.?0+$/, '') );
}

export function roundSvgPath(pathData: string, radius: number) {
  if (!pathData) {
    return;
  }

  // Get path coordinates as array of {x, y} objects
  let pathCoords = pathData
  .split(/[a-zA-Z]/)
  .reduce(function(parts: XYPoint[], part: string){
    var match = part.match(/(-?[\d]+(\.\d+)?)/g);;
    if (match) {
      // Cast to number before pushing coordinate
      parts.push({
        x: +match[0],
        y: +match[1]
      }); 
    }
    return parts;
  }, []).filter((e: any, i: any, arr: any) => {
    // Remove consecutive duplicates
    const prev = arr[ (i === 0 ? arr.length - 1 : i - 1) ];
    return e.x !== prev.x || e.y !== prev.y;
  });

  const path = [];

  for (let i = 0; i < pathCoords.length; i++) {

    // Get current point and the next two (start, corner, end)
    const c2Index = (i + 1) % pathCoords.length;
    const c3Index = (i + 2) % pathCoords.length;

    const c1 = pathCoords[i];
    const c2 = pathCoords[c2Index];
    const c3 = pathCoords[c3Index];
    
    // Vector going from C2 to C1 and from C2 to C3
    const c1c2dx = c1.x - c2.x;
    const c1c2dy = c1.y - c2.y;
    const c3c2dx = c3.x - c2.x;
    const c3c2dy = c3.y - c2.y;
    
    const angle = Math.abs(Math.atan2(
      c1c2dx * c3c2dy - c1c2dy * c3c2dx,
      c1c2dx * c3c2dx + c1c2dy * c3c2dy
    ));
    
    // Divide distance by two to allow rounding the next corner as much as this one
    const c2c1Dist = Math.hypot(c1c2dx, c1c2dy) / 2;
    const c2c3Dist = Math.hypot(c3c2dx, c3c2dy) / 2;

    // Clamp radius the the max available
    const clampedRadius = Math.min(radius, c2c1Dist, c2c3Dist);

      // Compute ideal control point distance to create a circle with quadratic bezier curves
      // const idealControlPointDistance = (4 / 3) * Math.tan(Math.PI / (2 * 4)) * clampedRadius;
      const idealControlPointDistance = (4 / 3) * Math.tan(
        Math.PI / (2 * ((2 * Math.PI) / angle ) )
      ) * clampedRadius * (
        angle < Math.PI / 2
          ? 1 + Math.cos(angle)
          : 1
      );

      // Start of the curve
      let c1c2curvePoint = {
        x: c2.x + c1c2dx * clampedRadius / c2c1Dist / 2,
        y: c2.y + c1c2dy * clampedRadius / c2c1Dist / 2,
      }
      // First control point
      let c1c2curveCP = {
        x: c2.x + c1c2dx * (clampedRadius - idealControlPointDistance) / c2c1Dist / 2,
        y: c2.y + c1c2dy * (clampedRadius - idealControlPointDistance) / c2c1Dist / 2
      }
      // End of the curve
      let c3c2curvePoint = {
        x: c2.x + c3c2dx * clampedRadius / c2c3Dist / 2,
        y: c2.y + c3c2dy * clampedRadius / c2c3Dist / 2,
      }
      // Second control point
      let c3c2curveCP = {
        x: c2.x + c3c2dx * (clampedRadius - idealControlPointDistance) / c2c3Dist / 2,
        y: c2.y + c3c2dy * (clampedRadius - idealControlPointDistance) / c2c3Dist / 2,
      }

      // Limit number after floating point
      const limit = (point: XYPoint) => ({
        x: limitPrecision(point.x, 3),
        y: limitPrecision(point.y, 3)
      });

      c1c2curvePoint = limit(c1c2curvePoint);
      c1c2curveCP = limit(c1c2curveCP);
      c3c2curvePoint = limit(c3c2curvePoint);
      c3c2curveCP = limit(c3c2curveCP)

      // If at last coordinate of polygon, use the end of the curve as
      // the polygon starting point
      if (i === pathCoords.length - 1) {
        path.unshift('M' + c3c2curvePoint.x + ' ' + c3c2curvePoint.y);
      }

      // Draw line from previous point to the start of the curve
      path.push('L' + c1c2curvePoint.x + ' ' + c1c2curvePoint.y);

      // Cubic bezier to draw the actual curve
      path.push('C' + c1c2curveCP.x + ' ' + c1c2curveCP.y + ',' + c3c2curveCP.x + ' ' + c3c2curveCP.y + ','  + c3c2curvePoint.x + ' ' + c3c2curvePoint.y);

  }
  
  // Close path
  path.push('Z');

  return path.join(' ');
}