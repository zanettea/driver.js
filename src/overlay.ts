import { easeInOutQuad } from "./utils";
import { onDriverClick } from "./events";
import { emit } from "./emitter";
import { getConfig } from "./config";
import { getState, setState } from "./state";
import { Rectangle, subdivide, unionPolygon, roundSvgPath } from "./utils";


export type StageDefinition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// This method calculates the animated new position of the
// stage (called for each frame by requestAnimationFrame)
export function transitionStage(elapsed: number, duration: number, from: Element, to: Element) {
  let activeStagePosition = getState("__activeStagePosition");

  const fromDefinition = activeStagePosition ? activeStagePosition : from.getBoundingClientRect();
  const toDefinition = to.getBoundingClientRect();

  const x = easeInOutQuad(elapsed, fromDefinition.x, toDefinition.x - fromDefinition.x, duration);
  const y = easeInOutQuad(elapsed, fromDefinition.y, toDefinition.y - fromDefinition.y, duration);
  const width = easeInOutQuad(elapsed, fromDefinition.width, toDefinition.width - fromDefinition.width, duration);
  const height = easeInOutQuad(elapsed, fromDefinition.height, toDefinition.height - fromDefinition.height, duration);

  activeStagePosition = {
    x,
    y,
    width,
    height,
  };

  renderOverlay([activeStagePosition]);
  setState("__activeStagePosition", activeStagePosition);
}

export function trackActiveElement(element: Element, highlightObjs: NodeListOf<Element> | undefined) {
  if (!element && !highlightObjs) {
    return;
  }

  const definition = element.getBoundingClientRect();

  const activeStagePosition: StageDefinition = {
    x: definition.x,
    y: definition.y,
    width: definition.width,
    height: definition.height,
  };

  setState("__activeStagePosition", activeStagePosition);

  if (!highlightObjs) {
    renderOverlay([activeStagePosition]);
  } else {
    const highlightStagePositions = Array.from(highlightObjs).map(el => {
      const definition = el.getBoundingClientRect();
      return {
        x: definition.x,
        y: definition.y,
        width: definition.width,
        height: definition.height,
      };
    });

    renderOverlay([...highlightStagePositions]);
  }
}

export function refreshOverlay() {
  const activeStagePosition = getState("__activeStagePosition");
  const overlaySvg = getState("__overlaySvg");

  if (!activeStagePosition) {
    return;
  }

  if (!overlaySvg) {
    console.warn("No stage svg found.");
    return;
  }

  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  overlaySvg.setAttribute("viewBox", `0 0 ${windowX} ${windowY}`);
}

function mountOverlay(stagePosition: StageDefinition[]) {
  const overlaySvg = createOverlaySvg(stagePosition);
  document.body.appendChild(overlaySvg);

  onDriverClick(overlaySvg, e => {
    const target = e.target as SVGElement;
    if (target.tagName !== "path") {
      return;
    }

    emit("overlayClick");
  });

  setState("__overlaySvg", overlaySvg);
}

function renderOverlay(stagePosition: StageDefinition[]) {
  const overlaySvg = getState("__overlaySvg");

  // TODO: cancel rendering if element is not visible
  if (!overlaySvg) {
    mountOverlay(stagePosition);

    return;
  }

  const pathElement = overlaySvg.firstElementChild as SVGPathElement | null;
  if (pathElement?.tagName !== "path") {
    throw new Error("no path element found in stage svg");
  }

  pathElement.setAttribute("d", generateStageSvgPathString(stagePosition));
}

function createOverlaySvg(stage: StageDefinition[]): SVGSVGElement {
  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("driver-overlay", "driver-overlay-animated");

  svg.setAttribute("viewBox", `0 0 ${windowX} ${windowY}`);
  svg.setAttribute("xmlSpace", "preserve");
  svg.setAttribute("xmlnsXlink", "http://www.w3.org/1999/xlink");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("preserveAspectRatio", "xMinYMin slice");

  svg.style.fillRule = "evenodd";
  svg.style.clipRule = "evenodd";
  svg.style.strokeLinejoin = "round";
  svg.style.strokeMiterlimit = "2";
  svg.style.zIndex = "10000";
  svg.style.position = "fixed";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";

  const stagePath = document.createElementNS("http://www.w3.org/2000/svg", "path");

  stagePath.setAttribute("d", generateStageSvgPathString(stage));

  stagePath.style.fill = getConfig("overlayColor") || "rgb(0,0,0)";
  stagePath.style.opacity = `${getConfig("overlayOpacity")}`;
  stagePath.style.pointerEvents = "auto";
  stagePath.style.cursor = "auto";

  svg.appendChild(stagePath);

  return svg;
}

function generateStageSvgPathString(stages: StageDefinition[]) {
  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  let path = `M${windowX},0L0,0L0,${windowY}L${windowX},${windowY}L${windowX},0Z `

  // convert into TL-BR notation and compute polygon string
  const stagePadding = getConfig("stagePadding") || 0;
  const stageRadius = getConfig("stageRadius") || 0;
  const svgPath = unionPolygon(subdivide(stages.map( (s: StageDefinition) : Rectangle => {
    return [[s.x - stagePadding, s.y - stagePadding], [s.x + s.width + stagePadding, s.y + s.height + stagePadding]];
  }))).map(
    poly => roundSvgPath(
      // Non rounded path to be rounded
      poly.map(
        (point, i) => `${i === 0 ? 'M' : 'L'}${point.join(' ')}${i === poly.length - 1 ? 'z' : ''}`
      ).join(
        ' '
      ),
      stageRadius * 2
    )
  ).join(' ');

  return path + " " + svgPath;
}

export function destroyOverlay() {
  const overlaySvg = getState("__overlaySvg");
  if (overlaySvg) {
    overlaySvg.remove();
  }
}
