import InterpreterState, { InterpreterStatus } from "./InterpreterState";
import {
  Decrement,
  Definition,
  EmptyLine,
  Goto,
  GotoIfZero,
  Halt,
  Increment,
  Node,
  nodesList,
} from "./nodes";

export class Interpreter {
  private state: InterpreterState = new InterpreterState();
  private ast: Node[] = [];
  private runTimeout = 500;
  private onStateUpdated?: (state: InterpreterState) => void;

  public setOnStateUpdated(callback: (state: InterpreterState) => void) {
    this.onStateUpdated = callback;
  }

  public setRunTimeout(timeout: number) {
    this.runTimeout = Math.min(Math.max(0, timeout), 10000);
  }

  public getRunTimeout() {
    return this.runTimeout;
  }

  public load(code: string) {
    try {
      this.ast = this.parse(code);
      this.setState({ status: InterpreterStatus.LOADED });
    } catch (e) {
      this.setState({
        status: InterpreterStatus.PARSING_ERROR,
        errorMessage: (e as Error).message,
      });
    }
  }

  private parse(code: string) {
    const ast: Node[] = [];
    const lines = code.split("\n");

    for (let i = 0; i < lines.length; i++) {
      try {
        let matched = false;
        for (const NodeClass of nodesList) {
          const match = lines[i].match(NodeClass.re);

          if (match) {
            matched = true;
            ast.push(NodeClass.fromMatch(match));

            break;
          }
        }

        if (!matched) throw Error("No matched node in line");
      } catch (e) {
        throw Error(`${i + 1}: ${(e as Error).message}`);
      }
    }

    return ast;
  }

  private setState(newState: Partial<InterpreterState>) {
    this.state = this.state.update(newState);
    if (this.onStateUpdated) this.onStateUpdated(this.state);
  }

  runStep() {
    this.checkStatus(
      InterpreterStatus.LOADED,
      InterpreterStatus.RUNNING,
      InterpreterStatus.STEP_EXECUTION
    );
    if (this.state.lineIndex >= this.ast.length) {
      throw Error("The interpreter reached the end of the code");
    }

    this.setState({ status: InterpreterStatus.STEP_EXECUTION });
    this.runStepInternal();
  }

  private checkStatus(...statuses: InterpreterStatus[]) {
    if (!this.hasStatus(...statuses)) {
      throw Error(
        `The interpreter is not in the expected state\ncurrent: ${this.state.status}, expected: ${statuses}`
      );
    }
  }

  public hasStatus(...statuses: InterpreterStatus[]) {
    return statuses.includes(this.state.status);
  }

  private runStepInternal() {
    try {
      const node = this.ast[this.state.lineIndex];
      this.evalNode(node);
    } catch (e) {
      this.setState({
        status: InterpreterStatus.RUNTIME_ERROR,
        errorMessage: `${this.state.lineIndex + 1}: ${(e as Error).message}`,
      });
    }
  }

  private evalNode(node: Node) {
    if (node instanceof Definition) {
      const value = this.getLiteralValue(node.value);
      this.setState({
        lineIndex: this.clampLineIndex(this.state.lineIndex + 1),
        heap: {
          ...this.state.heap,
          [node.name]: value,
        },
      });
    }
    if (node instanceof Increment) {
      const prevValue = this.getHeapValue(node.name);
      this.setState({
        lineIndex: this.clampLineIndex(this.state.lineIndex + 1),
        heap: {
          ...this.state.heap,
          [node.name]: prevValue + 1,
        },
      });
    }
    if (node instanceof Decrement) {
      const prevValue = this.getHeapValue(node.name);
      this.setState({
        lineIndex: this.clampLineIndex(this.state.lineIndex + 1),
        heap: {
          ...this.state.heap,
          [node.name]: Math.max(prevValue - 1, 0),
        },
      });
    }
    if (node instanceof Goto) {
      this.setState({ lineIndex: this.clampLineIndex(node.lineNumber - 1) });
    }
    if (node instanceof GotoIfZero) {
      const value = this.getHeapValue(node.name);
      if (value === 0) {
        this.setState({ lineIndex: this.clampLineIndex(node.lineNumber - 1) });
      } else {
        this.setState({
          lineIndex: this.clampLineIndex(this.state.lineIndex + 1),
        });
      }
    }
    if (node instanceof Halt) {
      this.setState({ status: InterpreterStatus.LOADED });
    }
    if (node instanceof EmptyLine) {
      this.setState({
        lineIndex: this.clampLineIndex(this.state.lineIndex + 1),
      });
    }
  }

  private getLiteralValue(literal: string): number {
    const maybeNumber = Number(literal);

    if (!Number.isNaN(maybeNumber)) {
      return maybeNumber;
    }

    return this.getHeapValue(literal);
  }

  private getHeapValue(name: string) {
    if (this.state.heap.hasOwnProperty(name)) {
      return this.state.heap[name];
    }
    throw new Error(`Cannot access ${name}`);
  }

  private clampLineIndex(lineIndex: number) {
    return Math.max(0, Math.min(this.ast.length - 1, lineIndex));
  }

  public async run() {
    this.checkStatus(
      InterpreterStatus.LOADED,
      InterpreterStatus.RUNNING,
      InterpreterStatus.STEP_EXECUTION
    );
    this.setState({ status: InterpreterStatus.RUNNING });

    while (this.state.lineIndex < this.ast.length) {
      if (this.runTimeout > 0) {
        await new Promise((r) => setTimeout(r, this.runTimeout));
      }
      if (this.state.status !== InterpreterStatus.RUNNING) break;

      this.runStepInternal();
    }

    if (this.state.status === InterpreterStatus.RUNNING) {
      this.setState({ status: InterpreterStatus.LOADED });
    }
  }

  reset() {
    this.setState({
      lineIndex: 0,
      heap: {},
      status: InterpreterStatus.NOT_LOADED,
    });
  }

  stop() {
    this.setState({ status: InterpreterStatus.LOADED });
  }
}
