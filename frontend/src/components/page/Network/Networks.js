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
import { NETWORK_LIST } from "../../../utils/api-endpoints";

function Networks() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [networkDetail, setNetworkDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const currentProject = useSelector((state) => state.project.currentProject);
  const projectId = currentProject?.project_id;
  const [loading, setLoading] = useState(false);
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
          onClick={() => setNetworkDetail({ data: toDetail(record), state: true })}
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
      dataIndex: "gatewayip",
      key: "gatewayIp",
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
    setNetworkDetail({ data: {}, state: false });
  };

  const createNetwork = (e) => {
    e.stopPropagation();
  };

  // Networks of the project selected in the top bar
  const fetchNetworks = useCallback(async () => {
    if (!userId || !projectId) {
      setNetworkData([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(NETWORK_LIST(userId, projectId));
      setNetworkData(res?.data?.data ?? []);
    } catch (error) {
      setNetworkData([]);
      message.error(getErrorMessage(error, "Couldn't load networks."));
    } finally {
      setLoading(false);
    }
  }, [userId, projectId]);

  useEffect(() => {
    fetchNetworks();
  }, [fetchNetworks]);

  useEffect(() => {
    const search = searchValue.toLowerCase();
    setNetworkCopyData(
      networkData?.filter((item) =>
        [item.name, item.cidr, item.status, item.gatewayip].some((value) =>
          (value ?? "").toLowerCase().includes(search)
        )
      ),
    );
  }, [networkData, searchValue]);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <PageHeader
        pathname={path}
        title="Networks"
        description={
          currentProject
            ? `Create and manage private networks, subnets and gateways in ${currentProject.name}.`
            : "Select a project in the top bar to see its networks."
        }
      >
        <SearchInput value={searchValue} setSearchValue={setSearchValue} />
        <CustomButton
          label="Create Network"
          icon={<PlusOutlined />}
          onClick={createNetwork}
          disabled={!projectId}
        />
      </PageHeader>
      <div className="mt-5">
        <CustomTable
          emptyTitle={searchValue ? "No matching networks" : "No networks"}
          emptyDescription={
            searchValue
              ? `Nothing matches "${searchValue}". Try a different search.`
              : "Create a network to connect your instances."
          }
          columns={columns}
          dataSource={networkCopyData}
          loading={loading}
          rowKey="_id"
          bordered
        />
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
