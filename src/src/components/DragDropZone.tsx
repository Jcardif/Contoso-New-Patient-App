import { Button } from "./Button";
import { dragZone, dragZoneHighlight, fileUpload } from "./DragDropZone.css";
import Icon from "@mdi/react";
import { mdiCamera, mdiCameraOff } from "@mdi/js";
import { useCallback, useEffect, useRef } from "react";

export function DragDropZone({
  setCameraActiveState,
  cameraActive,
  fileSelected,
}: {
  setCameraActiveState: (cb: (state: boolean) => boolean) => void;
  cameraActive: boolean;
  fileSelected: (file: File) => void;
}) {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();

      const file = e.dataTransfer?.files[0];
      if (file) {
        fileSelected(file);
      }
    },
    [fileSelected]
  );

  const preventDefaults = useCallback((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const highlight = useCallback((e: Event) => {
    if (dropZoneRef.current) {
      dropZoneRef.current.className = dragZoneHighlight;
    }
  }, []);

  const unhighlight = useCallback((e: Event) => {
    if (dropZoneRef.current) {
      dropZoneRef.current.className = dragZone;
    }
  }, []);

  useEffect(() => {
    if (dropZoneRef.current) {
      const dropArea = dropZoneRef.current;
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.addEventListener(eventName, highlight, false);
      });
      ["dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, unhighlight, false);
      });

      dropArea.addEventListener("drop", onDrop, false);
    }
  });

  return (
    <div className={dragZone} ref={dropZoneRef}>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="file"
          id="fileElem"
          accept="image/*,.pdf"
          className={fileUpload}
          onChange={(e) => {
            e.target.files && fileSelected(e.target.files[0]);
          }}
        />
        <label htmlFor="fileElem">Drop file here</label>
        <br />
        <Button onClick={() => setCameraActiveState((state) => !state)}>
          <>
            <Icon path={cameraActive ? mdiCamera : mdiCameraOff} size={1} />
            <br />
            {cameraActive ? "Turn off camera" : "Use the Camera"}
          </>
        </Button>
      </form>
    </div>
  );
}
