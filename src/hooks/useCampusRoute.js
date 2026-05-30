import { useEffect } from 'react';
import { roadNodes, roadEdges } from '../components/CampusMap/campusData';

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

export function getNearestNode(landmarkPosition) {
  let nearest = null;
  let minDist = Infinity;
  for (const node of roadNodes) {
    const dist = distance(landmarkPosition, node.position);
    if (dist < minDist) {
      minDist = dist;
      nearest = node;
    }
  }
  return nearest;
}

export function findShortestPath(startNodeId, endNodeId) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  const graph = {};
  roadNodes.forEach(node => {
    graph[node.id] = {};
    distances[node.id] = Infinity;
    unvisited.add(node.id);
  });

  roadEdges.forEach(edge => {
    if (graph[edge.from] && graph[edge.to]) {
      const weight = edge.distance / (edge.width / 5);
      graph[edge.from][edge.to] = { dist: edge.distance, weight, width: edge.width };
      graph[edge.to][edge.from] = { dist: edge.distance, weight, width: edge.width };
    }
  });

  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    let currNode = null;
    let minD = Infinity;
    for (const node of unvisited) {
      if (distances[node] < minD) {
        minD = distances[node];
        currNode = node;
      }
    }

    if (currNode === null) break;
    if (currNode === endNodeId) break;

    unvisited.delete(currNode);

    for (const neighbor in graph[currNode]) {
      if (unvisited.has(neighbor)) {
        const alt = distances[currNode] + graph[currNode][neighbor].weight;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = currNode;
        }
      }
    }
  }

  const path = [];
  let u = endNodeId;
  if (previous[u] !== undefined || u === startNodeId) {
    while (u !== undefined) {
      path.unshift(u);
      u = previous[u];
    }
  }
  return path;
}

// SVG-based route hook (no Leaflet) — computes steps from road graph
export function useCampusRoute(map, source, destination, onStepsReady) {
  useEffect(() => {
    if (!source || !destination) return;

    const startNode = getNearestNode(source.position);
    const endNode   = getNearestNode(destination.position);

    if (startNode && endNode) {
      const pathIds = findShortestPath(startNode.id, endNode.id);

      const steps = [`Start at ${source.name}`];
      let totalDist = 0;

      for (let i = 0; i < pathIds.length - 1; i++) {
        const from = pathIds[i];
        const to   = pathIds[i + 1];
        const edge = roadEdges.find(
          e => (e.from === from && e.to === to) || (e.from === to && e.to === from)
        );
        if (edge) {
          totalDist += edge.distance;
          steps.push(`Continue via road node ${to} (${edge.distance}m)`);
        }
      }

      steps.push(`Arrive at ${destination.name} — total ~${totalDist}m`);
      onStepsReady(steps);
    }
  }, [source, destination, onStepsReady]);
}
