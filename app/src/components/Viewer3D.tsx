import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { getGoogleMapsApiKey } from "../lib/env";
import type { Location } from "../lib/types";

interface Props {
  location: Location | null;
  loading: boolean;
}

const DEFAULT_VIEW = {
  longitude: 13.3777, // Brandenburg Gate — Berlin (visually nice idle state)
  latitude: 52.5163,
  height: 600,
};

const isCoarsePointer =
  typeof window !== "undefined" &&
  window.matchMedia?.("(pointer: coarse)").matches === true;

export function Viewer3D({ location, loading }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const tilesetRef = useRef<Cesium.Cesium3DTileset | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || viewerRef.current) return;

    let cancelled = false;

    // We're not using Cesium Ion — Google Photorealistic 3D Tiles is the world.
    Cesium.Ion.defaultAccessToken = "";

    const viewer = new Cesium.Viewer(container, {
      // Disable everything we don't need; Google 3D Tiles brings its own world.
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      baseLayer: false as unknown as Cesium.ImageryLayer, // Cesium types disagree; runtime accepts false
      skyBox: false,
      skyAtmosphere: false,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
    });

    // Lower DPR on coarse-pointer (mobile) for fewer pixels to shade.
    if (isCoarsePointer) viewer.resolutionScale = 0.85;

    // Hide the Cesium ion credit; keep Google's attribution (the tileset adds it automatically).
    viewer.cesiumWidget.creditContainer
      .querySelectorAll<HTMLAnchorElement>("a")
      .forEach((a) => {
        if (a.href.includes("cesium.com")) a.style.display = "none";
      });

    viewer.scene.globe.show = false; // Photorealistic 3D Tiles replaces the globe.
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;

    tuneCameraControlsForTouch(viewer);

    viewerRef.current = viewer;

    (async () => {
      try {
        const apiKey = getGoogleMapsApiKey();
        const tileset = await Cesium.Cesium3DTileset.fromUrl(
          `https://tile.googleapis.com/v1/3dtiles/root.json?key=${encodeURIComponent(apiKey)}`,
          { showCreditsOnScreen: true },
        );
        if (cancelled) {
          tileset.destroy();
          return;
        }
        // Stream fewer/coarser tiles on mobile to keep memory + battery sane.
        // Higher value = lower fidelity, much faster. ~24 is a sweet spot for phones.
        tileset.maximumScreenSpaceError = isCoarsePointer ? 24 : 16;
        viewer.scene.primitives.add(tileset);
        tilesetRef.current = tileset;

        // Idle camera — Brandenburg Gate while the homeowner reads the prompt.
        flyTo(viewer, DEFAULT_VIEW.longitude, DEFAULT_VIEW.latitude, DEFAULT_VIEW.height, 0);
      } catch (err) {
        console.error("Failed to load Google Photorealistic 3D Tiles", err);
      }
    })();

    return () => {
      cancelled = true;
      tilesetRef.current = null;
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);

  // Fly to the user's address whenever it changes.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !location) return;
    flyTo(viewer, location.longitude, location.latitude, 220, 2.0);
  }, [location]);

  return (
    <div className="viewer3d">
      <div ref={containerRef} className="viewer3d__canvas" />
      {loading && <div className="viewer3d__shade" aria-hidden />}
    </div>
  );
}

function tuneCameraControlsForTouch(viewer: Cesium.Viewer) {
  const c = viewer.scene.screenSpaceCameraController;

  // We don't want users teleporting across the planet by accident.
  // Restrict camera distance so they orbit *the house*, not Earth.
  c.minimumZoomDistance = 60;
  c.maximumZoomDistance = 1500;

  // Inertia on touch feels nicer when slightly damped.
  c.inertiaSpin = 0.6;
  c.inertiaTranslate = 0.6;
  c.inertiaZoom = 0.6;

  // Lock to: one-finger orbit + two-finger pinch-zoom + two-finger tilt.
  // Disable middle/right mouse buttons — meaningless on touch and confusing on desktop.
  const { CameraEventType, KeyboardEventModifier } = Cesium;

  c.rotateEventTypes = [CameraEventType.LEFT_DRAG];
  c.zoomEventTypes = [
    CameraEventType.WHEEL,
    CameraEventType.PINCH,
  ];
  c.tiltEventTypes = [
    CameraEventType.PINCH,
    {
      eventType: CameraEventType.LEFT_DRAG,
      modifier: KeyboardEventModifier.SHIFT,
    },
  ];
  // Disable look (free-fly) and translate — we want orbital, not free-roam.
  c.lookEventTypes = [];
  c.translateEventTypes = [];
}

function flyTo(
  viewer: Cesium.Viewer,
  longitude: number,
  latitude: number,
  height: number,
  duration: number,
) {
  const destination = Cesium.Cartesian3.fromDegrees(longitude, latitude - 0.0009, height);
  viewer.camera.flyTo({
    destination,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-35),
      roll: 0,
    },
    duration,
  });
}
