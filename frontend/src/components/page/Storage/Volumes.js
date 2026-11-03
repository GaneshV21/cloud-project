import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { message } from "antd";
import { useLocation } from "react-router-dom";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import { PlusOutlined } from "@ant-design/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageHeader from "../../../utils/page-header";
import { getStatus, toDetail } from "../../../utils/common";
import Drawer from "../../../utils/drawer";
import apiClient, { getErrorMessage } from "../../../utils/api-client";
import { VOLUME_LIST } from "../../../utils/api-endpoints";

function Volumes() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [volumeDetail, setVolumeDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const currentProject = useSelector((state) => state.project.currentProject);
  const projectId = currentProject?.project_id;
  const [loading, setLoading] = useState(false);
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
          onClick={() => setVolumeDetail({ data: toDetail(record), state: true })}
        >
          {item}
        </p>
      ),
    },
    {
      title: "Volume Type",
      dataIndex: "volume_type",
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
      dataIndex: "attached_to",
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

  // Volumes of the project selected in the top bar
  const fetchVolumes = useCallback(async () => {
    if (!userId || !projectId) {
      setVolumeData([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(VOLUME_LIST(userId, projectId));
      setVolumeData(res?.data?.data ?? []);
    } catch (error) {
      setVolumeData([]);
      message.error(getErrorMessage(error, "Couldn't load volumes."));
    } finally {
      setLoading(false);
    }
  }, [userId, projectId]);

  useEffect(() => {
    fetchVolumes();
  }, [fetchVolumes]);

  useEffect(() => {
    const search = searchValue.toLowerCase();
    setVolumeCopyData(
      volumeData?.filter((item) =>
        [item.name, item.volume_type, item.attached_to, item.status].some((value) =>
          (value ?? "").toLowerCase().includes(search)
        )
      ),
    );
  }, [volumeData, searchValue]);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <PageHeader
        pathname={path}
        title="Volumes"
        description={
          currentProject
            ? `Create, attach and manage block storage volumes in ${currentProject.name}.`
            : "Select a project in the top bar to see its volumes."
        }
      >
        <SearchInput value={searchValue} setSearchValue={setSearchValue} />
        <CustomButton
          label="Create Volume"
          icon={<PlusOutlined />}
          onClick={createVolume}
          disabled={!projectId}
        />
      </PageHeader>
      <div className="mt-5">
        <CustomTable
          emptyTitle={searchValue ? "No matching volumes" : "No volumes"}
          emptyDescription={
            searchValue
              ? `Nothing matches "${searchValue}". Try a different search.`
              : "Create a volume to add storage."
          }
          columns={columns}
          dataSource={volumeCopyData}
          loading={loading}
          rowKey="volume_id"
          bordered
        />
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
