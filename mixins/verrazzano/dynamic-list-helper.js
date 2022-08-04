// Added by Verrazzano

import { isEmpty } from '@/utils/object';
import { randomStr } from '~/utils/string';
import debounce from 'lodash/debounce';
import CreateEditView from '~/mixins/create-edit-view';

export default {
  inject: ['selectTab'],
  mixins: [CreateEditView],

  data() {
    let list;
    let dynamicListHelperRootType;
    const valueType = typeof this.value;

    if ((valueType === 'object' || valueType === 'undefined') && typeof this.getRootFieldName === 'function') {
      const rootFieldName = this.getRootFieldName();

      list = this.value[rootFieldName] || [];
      dynamicListHelperRootType = 'object';
    } else if (Array.isArray(this.value) || (valueType === 'undefined' && typeof this.getRootFieldName === 'undefined')) {
      list = this.value || [];
      dynamicListHelperRootType = 'array';
    } else {
      // eslint-disable-next-line no-console
      console.error('dynamic-list-helper could not find the list for value: ', JSON.stringify(this.value));
      throw new Error(`dynamic-list-helper could not find the list for value: ${ JSON.stringify(this.value) }`);
    }

    // create a copy of the config list with an ID in each element
    const dynamicListChildren = list.map((child) => {
      const newChild = this.clone(child);

      newChild._id = randomStr(4);

      return newChild;
    });

    return {
      dynamicListChildren,
      dynamicListHelperRootType,
    };
  },
  computed: {
    // TODO - delete me once everyone is using dynamicListChildren.
    children: {
      get() {
        return this.dynamicListChildren;
      },
      set(neu) {
        this.dynamicListChildren = neu;
      }
    },
  },
  methods: {
    update() {
      // create a config list from the local copy, removing the ID from each

      const children = [];

      this.dynamicListChildren.forEach((child) => {
        const newChild = this.clone(child);

        delete newChild._id;

        children.push(newChild);
      });

      if (this.dynamicListHelperRootType === 'object') {
        const rootFieldName = this.getRootFieldName();

        this.setFieldIfNotEmpty(rootFieldName, children);
      } else {
        this.$emit('input', children);
      }
    },
    dynamicListAddChild(child = {}) {
      this.dynamicListChildren.push({ _id: randomStr(4), ...child });

      if (!isEmpty(child)) {
        this.queueUpdate();
      }

      if (typeof this.getChildNavKey === 'function') {
        this.selectTab(this.getChildNavKey(child));
      }
    },
    dynamicListDeleteChild(childToDelete) {
      const index = this.dynamicListChildren.findIndex(child => child._id === childToDelete._id);

      if (index !== -1) {
        this.dynamicListChildren.splice(index, 1);
        this.queueUpdate();
      }
    },
    dynamicListDeleteChildByIndex(index) {
      this.dynamicListChildren.splice(index, 1);
      this.queueUpdate();
    },
    dynamicListClearChildrenList() {
      this.dynamicListChildren.splice(0, this.dynamicListChildren.length);
      this.queueUpdate();
    },
    dynamicListUpdate() {
      this.queueUpdate();
    },
    // TODO delete these once everyone is using the renamed methods.
    addChild(child = {}) {
      this.dynamicListAddChild(child);
    },
    deleteChild(childToDelete) {
      this.dynamicListDeleteChild(childToDelete);
    }
  },

  created() {
    this.queueUpdate = debounce(this.update, 500);
  }
};
