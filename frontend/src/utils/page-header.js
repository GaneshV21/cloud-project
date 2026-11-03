import React from "react";
import BreadCrumb from "./bread-crumbs";

// breadcrumbItems (optional): [{ title, path? }] for pages that need clickable crumbs
const PageHeader = ({
  pathname,
  title,
  description,
  children,
  showBreadcrumb = true,
  breadcrumbItems,
}) => {
  return (
    <>
      {showBreadcrumb && <BreadCrumb pathname={pathname} items={breadcrumbItems} />}
      <div className={`flex justify-between items-center mb-2 ${showBreadcrumb ? "mt-2" : ""}`}>
        <div className="flex flex-col gap-1">
          <p className="text-[24px] leading-[38px] font-semibold text-[#181D27]">{title}</p>
          {description && (
            <p className="text-[#535862] text-[16px] leading-6">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </>
  );
};

export default PageHeader;
