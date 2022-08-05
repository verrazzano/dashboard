// Added by Verrazzano
export default {
  methods: {

    // join multiple names with an underscore to create a key.
    // if the any name is empty, just skip it.
    createTabName(...args) {
      const scrubbedArgs = args.filter(arg => !!arg);

      return scrubbedArgs.join('_');
    },

    // find a key value for a new nodes entry that hasn't been used.
    // if the nodes list is empty or not established, just return the prefix.
    getNextName(nodes, key, prefix) {
      const usedNames = [];
      let nextName = prefix;

      if (typeof nodes !== 'undefined') {
        nodes.forEach((node) => {
          usedNames.push(node[key]);
        });

        let index = 0;

        while (usedNames.includes(nextName)) {
          index++;
          nextName = `${ prefix }-${ index }`;
        }
      }

      return nextName;
    },
  }
};
