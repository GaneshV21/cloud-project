import React, { useState } from "react";
import { ConfigProvider, Modal } from "antd";
import {
  CustomButton,
  CustomInput,
  CustomSecondaryButton,
  CustomSelect,
} from "../../../utils/custom-input";

// Same checks as the backend, so most mistakes are caught before saving
const isValidCidr = (cidr) => {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/.exec(cidr ?? "");
  if (!match) return false;
  const [a, b, c, d, prefix] = match.slice(1).map(Number);
  return [a, b, c, d].every((n) => n <= 255) && prefix <= 32;
};

const isValidPort = (port) => {
  const match = /^(\d{1,5})(?:-(\d{1,5}))?$/.exec(String(port ?? "").trim());
  if (!match) return false;
  const from = Number(match[1]);
  const to = match[2] ? Number(match[2]) : from;
  return from >= 1 && to <= 65535 && from <= to;
};

const Label = ({ children }) => (
  <p className="text-[13px] font-medium text-[#344054] mb-1">
    {children} <span className="text-[#F04438]">*</span>
  </p>
);

const FieldError = ({ message }) =>
  message ? <p className="text-[12px] text-[#F04438] mt-1">{message}</p> : null;

// mode: "create" | "edit"; types / protocols come from the rule option APIs
function RuleModal({ open, mode, rule, securityGroupName, types = [], protocols = [], onClose, onSave }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState({
    type: rule?.type ?? types[0]?.value,
    protocol: rule?.protocol,
    port: rule?.port ?? "",
    cidr: rule?.cidr ?? "0.0.0.0/0",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const protocolOption = protocols.find((p) => p.value === form.protocol);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.type) next.type = "Select a type.";
    if (!form.protocol) next.protocol = "Select a protocol.";
    if (protocolOption?.requires_port && !isValidPort(form.port)) {
      next.port = "Enter a port (1-65535) or a range like 8000-8080.";
    }
    if (!isValidCidr(form.cidr.trim())) next.cidr = "Enter a valid IPv4 CIDR, e.g. 0.0.0.0/0.";
    setErrors(next);
    return !Object.keys(next).length;
  };

  const handleSave = async () => {
    if (saving || !validate()) return;
    setSaving(true);
    try {
      await onSave({
        type: form.type,
        protocol: form.protocol,
        cidr: form.cidr.trim(),
        port: protocolOption?.requires_port ? form.port.trim() : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  // What the port will be for protocols that don't need one typed in
  const portHint = protocolOption?.requires_port
    ? null
    : protocolOption?.port
    ? `Uses port ${protocolOption.port}`
    : protocolOption
    ? "No port (ICMP)"
    : null;

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
              {isEdit ? "Edit Rule" : "Add Rule"}
            </span>
            <span className="text-[13px] font-normal text-[#535862]">
              {isEdit ? "Update this rule in " : "Allow traffic for "}
              <span className="font-medium text-[#344054]">{securityGroupName}</span>.
            </span>
          </div>
        }
        footer={
          <div className="flex justify-end gap-2">
            <CustomSecondaryButton label="Cancel" onClick={onClose} disabled={saving} />
            <CustomButton
              label={isEdit ? "Save Changes" : "Add Rule"}
              onClick={handleSave}
              loading={saving}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4 mt-3">
          {/* Type: ingress / egress as two clickable options */}
          <div>
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {types.map((type) => {
                const active = form.type === type.value;
                return (
                  <div
                    key={type.value}
                    onClick={() => setField("type", type.value)}
                    className={`px-3 py-2 rounded-lg border-solid border-[1px] cursor-pointer transition-colors ${
                      active
                        ? "border-[#5142D4] bg-[#F8F7FF]"
                        : "border-[#D0D5DD] bg-white hover:border-[#5142D4]"
                    }`}
                  >
                    <p className={`text-sm font-medium ${active ? "text-[#5142D4]" : "text-[#344054]"}`}>
                      {type.label}
                    </p>
                    <p className="text-[12px] text-gray-500">{type.description}</p>
                  </div>
                );
              })}
            </div>
            <FieldError message={errors.type} />
          </div>

          {/* Protocol (+ port for custom TCP) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Protocol</Label>
              <CustomSelect
                className="w-full"
                placeholder="Select protocol"
                value={form.protocol}
                status={errors.protocol ? "error" : undefined}
                onChange={(value) => setField("protocol", value)}
                options={protocols.map((p) => ({ value: p.value, label: p.label }))}
              />
              <FieldError message={errors.protocol} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#344054] mb-1">
                Port {protocolOption?.requires_port && <span className="text-[#F04438]">*</span>}
              </p>
              <CustomInput
                placeholder={protocolOption?.requires_port ? "e.g. 443 or 8000-8080" : "-"}
                disabled={!protocolOption?.requires_port}
                value={protocolOption?.requires_port ? form.port : protocolOption?.port ?? ""}
                status={errors.port ? "error" : undefined}
                onChange={(e) => setField("port", e.target.value)}
              />
              {portHint && <p className="text-[12px] text-gray-500 mt-1">{portHint}</p>}
              <FieldError message={errors.port} />
            </div>
          </div>

          {/* CIDR */}
          <div>
            <Label>CIDR</Label>
            <CustomInput
              placeholder="e.g. 10.0.0.0/24"
              value={form.cidr}
              status={errors.cidr ? "error" : undefined}
              onChange={(e) => setField("cidr", e.target.value)}
              onPressEnter={handleSave}
            />
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[12px] text-gray-500">
                {form.type === "egress" ? "Destination" : "Source"} IP range.
              </p>
              <span
                className="text-[12px] text-[#5142D4] font-medium cursor-pointer hover:underline"
                onClick={() => setField("cidr", "0.0.0.0/0")}
              >
                Use anywhere (0.0.0.0/0)
              </span>
            </div>
            <FieldError message={errors.cidr} />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default RuleModal;
