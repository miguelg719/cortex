import { NextResponse } from 'next/server'

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Cortex Memory API',
    version: '1.0.0',
    description: 'API for managing short-term and long-term memories',
  },
  paths: {
    '/api/memories': {
      get: {
        summary: 'Get memories',
        parameters: [
          {
            name: 'type',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              enum: ['shortTermMemory', 'longTermMemory'],
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of memories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Memory' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create memory',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type', 'content'],
                properties: {
                  type: {
                    type: 'string',
                    enum: ['short-term', 'long-term'],
                  },
                  content: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Memory created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Memory' },
              },
            },
          },
        },
      },
    },
    '/api/memories/{id}': {
      get: {
        summary: 'Get memory by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'type',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              enum: ['short-term', 'long-term'],
            },
          },
        ],
        responses: {
          '200': {
            description: 'Memory found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Memory' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update memory',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'type',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              enum: ['short-term', 'long-term'],
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Memory updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Memory' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete memory',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'type',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              enum: ['short-term', 'long-term'],
            },
          },
        ],
        responses: {
          '200': {
            description: 'Memory deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Memory: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          content: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(openApiSpec)
}
