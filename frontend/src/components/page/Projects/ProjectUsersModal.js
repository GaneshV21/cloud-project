import React, { useState } from "react";
import { ConfigProvider, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CustomButton, CustomSelect, CustomSecondaryButton } from "../../../utils/custom-input";
import { getAvatarColor } from "../../../utils/common";
import { RoleSelect } from "../Users/ProjectAccessDrawer";
import { assignUsersToProject, removeUsersFromProject } from "../../../redux/UsersSlice";

const userOption = (user, roleName) => ({
  value: user.email,
  searchText: `${user.name} ${user.email}`,
  label: (
    <div className="flex items-center gap-2">
      <div
        className="h-5 w-5 shrink-0 rounded-md flex items-center justify-center text-white text-[10px] font-medium"
        style={{ backgroundColor: getAvatarColor(user.name) }}
      >
        {user.name?.[0]?.toUpperCase()}
      </div>
      <span className="truncate">{user.name}</span>
      {roleName && <span className="text-[12px] text-[#98A2B3]">· {roleName}</span>}
    </div>
  ),
});

const Label = ({ children }) => (
  <p className="text-[13px] font-medium text-[#344054] mb-1">{children}</p>
);

// mode: "assign" | "remove"
function ProjectUsersModal({ open, mode, project, onClose }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const roles = useSelector((state) => state.roles.roles);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleId, setRoleId] = useState(undefined);

  const isAssign = mode === "assign";
  const projectName = project?.name;
  const getMembership = (user) => user.projects.find((p) => p.name === projectName);
  const getRoleName = (id) => roles.find((r) => r.id === id)?.name;

  // Assign: users not in the project yet. Remove: users already in it.
  const options = users
    .filter((user) => (isAssign ? !getMembership(user) : getMembership(user)))
    .map((user) => userOption(user, isAssign ? null : getRoleName(getMembership(user).roleId)));

  const canSubmit = selectedUsers.length > 0 && (!isAssign || roleId);

  // TODO: call the assign / remove project users APIs
  const handleSubmit = () => {
    if (isAssign) {
      dispatch(assignUsersToProject({ project: projectName, emails: selectedUsers, roleId }));
    } else {
      dispatch(removeUsersFromProject({ project: projectName, emails: selectedUsers }));
    }
    onClose();
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#5142D4", borderRadius: 8 } }}>
      <Modal
        open={open}
        onCancel={onClose}
        width={480}
        centered
        destroyOnHidden
        title={
          <div className="flex flex-col">
            <span className="text-[17px] leading-6 font-semibold text-[#181D27]">
              {isAssign ? "Assign Users" : "Remove Users"}
            </span>
            <span className="text-[13px] font-normal text-[#535862]">
              {isAssign
                ? "Give users access to this project with a role."
                : "Take users out of this project."}
            </span>
          </div>
        }
        footer={
          <div className="flex justify-end gap-2">
            <CustomSecondaryButton label="Cancel" onClick={onClose} />
            {isAssign ? (
              <CustomButton label="Assign Users" disabled={!canSubmit} onClick={handleSubmit} />
            ) : (
              <CustomButton
                label="Remove Users"
                danger
                disabled={!canSubmit}
                onClick={handleSubmit}
              />
            )}
          </div>
        }
      >
        <div className="flex flex-col gap-4 mt-3">
          {/* Project */}
          <div>
            <Label>Project</Label>
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg border-solid border-[1px] border-[#EAECF0] bg-[#F9FAFB]">
              <div
                className="h-5 w-5 shrink-0 rounded-md flex items-center justify-center text-white text-[10px] font-medium"
                style={{ backgroundColor: getAvatarColor(projectName) }}
              >
                {projectName?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-[#101828]">{projectName}</span>
            </div>
          </div>

          {/* Users */}
          <div>
            <Label>Users</Label>
            <CustomSelect
              mode="multiple"
              allowClear
              className="w-full"
              placeholder={
                options.length
                  ? "Select users"
                  : isAssign
                  ? "All users are already in this project"
                  : "No users in this project"
              }
              disabled={!options.length}
              value={selectedUsers}
              onChange={setSelectedUsers}
              options={options}
              optionFilterProp="searchText"
              maxTagCount="responsive"
            />
          </div>

          {/* Role (assign only) */}
          {isAssign && (
            <div>
              <Label>Role</Label>
              <RoleSelect
                roles={roles}
                className="w-full"
                value={roleId}
                onChange={setRoleId}
                popupMatchSelectWidth
              />
            </div>
          )}
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default ProjectUsersModal;
