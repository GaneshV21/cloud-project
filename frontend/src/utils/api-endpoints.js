const URL = "http://localhost:8003";

export const SIGNUP = `${URL}/auth/signup`;
export const LOGIN = `${URL}/auth/login`;

// Projects
export const PROJECT_LIST = (userId) => `${URL}/project/list/${userId}`;
export const PROJECT_CREATE = (userId) => `${URL}/project/create/${userId}`;
export const PROJECT_UPDATE = (userId, projectId) =>
  `${URL}/project/update/${userId}/${projectId}`;

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
