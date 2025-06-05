"use client";

import { Star } from "lucide-react";
import * as React from "react";

import { IconButton } from "@/registry/icon-button/icon-button";

export default function IconButtonDemo() {
  const [active, setActive] = React.useState(false);

  return (
    <IconButton
      icon={Star}
      active={active}
      onClick={() => setActive(!active)}
      color={[255, 255, 0]}
    />
  );
}
