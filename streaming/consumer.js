let cache;

const rehydrate = async () => {
    try {
        const roots = await cache.getJson('roots');
        console.info(roots);
    } catch (e) {
        console.error(`Error ao rehydrate data: ${JSON.stringify(e)}`);
    }
}

const startListening = async () => {
    cache = Adapters.getCacheAdapter();

    await rehydrate();
    await cache.connectSubscriber();
    cache.onUpdate((key, value) => {
        try {
            console.info(key, value);
        } catch (e) {
            console.error(`Erro ao consumir dados: ${JSON.stringify(e)}`);
        }
    })
}

module.exports = startListening