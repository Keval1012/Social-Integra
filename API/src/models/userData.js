import mongoose from 'mongoose';

const userDataSchema = new mongoose.Schema({
    facebookData: {
        type: Object,
        required: false,
        default: Date.now()
        // { timestamps: true }
    },
    instagramData: {
        type: Object,
        required: false,
        default: Date.now()
    },
    linkedinData: {
        type: Object,
        required: false,
        default: Date.now()
    },
    twitterData: {
        type: Object,
        required: false,
        default: Date.now()
    },
}, { timestamps: true });

// userDataSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

export default mongoose.model("UserData", userDataSchema, "userData");