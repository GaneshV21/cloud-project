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

function Instances() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [instanceDetail, setInstanceDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const data = [
    {
      name: "Instance 1",
      status: "Running",
      ip: "192.168.1.1",
      cpu: "2",
      ram: "4 GB",
      os: "Ubuntu 22.04",
      keypair: "Keypair-01",
      network: "Network-01",
    },
    {
      name: "Instance 2",
      status: "Running",
      ip: "192.168.1.2",
      cpu: "3",
      ram: "8 GB",
      os: "Ubuntu 22.04",
      keypair: "Keypair-02",
      network: "Network-01",
    },
    {
      name: "Instance 3",
      status: "Stopped",
      ip: "192.168.1.3",
      cpu: "4",
      ram: "16 GB",
      os: "Centos",
      keypair: "Keypair-03",
      network: "Network-02",
    },
    {
      name: "Instance 4",
      status: "Running",
      ip: "192.168.1.4",
      cpu: "1",
      ram: "4 GB",
      os: "Windows 2021",
      keypair: "Keypair-04",
      network: "Network-02",
    },
    {
      name: "Instance 5",
      status: "Running",
      ip: "192.168.1.5",
      cpu: "3",
      ram: "8 GB",
      os: "Windows 2021",
      keypair: "Keypair-05",
      network: "Network-03",
    },
    {
      name: "Instance 6",
      status: "Stopped",
      ip: "192.168.1.6",
      cpu: "4",
      ram: "16 GB",
      os: "Ubuntu 20.04",
      keypair: "Keypair-06",
      network: "Network-03",
    },
    {
      name: "Instance 7",
      status: "Running",
      ip: "192.168.1.7",
      cpu: "1",
      ram: "4 GB",
      os: "Ubuntu 20.04",
      keypair: "Keypair-07",
      network: "Network-04",
    },
    {
      name: "Instance 8",
      status: "Running",
      ip: "192.168.1.8",
      cpu: "3",
      ram: "8 GB",
      os: "Centos",
      keypair: "Keypair-08",
      network: "Network-04",
    },
    {
      name: "Instance 9",
      status: "Stopped",
      ip: "192.168.1.9",
      cpu: "4",
      ram: "16 GB",
      os: "Ubuntu 20.04",
      keypair: "Keypair-09",
      network: "Network-05",
    },
    {
      name: "Instance 10",
      status: "Running",
      ip: "192.168.1.10",
      cpu: "1",
      ram: "4 GB",
      os: "Ubuntu 20.04",
      keypair: "Keypair-10",
      network: "Network-05",
    },
    {
      name: "Instance 11",
      status: "Running",
      ip: "192.168.1.11",
      cpu: "3",
      ram: "8 GB",
      os: "Windows 2008",
      keypair: "Keypair-11",
      network: "Network-06",
    },
  ];
  const [instanceData, setInstanceData] = useState([]);
  const [instanceCopyData, setInstanceCopyData] = useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (item, record) => (
        <p
          className="text-sm text-gray-900 underline cursor-pointer"
          onClick={() => setInstanceDetail({ data: record, state: true })}
        >
          {item}
        </p>
      ),
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
      title: "OS",
      dataIndex: "os",
      key: "os",
      render: (item) => <p className="text-sm text-gray-900">{item}</p>,
    },
    {
      title: "IP Address",
      dataIndex: "ip",
      key: "ip",
      render: (item) => <p className="text-sm text-gray-900">{item}</p>,
    },
    {
      title: "CPU",
      dataIndex: "cpu",
      key: "cpu",
      render: (item) => <p className="text-sm text-gray-900">{item}</p>,
    },
    {
      title: "RAM",
      dataIndex: "ram",
      key: "ram",
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
    setInstanceDetail({ data: {}, state: false });
  };

  const createInstance = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setInstanceCopyData(
      instanceData?.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.status.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.ip.toLowerCase().includes(searchValue.toLowerCase())
        );
      }),
    );
  }, [instanceData, searchValue]);

  useEffect(() => {
    setInstanceData(data);
    setInstanceCopyData(data);
  }, []);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <div className="flex justify-between items-center mb-2 ">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold text-[#101828]">
            Instances
          </h1>

          <BreadCrumb pathname={path} />
        </div>
        <div className="flex items-center gap-2">
          <SearchInput value={searchValue} setSearchValue={setSearchValue} />
          <CustomButton
            label="Create Instance"
            icon={<PlusOutlined />}
            onClick={createInstance}
          />
        </div>
      </div>
      <div className="mt-5">
        <CustomTable columns={columns} dataSource={instanceCopyData} bordered />
      </div>
      {instanceDetail?.state && (
        <Drawer
          item={instanceDetail?.data}
          title={"Instance Detail"}
          open={instanceDetail?.state}
          onClose={onClose}
        />
      )}
    </>
  );
}

export default Instances;
