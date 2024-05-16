import { ThemeUIStyleObject } from "theme-ui";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      section: {
        sx?: ThemeUIStyleObject;
      };
      // Add other elements that use the sx prop here
    }
  }
}
