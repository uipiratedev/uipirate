"use client";

import UIComponentLibrary from "./UIComponentLibrary";
import UIComponentDashboard from "./UIComponentDashboard";

export { default as UIComponentLibrary } from "./UIComponentLibrary";
export { default as UIComponentDashboard } from "./UIComponentDashboard";

export default function UIComponentsScreen() {
  return <UIComponentLibrary />;
}
