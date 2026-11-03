// Auth
const Login = "/login";
const Signup = "/signup";

// Services
const Dashboard = "/dashboard";
const Instances = "/compute/instances";
const CreateInstance = "/compute/instances/create_instance";
const Keypairs = "/compute/keypairs";
const Volumes = "/volumes";
const Networks = "/network/networks";
const SecurityGroups = "/network/security_groups";
const SecurityGroupRules = "/network/security_groups/:securitygroup_id/rules";
const Projects = "/iam/projects";
const Users = "/iam/users";
const Roles = "/iam/roles";
const Profile = "/profile";
const Billing = "/billing";

const PATH = {
  Login,
  Signup,
  Dashboard,
  Instances,
  CreateInstance,
  Keypairs,
  Volumes,
  Networks,
  SecurityGroups,
  SecurityGroupRules,
  Projects,
  Users,
  Roles,
  Profile,
  Billing,
};

export default PATH;

// Rules page of one security group
export const securityGroupRulesPath = (securityGroupId) =>
  SecurityGroupRules.replace(":securitygroup_id", securityGroupId);
