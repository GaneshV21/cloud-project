import React, { useState } from "react";
import { ConfigProvider, Drawer, Switch } from "antd";
import { useSelector } from "react-redux";
import { CustomButton, CustomSelect, CustomSecondaryButton } from "../../../utils/custom-input";
import SearchInput from "../../../utils/search-input";
import { getAvatarColor } from "../../../utils/common";

// Role picker grouped into built-in and custom roles, coming from the Roles module
export const RoleSelect = ({ roles, ...props }) => {
  const toOption = (role) => ({
    value: role.id,
    label: role.name,
    count: role.permissions.length,
  });
  return (
    <CustomSelect
      {...props}
      placeholder="Select role"
      popupMatchSelectWidth={220}
      options={[
        { label: "Built-in", options: roles.filter((r) => r.system).map(toOption) },
        { label: "Custom", options: roles.filter((r) => !r.system).map(toOption) },
      ].filter((group) => group.options.length)}
      optionRender={(option) => (
        <div className="flex justify-between items-center gap-2">
          <span>{option.data.label}</span>
          <span className="text-[11px] text-[#98A2B3]">{option.data.count} actions</span>
        </div>
      )}
    />
  );
};

function ProjectAccessDrawer({ open, user, allProjects = [], onClose, onSave }) {
  const roles = useSelector((state) => state.roles.roles);
  const defaultRoleId = roles.find((r) => r.id === "reader")?.id ?? roles[0]?.id;

  // Local draft: { [projectName]: roleId } — only saved when the user clicks Save
  const [access, setAccess] = useState(() =>
    Object.fromEntries((user?.projects ?? []).map((p) => [p.name, p.roleId]))
  );
  const [search, setSearch] = useState("");

  const toggleProject = (name, enabled) => {
    setAccess((prev) => {
      const next = { ...prev };
      if (enabled) next[name] = prev[name] ?? defaultRoleId;
      else delete next[name];
      return next;
    });
  };

  const setRole = (name, roleId) => setAccess((prev) => ({ ...prev, [name]: roleId }));

  const handleSave = () => {
    onSave(Object.entries(access).map(([name, roleId]) => ({ name, roleId })));
  };

  const assignedCount = Object.keys(access).length;
  const visibleProjects = allProjects.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#5142D4", borderRadius: 8 } }}>
      <Drawer
        open={open}
        onClose={onClose}
        size={520}
        title={
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center text-white text-[16px] font-medium"
              style={{ backgroundColor: getAvatarColor(user?.name) }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[16px] font-semibold text-[#181D27] truncate">
                {user?.name}
              </span>
              <span className="text-[13px] font-normal text-[#667085] truncate">
                {user?.email}
              </span>
            </div>
          </div>
        }
        footer={
          <div className="flex justify-between items-center py-1">
            <span className="text-[13px] text-[#667085]">
              Access to <span className="font-semibold text-[#344054]">{assignedCount}</span> of{" "}
              {allProjects.length} projects
            </span>
            <div className="flex gap-2">
              <CustomSecondaryButton label="Cancel" onClick={onClose} />
              <CustomButton label="Save Access" onClick={handleSave} />
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-[16px] font-semibold text-[#181D27]">Project Access</p>
          <p className="text-[13px] text-[#667085]">
            Turn on the projects this user can use, then pick their role in each one.
          </p>
        </div>

        {allProjects.length > 5 && (
          <div className="mb-3">
            <SearchInput value={search} setSearchValue={setSearch} />
          </div>
        )}

        <div className="flex flex-col gap-2">
          {visibleProjects.map((name) => {
            const enabled = name in access;
            return (
              <div
                key={name}
                className={`flex items-center gap-3 p-3 rounded-xl border-solid border-[1px] transition-colors ${
                  enabled ? "border-[#5142D4] bg-[#F8F7FF]" : "border-[#EAECF0] bg-white"
                }`}
              >
                <Switch size="small" checked={enabled} onChange={(v) => toggleProject(name, v)} />
                <div
                  className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: getAvatarColor(name) }}
                >
                  {name[0]?.toUpperCase()}
                </div>
                <p
                  className={`flex-1 text-sm font-medium truncate ${
                    enabled ? "text-[#101828]" : "text-[#667085]"
                  }`}
                >
                  {name}
                </p>
                <RoleSelect
                  roles={roles}
                  className="w-[160px]"
                  disabled={!enabled}
                  value={enabled ? access[name] : undefined}
                  onChange={(roleId) => setRole(name, roleId)}
                />
              </div>
            );
          })}
          {!visibleProjects.length && (
            <p className="text-sm text-[#667085] text-center py-6">No projects found.</p>
          )}
        </div>
      </Drawer>
    </ConfigProvider>
  );
}

export default ProjectAccessDrawer;
