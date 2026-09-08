const mongoose = require("mongoose");

const InstanceBillingSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    flavor_name: { type: String },
    flavor_amount: { type: String },
    status: { type: String },
    created_time: { type: Date },
    change_time: { type: Date },
    deleted_time: { type: Date },
  },
  { _id: false },
);

const NetworkBillingSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    network_amount: { type: String },
    status: { type: String },
    created_time: { type: Date },
    change_time: { type: Date },
    deleted_time: { type: Date },
  },
  { _id: false },
);

const VolumeBillingSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    volume_amount: { type: String },
    volume_type: { type: String },
    status: { type: String },
    created_time: { type: Date },
    change_time: { type: Date },
    deleted_time: { type: Date },
  },
  { _id: false },
);

const BillingSchema = new mongoose.Schema({
  user_id: { type: String },
  instance: { type: [InstanceBillingSchema], default: [] },
  network: { type: [NetworkBillingSchema], default: [] },
  volume: { type: [VolumeBillingSchema], default: [] },
});

module.exports = mongoose.model("billing", BillingSchema);
