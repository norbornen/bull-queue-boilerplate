import * as path from "path";
import * as glob from "glob";
import * as config from "config";
import * as pSettle from "p-settle";
import * as Queue from './Queue';

const QUEUES = new Map();

export async function create(name?: string) {
    const queue = Queue.get(name);
    QUEUES.set(queue.name, queue);

    const processors = await getProcessors();
    processors.forEach(({processor_name, processor}) => queue.process(processor_name, require(processor)));

    return queue;
}

async function getProcessors(): Promise<Array<{processor: string, processor_name: string}>> {
    const dir = path.join(__dirname, 'processor');
    const files = await new Promise<string[]>((resolve, reject) => {
        glob(path.join(dir, '**/*.ts'), (err, x) => {
            if (err) {
                return reject(err);
            }
            resolve(x);
        });
    });
    const processors = files.map((x) => {
        const name = x.replace(dir, '').replace(/^\//, '').split('/');
        name[name.length - 1] = name[name.length - 1].replace(/\.[jt]s$/, '');
        if (name[name.length - 1] === 'index') {
            name.pop();
        }
        return {processor: x, processor_name: name.join('.')};
    });
    return processors;
}

process.on('SIGINT', () => {
    console.info('[W]   terminate queues...');
    pSettle(Array.from(QUEUES.entries()).map(([name, q]) => q.close));
});
