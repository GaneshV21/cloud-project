import React, { useState } from "react";
import { ConfigProvider, Modal } from "antd";
import {
  CustomButton,
  CustomInput,
  CustomSecondaryButton,
  CustomTextArea,
} from "../../../utils/custom-input";

const MAX_DESCRIPTION = 200;

// mode: "create" | "edit"
function SecurityGroupModal({ open, mode, securityGroup, existingNames = [], onClose, onSave }) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(securityGroup?.name ?? "");
  const [description, setDescription] = useState(securityGroup?.description ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    const trimmed = name.trim();
    if (!trimmed) return setError("Name is required.");
    if (existingNames.some((n) => n?.toLowerCase() === trimmed.toLowerCase())) {
      return setError("A security group with this name already exists.");
    }
    setSaving(true);
    try {
      await onSave({ name: trimmed, description: description.trim() });
    } finally {
      setSaving(false);
    }
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
              {isEdit ? "Edit Security Group" : "Create Security Group"}
            </span>
            <span className="text-[13px] font-normal text-[#535862]">
              {isEdit
                ? "Update the security group's name and description."
                : "Group traffic rules you can attach to instances. Add rules after creating it."}
            </span>
          </div>
        }
        footer={
          <div className="flex justify-end gap-2">
            <CustomSecondaryButton label="Cancel" onClick={onClose} disabled={saving} />
            <CustomButton
              label={isEdit ? "Save Changes" : "Create Security Group"}
              onClick={handleSave}
              loading={saving}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4 mt-3">
          <div>
            <p className="text-[13px] font-medium text-[#344054] mb-1">
              Name <span className="text-[#F04438]">*</span>
            </p>
            <CustomInput
              autoFocus
              placeholder="e.g. web-servers"
              maxLength={50}
              value={name}
              status={error ? "error" : undefined}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onPressEnter={handleSave}
            />
            {error && <p className="text-[12px] text-[#F04438] mt-1">{error}</p>}
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#344054] mb-1">Description</p>
            <CustomTextArea
              rows={3}
              placeholder="What is this security group for?"
              maxLength={MAX_DESCRIPTION}
              showCount
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default SecurityGroupModal;
