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

    // ensure that the list has been established, then add the specified node.
    addConfigNode(parentNode, key, configNode) {
      if (typeof parentNode[key] === 'undefined') {
        this.$set(parentNode, key, []);
      }

      parentNode[key].push(configNode);
    },

    // remove the specified element from the list, and remove the list if it is empty.
    deleteConfigNode(parentNode, key, configNode) {
      const index = parentNode[key].indexOf(configNode);

      parentNode[key].splice(index, 1);

      if (!parentNode[key].length) {
        this.$delete(parentNode, key);
      }
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
