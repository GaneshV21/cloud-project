// Resource limits per project. Create APIs refuse to go over these.
const QUOTAS = {
  instances: 10,
  networks: 10,
  security_groups: 5,
  security_group_rules: 50,
  volumes: 10,
  keypairs: 10,
};

// Rules allowed inside one security group (on top of the per-project rule quota)
const RULES_PER_SECURITY_GROUP = 10;

// 403 with a readable message, e.g. "Quota reached: a project can have up to 10 instances."
const quotaExceeded = (res, message) =>
  res.status(403).json({ data: {}, message: `Quota reached: ${message}` });

module.exports = { QUOTAS, RULES_PER_SECURITY_GROUP, quotaExceeded };
