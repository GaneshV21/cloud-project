import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Spin } from "antd";
import {
  ArrowRightOutlined,
  CloudServerOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  FolderOpenOutlined,
  KeyOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import PageHeader from "../../../utils/page-header";
import { CustomButton } from "../../../utils/custom-input";
import { getAvatarColor } from "../../../utils/common";
import apiClient, { getErrorMessage } from "../../../utils/api-client";
import { PROJECT_SUMMARY } from "../../../utils/api-endpoints";
import PATH from "../../../utils/Path";

// One card per service: key in the summary API's counts, label, icon, page to open
const SERVICES = [
  { key: "instances", label: "Instances", icon: CloudServerOutlined, path: PATH.Instances },
  { key: "keypairs", label: "Keypairs", icon: KeyOutlined, path: PATH.Keypairs },
  { key: "networks", label: "Networks", icon: ClusterOutlined, path: PATH.Networks },
  { key: "security_groups", label: "Security Groups", icon: SafetyOutlined, path: PATH.SecurityGroups },
  { key: "volumes", label: "Volumes", icon: DatabaseOutlined, path: PATH.Volumes },
];

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
    : "-";

const StatCard = ({ service, count = 0, quota, loading, onClick }) => {
  const Icon = service.icon;
  const percent = quota ? Math.min((count / quota) * 100, 100) : 0;
  const full = quota && count >= quota;
  return (
    <div
      onClick={onClick}
      className="group bg-white border-solid border-[1px] border-[#EAECF0] rounded-xl p-4 flex flex-col gap-4 cursor-pointer transition-all hover:border-[#5142D4] hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-lg bg-[#EEF0FF] flex items-center justify-center">
          <Icon className="text-[18px] text-[#5142D4]" />
        </div>
        <ArrowRightOutlined className="text-[12px] text-[#98A2B3] transition-colors group-hover:text-[#5142D4]" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{service.label}</p>
        <p className="text-[30px] leading-[38px] font-semibold text-[#101828]">
          {loading ? (
            <Spin size="small" />
          ) : (
            <>
              {count}
              {quota ? (
                <span className="text-[16px] font-normal text-gray-500"> / {quota}</span>
              ) : null}
            </>
          )}
        </p>
      </div>
      {/* Quota usage */}
      {quota ? (
        <div>
          <div className="h-[6px] w-full rounded-full bg-[#F2F4F7] overflow-hidden">
            <div
              className={`h-full rounded-full ${full ? "bg-[#F04438]" : "bg-[#5142D4]"}`}
              style={{ width: `${loading ? 0 : percent}%` }}
            />
          </div>
          <p className={`text-[12px] mt-1 ${full ? "text-[#F04438]" : "text-gray-500"}`}>
            {full ? "Quota reached" : `${quota - count} left`}
          </p>
        </div>
      ) : null}
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?.user_id);
  const { currentProject, loaded } = useSelector((state) => state.project);
  const projectId = currentProject?.project_id;
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    if (!userId || !projectId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(PROJECT_SUMMARY(userId, projectId));
      setSummary(res?.data?.data ?? null);
    } catch (error) {
      setSummary(null);
      message.error(getErrorMessage(error, "Couldn't load the project summary."));
    } finally {
      setLoading(false);
    }
  }, [userId, projectId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const counts = summary?.counts ?? {};
  // Per-project limits from the backend (utils/quotas.js)
  const quotas = summary?.quotas ?? {};
  const total = SERVICES.reduce((sum, s) => sum + (counts[s.key] ?? 0), 0);
  const project = summary?.project;

  return (
    <>
      <PageHeader
        showBreadcrumb={false}
        title="Dashboard"
        description={
          currentProject
            ? `Summary of resources in ${currentProject.name}.`
            : "Select a project to see its summary."
        }
      />

      {loaded && !currentProject && (
        <div className="flex flex-col items-center gap-3 py-16 mt-4 rounded-xl border-dashed border-[1px] border-[#D0D5DD]">
          <div className="h-16 w-16 rounded-2xl bg-[#EEF0FF] flex items-center justify-center">
            <FolderOpenOutlined className="text-[30px] text-[#5142D4]" />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[#101828]">No project selected</p>
            <p className="text-sm text-[#667085]">
              Choose a project in the top bar, or open Projects to create one.
            </p>
          </div>
          <CustomButton label="Go to Projects" onClick={() => navigate(PATH.Projects)} />
        </div>
      )}

      {currentProject && (
        <div className="flex flex-col gap-5 mt-4">
          {/* Project overview */}
          <div className="bg-white border-solid border-[1px] border-[#EAECF0] rounded-xl p-5 flex items-center gap-4">
            <div
              className="h-12 w-12 shrink-0 rounded-lg flex items-center justify-center text-white text-[20px] font-medium"
              style={{ backgroundColor: getAvatarColor(currentProject.name) }}
            >
              {currentProject.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[18px] leading-7 font-semibold text-[#101828] truncate">
                {currentProject.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {project?.description || "No description"}
              </p>
            </div>
            <div className="flex gap-8 shrink-0">
              <div>
                <p className="text-sm text-gray-500">Total resources</p>
                <p className="text-[18px] font-semibold text-[#101828]">
                  {loading ? "-" : total}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-[18px] font-semibold text-[#101828]">
                  {formatDate(project?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Resource counts */}
          <div className="grid grid-cols-5 gap-4">
            {SERVICES.map((service) => (
              <StatCard
                key={service.key}
                service={service}
                count={counts[service.key]}
                quota={quotas[service.key]}
                loading={loading}
                onClick={() => navigate(service.path)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
