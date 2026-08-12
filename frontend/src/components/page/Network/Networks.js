import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import { PlusOutlined } from "@ant-design/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import BreadCrumb from "../../../utils/bread-crumbs";
import { getStatus } from "../../../utils/common";
import Drawer from "../../../utils/drawer";

function Networks() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [networkDetail, setNetworkDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const data = [
    { name: "Network-01", cidr: "10.0.0.0/24", status: "Active", gatewayIp: "10.0.0.1" },
    { name: "Network-02", cidr: "10.0.1.0/24", status: "Active", gatewayIp: "10.0.1.1" },
    { name: "Network-03", cidr: "10.0.2.0/24", status: "Inactive", gatewayIp: "10.0.2.1" },
    { name: "Network-04", cidr: "10.0.3.0/24", status: "Active", gatewayIp: "10.0.3.1" },
    { name: "Network-05", cidr: "10.0.4.0/24", status: "Active", gatewayIp: "10.0.4.1" },
    { name: "Network-06", cidr: "10.0.5.0/24", status: "Inactive", gatewayIp: "10.0.5.1" },
    { name: "Network-07", cidr: "10.0.6.0/24", status: "Active", gatewayIp: "10.0.6.1" },
    { name: "Network-08", cidr: "10.0.7.0/24", status: "Active", gatewayIp: "10.0.7.1" },
    { name: "Network-09", cidr: "10.0.8.0/24", status: "Inactive", gatewayIp: "10.0.8.1" },
    { name: "Network-10", cidr: "10.0.9.0/24", status: "Active", gatewayIp: "10.0.9.1" },
    { name: "Network-11", cidr: "10.0.10.0/24", status: "Active", gatewayIp: "10.0.10.1" },
  ];
  const [networkData, setNetworkData] = useState([]);
  const [networkCopyData, setNetworkCopyData] = useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (item, record) => (
        <p
          className="text-sm text-gray-900 underline cursor-pointer"
          onClick={() => setNetworkDetail({ data: record, state: true })}
        >
          {item}
        </p>
      ),
    },
    {
      title: "CIDR",
      dataIndex: "cidr",
      key: "cidr",
      render: (item) => <p className="text-sm text-gray-900">{item}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (item) => {
        return <p>{getStatus(item)}</p>;
      },
    },
    {
      title: "Gateway IP",
      dataIndex: "gatewayIp",
      key: "gatewayIp",
      render: (item) => <p className="text-sm text-gray-900">{item}</p>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 50,
      render: () => (
        <HiOutlineDotsVertical className="text-gray-600 text-lg cursor-pointer" />
      ),
    },
  ];

  const onClose = () => {
    setNetworkDetail({ data: {}, state: false });
  };

  const createNetwork = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setNetworkCopyData(
      networkData?.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.cidr.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.status.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.gatewayIp.toLowerCase().includes(searchValue.toLowerCase())
        );
      }),
    );
  }, [networkData, searchValue]);

  useEffect(() => {
    setNetworkData(data);
    setNetworkCopyData(data);
  }, []);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <div className="flex justify-between items-center mb-2 ">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold text-[#101828]">
            Networks
          </h1>

          <BreadCrumb pathname={path} />
        </div>
        <div className="flex items-center gap-2">
          <SearchInput value={searchValue} setSearchValue={setSearchValue} />
          <CustomButton
            label="Create Network"
            icon={<PlusOutlined />}
            onClick={createNetwork}
          />
        </div>
      </div>
      <div className="mt-5">
        <CustomTable columns={columns} dataSource={networkCopyData} bordered />
      </div>
      {networkDetail?.state && (
        <Drawer
          item={networkDetail?.data}
          title={"Network Detail"}
          open={networkDetail?.state}
          onClose={onClose}
        />
      )}
    </>
  );
}

export default Networks;
