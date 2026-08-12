import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomTable from "../../../utils/custom-table";
import SearchInput from "../../../utils/search-input";
import { CustomButton } from "../../../utils/custom-input";
import { PlusOutlined } from "@ant-design/icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
import BreadCrumb from "../../../utils/bread-crumbs";
import Drawer from "../../../utils/drawer";

function Keypairs() {
  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState("");
  const [keypairDetail, setKeypairDetail] = useState({
    data: {},
    state: false,
  });
  const location = useLocation();
  const data = [
    {
      name: "Keypair-01",
      type: "ssh",
      fingerprint: "SHA256:1a2b3c4d5e6f7g8h9i0jklmnopqrstuv",
      publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC01 keypair-01",
    },
    {
      name: "Keypair-02",
      type: "ssh",
      fingerprint: "SHA256:2b3c4d5e6f7g8h9i0j1klmnopqrstuvw",
      publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC02 keypair-02",
    },
    {
      name: "Keypair-03",
      type: "rsa",
      fingerprint: "SHA256:3c4d5e6f7g8h9i0j1k2lmnopqrstuvwx",
      publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC03 keypair-03",
    },
    {
      name: "Keypair-04",
      type: "ssh",
      fingerprint: "SHA256:4d5e6f7g8h9i0j1k2l3mnopqrstuvwxy",
      publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC04 keypair-04",
    },
    {
      name: "Keypair-05",
      type: "ed25519",
      fingerprint: "SHA256:5e6f7g8h9i0j1k2l3m4nopqrstuvwxyz",
      publicKey: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI05 keypair-05",
    },
    {
      name: "Keypair-06",
      type: "ssh",
      fingerprint: "SHA256:6f7g8h9i0j1k2l3m4n5opqrstuvwxyza",
      publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC06 keypair-06",
    },
    {
      name: "Keypair-07",
      type: "rsa",
      fingerprint: "SHA256:7g8h9i0j1k2l3m4n5o6pqrstuvwxyzab",
      publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC07 keypair-07",
    },
    {
      name: "Keypair-08",
      type: "ssh",
      fingerprint: "SHA256:8h9i0j1k2l3m4n5o6p7qrstuvwxyzabc",
      publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC08 keypair-08",
    },
    {
      name: "Keypair-09",
      type: "ssh",
      fingerprint: "SHA256:9i0j1k2l3m4n5o6p7q8rstuvwxyzabcd",
      publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC09 keypair-09",
    },
    {
      name: "Keypair-10",
      type: "ed25519",
      fingerprint: "SHA256:0j1k2l3m4n5o6p7q8r9stuvwxyzabcde",
      publicKey: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI10 keypair-10",
    },
    {
      name: "Keypair-11",
      type: "rsa",
      fingerprint: "SHA256:1k2l3m4n5o6p7q8r9s0tuvwxyzabcdef",
      publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC11 keypair-11",
    },
  ];
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
          onClick={() => setKeypairDetail({ data: record, state: true })}
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
      width: 50,
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

  useEffect(() => {
    setKeypairCopyData(
      keypairData?.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.type.toLowerCase().includes(searchValue.toLowerCase())
        );
      }),
    );
  }, [keypairData, searchValue]);

  useEffect(() => {
    setKeypairData(data);
    setKeypairCopyData(data);
  }, []);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <div className="flex justify-between items-center mb-2 ">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold text-[#101828]">
            Keypairs
          </h1>

          <BreadCrumb pathname={path} />
        </div>
        <div className="flex items-center gap-2">
          <SearchInput value={searchValue} setSearchValue={setSearchValue} />
          <CustomButton
            label="Create Keypair"
            icon={<PlusOutlined />}
            onClick={createKeypair}
          />
        </div>
      </div>
      <div className="mt-5">
        <CustomTable columns={columns} dataSource={keypairCopyData} bordered />
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
