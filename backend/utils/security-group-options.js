// Allowed values for security group rules, served by the type / protocol APIs
// and used to validate rules on create / update.

const RULE_TYPES = [
  { value: "ingress", label: "Ingress", description: "Incoming traffic" },
  { value: "egress", label: "Egress", description: "Outgoing traffic" },
];

// port: fixed port for the protocol; requires_port: user must enter a port (custom TCP)
const RULE_PROTOCOLS = [
  { value: "tcp", label: "TCP", requires_port: true },
  { value: "icmp", label: "ICMP" },
  { value: "all_tcp", label: "All TCP", port: "1-65535" },
  { value: "all_icmp", label: "All ICMP" },
  { value: "ssh", label: "SSH", port: "22" },
  { value: "ping", label: "Ping" },
];

// IPv4 CIDR, e.g. 10.0.0.0/24 or 0.0.0.0/0
const isValidCidr = (cidr) => {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/.exec(cidr ?? "");
  if (!match) return false;
  const [a, b, c, d, prefix] = match.slice(1).map(Number);
  return [a, b, c, d].every((n) => n <= 255) && prefix <= 32;
};

// A single port (1-65535) or a range like 8000-8080
const isValidPort = (port) => {
  const match = /^(\d{1,5})(?:-(\d{1,5}))?$/.exec(String(port ?? "").trim());
  if (!match) return false;
  const from = Number(match[1]);
  const to = match[2] ? Number(match[2]) : from;
  return from >= 1 && to <= 65535 && from <= to;
};

// Checks a rule from the request body; returns { error } or { rule } ready to save
const validateRule = ({ type, protocol, cidr, port }) => {
  if (!RULE_TYPES.some((t) => t.value === type)) {
    return { error: "Type must be one of: " + RULE_TYPES.map((t) => t.value).join(", ") };
  }
  const protocolOption = RULE_PROTOCOLS.find((p) => p.value === protocol);
  if (!protocolOption) {
    return { error: "Protocol must be one of: " + RULE_PROTOCOLS.map((p) => p.value).join(", ") };
  }
  if (!isValidCidr(cidr)) {
    return { error: "CIDR must be a valid IPv4 range, e.g. 0.0.0.0/0 or 10.0.0.0/24" };
  }
  let rulePort = protocolOption.port ?? "";
  if (protocolOption.requires_port) {
    if (!isValidPort(port)) return { error: "Port must be 1-65535 or a range like 8000-8080" };
    rulePort = String(port).trim();
  }
  return { rule: { type, protocol, cidr, port: rulePort } };
};

module.exports = { RULE_TYPES, RULE_PROTOCOLS, validateRule };
