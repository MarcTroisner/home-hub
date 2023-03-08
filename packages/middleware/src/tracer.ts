import type { Request, Response, NextFunction } from 'express';
import type { ISpanMapping } from '@package/types/middleware';

import { randomUUID } from 'crypto';
import { get, set, join, split, chain, merge } from 'lodash';
import { SpanModel, SpanEventModel } from '@package/models';
import { ESpanKind } from '@package/types/models';

/**
 * Creates a tracer provider for creating new traces
 *
 * @param {Request} _req - Request object
 * @param {Response} res - Response object
 * @param {NextFunction} _next - Next function
 */
export function tracer(req: Request, res: Response, next: NextFunction): void {
  req.app.tracer = {
    $_state: {
      traceId: null,
      parentId: null,
      mapper: {},
    },

    $_checkTraceStarted() {
      if (Object.keys(this.$_state.mapper).length === 0) {
        req.app.logger.warn('Trace not started.');
        return false;
      }

      return true;
    },

    $_checkSpanExists(mapping) {
      const computedMapping = `root.children.${chain(mapping).split('.').join('.children.').value()}`;
      const span = get(this.$_state.mapper, computedMapping, null);

      if (span === null) req.app.logger.warn(`No span exists for mapping '${mapping}'.`);

      return span !== null;
    },

    $_computeMapping(mapping) {
      const mappingSpans = split(mapping, '.');
      const computedMapping = `root.children.${join(mappingSpans, '.children.')}`;

      // Check if mapping is a valid path to a existing parent
      if (mappingSpans.length >= 2) {
        const mappingToCheck = (mappingSpans.length === 2) ? `${mappingSpans[0]}.children` : `${join(mappingSpans, '.children.')}.children`;

        if (get(this.$_state.mapper, `root.children.${mappingToCheck}`, null) === null) {
          req.app.logger.warn(`Mapping '${mapping}' does not point to a valid parent.`);
          return null;
        }
      }

      return computedMapping;
    },

    start({ traceId = randomUUID(), parentId = null } = {}) {
      this.$_state.traceId = traceId;
      this.$_state.parentId = parentId;

      const rootSpan = new SpanModel({
        name: req.path,
        context: {
          traceId: this.$_state.traceId,
        },
      });

      set(this.$_state.mapper, 'root', { instance: rootSpan.toJSON(), children: {} });
      req.app.logger.info(`Started new trace '${this.$_state.traceId}'`);

      return this;
    },

    addSpan({ name, type = ESpanKind.INTERNAL, mapping, attributes = {} }) {
      if (!this.$_checkTraceStarted()) return this;

      const computedMapping = this.$_computeMapping(mapping);
      if (computedMapping === null) return this;

      // Check if span already exists
      if (get(this.$_state.mapper, computedMapping, null) !== null) {
        req.app.logger.warn(`A span does already exist for mapping '${mapping}'.`);
        return this;
      }

      const span: ISpanMapping = {
        instance: new SpanModel({
          name,
          type,
          attributes,
          context: {
            traceId: this.$_state.traceId,
          },
        }),
        children: {},
      };

      set(this.$_state.mapper, computedMapping, span);
      req.app.logger.info(`Created new span '${span.instance.context.spanId}' for trace '${this.$_state.traceId}'`);

      return this;
    },

    async finishSpan({ mapping }) {
      if (!this.$_checkTraceStarted()) return this;
      if (!this.$_checkSpanExists(mapping)) return this;

      const computedMapping = this.$_computeMapping(mapping);
      if (computedMapping === null) return this;

      const span = get(this.$_state.mapper, computedMapping);

      const spanDoc = new SpanModel({
        ...span.instance,
        endTime: Date.now(),
      });
      await spanDoc.save()
        .then(() => {
          req.app.logger.info(`Span '${span.instance.context.spanId}' finished.`);
        })
        .catch((e) => {
          req.app.logger.warn('a', { e });
          // req.app.logger.warn(`Failed to save span '${span.instance.context.spanId}'.`);
        });

      return this;
    },

    addSpanAttribute({ mapping, attributes }) {
      if (!this.$_checkTraceStarted()) return this;
      if (!this.$_checkSpanExists(mapping)) return this;

      const computedMapping = this.$_computeMapping(mapping);
      if (computedMapping === null) return this;

      const span = get(this.$_state.mapper, computedMapping);

      merge(span.instance.attributes, attributes);
      req.app.logger.info(`Added new attributes to span '${span.instance.context.spanId}'`);

      return this;
    },

    addSpanEvent({ mapping, event }) {
      if (!this.$_checkTraceStarted()) return this;
      if (!this.$_checkSpanExists(mapping)) return this;

      const computedMapping = this.$_computeMapping(mapping);
      if (computedMapping === null) return this;

      const span = get(this.$_state.mapper, computedMapping);

      const spanEvent = new SpanEventModel({
        ...event,
      }).toJSON();

      span.instance.events.push(spanEvent);
      req.app.logger.info(`Added new event to span '${span.instance.context.spanId}'`);

      return this;
    },
  };

  next();
}
