import 'mocha';
import * as Queue from '../../src/queue/Queue';

describe('Sample queue job', () => {
    let queue;
    before(async () => {
        queue = Queue.create(); console.info('queue ready');
    });
    after(async () => {
        if (queue) {
            await queue.close();
            console.info('queue done');
        }
        console.log('done!');
    });

    it('Sample Job With External Worker', async () => {
        const testJob = await queue.add('sample.hard', {value: new Date()}, {removeOnComplete: true});
        console.log(`Job id=${testJob.id} was created`);

        const testJobResult = await testJob.finished();
        console.log(`Job id=${testJob.id} result=${JSON.stringify(testJobResult)}`);
    });
});
