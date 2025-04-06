// src/components/WithLoading.jsx (or wherever you organize your components)

import React from "react";
import LoadingPage from "../Pages/LoadingPage"; // adjust path as needed

const WithLoading = ({ loading, children }) => {
  return loading ? <LoadingPage /> : children;
};

export default WithLoading;
