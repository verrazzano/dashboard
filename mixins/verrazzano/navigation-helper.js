// Added by Verrazzano
export default {
  methods: {

    // join two names with an underscore to create a key.
    // if the first name is empty, just return the second.
    createTabKey(prefix, pageName) {
      let result = pageName;

      if (prefix) {
        result = `${ prefix }_${ pageName }`;
      }

      return result;
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
