const mongoose = require("mongoose");
const { CustomObjectId } = require("../utils/idGenerator");
const packageSchema = new mongoose.Schema({
	name: { type: String },
	description: { type: String },
	actualPrice: { type: Number },
	salePrice: { type: Number },
	features: [{ type: String }],
	processingDays: {
		type: Number,
		default: 7,
	},
	requiredDocuments: [
		{
			name: String,
			description: String,
			required: Boolean,
		},
	],
});

const serviceSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true, 
		},
		category: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String },
		hsncode: { type: String, required: true },
		currency: { type: String, default: "INR" },
		gstRate: { 
			type: Number, 
			default: 18,
			min: 0,
			max: 100,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		hasStaticPage: {
			type: Boolean,
			default: false,
		}, 
		packages: [packageSchema],
	},
	{ timestamps: true }
);

serviceSchema.pre("validate", async function (next) {
	if (!this._id) {
		this._id = await CustomObjectId.generate("SER");
	}
	next();
});

module.exports = mongoose.model("Service", serviceSchema);
