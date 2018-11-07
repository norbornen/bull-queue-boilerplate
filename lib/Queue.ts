import * as config from "config";
import * as Queue from "bull";
import * as pSettle from "p-settle";

const QUEUES = new Map();

export function create(name: string = config.get('queue.default')) {
    const prefix = config.get('queue.prefix');
    const queue = new Queue(name, {prefix});
    QUEUES.set(name, queue);
    return queue;
}

export function get(name: string = config.get('queue.default')) {
    return QUEUES.get(name) || module.exports.create(name);
}

process.on('SIGINT', () => {
    console.info('[Q]   terminate queues...');
    pSettle(Array.from(QUEUES.entries()).map(([name, q]) => q.close));
});
