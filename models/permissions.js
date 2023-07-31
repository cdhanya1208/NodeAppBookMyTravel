const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
      action: { type: String, required: true },
      user_types: { type: [String], required: true }
});

const Permission = mongoose.model('permissions', permissionSchema);
module.exports = Permission;