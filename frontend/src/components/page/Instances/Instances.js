import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import { PlusOutlined } from "@ant-design/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageHeader from "../../../utils/page-header";
import { getStatus, toDetail } from "../../../utils/common";
import Drawer from "../../../utils/drawer";
import PATH from "../../../utils/Path";
import apiClient, { getErrorMessage } from "../../../utils/api-client";
import { INSTANCE_LIST } from "../../../utils/api-endpoints";

function Instances() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [instanceDetail, setInstanceDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const currentProject = useSelector((state) => state.project.currentProject);
  const projectId = currentProject?.project_id;
  const [loading, setLoading] = useState(false);
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
          onClick={() => setInstanceDetail({ data: toDetail(record), state: true })}
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
      width: 60,
      render: () => (
        <HiOutlineDotsVertical className="text-gray-600 text-lg cursor-pointer" />
      ),
    },
  ];

  const onClose = () => {
    setInstanceDetail({ data: {}, state: false });
  };

  const createInstance = () => {
    navigate(PATH.CreateInstance);
  };

  // Instances of the project selected in the top bar
  const fetchInstances = useCallback(async () => {
    if (!userId || !projectId) {
      setInstanceData([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(INSTANCE_LIST(userId, projectId));
      setInstanceData(res?.data?.data ?? []);
    } catch (error) {
      setInstanceData([]);
      message.error(getErrorMessage(error, "Couldn't load instances."));
    } finally {
      setLoading(false);
    }
  }, [userId, projectId]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  useEffect(() => {
    const search = searchValue.toLowerCase();
    setInstanceCopyData(
      instanceData?.filter((item) =>
        [item.name, item.status, item.ip].some((value) =>
          (value ?? "").toLowerCase().includes(search)
        )
      ),
    );
  }, [instanceData, searchValue]);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <PageHeader
        pathname={path}
        title="Instances"
        description={
          currentProject
            ? `Launch, monitor and manage compute instances in ${currentProject.name}.`
            : "Select a project in the top bar to see its instances."
        }
      >
        <SearchInput value={searchValue} setSearchValue={setSearchValue} />
        <CustomButton
          label="Create Instance"
          icon={<PlusOutlined />}
          onClick={createInstance}
          disabled={!projectId}
        />
      </PageHeader>
      <div className="mt-5">
        <CustomTable
          emptyTitle={searchValue ? "No matching instances" : "No instances"}
          emptyDescription={
            searchValue
              ? `Nothing matches "${searchValue}". Try a different search.`
              : "Create an instance to get started."
          }
          columns={columns}
          dataSource={instanceCopyData}
          loading={loading}
          rowKey="instance_id"
          bordered
        />
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
