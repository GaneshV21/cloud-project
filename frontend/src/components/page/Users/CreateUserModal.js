import React, { useState } from "react";
import { ConfigProvider, Modal } from "antd";
import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  CustomButton,
  CustomInput,
  CustomInputPassword,
  CustomSecondaryButton,
  CustomSelect,
} from "../../../utils/custom-input";
import { getAvatarColor } from "../../../utils/common";
import { RoleSelect } from "./ProjectAccessDrawer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

const PASSWORD_RULES = [
  { label: `At least ${MIN_PASSWORD} characters`, test: (p) => p.length >= MIN_PASSWORD },
  { label: "One capital letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "One number (0-9)", test: (p) => /\d/.test(p) },
  { label: "One special character (!@#$...)", test: (p) => /[^A-Za-z0-9\s]/.test(p) },
];

const Label = ({ children, required }) => (
  <p className="text-[13px] font-medium text-[#344054] mb-1">
    {children} {required && <span className="text-[#F04438]">*</span>}
  </p>
);

const FieldError = ({ message }) =>
  message ? <p className="text-[12px] text-[#F04438] mt-1">{message}</p> : null;

function CreateUserModal({ open, allProjects = [], existingEmails = [], onClose, onSave }) {
  const roles = useSelector((state) => state.roles.roles);
  const [form, setForm] = useState({
    name: "",
    email: "",
    projects: [],
    roleId: undefined,
    password: "",
  });
  const [errors, setErrors] = useState({});

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    const email = form.email.trim().toLowerCase();
    if (!form.name.trim()) next.name = "Name is required.";
    if (!email) next.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email)) next.email = "Enter a valid email address.";
    else if (existingEmails.some((e) => e.toLowerCase() === email)) {
      next.email = "A user with this email already exists.";
    }
    if (!form.projects.length) next.projects = "Select at least one project.";
    if (!form.roleId) next.roleId = "Select a role.";
    if (!form.password) next.password = "Password is required.";
    else if (!PASSWORD_RULES.every((rule) => rule.test(form.password))) {
      next.password = "Password doesn't meet all the requirements below.";
    }
    setErrors(next);
    return !Object.keys(next).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      projects: form.projects.map((name) => ({ name, roleId: form.roleId })),
    });
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#5142D4", borderRadius: 8 } }}>
      <Modal
        open={open}
        onCancel={onClose}
        width={520}
        centered
        destroyOnHidden
        title={
          <div className="flex flex-col">
            <span className="text-[17px] leading-6 font-semibold text-[#181D27]">Add User</span>
            <span className="text-[13px] font-normal text-[#535862]">
              Create a sub-user and give them access to projects.
            </span>
          </div>
        }
        footer={
          <div className="flex justify-end gap-2">
            <CustomSecondaryButton label="Cancel" onClick={onClose} />
            <CustomButton label="Add User" onClick={handleSave} />
          </div>
        }
      >
        <div className="flex flex-col gap-4 mt-3">
          {/* Name & email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Name</Label>
              <CustomInput
                autoFocus
                placeholder="e.g. Arun Kumar"
                maxLength={50}
                value={form.name}
                status={errors.name ? "error" : undefined}
                onChange={(e) => setField("name", e.target.value)}
              />
              <FieldError message={errors.name} />
            </div>
            <div>
              <Label required>Email</Label>
              <CustomInput
                type="email"
                placeholder="name@company.com"
                value={form.email}
                status={errors.email ? "error" : undefined}
                onChange={(e) => setField("email", e.target.value)}
              />
              <FieldError message={errors.email} />
            </div>
          </div>

          {/* Projects */}
          <div>
            <Label required>Projects</Label>
            <CustomSelect
              mode="multiple"
              allowClear
              className="w-full"
              placeholder="Select projects"
              maxTagCount="responsive"
              value={form.projects}
              status={errors.projects ? "error" : undefined}
              onChange={(value) => setField("projects", value)}
              options={allProjects.map((name) => ({
                value: name,
                label: (
                  <div className="flex items-center gap-2">
                    <div
                      className="h-5 w-5 shrink-0 rounded-md flex items-center justify-center text-white text-[10px] font-medium"
                      style={{ backgroundColor: getAvatarColor(name) }}
                    >
                      {name[0]?.toUpperCase()}
                    </div>
                    {name}
                  </div>
                ),
              }))}
            />
            <FieldError message={errors.projects} />
          </div>

          {/* Role */}
          <div>
            <Label required>Role</Label>
            <RoleSelect
              roles={roles}
              className="w-full"
              value={form.roleId}
              status={errors.roleId ? "error" : undefined}
              onChange={(value) => setField("roleId", value)}
            />
            <p className="text-[12px] text-[#667085] mt-1">
              Applied to every selected project. You can change it per project later from
              Project Access.
            </p>
            <FieldError message={errors.roleId} />
          </div>

          {/* Password */}
          <div>
            <Label required>Password</Label>
            <CustomInputPassword
              placeholder="Enter a strong password"
              autoComplete="new-password"
              value={form.password}
              status={errors.password ? "error" : undefined}
              onChange={(e) => setField("password", e.target.value)}
            />
            <FieldError message={errors.password} />
            {/* Live checklist: turns green as each rule is met */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
              {PASSWORD_RULES.map((rule) => {
                const met = rule.test(form.password);
                return (
                  <p
                    key={rule.label}
                    className={`flex items-center gap-1 text-[12px] ${
                      met ? "text-[#079455]" : errors.password ? "text-[#F04438]" : "text-[#667085]"
                    }`}
                  >
                    {met ? <CheckCircleFilled /> : <CloseCircleOutlined />}
                    {rule.label}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default CreateUserModal;
