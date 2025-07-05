import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order.model";

interface PaymentAttrs {}

export interface PaymentDoc extends mongoose.Document {}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PaymentDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {},
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: PaymentAttrs) => {};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  ticketSchema
);

export { Payment };
