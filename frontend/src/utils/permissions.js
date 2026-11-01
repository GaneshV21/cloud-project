
export const PERMISSION_MODULES = [
  { key: "instance", label: "Instances", service: "Compute" },
  { key: "keypair", label: "Keypairs", service: "Compute" },
  { key: "network", label: "Networks", service: "Network" },
  { key: "security_group", label: "Security Groups", service: "Network" },
  { key: "volume", label: "Volumes", service: "Storage" },
];

export const PERMISSION_ACTIONS = [
  { key: "read", label: "Read", short: "R" },
  { key: "create", label: "Create", short: "C" },
  { key: "update", label: "Update", short: "U" },
  { key: "delete", label: "Delete", short: "D" },
];

export const getPermissionKey = (moduleKey, actionKey) => `${moduleKey}:${actionKey}`;

export const ALL_PERMISSIONS = PERMISSION_MODULES.flatMap((module) =>
  PERMISSION_ACTIONS.map((action) => getPermissionKey(module.key, action.key))
);

export const TOTAL_PERMISSIONS = ALL_PERMISSIONS.length;
