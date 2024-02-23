/* eslint-disable @next/next/no-img-element */

import React, { useContext } from "react";
import { LayoutContext } from "./context/layoutcontext";
import Image from "next/image";

const AppFooter = () => {
  const { layoutConfig } = useContext(LayoutContext);

  return (
    <div className="layout-footer">
      <Image
        src="/logo-white.png"
        alt="Logo"
        width={70}
        height="70"
        className="mr-2"
      />
      by
      <span className="font-medium ml-2">Liberty Mutabvuri</span>
    </div>
  );
};

export default AppFooter;
