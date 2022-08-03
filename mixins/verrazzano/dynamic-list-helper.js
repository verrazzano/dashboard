// Added by Verrazzano

import { isEmpty } from '@/utils/object';
import { randomStr } from '~/utils/string';
import debounce from 'lodash/debounce';
import CreateEditView from '~/mixins/create-edit-view';

export default {
  mixins: [CreateEditView],

  data() {
    const rootFieldName = this.getRootFieldName();

    // create a copy of the config list with an ID in each element
    const children = (this.value[rootFieldName] || []).map((child) => {
      const newChild = this.clone(child);

      newChild._id = randomStr(4);

      return newChild;
    });

    return { children };
  },

  methods: {
    update() {
      // create a config list from the local copy, removing the ID from each

      const rootFieldName = this.getRootFieldName();
      const children = [];

      this.children.forEach((child) => {
        const newChild = this.clone(child);

        delete newChild._id;

        children.push(newChild);
      });

      this.setFieldIfNotEmpty(rootFieldName, children);
    },
    addChild(child) {
      this.children.push({ _id: randomStr(4), ...child });

      if (!isEmpty(child)) {
        this.queueUpdate();
      }
    },
    deleteChild(childToDelete) {
      const index = this.children.findIndex(child => child._id === childToDelete._id);

      if (index !== -1) {
        this.children.splice(index, 1);
        this.queueUpdate();
      }
    },
  },

  created() {
    this.queueUpdate = debounce(this.update, 500);
  }
};
