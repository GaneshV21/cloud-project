import React, { useState } from "react";
import { ConfigProvider, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { CustomButton, CustomCheckbox, CustomInput, CustomSecondaryButton } from "../../../utils/custom-input";
import {
  ALL_PERMISSIONS,
  getPermissionKey,
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
  TOTAL_PERMISSIONS,
} from "../../../utils/permissions";

// mode: "create" | "edit" | "view"
function RoleModal({ open, mode, role, existingNames = [], onClose, onSave }) {
  const readOnly = mode === "view";
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [permissions, setPermissions] = useState(role?.permissions ?? []);
  const [error, setError] = useState("");

  const has = (moduleKey, actionKey) => permissions.includes(getPermissionKey(moduleKey, actionKey));

  // Picking any action also picks Read; removing Read removes the whole row
  const applyToggle = (prev, moduleKey, actionKey, checked) => {
    const key = getPermissionKey(moduleKey, actionKey);
    const readKey = getPermissionKey(moduleKey, "read");
    if (checked) {
      return [...new Set([...prev, key, readKey])];
    }
    if (actionKey === "read") {
      return prev.filter((p) => !p.startsWith(`${moduleKey}:`));
    }
    return prev.filter((p) => p !== key);
  };

  const update = (fn) => {
    setPermissions(fn);
    setError("");
  };

  const toggleCell = (moduleKey, actionKey, checked) =>
    update((prev) => applyToggle(prev, moduleKey, actionKey, checked));

  const toggleRow = (moduleKey, checked) =>
    update((prev) =>
      checked
        ? [...new Set([...prev, ...PERMISSION_ACTIONS.map((a) => getPermissionKey(moduleKey, a.key))])]
        : prev.filter((p) => !p.startsWith(`${moduleKey}:`))
    );

  const toggleColumn = (actionKey, checked) =>
    update((prev) =>
      PERMISSION_MODULES.reduce((acc, m) => applyToggle(acc, m.key, actionKey, checked), prev)
    );

  const toggleAll = (checked) => update(checked ? [...ALL_PERMISSIONS] : []);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return setError("Role name is required.");
    if (existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      return setError("A role with this name already exists.");
    }
    if (!permissions.length) return setError("Select at least one permission.");
    onSave({ ...role, name: trimmed, description: description.trim(), permissions });
  };

  const columnState = (actionKey) => {
    const count = PERMISSION_MODULES.filter((m) => has(m.key, actionKey)).length;
    return { checked: count === PERMISSION_MODULES.length, indeterminate: count > 0 && count < PERMISSION_MODULES.length };
  };

  const rowState = (moduleKey) => {
    const count = PERMISSION_ACTIONS.filter((a) => has(moduleKey, a.key)).length;
    return { checked: count === PERMISSION_ACTIONS.length, indeterminate: count > 0 && count < PERMISSION_ACTIONS.length };
  };

  const title = { create: "Create Role", edit: "Edit Role", view: role?.name }[mode];
  const subtitle = readOnly
    ? "Built-in role. Its permissions can't be changed."
    : "Give the role a name and choose what it's allowed to do in each module.";

  const cellClass = "w-[64px] text-center";

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#5142D4", borderRadius: 8 } }}>
      <Modal
        open={open}
        onCancel={onClose}
        width={580}
        centered
        destroyOnHidden
        title={
          <div className="flex flex-col">
            <span className="text-[17px] leading-6 font-semibold text-[#181D27]">{title}</span>
            <span className="text-[13px] font-normal text-[#535862]">{subtitle}</span>
          </div>
        }
        footer={
          <div className="flex justify-end gap-2">
            <CustomSecondaryButton label={readOnly ? "Close" : "Cancel"} onClick={onClose} />
            {!readOnly && (
              <CustomButton
                label={mode === "create" ? "Create Role" : "Save Changes"}
                onClick={handleSave}
              />
            )}
          </div>
        }
      >
        {/* Name & description */}
        {!readOnly && (
          <div className="grid grid-cols-2 gap-3 mt-3 mb-3">
            <div>
              <p className="text-[13px] font-medium text-[#344054] mb-1">
                Role name <span className="text-[#F04438]">*</span>
              </p>
              <CustomInput
                placeholder="e.g. Create Role"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#344054] mb-1">Description</p>
              <CustomInput
                placeholder="What is this role for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}
        {readOnly && role?.description && (
          <p className="text-[13px] text-[#535862] mt-3 mb-3">{role.description}</p>
        )}

        {/* Permissions table */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-[14px] font-semibold text-[#181D27]">
            Permissions{" "}
            <span className="text-[12px] font-normal text-[#667085]">
              ({permissions.length} of {TOTAL_PERMISSIONS} selected)
            </span>
          </p>
          {!readOnly && (
            <CustomCheckbox
              checked={permissions.length === TOTAL_PERMISSIONS}
              indeterminate={permissions.length > 0 && permissions.length < TOTAL_PERMISSIONS}
              onChange={(e) => toggleAll(e.target.checked)}
            >
              <span className="text-[13px] text-[#344054]">Full access</span>
            </CustomCheckbox>
          )}
        </div>

        <div className="border-solid border-[1px] border-[#EAECF0] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] text-[12px] font-medium text-[#667085]">
                <th className="text-left font-medium px-3 py-2">Module</th>
                {PERMISSION_ACTIONS.map((action) => (
                  <th key={action.key} className={`${cellClass} font-medium py-2`}>
                    <div className="flex flex-col items-center">
                      <span>{action.label}</span>
                      {!readOnly && (
                        <CustomCheckbox
                          {...columnState(action.key)}
                          onChange={(e) => toggleColumn(action.key, e.target.checked)}
                        />
                      )}
                    </div>
                  </th>
                ))}
                {!readOnly && <th className={`${cellClass} font-medium py-2`}>All</th>}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_MODULES.map((module) => {
                const row = rowState(module.key);
                return (
                  <tr
                    key={module.key}
                    className={`border-solid border-0 border-t-[1px] border-[#EAECF0] ${
                      row.checked || row.indeterminate ? "bg-[#F8F7FF]" : "bg-white"
                    }`}
                  >
                    <td className="px-3 py-2">
                      <p className="text-[13px] font-medium text-[#101828] leading-4">{module.label}</p>
                      <p className="text-[11px] text-[#98A2B3] leading-4">{module.service}</p>
                    </td>
                    {PERMISSION_ACTIONS.map((action) => (
                      <td key={action.key} className={`${cellClass} py-2`}>
                        <CustomCheckbox
                          disabled={readOnly}
                          checked={has(module.key, action.key)}
                          onChange={(e) => toggleCell(module.key, action.key, e.target.checked)}
                        />
                      </td>
                    ))}
                    {!readOnly && (
                      <td className={`${cellClass} py-2`}>
                        <CustomCheckbox
                          {...row}
                          onChange={(e) => toggleRow(module.key, e.target.checked)}
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!readOnly && (
          <p className="flex items-center gap-1 text-[12px] text-[#667085] mt-2 mb-0">
            <InfoCircleOutlined />
            Read is selected automatically when you choose Create, Update or Delete.
          </p>
        )}
        {error && <p className="text-[13px] text-[#F04438] mt-1">{error}</p>}
      </Modal>
    </ConfigProvider>
  );
}

export default RoleModal;
