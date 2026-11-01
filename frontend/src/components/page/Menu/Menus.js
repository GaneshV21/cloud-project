import { Button, ConfigProvider, Dropdown, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import cloudIcon from "../../../assets/images/cloudIcon.png";
import { FaUserCircle } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import {
  MdDashboard,
  MdOutlineFolderOpen,
  MdMemory,
  MdOutlineLan,
  MdOutlineStorage,
  MdOutlinePerson,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../../redux/AuthSlice";
const items = [
  {
    key: "cloudImage",
    label: "CloudPortal",
    icon: <img src={cloudIcon} className="w-4 h-4" alt="Cloud" />,
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <MdDashboard />,
  },
  {
    key: "compute",
    label: "Compute",
    icon: <MdMemory />,
    children: [
      {
        key: "instances",
        label: "Instances",
      },
      {
        key: "keypairs",
        label: "Keypairs",
      },
    ],
  },
  {
    key: "network",
    label: "Network",
    icon: <MdOutlineLan />,
    children: [
      {
        key: "networks",
        label: "Networks",
      },
      {
        key: "security_groups",
        label: "Security Groups",
      },
    ],
  },
  {
    key: "volumes",
    label: "Volumes",
    icon: <MdOutlineStorage />,
  },
  {
    key: "profile",
    label: "Profile",
    icon: <MdOutlinePerson />,
  },
  {
    key: "billing",
    label: "Billing",
    icon: <MdOutlineReceiptLong />,
  },
   {
    key: "iam",
    label: "IAM",
    icon: <MdOutlineFolderOpen />,
    children: [
      {
        key: "projects",
        label: "Projects",
      },
      {
        key: "users",
        label: "Users",
      },
      {
        key: "roles",
        label: "Roles",
      },
    ],
  },
];

export const Menus = () => {
  const location = useLocation();
  const Navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);

  const onClick = (e) => {
    const selectedItem = "/" + [...e?.keyPath].reverse().join("/");
    if (selectedItem === "/cloudImage") {
      Navigate("/dashboard");
    } else {
      Navigate(selectedItem);
    }
  };

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    setSelectedKey(pathSegments[pathSegments.length - 1] || "");

    const parentKeys = pathSegments.slice(0, -1);
    setOpenKeys(parentKeys);
  }, [location.pathname]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <ConfigProvider
      itemHeight={48}
      theme={{
        components: {
          Menu: {
            fontSize: 17,
            darkItemActiveBg: "#6cc0c0af",
            darkItemSelectedBg: "#5142D4",
          },
        },
      }}
    >
      <Menu
        onClick={onClick}
        onOpenChange={onOpenChange} // 3. ADD onOpenChange
        style={{ width: "100%", borderInlineEnd: "none" }}
        mode="inline"
        items={items}
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        theme="dark"
      />
    </ConfigProvider>
  );
};

export const MenuItems = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const handleMenuClick = (e) => {
    if (e.key === "1") {
      Navigate("/profile");
    } else if (e.key === "2") {
      dispatch(clearToken());
      Navigate("/login");
    }
  };

  const items = [
    {
      key: "1",
      label: "Profile",
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];
  return (
    // Full-screen shell: sidebar stays fixed, only the page content on the right scrolls
    <div className="flex h-screen overflow-hidden">
      <div className="w-[20%] h-full overflow-y-auto bg-[#001529]">
        <Menus />
      </div>
      <div className="flex flex-col w-[80%] h-full">
        <div className="shrink-0 flex justify-end items-center p-2 border-b border-gray-200">
          <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            trigger={["click"]}
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <FaUserCircle className="text-[40px] text-[#98A2B3]" />

              <div className="flex flex-col leading-tight">
                <span className="text-[16px] font-semibold text-[#101828]">
                  {user?.name}
                </span>
                <span className="text-[13px] text-[#667085]">{user?.role}</span>
              </div>

              <IoChevronDown className="text-[#667085] text-[16px]" />
            </div>
          </Dropdown>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
