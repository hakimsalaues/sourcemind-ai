import { Document, Schema, Types, model } from "mongoose";

export type MessageRole = "user" | "assistant";

export type MessageSource = {
  documentId: string;
  documentName: string;
  chunkIndex: number;
  textPreview: string;
  score: number;
};

export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  userId: Types.ObjectId;
  role: MessageRole;
  content: string;
  sources: MessageSource[];
  createdAt: Date;
  updatedAt: Date;
}

const sourceSchema = new Schema<MessageSource>(
  {
    documentId: String,
    documentName: String,
    chunkIndex: Number,
    textPreview: String,
    score: Number,
  },
  { _id: false },
);

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sources: {
      type: [sourceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Message = model<IMessage>("Message", messageSchema);
