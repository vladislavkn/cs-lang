export class Definition {
  constructor(public name: string, public value: string) {}

  static fromMatch(match: RegExpMatchArray) {
    return new Definition(match[1], match[2]);
  }

  static re = /^([a-zA-Z]+\d*)\s*=\s*([a-zA-Z]*\d*)$/;
}

export class Increment {
  constructor(public name: string) {}

  static fromMatch(match: RegExpMatchArray) {
    return new Increment(match[1]);
  }

  static re = /^([a-zA-Z]+\d*)\s*=\s*\1\s*\+\s*1$/;
}

export class Decrement {
  constructor(public name: string) {}

  static fromMatch(match: RegExpMatchArray) {
    return new Decrement(match[1]);
  }

  static re = /^([a-zA-Z]+\d*)\s*=\s*\1\s*\-\s*1$/;
}

export class Goto {
  constructor(public lineNumber: number) {}

  static fromMatch(match: RegExpMatchArray) {
    const lineNumber = Number(match[1]);
    if (Number.isNaN(lineNumber)) {
      throw Error("Cannot parse lineNumber");
    }
    return new Goto(lineNumber);
  }

  static re = /^goto\s*(\d+)$/i;
}

export class GotoIfZero {
  constructor(public name: string, public lineNumber: number) {}

  static fromMatch(match: RegExpMatchArray) {
    const lineNumber = Number(match[1]);
    if (Number.isNaN(lineNumber)) {
      throw Error("Cannot parse lineNumber");
    }
    return new GotoIfZero(match[2], lineNumber);
  }

  static re = /^goto\s*(\d+)\s*if\s*([a-zA-Z]\d*)\s*=\s*0$/i;
}

export class Halt {
  static fromMatch(_: RegExpMatchArray) {
    return new Halt();
  }

  static re = /^halt$/i;
}

export class EmptyLine {
  static fromMatch(_: RegExpMatchArray) {
    return new EmptyLine();
  }
  static re = /^\s*(#\s*\w*)*\s*$/;
}

export const nodesList = [
  Definition,
  Increment,
  Decrement,
  Goto,
  GotoIfZero,
  Halt,
  EmptyLine,
];

export type Node =
  | Definition
  | Increment
  | Decrement
  | Goto
  | GotoIfZero
  | Halt
  | EmptyLine;
