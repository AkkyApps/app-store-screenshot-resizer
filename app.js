const presets = [
  {
    id: "apple-watch-11-portrait",
    label: "Apple Watch Series 11 portrait",
    width: 416,
    height: 496,
  },
  {
    id: "iphone-17-pro-max-portrait",
    label: 'iPhone 17 Pro Max portrait',
    width: 1320,
    height: 2868,
  },
  {
    id: "iphone-17-pro-max-landscape",
    label: 'iPhone 17 Pro Max landscape',
    width: 2868,
    height: 1320,
  },
  {
    id: "ipad-13-portrait",
    label: '13" iPad portrait',
    width: 2064,
    height: 2752,
  },
  {
    id: "ipad-13-landscape",
    label: '13" iPad landscape',
    width: 2752,
    height: 2064,
  },
  {
    id: "ipad-12-9-portrait",
    label: '12.9" iPad portrait',
    width: 2048,
    height: 2732,
  },
  {
    id: "ipad-12-9-landscape",
    label: '12.9" iPad landscape',
    width: 2732,
    height: 2048,
  },
];

const elements = {
  dropZone: document.getElementById("dropZone"),
  dropZoneLabel: document.getElementById("dropZoneLabel"),
  imageInput: document.getElementById("imageInput"),
  presetSelect: document.getElementById("presetSelect"),
  outputSize: document.getElementById("outputSize"),
  orientationLabel: document.getElementById("orientationLabel"),
  zoomRange: document.getElementById("zoomRange"),
  fitButton: document.getElementById("fitButton"),
  centerButton: document.getElementById("centerButton"),
  downloadButton: document.getElementById("downloadButton"),
  statusText: document.getElementById("statusText"),
  sourceSize: document.getElementById("sourceSize"),
  canvasFrame: document.getElementById("canvasFrame"),
  previewCanvas: document.getElementById("previewCanvas"),
  emptyState: document.getElementById("emptyState"),
};

const ctx = elements.previewCanvas.getContext("2d");

const state = {
  image: null,
  preset: presets[0],
  scale: 1,
  minScale: 1,
  offsetX: 0,
  offsetY: 0,
  dragging: false,
  startPointerX: 0,
  startPointerY: 0,
  startOffsetX: 0,
  startOffsetY: 0,
};

function isSupportedFile(file) {
  return ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
}

function resetInputValue() {
  elements.imageInput.value = "";
}

function populatePresets() {
  for (const preset of presets) {
    const option = document.createElement("option");
    option.value = preset.id;
    option.textContent = `${preset.label} (${preset.width} × ${preset.height})`;
    elements.presetSelect.append(option);
  }
  elements.presetSelect.value = state.preset.id;
  updatePresetMeta();
}

function updatePresetMeta() {
  elements.outputSize.textContent = `${state.preset.width} × ${state.preset.height}`;
  elements.orientationLabel.textContent =
    state.preset.width > state.preset.height ? "landscape" : "portrait";
}

function loadImage(file) {
  if (!isSupportedFile(file)) {
    setStatus("PNG または JPG ファイルをドロップしてください。");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      state.image = img;
      elements.sourceSize.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
      elements.emptyState.hidden = true;
      elements.dropZoneLabel.textContent = "別の画像に差し替える";
      fitImage();
      render();
      elements.downloadButton.disabled = false;
      setStatus("画像を読み込みました。ドラッグで位置を調整できます。");
    };
    img.onerror = () => {
      setStatus("画像の読み込みに失敗しました。PNG または JPG を試してください。");
    };
    img.src = reader.result;
  };
  reader.onerror = () => {
    setStatus("ファイルの読み込みに失敗しました。");
  };
  reader.readAsDataURL(file);
  resetInputValue();
}

function fitImage() {
  if (!state.image) {
    return;
  }

  const scaleX = state.preset.width / state.image.naturalWidth;
  const scaleY = state.preset.height / state.image.naturalHeight;
  state.minScale = Math.max(scaleX, scaleY);
  state.scale = state.minScale;
  elements.zoomRange.min = state.minScale.toFixed(2);
  elements.zoomRange.max = Math.max(state.minScale * 4, state.minScale + 0.1).toFixed(2);
  elements.zoomRange.value = state.scale.toFixed(2);
  centerImage();
}

function centerImage() {
  if (!state.image) {
    return;
  }

  const drawnWidth = state.image.naturalWidth * state.scale;
  const drawnHeight = state.image.naturalHeight * state.scale;
  state.offsetX = (state.preset.width - drawnWidth) / 2;
  state.offsetY = (state.preset.height - drawnHeight) / 2;
  clampOffsets();
  render();
}

function clampOffsets() {
  if (!state.image) {
    return;
  }

  const drawnWidth = state.image.naturalWidth * state.scale;
  const drawnHeight = state.image.naturalHeight * state.scale;

  if (drawnWidth <= state.preset.width) {
    state.offsetX = (state.preset.width - drawnWidth) / 2;
  } else {
    const minX = state.preset.width - drawnWidth;
    state.offsetX = Math.min(0, Math.max(minX, state.offsetX));
  }

  if (drawnHeight <= state.preset.height) {
    state.offsetY = (state.preset.height - drawnHeight) / 2;
  } else {
    const minY = state.preset.height - drawnHeight;
    state.offsetY = Math.min(0, Math.max(minY, state.offsetY));
  }
}

