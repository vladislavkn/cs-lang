import { Ref, ref, shallowRef, watch } from "vue";
import { Interpreter } from "../interpreter/interpreter";
import InterpreterState, {
  InterpreterStatus,
} from "../interpreter/InterpreterState";

const useInterpreter = (code: Ref<string>) => {
  const interpreter = new Interpreter();
  const state = shallowRef<InterpreterState>(new InterpreterState());

  watch(code, () => {
    if (!interpreter.hasStatus(InterpreterStatus.NOT_LOADED)) {
      interpreter.reset();
    }
  });

  interpreter.setOnStateUpdated((newState) => {
    state.value = newState;
  });

  const reset = () => interpreter.reset();
  const stop = () => interpreter.stop();
  const run = () => invokeInterpreterRunMethod(() => interpreter.run());
  const runStep = () => invokeInterpreterRunMethod(() => interpreter.runStep());

  const invokeInterpreterRunMethod = async (fn: () => void) => {
    loadCodeIfNeeded();
    try {
      await fn();
    } catch (e) {
      console.error(e);
      alert("Interpreter error: " + (e as Error).message);
    }
  };

  const loadCodeIfNeeded = () => {
    const needLoad = interpreter.hasStatus(
      InterpreterStatus.PARSING_ERROR,
      InterpreterStatus.RUNTIME_ERROR,
      InterpreterStatus.NOT_LOADED
    );
    if (needLoad) {
      interpreter.load(code.value);
    }
  };

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
