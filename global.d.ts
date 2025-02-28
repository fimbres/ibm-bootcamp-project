declare module "*.png" {
  const value: ImageSourcePropType;
  export default value;
}

declare module "*.jpg" {
  const value: ImageSourcePropType;
  export default value;
}

declare module "*.jpeg" {
  const value: ImageSourcePropType;
  export default value;
}

declare module "*.gif" {
  const value: ImageSourcePropType;
  export default value;
}

declare module "*.svg" {
  import React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "*.webp" {
  const value: ImageSourcePropType;
  export default value;
}

declare module "*.avif" {
  const value: ImageSourcePropType;
  export default value;
}
