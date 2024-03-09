export default class InterpreterState {
  constructor(
    public lineIndex: number = 0,
    public heap: Record<string, number> = {},
    public status: InterpreterStatus = InterpreterStatus.NOT_LOADED,
    public errorMessage?: string
  ) {
    Object.freeze(this);
  }

  public update(newValues: Partial<InterpreterState>) {
    const values = { ...this, ...newValues };
    if (newValues.heap) {
      values.heap = { ...newValues.heap };
    }

    const errorStatuses = [
      InterpreterStatus.PARSING_ERROR,
      InterpreterStatus.RUNTIME_ERROR,
    ];
    if (!errorStatuses.includes(values.status)) {
      values.errorMessage = undefined;
    }

    return new InterpreterState(
      values.lineIndex,
      values.heap,
      values.status,
      values.errorMessage
    );
  }
}

export enum InterpreterStatus {
  NOT_LOADED = "NOT_LOADED",
  PARSING_ERROR = "PARSING_ERROR",
  LOADED = "LOADED/STOPPED",
  RUNNING = "RUNNING",
  STEP_EXECUTION = "STEP_EXECUTION",
  RUNTIME_ERROR = "RUNTIME_ERROR",
}
