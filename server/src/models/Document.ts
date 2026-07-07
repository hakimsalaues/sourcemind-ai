import { Document as MongooseDocument, Schema, Types, model } from "mongoose";

export type DocumentStatus = "pending" | "processing" | "completed" | "failed";

export interface IDocument extends MongooseDocument {
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  originalName: string;
  storedName: string;
  filePath: string;
  mimeType: string;
  size: number;
  status: DocumentStatus;
  chunkCount: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    storedName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    chunkCount: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const DocumentModel = model<IDocument>("Document", documentSchema);
