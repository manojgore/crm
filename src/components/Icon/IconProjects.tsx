import * as React from "react";

function IconProjects(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M7 14.001h2v2H7z" />
      <path d="M19 2h-8a2 2 0 00-2 2v6H5c-1.103 0-2 .897-2 2v9a1 1 0 001 1h16a1 1 0 001-1V4a2 2 0 00-2-2zM5 20v-8h6v8H5zm9-12h-2V6h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2z" />
    </svg>
  );
}

export default IconProjects;