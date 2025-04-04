// This file is added for correct work of TS-checks in pre-commit hook using tsc-files
declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}
