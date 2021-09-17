import { Sequelize, Op } from 'sequelize';
import { error, output } from '../utils';
import { Crud } from '../models/Crud';
import { BigNumber } from 'bignumber.js';
import moment, { Moment } from 'moment';



export const getTransactionGraph = async (r) => {
  try {
    const poolAddress: string = r.params.pool;
    const graphType: string = r.params.graph;
    const startInterval: string = r.params.interval;
    const timestampNow = new Date().valueOf();

    console.log(poolAddress, ' ', graphType, ' ', startInterval);

    let intervalsAmount: number;
    let timeBetweenIntervals: number;


    let getData: any = [];
    let dataArray = [];

    for (let interval = 1; interval <= intervalsAmount; interval++) {
      let mean = new BigNumber(0);
      getData = await Crud.findAll({
        attributes: [[Sequelize.literal(`ROUND(AVG("${graphType}"), 0)`), 'value']],
        where: {
          createdAt: {
            [Op.between]: [
              timestampNow - timeBetweenIntervals * interval,
              timestampNow - timeBetweenIntervals * (interval - 1),
            ],
          },
          pool: poolAddress,
        },
        raw: true,
      });

      for (let record of getData) {
        if (record.value) {
          mean = mean.plus(new BigNumber(record.value));
        }
      }

      let dataForPeriod = {
        value: mean.toString(),
        createdAt: new Date(timestampNow - timeBetweenIntervals * interval),
      };
      dataArray.push(dataForPeriod);
    }

    return output({ data: dataArray.reverse() });
  } catch (err) {
    console.log(err);
    return error(500000, 'Failed to get transactions graph', null);
  }
};

export const createLine = async (r) => {
    try {

        const {
            name,
            email,
            password,
        } = r.payload 
        const deletedAt = null

        await Crud.create({
            name,
            email,
            password,
            deletedAt
        })

        console.log('A line was created')
        return output({ data: 'A line was created' });

    } catch (e) {
        console.log(e);
        return error(500000, 'Failed to create a line', null);
    } 
}

export const readLine = async (r) => {
    try {
      const data = await Crud.findOne({
        where: {
          [Op.and]: [
            {
              id: {
                [Op.eq]: r.params.id,
              }
            }, {
              deletedAt: {
                [Op.eq]: null,
              }
            }
          ]
        }
      })

      if(!data) {
        console.log('There is no the line')
        return error(404000, 'There is no the line', null );
      }

      return output({ data: data })

    } catch (e) {
        console.log(e);
        return error(500000, 'Failed to get line by ID', null);
    } 
}

export const readName = async (r) => {
  try {

    const data = await Crud.findOne({
      where: {
        name: r.params.name,
        deletedAt: {
          [Op.eq]: null,
        }
      }
    })

    if(!data) {
      console.log('There is no any line')
      return error(404000, 'There is no any line', null);
    }

    return output({ data: data })
  } catch (e) {
      console.log(e);
      return error(500000, 'Failed to get the line with a current name', null);
  } 
}

export const getall = async (r) => {
    try {

      const dataArray = await Crud.findAll({
        where: {
          deletedAt: {
            [Op.eq]: null,
          }
        }
      })

      if(!dataArray) {
        console.log('There is no any line')
        return error(404000, 'There is no any line', null);
      }

      return output({ data: dataArray })
    } catch (e) {
        console.log(e);
        return error(500000, 'Failed to get all lines', null);
    } 
}

export const updateLine = async (r) => {
    try {

      const data = await Crud.findOne({
        where: {
          id: r.payload.id
        }
      })

      if(!data) {
        console.log('There is no any line')
        return error(404000, 'There is no any line', null);
      }

      await data.update({
        name: r.payload.name,
        email: r.payload.email,
        password: r.payload.password,
      })

      console.log('Updated successfully')
      return output({ msg: 'Updated successfully' })

    } catch (e) {
        console.log(e);
        return error(500000, 'Failed to get transactions graph', null);
    } 
}

export const deleteLine = async (r) => {
    try {

      const now = moment()
      const formatted = now.format('YYYY-MM-DD HH:mm:ss Z')
      
      const data = await Crud.findOne({
        where: {
          id: r.params.id
        }
      })

      if(!data) {
        console.log('There is no any line')
        return error(404000, 'There is no any line', null);
      }

      data.update({
        deletedAt: formatted,
      })

      console.log('Deleted successfully')
      return output({ msg: 'Deleted successfully' })

    } catch (e) {
        console.log(e);
        return error(500000, 'Failed to get transactions graph', null);
    } 
}
