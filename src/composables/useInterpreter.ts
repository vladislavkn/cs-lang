import { Ref, computed, ref, shallowRef, watch } from "vue";
import { Interpreter } from "../interpreter/interpreter";
import InterpreterState, {
  InterpreterStatus,
} from "../interpreter/InterpreterState";

const useInterpreter = (code: Ref<string>) => {
  const interpreter = new Interpreter();
  const state = shallowRef<InterpreterState>(new InterpreterState());

  watch(code, () => {
    const runningOrStepExecution = [
      InterpreterStatus.RUNNING,
      InterpreterStatus.STEP_EXECUTION,
    ];
    if (runningOrStepExecution.includes(state.value.status)) {
      interpreter.reset();
    }
  });

  interpreter.setOnStateUpdated((newState) => {
    state.value = newState;
  });

  const run = () => {
    loadCodeIfStatus(
      InterpreterStatus.NOT_LOADED,
      InterpreterStatus.PARSING_ERROR,
      InterpreterStatus.RUNTIME_ERROR
    );
    try {
      interpreter.run();
    } catch (e) {
      console.error(e);
    }
  };

  const runStep = () => {
    loadCodeIfStatus(
      InterpreterStatus.NOT_LOADED,
      InterpreterStatus.PARSING_ERROR,
      InterpreterStatus.RUNTIME_ERROR
    );
    try {
      interpreter.evalStep();
    } catch (e) {
      console.error(e);
    }
  };

  const loadCodeIfStatus = (...statuses: InterpreterStatus[]) => {
    if (statuses.includes(state.value.status)) {
      interpreter.load(code.value);
    }
  };

  const reset = () => interpreter.reset();
  const stop = () => interpreter.stop();

  const runTimeout = ref(interpreter.getRunTimeout());

  watch(runTimeout, (newValue) => {
    if (newValue !== interpreter.getRunTimeout()) {
      interpreter.setRunTimeout(newValue);
      runTimeout.value = interpreter.getRunTimeout();
    }
  });

  return {
    state,
    run,
    runStep,
    reset,
    stop,
    runTimeout,
  };
};

export default useInterpreter;
