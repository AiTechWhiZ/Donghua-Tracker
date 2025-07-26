const mongoose = require("mongoose");

// Backup all documents from a model
async function backupData(model) {
  return await model.find({});
}

// Restore documents to a model (overwrites existing)
async function restoreData(model, data) {
  await model.deleteMany({});
  await model.insertMany(data);
}

module.exports = { backupData, restoreData };
