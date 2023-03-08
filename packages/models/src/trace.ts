import type { ISpan, ISpanContext, ISpanEvent } from '@package/types/models';

import { Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';
import { omit } from 'lodash';
import { ESpanKind, EStatusCodes } from '@package/types/models';

const SpanEventSchema = new Schema<ISpanEvent>({
  name: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true,
  },
  attributes: {
    type: Object,
    default: {},
  },
}, { _id: false, minimize: false });

const SpanContextSchema = new Schema<ISpanContext>({
  traceId: {
    type: String,
    required: true,
    immutable: true,
  },
  spanId: {
    type: String,
    default: randomUUID(),
    required: true,
    immutable: true,
  },
}, { _id: false });

const SpanSchema = new Schema<ISpan>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(ESpanKind),
    default: ESpanKind.INTERNAL,
  },
  context: {
    type: SpanContextSchema,
    default: {},
    immutable: true,
  },
  parentId: {
    type: String,
    immutable: true,
  },
  statusCode: {
    type: String,
    enum: Object.values(EStatusCodes),
    required: true,
    default: EStatusCodes.UNSET,
  },
  statusMessage: {
    type: String,
    default: '',
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true,
  },
  endTime: {
    type: Date,
  },
  attributes: {
    type: Object,
    default: {},
  },
  events: {
    type: [SpanEventSchema],
    default: [],
  },
}, {
  minimize: false,
  toJSON: {
    transform: (doc, ret) => omit(ret, ['_id', '__v']),
  },
});

export const SpanModel = model<ISpan>('Span', SpanSchema, 'spans');
export const SpanEventModel = model<ISpanEvent>('SpanEvent', SpanEventSchema);
