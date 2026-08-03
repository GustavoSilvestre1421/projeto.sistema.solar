class SimulatorBridge extends EventTarget {
  notifyBodySelected(bodyName, position = {}) {
    this.dispatchEvent(new CustomEvent('body:selected', {
      detail: { bodyName, position }
    }));
  }

  focusBody(bodyName, targetName = null) {
    this.dispatchEvent(new CustomEvent('camera:focus-requested', { detail: { bodyName, targetName } }));
  }

  resetCamera() {
    this.dispatchEvent(new CustomEvent('camera:reset-requested'));
  }

  exitPrecisionMode() {
    this.dispatchEvent(new CustomEvent('precision:exit-requested'));
  }
}

export const simulatorBridge = new SimulatorBridge();
