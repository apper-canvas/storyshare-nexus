import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const Home = lazy(() => import("@/components/pages/Home"));
const MyStories = lazy(() => import("@/components/pages/MyStories"));
const Browse = lazy(() => import("@/components/pages/Browse"));
const Library = lazy(() => import("@/components/pages/Library"));
const StoryReader = lazy(() => import("@/components/pages/StoryReader"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <div className="text-lg font-medium text-gray-900">Loading StoryShare...</div>
    </div>
  </div>
);

// Wrap components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// Define main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: withSuspense(Home)
  },
  {
    path: "my-stories",
    element: withSuspense(MyStories)
  },
  {
    path: "browse",
    element: withSuspense(Browse)
  },
},
  {
    path: "library",
    element: withSuspense(Library)
  },
  {
    path: "story/:storyId",
    element: withSuspense(StoryReader)
  },
  {
    path: "*",
    element: withSuspense(NotFound)
  }
];
// Create routes array
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

// Export router
export const router = createBrowserRouter(routes);