import { Sequelize, } from 'sequelize-typescript';
import config from '../config/config';
import { Crud, } from './Crud';

export const initDatabase = async () => {
  try {
    const sequelize = new Sequelize(config.dbLink, {
      dialect: 'postgres',
      models: [Crud],
      logging: false,
      dialectOptions: {}
    });

    await sequelize.sync();
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    return sequelize;
  }
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default initDatabase;
