import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import { PlusOutlined } from "@ant-design/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import BreadCrumb from "../../../utils/bread-crumbs";
import Drawer from "../../../utils/drawer";

function SecurityGroups() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [securityGroupDetail, setSecurityGroupDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const data = [
    { name: "SG-Default", rules: "22, 80, 443", description: "Default group allowing SSH and web traffic" },
    { name: "SG-Web", rules: "80, 443", description: "Allows inbound HTTP and HTTPS traffic" },
    { name: "SG-Database", rules: "3306, 5432", description: "Allows access to MySQL and PostgreSQL ports" },
    { name: "SG-SSH-Only", rules: "22", description: "Restricts inbound traffic to SSH only" },
    { name: "SG-Internal", rules: "All traffic", description: "Allows all traffic within the same network" },
    { name: "SG-Monitoring", rules: "9090, 3000", description: "Allows access to Prometheus and Grafana" },
    { name: "SG-LoadBalancer", rules: "80, 443, 8080", description: "Rules for load balancer instances" },
    { name: "SG-Bastion", rules: "22", description: "Restricted SSH access for bastion host" },
    { name: "SG-Cache", rules: "6379", description: "Allows access to Redis cache instances" },
    { name: "SG-App", rules: "8000, 8443", description: "Allows inbound traffic for application servers" },
    { name: "SG-DevTest", rules: "All traffic", description: "Open group used for development and testing" },
  ];
  const [securityGroupData, setSecurityGroupData] = useState([]);
  const [securityGroupCopyData, setSecurityGroupCopyData] = useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (item, record) => (
        <p
          className="text-sm text-gray-900 underline cursor-pointer"
          onClick={() =>
            setSecurityGroupDetail({ data: record, state: true })
          }
        >
          {item}
        </p>
      ),
    },
    {
      title: "Rules",
      dataIndex: "rules",
      key: "rules",
      render: (item) => <p className="text-sm text-gray-900">{item}</p>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
    setSecurityGroupDetail({ data: {}, state: false });
  };

  const createSecurityGroup = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setSecurityGroupCopyData(
      securityGroupData?.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.rules.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.description.toLowerCase().includes(searchValue.toLowerCase())
        );
      }),
    );
  }, [securityGroupData, searchValue]);

  useEffect(() => {
    setSecurityGroupData(data);
    setSecurityGroupCopyData(data);
  }, []);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <div className="flex justify-between items-center mb-2 ">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold text-[#101828]">
            Security Groups
          </h1>

          <BreadCrumb pathname={path} />
        </div>
        <div className="flex items-center gap-2">
          <SearchInput value={searchValue} setSearchValue={setSearchValue} />
          <CustomButton
            label="Create Security Group"
            icon={<PlusOutlined />}
            onClick={createSecurityGroup}
          />
        </div>
      </div>
      <div className="mt-5">
        <CustomTable
          columns={columns}
          dataSource={securityGroupCopyData}
          bordered
        />
      </div>
      {securityGroupDetail?.state && (
        <Drawer
          item={securityGroupDetail?.data}
          title={"Security Group Detail"}
          open={securityGroupDetail?.state}
          onClose={onClose}
        />
      )}
    </>
  );
}

export default SecurityGroups;
