import { ConfigProvider, Table } from "antd";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const WINDOW_SIZE = 5;
// Used only until a real row has been rendered and measured
const DEFAULT_ROW_HEIGHT = 49;

// Nearest ancestor that scrolls vertically (the page content area in the layout)
function getScrollParent(el) {
  let node = el?.parentElement;
  while (node && node !== document.body) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return document.documentElement;
}

export function CustomPagination({ total = 0, pageSize, page, onChange }) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  // Sliding window of up to 5 page numbers around the current page
  const pageNumbers = useMemo(() => {
    let start = Math.max(page - Math.floor(WINDOW_SIZE / 2), 1);
    let end = Math.min(start + WINDOW_SIZE - 1, totalPages);
    start = Math.max(end - WINDOW_SIZE + 1, 1);
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }, [page, totalPages]);

  const arrowClass = (disabled) =>
    `text-sm text-gray-500 border-solid border-[1px] border-gray-300 w-5 h-6 rounded-md ${
      disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
    }`;

  return (
    <div className="mx-2">
      <div className="flex gap-2 items-center">
        <IoIosArrowBack
          className={arrowClass(page === 1)}
          onClick={() => page > 1 && onChange(page - 1)}
        />
        {pageNumbers.map((item) => (
          <div
            key={item}
            className={`${item === page ? "bg-[#5142D4] border-none text-white" : "text-gray-500"} text-sm border-solid border-[1px] border-gray-300 w-7 h-6 flex items-center justify-center cursor-pointer rounded-md`}
            onClick={() => onChange(item)}
          >
            {item}
          </div>
        ))}
        <IoIosArrowForward
          className={arrowClass(page === totalPages)}
          onClick={() => page < totalPages && onChange(page + 1)}
        />
      </div>
    </div>
  );
}

export function Footer({ total = 0, pageSize, page, onChange }) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex justify-between my-2 items-center">
      <p className="text-sm text-gray-500">
        Showing {start} to {end} of {total} results
      </p>
      <div>
        <CustomPagination total={total} pageSize={pageSize} page={page} onChange={onChange} />
      </div>
    </div>
  );
}

function CustomTable({ dataSource = [], ...props }) {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  // Tallest row seen for the current data, so the page size doesn't flip back and forth
  const rowHeightRef = useRef(0);
  const [pageSize, setPageSize] = useState(1);
  const [bodyHeight, setBodyHeight] = useState(undefined);
  const [page, setPage] = useState(1);

  const total = dataSource.length;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const currentPage = Math.min(page, totalPages);

  const PaginationData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return dataSource.slice(start, start + pageSize);
  }, [dataSource, currentPage, pageSize]);

  // Work out how many rows fit between the table's top and the bottom of the page area
  const measure = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (!containerRef.current) containerRef.current = getScrollParent(wrapper);
    const container = containerRef.current;

    const rows = wrapper.querySelectorAll(".ant-table-tbody > tr.ant-table-row");
    rows.forEach((row) => {
      rowHeightRef.current = Math.max(rowHeightRef.current, row.offsetHeight);
    });
    const rowHeight = rowHeightRef.current || DEFAULT_ROW_HEIGHT;

    const isRoot = container === document.documentElement;
    const containerStyle = window.getComputedStyle(container);
    const containerBottom = isRoot
      ? window.innerHeight
      : container.getBoundingClientRect().bottom -
        parseFloat(containerStyle.paddingBottom) -
        parseFloat(containerStyle.borderBottomWidth);
    const wrapperTop = wrapper.getBoundingClientRect().top + (isRoot ? 0 : container.scrollTop);
    const available = containerBottom - wrapperTop;

    // Everything in the table that isn't body rows: header, footer/pagination, borders
    const body =
      wrapper.querySelector(".ant-table-body") || wrapper.querySelector(".ant-table-tbody");
    const chrome = wrapper.offsetHeight - (body?.offsetHeight ?? 0);

    const availableBody = Math.floor(available - chrome);
    const nextSize = Math.max(Math.floor(availableBody / rowHeight), 1);
    const nextBodyHeight = Math.max(availableBody, rowHeight);

    setPageSize((prev) => (prev === nextSize ? prev : nextSize));
    setBodyHeight((prev) => (prev === nextBodyHeight ? prev : nextBodyHeight));
  }, []);

  // New data: start from page 1 and re-measure row heights
  useEffect(() => {
    rowHeightRef.current = 0;
    setPage(1);
  }, [dataSource]);

  // Measure before paint so the first frame already has the right number of rows
  useLayoutEffect(() => {
    measure();
  }, [measure, PaginationData]);

  // Re-measure whenever the page area or the table itself changes size
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const container = containerRef.current || getScrollParent(wrapper);
    const observer = new ResizeObserver(() => measure());
    observer.observe(wrapper);
    observer.observe(container === document.documentElement ? document.body : container);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div ref={wrapperRef} className="custom-table">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#FAFAFA",
              headerColor: "#6B7280", // text-gray-500
              footerBg: "#ffffff",
              cellPaddingBlock: 8,
              cellPaddingBlockSM: 6,
              cellPaddingInline: 8,
              cellPaddingInlineSM: 6,
            },
            // Actions (⋮) menus opened from table rows: text-sm
            Dropdown: {
              fontSize: 14,
            },
          },
          token: {
            borderRadius: 10,
            fontSize: 16,
          },
        }}
      >
        <Table
          {...props}
          dataSource={PaginationData}
          pagination={false}
          // If a row is taller than expected, scroll inside the table instead of the page
          scroll={bodyHeight ? { ...props.scroll, y: bodyHeight } : props.scroll}
          footer={() => (
            <Footer total={total} pageSize={pageSize} page={currentPage} onChange={setPage} />
          )}
        />
      </ConfigProvider>
    </div>
  );
}

export default CustomTable;
