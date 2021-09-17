import * as Joi from 'joi';
import { createLine, readLine, updateLine, deleteLine, getall, readName } from '../../api/crud';

export default [
  {
    method: 'POST',
    path: '/create',
    handler: createLine,
    options: {
      id: 'create',
      auth: false,
      description: 'This method creates a new line in a DataBase.',
      tags: ['api', 'Post'],
      validate: {
        payload: Joi.object({
          name: Joi.string().min(3).max(60).required(),
          email: Joi.string().email().max(100).required(),
          password: Joi.string().min(3).max(60).required(),
        }),
        failAction: (req, h, err) =>
          err.isJoi ? h.response(err.details[0]).takeover().code(400) : h.response(err).takeover(),
      },
    },
  },{
    method: 'GET',
    path: '/read/{id}',
    handler: readLine,
    options: {
      id: 'read',
      auth: false,
      description: 'This method returns a line in a DataBase.',
      tags: ['api', 'Get'],
      validate: {
        params: Joi.object({
          id: Joi.number().positive().min(0).max(1000000).required(),
        }),
        failAction: (req, h, err) =>
          err.isJoi ? h.response(err.details[0]).takeover().code(400) : h.response(err).takeover(),
      },
    },
  },{
    method: 'GET',
    path: '/name/{name}',
    handler: readName,
    options: {
      id: 'name',
      auth: false,
      description: 'This method returns a line in a DataBase.',
      tags: ['api', 'Get'],
      validate: {
        params: Joi.object({
          name: Joi.string().min(0).max(100).required(),
        }),
        failAction: (req, h, err) =>
          err.isJoi ? h.response(err.details[0]).takeover().code(400) : h.response(err).takeover(),
      },
    },
  },
  {
    method: 'GET',
    path: '/getall',
    handler: getall,
    options: {
      id: 'getall',
      auth: false,
      description: 'This method returns all lines from a DataBase.',
      tags: ['api', 'Get', 'all']
    },
  },{
    method: 'PUT',
    path: '/update',
    handler: updateLine,
    options: {
      id: 'update',
      auth: false,
      description: 'This method updates a line in a DataBase.',
      tags: ['api', 'Update'],
      validate: {
        payload: Joi.object({
          id: Joi.number().positive().min(0).max(1000000).required(),
          name: Joi.string().min(3).max(60).required(),
          email: Joi.string().email().max(100).required(),
          password: Joi.string().min(3).max(60).required(),
        }),
        failAction: (req, h, err) =>
          err.isJoi ? h.response(err.details[0]).takeover().code(400) : h.response(err).takeover(),
      },
    },
    
  },{
    method: 'DELETE',
    path: '/delete/{id}',
    handler: deleteLine,
    options: {
      id: 'delete',
      auth: false,
      description: 'This method deletes a line in a DataBase.',
      tags: ['api', 'Delete'],
      validate: {
        params: Joi.object({
          id: Joi.number().positive().min(0).max(1000000).required(),
        }),
        failAction: (req, h, err) =>
          err.isJoi ? h.response(err.details[0]).takeover().code(400) : h.response(err).takeover(),
      },
    },
  },
  
];
