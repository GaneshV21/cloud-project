const URL = "http://localhost:8003";

export const SIGNUP = `${URL}/auth/signup`;
export const LOGIN = `${URL}/auth/login`;

// Projects
export const PROJECT_LIST = (userId) => `${URL}/project/list/${userId}`;
export const PROJECT_CREATE = (userId) => `${URL}/project/create/${userId}`;
export const PROJECT_UPDATE = (userId, projectId) =>
  `${URL}/project/update/${userId}/${projectId}`;
export const PROJECT_DELETE = (userId, projectId) =>
  `${URL}/project/delete/${userId}/${projectId}`;
export const PROJECT_SELECT = (userId, projectId) =>
  `${URL}/project/select/${userId}/${projectId}`;
export const PROJECT_SUMMARY = (userId, projectId) =>
  `${URL}/project/summary/${userId}/${projectId}`;

// Instances
export const INSTANCE_LIST = (userId, projectId) =>
  `${URL}/instance/list/${userId}/${projectId}`;
export const INSTANCE_CREATE = (userId, projectId) =>
  `${URL}/instance/create/${userId}/${projectId}`;

// Networks
export const NETWORK_LIST = (userId, projectId) =>
  `${URL}/network/list/${userId}/${projectId}`;

// Security groups
export const SECURITY_GROUP_LIST = (userId, projectId) =>
  `${URL}/securitygroup/list/${userId}/${projectId}`;

// Keypairs
export const KEYPAIR_LIST = (userId, projectId) =>
  `${URL}/keypair/list/${userId}/${projectId}`;

// Volumes
export const VOLUME_LIST = (userId, projectId) =>
  `${URL}/volume/list/${userId}/${projectId}`;
export const SECURITY_GROUP_GET = (userId, projectId, securityGroupId) =>
  `${URL}/securitygroup/get/${userId}/${projectId}/${securityGroupId}`;
export const SECURITY_GROUP_CREATE = (userId, projectId) =>
  `${URL}/securitygroup/create/${userId}/${projectId}`;
export const SECURITY_GROUP_UPDATE = (userId, projectId, securityGroupId) =>
  `${URL}/securitygroup/update/${userId}/${projectId}/${securityGroupId}`;
export const SECURITY_GROUP_DELETE = (userId, projectId, securityGroupId) =>
  `${URL}/securitygroup/delete/${userId}/${projectId}/${securityGroupId}`;

// Security group rules
export const RULE_TYPES = (userId) => `${URL}/securitygroup/rule/types/${userId}`;
export const RULE_PROTOCOLS = (userId) => `${URL}/securitygroup/rule/protocols/${userId}`;
export const RULE_LIST = (userId, projectId, securityGroupId) =>
  `${URL}/securitygroup/rule/list/${userId}/${projectId}/${securityGroupId}`;
export const RULE_CREATE = (userId, projectId, securityGroupId) =>
  `${URL}/securitygroup/rule/create/${userId}/${projectId}/${securityGroupId}`;
export const RULE_UPDATE = (userId, projectId, securityGroupId, ruleId) =>
  `${URL}/securitygroup/rule/update/${userId}/${projectId}/${securityGroupId}/${ruleId}`;
export const RULE_DELETE = (userId, projectId, securityGroupId, ruleId) =>
  `${URL}/securitygroup/rule/delete/${userId}/${projectId}/${securityGroupId}/${ruleId}`;

// Sub-users (IAM is per user, not per project)
export const SUBUSER_LIST = (userId) => `${URL}/subuser/list/${userId}`;
export const SUBUSER_CREATE = (userId) => `${URL}/subuser/create/${userId}`;
export const SUBUSER_DELETE = (userId, subuserId) =>
  `${URL}/subuser/delete/${userId}/${subuserId}`;
// Sets a sub-user's projects and role in each
export const PROJECT_MANAGE_USER = (userId, subuserId) =>
  `${URL}/project/manage-user/${userId}/${subuserId}`;
