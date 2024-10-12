import Search from "../Page/Search";
const { createBrowserRouter, Route, createRoutesFromElements } = require("react-router-dom");
export const route = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* <Route index element={<Home />} /> */}
      <Route path="search" element={<Search />} />
    </Route>
  )
);
