const Keypair = require("../models/Keypair");

exports.listKeypair = async function (req, res, next) {
  try {
    let { user_id } = req.params;
    const keypairList = await Keypair.find({ user_id }, { _v: 0 });
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
    let { user_id } = req.params;
    const { name, type } = req.body;
    const instanceCreate = await Keypair.create({
      name,
      type,
    });

    res.status(200).json({
      data: instanceCreate,
      message: "Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getInstance = async function (req, res, next) {
  try {
    let { user_id, instance_id } = req.params;
    const instanceGet = await Instance.findOne({ user_id, _id: instancr_id });
    if (!instanceGet) {
      return res.status(404).json({
        data: {},
        message: "Not Found",
      });
    }
    res.status(200).json({
      data: instanceGet,
      message: "Request Processed Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteInstance = async function (req, res, next) {
  try {
    let { user_id, instance_id } = req.params;
    const instanceDelete = await Instance.deleteOne({
      user_id,
      _id: instance_id,
    });
    res.status(200).json({
      data: instanceDelete,
      message: "Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
