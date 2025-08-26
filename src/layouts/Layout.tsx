import { Outlet, ScrollRestoration } from "react-router-dom";

import { LayoutWrapper } from "./styled/components";

export default function Layout() {
  return (
    <LayoutWrapper>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
      <ScrollRestoration />
    </LayoutWrapper>
  );
}
