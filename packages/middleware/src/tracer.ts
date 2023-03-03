import type { Request, Response, NextFunction } from 'express';

import { randomUUID } from 'crypto';
import { get, set } from 'lodash';
import { SpanModel, SpanEventModel } from '@package/models';

/**
 * Creates a tracer provider for creating new traces
 *
 * @param {Request} _req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} _next - Next function
 */
export function traceProvider(req: Request, res: Response, next: NextFunction): void {
  req.app.tracer = {
    $_state: {
      active: false,
      traceId: randomUUID(),
      parentId: null,
      spans: {},
    },

    $_getSpan(mapping) {
      const spanState = get(this.$_state.spans, mapping, null);

      if (spanState === null) {
        req.app.logger.warn('Span does not exist');
        return null;
      }

      return spanState;
    },

    $_setSpanInstance(mapping, instance) {
      set(this.$_state.spans, mapping, instance);
    },

    startTrace() {
      req.app.logger.trace('Starting new trace');

      if (this.$_state.active) {
        req.app.logger.warn('Can not start trace. A trace is already active');
        return;
      }

      if (req.headers['trace-id']) this.$_state.traceId = req.headers['trace-id'];
      if (req.headers['span-id']) this.$_state.parentId = req.headers['span-id'];

      this.createSpan({ name: req.path, mapping: 'root' });
    },

    createSpan({ name, mapping, attributes = {} }) {
      req.app.logger.trace('Starting new trace span');

      const span = new SpanModel({
        name,
        context: {
          traceId: this.$_state.traceId,
        },
        attributes,
        parentId: this.$_state.parentId,
      }).toJSON();

      this.$_setSpanInstance(mapping, span);
    },

    finishSpan(mapping) {
      const span = this.$_getSpan(mapping);
      if (span === null) return;

      if (Object.keys(span.children).length !== 0) {
        req.app.logger.warn('Can not stop span, span has active children');
        return null;
      }

      req.app.logger.trace('Finishing trace span', { spanId: span.instance.context.spanId });

      req.app.logger.trace('Span finished', { ...span });
    },

    addSpanEvent({ mapping, name, attributes = {} }) {
      const span = this.$_getSpan(mapping);
      if (span === null) return;

      req.app.logger.trace('Adding new span event', { spanId: span.instance.context.spanId });

      span.instance.events.push(new SpanEventModel({
        name,
        attributes,
      }).toJSON());

      this.$_setSpanInstance(mapping, span.instance);
    },

    addSpanAttributes({ mapping, attributes }) {
      const span = this.$_getSpan(mapping);
      if (span === null) return;

      req.app.logger.trace('Adding new span attributes', { spanId: span.instance.context.spanId });

      span.instance.attributes = {
        ...span.instance.attributes,
        ...attributes,
      };

      this.$_setSpanInstance(mapping, span.instance);
    },

    includeTraceInformation(mapping = 'root') {
      req.app.logger.trace('Updating headers for next service');

      const span = this.$_getSpan(mapping);

      res.setHeader('trace-id', this.$_state.traceId);
      res.setHeader('span-id', span!.instance.context.spanId);
    },
  };

  next();
}
