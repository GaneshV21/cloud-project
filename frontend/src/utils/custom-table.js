import { ConfigProvider, Table, Typography } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const PAGE_SIZE = 8;
const WINDOW_SIZE = 5;

export function CustomPagination({
  copyData = [],
  setPageNumbers,
  pageNumbers,
  setPagination,
}) {
  const [selectedPage, setSelectedPage] = useState(1);
  const totalPages = Math.max(Math.ceil(copyData.length / PAGE_SIZE), 1);

  const handlePagination = useCallback(
    (item, type) => {
      if (type === "") {
        const startIndex = (item - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        setPagination({ start: startIndex, end: endIndex });
        setSelectedPage(item);
      } else if (type === "backward" && item !== 1) {
        let count = item - 1;
        setSelectedPage(count);
        setPagination({
          start: (count - 1) * PAGE_SIZE,
          end: (count - 1) * PAGE_SIZE + PAGE_SIZE,
        });
      } else if (type === "forward" && item !== totalPages) {
        let count = item + 1;
        setSelectedPage(count);
        setPagination({
          start: item * PAGE_SIZE,
          end: item * PAGE_SIZE + PAGE_SIZE,
        });
      }
    },
    [totalPages, setPagination],
  );

  useEffect(() => {
    setSelectedPage(1);
  }, [copyData]);

  // below 5 page numbers
  useEffect(() => {
    let start = selectedPage;
    let end = selectedPage + WINDOW_SIZE - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(totalPages - WINDOW_SIZE + 1, 1);
    }
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);
    setPageNumbers(pages);
  }, [selectedPage, totalPages, setPageNumbers]);

  return (
    <div className="mx-2">
      <div className="flex gap-2 items-center">
        <IoIosArrowBack
          className="text-gray-600 border-solid border-[1px] border-gray-300 w-5 h-6  rounded-md"
          disabled={selectedPage === 1}
          onClick={() => handlePagination(selectedPage, "backward")}
        />
        {pageNumbers?.map((item) => (
          <div
            key={item}
            className={`${item === selectedPage ? "bg-[#5142D4] border-none text-white" : "text-gray-600"} border-solid border-[1px] border-gray-300 w-7 h-6 flex items-center justify-center cursor-pointer rounded-md`}
            onClick={() => handlePagination(item, "")}
          >
            {item}
          </div>
        ))}
        <IoIosArrowForward
          disabled={selectedPage === totalPages}
          onClick={() => handlePagination(selectedPage, "forward")}
          className="text-gray-600 border-solid border-[1px] border-gray-300 w-5 h-6 rounded-md cursor-pointer"
        />
      </div>
    </div>
  );
}

// Fixed props destructuring
export function Footer({
  copyData,
  setPageNumbers,
  pageNumbers,
  setPagination,
  pagination,
}) {
  const total = copyData?.length || 0;
  const start = total === 0 ? 0 : pagination.start + 1;
  const end = Math.min(pagination.end, total);

  return (
    <div className="flex justify-between my-2 items-center">
      <Typography>
        Showing {start} to {end} of {total} results
      </Typography>
      <div>
        <CustomPagination
          copyData={copyData}
          setPageNumbers={setPageNumbers}
          pageNumbers={pageNumbers}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
}

function CustomTable({ dataSource = [], ...props }) {
  const [pagination, setPagination] = useState({ start: 0, end: PAGE_SIZE });
  const [pageNumbers, setPageNumbers] = useState([]);
  const PaginationData = useMemo(() => {
    return dataSource.slice(pagination.start, pagination.end);
  }, [dataSource, pagination]);

  useEffect(() => {
    setPagination({ start: 0, end: PAGE_SIZE });
  }, [dataSource]);

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#FAFAFA",
              headerColor: "#535862",
              footerBg: "#ffffff",
              cellPaddingBlock: 8,
              cellPaddingBlockSM: 6,
              cellPaddingInline: 8,
              cellPaddingInlineSM: 6,
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
          footer={() => (
            <Footer
              copyData={dataSource}
              setPageNumbers={setPageNumbers}
              pageNumbers={pageNumbers}
              setPagination={setPagination}
              pagination={pagination}
            />
          )}
        />
      </ConfigProvider>
    </div>
  );
}

export default CustomTable;
