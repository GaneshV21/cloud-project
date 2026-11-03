import React, { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { getPathSegmentsAsPascalCase } from "./common";

// items (optional): [{ title, path? }] — an item with a path is a link back to that page.
// Without items, the crumbs are built from the pathname and none of them are links.
const BreadCrumb = ({ pathname, items }) => {
  const [breadCrumbItem, setBreadCrumbItem] = useState([]);

  useEffect(() => {
    if (items) {
      setBreadCrumbItem(
        items.map((item) => ({
          title: item.path ? (
            <Link to={item.path} className="!text-[#5142D4] hover:underline">
              {item.title}
            </Link>
          ) : (
            item.title
          ),
        }))
      );
      return;
    }
    let data = getPathSegmentsAsPascalCase(pathname);
    const breadcrumbItems = data.map((item) => ({
      title: item,
    }));
    setBreadCrumbItem([...breadcrumbItems]);
  }, [pathname, items]);

  return <Breadcrumb separator=">" items={breadCrumbItem} />;
};
export default BreadCrumb;
