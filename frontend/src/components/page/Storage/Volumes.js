import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import { PlusOutlined } from "@ant-design/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageHeader from "../../../utils/page-header";
import { getStatus } from "../../../utils/common";
import Drawer from "../../../utils/drawer";

function Volumes() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [volumeDetail, setVolumeDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const data = [
    { name: "Volume-01", volumeType: "SSD", size: "50 GB", attachedTo: "Instance 1", status: "In-use" },
    { name: "Volume-02", volumeType: "HDD", size: "100 GB", attachedTo: "Instance 2", status: "In-use" },
    { name: "Volume-03", volumeType: "SSD", size: "20 GB", attachedTo: "Unattached", status: "Available" },
    { name: "Volume-04", volumeType: "SSD", size: "250 GB", attachedTo: "Instance 4", status: "In-use" },
    { name: "Volume-05", volumeType: "HDD", size: "500 GB", attachedTo: "Unattached", status: "Available" },
    { name: "Volume-06", volumeType: "SSD", size: "50 GB", attachedTo: "Instance 6", status: "In-use" },
    { name: "Volume-07", volumeType: "SSD", size: "100 GB", attachedTo: "Instance 7", status: "In-use" },
    { name: "Volume-08", volumeType: "HDD", size: "1 TB", attachedTo: "Unattached", status: "Available" },
    { name: "Volume-09", volumeType: "SSD", size: "20 GB", attachedTo: "Instance 9", status: "In-use" },
    { name: "Volume-10", volumeType: "SSD", size: "50 GB", attachedTo: "Unattached", status: "Available" },
    { name: "Volume-11", volumeType: "HDD", size: "200 GB", attachedTo: "Instance 11", status: "In-use" },
  ];
  const [volumeData, setVolumeData] = useState([]);
  const [volumeCopyData, setVolumeCopyData] = useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (item, record) => (
        <p
          className="text-sm text-gray-900 underline cursor-pointer"
          onClick={() => setVolumeDetail({ data: record, state: true })}
        >
          {item}
        </p>
      ),
    },
    {
      title: "Volume Type",
      dataIndex: "volumeType",
      key: "volumeType",
      render: (item) => <p className="text-sm text-gray-900">{item}</p>,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (item) => <p className="text-sm text-gray-900">{item}</p>,
    },
    {
      title: "Attached To",
      dataIndex: "attachedTo",
      key: "attachedTo",
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
      title: "Actions",
      key: "actions",
      width: 60,
      render: () => (
        <HiOutlineDotsVertical className="text-gray-600 text-lg cursor-pointer" />
      ),
    },
  ];

  const onClose = () => {
    setVolumeDetail({ data: {}, state: false });
  };

  const createVolume = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setVolumeCopyData(
      volumeData?.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.volumeType.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.attachedTo.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.status.toLowerCase().includes(searchValue.toLowerCase())
        );
      }),
    );
  }, [volumeData, searchValue]);

  useEffect(() => {
    setVolumeData(data);
    setVolumeCopyData(data);
  }, []);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <PageHeader
        pathname={path}
        title="Volumes"
        description="Create, attach and manage block storage volumes."
      >
        <SearchInput value={searchValue} setSearchValue={setSearchValue} />
        <CustomButton
          label="Create Volume"
          icon={<PlusOutlined />}
          onClick={createVolume}
        />
      </PageHeader>
      <div className="mt-5">
        <CustomTable columns={columns} dataSource={volumeCopyData} bordered />
      </div>
      {volumeDetail?.state && (
        <Drawer
          item={volumeDetail?.data}
          title={"Volume Detail"}
          open={volumeDetail?.state}
          onClose={onClose}
        />
      )}
    </>
  );
}

export default Volumes;
