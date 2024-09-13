const Adapters = require("../adapters");

const instance = Adapters.getSQLAdapter();

module.exports = {
  get: async () => {
    return await instance.execute("panorama.get", "SELECT * FROM public.session");
  },
};
