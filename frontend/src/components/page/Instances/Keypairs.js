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
import { toDetail } from "../../../utils/common";
import Drawer from "../../../utils/drawer";
import apiClient, { getErrorMessage } from "../../../utils/api-client";
import { KEYPAIR_LIST } from "../../../utils/api-endpoints";

function Keypairs() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [keypairDetail, setKeypairDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const currentProject = useSelector((state) => state.project.currentProject);
  const projectId = currentProject?.project_id;
  const [loading, setLoading] = useState(false);
  const [keypairData, setKeypairData] = useState([]);
  const [keypairCopyData, setKeypairCopyData] = useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (item, record) => (
        <p
          className="text-sm text-gray-900 underline cursor-pointer"
          onClick={() => setKeypairDetail({ data: toDetail(record), state: true })}
        >
          {item}
        </p>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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
    setKeypairDetail({ data: {}, state: false });
  };

  const createKeypair = (e) => {
    e.stopPropagation();
  };

  // Keypairs of the project selected in the top bar
  const fetchKeypairs = useCallback(async () => {
    if (!userId || !projectId) {
      setKeypairData([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(KEYPAIR_LIST(userId, projectId));
      setKeypairData(res?.data?.data ?? []);
    } catch (error) {
      setKeypairData([]);
      message.error(getErrorMessage(error, "Couldn't load keypairs."));
    } finally {
      setLoading(false);
    }
  }, [userId, projectId]);

  useEffect(() => {
    fetchKeypairs();
  }, [fetchKeypairs]);

  useEffect(() => {
    const search = searchValue.toLowerCase();
    setKeypairCopyData(
      keypairData?.filter((item) =>
        [item.name, item.type].some((value) =>
          (value ?? "").toLowerCase().includes(search)
        )
      ),
    );
  }, [keypairData, searchValue]);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <PageHeader
        pathname={path}
        title="Keypairs"
        description={
          currentProject
            ? `Create and manage SSH keypairs used to access instances in ${currentProject.name}.`
            : "Select a project in the top bar to see its keypairs."
        }
      >
        <SearchInput value={searchValue} setSearchValue={setSearchValue} />
        <CustomButton
          label="Create Keypair"
          icon={<PlusOutlined />}
          onClick={createKeypair}
          disabled={!projectId}
        />
      </PageHeader>
      <div className="mt-5">
        <CustomTable
          emptyTitle={searchValue ? "No matching keypairs" : "No keypairs"}
          emptyDescription={
            searchValue
              ? `Nothing matches "${searchValue}". Try a different search.`
              : "Create a keypair to access your instances."
          }
          columns={columns}
          dataSource={keypairCopyData}
          loading={loading}
          rowKey="keypair_id"
          bordered
        />
      </div>
      {keypairDetail?.state && (
        <Drawer
          item={keypairDetail?.data}
          title={"Keypair Detail"}
          open={keypairDetail?.state}
          onClose={onClose}
        />
      )}
    </>
  );
}

export default Keypairs;
