import { getRepository } from 'typeorm';
import { path, pathOr } from 'ramda';
import { Order } from '../../../entity/Order';

module.exports = async (job) => {
    console.log('[sample.hard]');
    console.log('[sample.hard]   job.data ', job.data);
    const args = job.data;
    const rand = Math.random().toString(8);
    const order = await getRepository(Order).findOne({
        order: {updated_at: "DESC"}
    });
    return {args: JSON.stringify(args), rand, order};
};
