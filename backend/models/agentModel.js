import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,  // with country code e.g. +91xxxxxxxxxx
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    assignedData: [
        {
            firstName: String,
            phone: Number,
            notes: String
        }
    ]
});

const agentModel = mongoose.models.agent || mongoose.model("agent", agentSchema);

export default agentModel;
