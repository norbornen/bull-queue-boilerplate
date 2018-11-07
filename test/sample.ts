import 'mocha';
import { createConnection } from 'typeorm';
import * as Queue from '../../src/queue/Queue';
import * as Worker from '../../src/queue/Worker';

describe('Sample queue job', () => {
    let queue;
    let worker;
    // let testJob;
    before(async () => {
        await createConnection(); console.info('make connect');
        queue = Queue.create(); console.info('queue ready');
        worker = await Worker.create(); console.info('worker ready');
    });
    after((done) => {
        if (queue) {
            queue.close();
        }
        if (worker) {
            worker.close();
        }
        done();
        console.log('done!');
    });

    it('Sample Job', async () => {
        const testJob = await queue.add('sample.hard', {value: new Date()}, {removeOnComplete: true});
        console.log(`Job id=${testJob.id} was created`);

        const testJobResult = await testJob.finished();
        console.log(`Job id=${testJob.id} result=${JSON.stringify(testJobResult)}`);
    });
});
