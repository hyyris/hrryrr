export type Option = {
  id: string;
  text: string;
  delta: number;
  nextToken: string; // path string for next question
};

export type Question = {
  id: string;
  text: string;
  options: [Option, Option]; // always 2 for now
};

export type QuestionResponse = {
  token: string; // current path
  step: number; // 0-based step index
  isLast: boolean;
  question: Question;
};

export type DoneResponse = {
  done: true;
  step: number;
  token: string;
};