function render() {
  const { width, height } = state.preset;
  elements.previewCanvas.width = width;
  elements.previewCanvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f7f2e9";
  ctx.fillRect(0, 0, width, height);

  if (!state.image) {
    return;
  }

  ctx.drawImage(
    state.image,
    state.offsetX,
    state.offsetY,
    state.image.naturalWidth * state.scale,
    state.image.naturalHeight * state.scale
  );
}

function setStatus(message) {
  elements.statusText.textContent = message;
}

function updateScale(nextScale, anchorX = state.preset.width / 2, anchorY = state.preset.height / 2) {
  if (!state.image) {
    return;
  }

  const clampedScale = Math.max(state.minScale, Number(nextScale));
  const previousScale = state.scale;
  const imageX = (anchorX - state.offsetX) / previousScale;
  const imageY = (anchorY - state.offsetY) / previousScale;

  state.scale = clampedScale;
  state.offsetX = anchorX - imageX * state.scale;
  state.offsetY = anchorY - imageY * state.scale;
  clampOffsets();
  elements.zoomRange.value = state.scale.toFixed(2);
  render();
}

function downloadImage() {
  if (!state.image) {
    setStatus("先に画像を読み込んでください。");
    return;
  }

  const link = document.createElement("a");
  const safeLabel = state.preset.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  link.href = elements.previewCanvas.toDataURL("image/png");
  link.download = `app-store-${safeLabel}.png`;
  link.click();
  setStatus(`PNG を書き出しました: ${state.preset.width} × ${state.preset.height}`);
}

function getCanvasPointerPosition(event) {
  const rect = elements.previewCanvas.getBoundingClientRect();
  const scaleX = elements.previewCanvas.width / rect.width;
  const scaleY = elements.previewCanvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

elements.imageInput.addEventListener("change", (event) => {
  const [file] = event.target.files || [];
  if (file) {
    loadImage(file);
  }
});

function showDropFeedback() {
  elements.dropZone.classList.add("drag-over");
}

function hideDropFeedback() {
  elements.dropZone.classList.remove("drag-over");
}

function hasFilePayload(event) {
  return event.dataTransfer?.types?.includes("Files");
}

elements.dropZone.addEventListener("dragenter", (event) => {
  if (!hasFilePayload(event)) {
    return;
  }

  event.preventDefault();
  showDropFeedback();
});

elements.dropZone.addEventListener("dragover", (event) => {
  if (!hasFilePayload(event)) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  showDropFeedback();
});

elements.dropZone.addEventListener("dragleave", (event) => {
  if (!hasFilePayload(event)) {
    return;
  }

  event.preventDefault();
  hideDropFeedback();
});

elements.dropZone.addEventListener("drop", (event) => {
  if (!event.dataTransfer?.files?.length) {
    return;
  }

  event.preventDefault();
  hideDropFeedback();
  const [file] = event.dataTransfer.files;
  loadImage(file);
});

document.addEventListener("dragover", (event) => {
  if (!hasFilePayload(event)) {
    return;
  }

  event.preventDefault();
});

document.addEventListener("drop", (event) => {
  if (!event.dataTransfer?.types?.includes("Files")) {
    return;
  }

  event.preventDefault();
  hideDropFeedback();
});

elements.presetSelect.addEventListener("change", (event) => {
  state.preset = presets.find((preset) => preset.id === event.target.value) || presets[0];
  updatePresetMeta();
  if (state.image) {
    fitImage();
    setStatus(`プリセットを ${state.preset.width} × ${state.preset.height} に切り替えました。`);
  } else {
    render();
  }
});

elements.zoomRange.addEventListener("input", (event) => {
  updateScale(event.target.value);
});

elements.fitButton.addEventListener("click", () => {
  fitImage();
  setStatus("画像をキャンバスにフィットさせました。");
});

elements.centerButton.addEventListener("click", () => {
  centerImage();
  setStatus("画像位置を中央に戻しました。");
});

elements.downloadButton.addEventListener("click", downloadImage);

elements.previewCanvas.addEventListener("pointerdown", (event) => {
  if (!state.image) {
    return;
  }

  const point = getCanvasPointerPosition(event);
  state.dragging = true;
  state.startPointerX = point.x;
  state.startPointerY = point.y;
  state.startOffsetX = state.offsetX;
  state.startOffsetY = state.offsetY;
  elements.previewCanvas.classList.add("dragging");
  elements.previewCanvas.setPointerCapture(event.pointerId);
});

elements.previewCanvas.addEventListener("pointermove", (event) => {
  if (!state.dragging || !state.image) {
    return;
  }

  const point = getCanvasPointerPosition(event);
  state.offsetX = state.startOffsetX + (point.x - state.startPointerX);
  state.offsetY = state.startOffsetY + (point.y - state.startPointerY);
  clampOffsets();
  render();
});

function stopDragging(event) {
  if (!state.dragging) {
    return;
  }

  state.dragging = false;
  elements.previewCanvas.classList.remove("dragging");
  if (event?.pointerId !== undefined && elements.previewCanvas.hasPointerCapture(event.pointerId)) {
    elements.previewCanvas.releasePointerCapture(event.pointerId);
  }
}

elements.previewCanvas.addEventListener("pointerup", stopDragging);
elements.previewCanvas.addEventListener("pointercancel", stopDragging);
elements.previewCanvas.addEventListener("pointerleave", stopDragging);

elements.previewCanvas.addEventListener(
  "wheel",
  (event) => {
    if (!state.image) {
      return;
    }

    event.preventDefault();
    const point = getCanvasPointerPosition(event);
    const direction = event.deltaY < 0 ? 1.05 : 0.95;
    updateScale(state.scale * direction, point.x, point.y);
  },
  { passive: false }
);

populatePresets();
render();
