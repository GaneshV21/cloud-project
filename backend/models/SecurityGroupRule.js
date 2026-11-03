const mongoose = require("mongoose");
const SecurityGroupRuleSchema = new mongoose.Schema({
  // Public id, e.g. "qwert2-gftjaj-ganer22q" (see utils/generate-id.js)
  security_group_rule_id: { type: String, required: true, index: { unique: true } },
  // securitygroup_id of the security group this rule belongs to
  security_group_id: { type: String, required: true, index: true },
  // ingress / egress (see utils/security-group-options.js)
  type: { type: String, required: true },
  // tcp / icmp / all_tcp / all_icmp / ssh / ping
  protocol: { type: String, required: true },
  // Port or range for TCP rules ("22", "8000-8080"); empty for ICMP
  port: { type: String, default: "" },
  cidr: { type: String, required: true },
  user_id: { type: String },
  project_id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("securitygrouprule", SecurityGroupRuleSchema);
