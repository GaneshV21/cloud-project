import React, { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { getPathSegmentsAsPascalCase } from "./common";

const BreadCrumb = ({ pathname }) => {
  const [breadCrumbItem, setBreadCrumbItem] = useState([]);

  useEffect(() => {
    let data = getPathSegmentsAsPascalCase(pathname);
    const breadcrumbItems = data.map((item) => ({
      title: item,
    }));
    setBreadCrumbItem([...breadcrumbItems]);
  }, [pathname]);

  return <Breadcrumb separator=">" items={breadCrumbItem} />;
};
export default BreadCrumb;
