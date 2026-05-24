import mongoose, { Schema, type Document } from 'mongoose';

export interface ICropReport extends Document {
  userId?: string;
  userName: string;
  userMobile: string;
  userEmail: string;
  cropName: string;
  detectedCondition: string;
  confidenceScore: number;
  damageSeverity: number;
  treatmentSuggestions: string[];
  diagnosticType: string;
  status: string;
  capturedAt: Date;
  fileName: string;
  cropImage?: string;
  pmfbyClaimFiled: boolean;
}

const cropReportSchema = new Schema<ICropReport>(
  {
    userId: { type: String, trim: true },
    userName: { type: String, required: true, trim: true },
    userMobile: { type: String, required: true, trim: true, index: true },
    userEmail: { type: String, default: '', trim: true },
    cropName: { type: String, required: true, trim: true },
    detectedCondition: { type: String, required: true, trim: true },
    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    damageSeverity: { type: Number, required: true, min: 0, max: 100 },
    treatmentSuggestions: { type: [String], default: [] },
    diagnosticType: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    capturedAt: { type: Date, required: true, default: Date.now },
    fileName: { type: String, required: true, trim: true },
    cropImage: { type: String },
    pmfbyClaimFiled: { type: Boolean, required: true, default: false },
  },
  {
    collection: 'cropreports',
    timestamps: true,
  }
);

cropReportSchema.index({ userMobile: 1, capturedAt: -1, createdAt: -1 });

const CropReport = mongoose.model<ICropReport>('CropReport', cropReportSchema);

export default CropReport;
