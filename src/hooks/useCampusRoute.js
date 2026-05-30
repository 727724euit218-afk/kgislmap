import { useEffect } from 'react';
import { landmarks, landmarkEdges } from '../components/CampusMap/campusData';

// ─── Euclidean distance between two SVG points ────────────────────────────────
function pixelDist(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

// ─── Build adjacency map once (module-level, not per-render) ─────────────────
function buildGraph() {
  const graph = {};
  for (const lm of landmarks) graph[lm.id] = {};
  for (const edge of landmarkEdges) {
    const { from, to, distance, label } = edge;
    if (graph[from] !== undefined && graph[to] !== undefined) {
      graph[from][to] = { distance, label };
      graph[to][from] = { distance, label };
    }
  }
  return graph;
}
const GRAPH = buildGraph();

// ─── Nearest landmark to an [x, y] position ──────────────────────────────────
export function getNearestLandmark(position) {
  let nearest = null;
  let minDist = Infinity;
  for (const lm of landmarks) {
    const d = pixelDist(position, lm.position);
    if (d < minDist) { minDist = d; nearest = lm; }
  }
  return nearest;
}

/** Backward-compat alias (used by InteractiveCampusMap) */
export function getNearestNode(position) {
  return getNearestLandmark(position);
}

// ─── Dijkstra on landmark graph — returns ordered array of landmark IDs ───────
export function findShortestPath(startId, endId) {
  const dist     = {};
  const previous = {};
  const unvisited = new Set();

  for (const lm of landmarks) {
    dist[lm.id] = Infinity;
    unvisited.add(lm.id);
  }
  dist[startId] = 0;

  while (unvisited.size > 0) {
    // Pick unvisited node with smallest tentative distance
    let curr = null, minD = Infinity;
    for (const id of unvisited) {
      if (dist[id] < minD) { minD = dist[id]; curr = id; }
    }
    if (curr === null || curr === endId) break;
    unvisited.delete(curr);

    for (const neighborId in GRAPH[curr]) {
      const nId = Number(neighborId);
      if (!unvisited.has(nId)) continue;
      const alt = dist[curr] + GRAPH[curr][nId].distance;
      if (alt < dist[nId]) {
        dist[nId] = alt;
        previous[nId] = curr;
      }
    }
  }

  // Reconstruct path
  const path = [];
  let u = endId;
  while (u !== undefined) {
    path.unshift(u);
    u = previous[u];
  }
  return path.length > 1 || path[0] === startId ? path : [];
}

// ─── Build named step-by-step instructions ───────────────────────────────────
// Returns { steps: [{from, to, distance, label}], totalDistance }
export function getNamedRouteSteps(sourceId, destinationId) {
  const path = findShortestPath(sourceId, destinationId);
  if (!path || path.length < 2) return null;

  const lmMap = {};
  for (const lm of landmarks) lmMap[lm.id] = lm;

  const steps = [];
  let totalDistance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const fromId = path[i];
    const toId   = path[i + 1];
    const edge   = GRAPH[fromId]?.[toId];
    if (!edge) continue;
    totalDistance += edge.distance;
    steps.push({
      from:     lmMap[fromId]?.name  || `Node ${fromId}`,
      to:       lmMap[toId]?.name    || `Node ${toId}`,
      distance: edge.distance,
      label:    edge.label,
    });
  }

  return { steps, totalDistance };
}

// ─── React hook (used by LiveNavigationPage) ─────────────────────────────────
export function useCampusRoute(map, source, destination, onStepsReady) {
  useEffect(() => {
    if (!source || !destination) return;

    const result = getNamedRouteSteps(source.id, destination.id);
    if (!result) return;

    const { steps, totalDistance } = result;
    const textSteps = [
      `Start at ${source.name}`,
      ...steps.map(s => `Walk to ${s.to} via ${s.label} — ${s.distance} m`),
      `Arrive at ${destination.name} — total ~${totalDistance} m`,
    ];
    onStepsReady(textSteps);
  }, [source, destination, onStepsReady]);
}
