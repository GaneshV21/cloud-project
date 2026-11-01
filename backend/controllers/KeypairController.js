const Keypair = require("../models/Keypair");
const { generateKeyPair } = require("../utils/jwt");
const { findUserProject, projectNotFound } = require("../utils/project-access");

exports.listKeypair = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    if (!(await findUserProject(user_id, project_id))) return projectNotFound(res);
    const keypairList = await Keypair.find({ user_id, project_id }, { __v: 0 });
    res.status(200).json({
      data: keypairList,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.createKeypair = async function (req, res, next) {
  try {
    let { user_id, project_id } = req.params;
    if (!(await findUserProject(user_id, project_id))) return projectNotFound(res);
    const { name, type } = req.body;
    const { private_key, public_key, fingerprint } = generateKeyPair();
    const keypairCreate = await Keypair.create({
      user_id,
      project_id,
      name,
      type,
      public_key,
      fingerprint,
    });

    // The private key is only returned here, once; it is never stored
    res.status(200).json({
      data: { ...keypairCreate.toJSON(), private_key },
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getKeypair = async function (req, res, next) {
  try {
    let { user_id, keypair_id } = req.params;
    const keypairGet = await Keypair.findOne({ user_id, _id: keypair_id }, { __v: 0 });
    if (!keypairGet) {
      return res.status(404).json({
        data: {},
        message: "Keypair Not Found",
      });
    }
    res.status(200).json({
      data: keypairGet,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteKeypair = async function (req, res, next) {
  try {
    let { user_id, keypair_id } = req.params;
    const keypairDelete = await Keypair.deleteOne({
      user_id,
      _id: keypair_id,
    });
    res.status(200).json({
      data: keypairDelete,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
