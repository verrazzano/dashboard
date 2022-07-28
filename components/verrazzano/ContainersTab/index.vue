<script>
// Added by Verrazzano
import ContainerTab from '@/components/verrazzano/ContainersTab/ContainerTab';
import LabeledInput from '@/components/form/LabeledInput';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'ContainersTab',
  components: {
    ContainerTab,
    LabeledInput,
    TreeTab,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      // parent object (e.g., pod spec)
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    rootFieldName: {
      type:    String,
      default: 'containers'
    },
    addButtonLabel: {
      type:    String,
      default: ''
    },
    useEphemeralContainers: {
      type:    Boolean,
      default: false
    },
    namespacedObject: {
      type:     Object,
      required: true
    },
    tabName: {
      type:    String,
      default: ''
    },
    tabLabel: {
      type:    String,
      default: ''
    },
  },
  data() {
    // eslint-disable-next-line no-console
    console.log(`XXXXXX ContainersTab data() for ${ this.rootFieldName } received value: `, JSON.stringify(this.value, null, 2));

    const containers = (this.value[this.rootFieldName] || []).map((container) => {
      const newContainer = this.clone(container);

      newContainer._id = randomStr(4);

      return newContainer;
    });

    // eslint-disable-next-line no-console
    console.log(`XXXXXX ContainersTab data() for ${ this.rootFieldName } created containers: `, JSON.stringify(containers, null, 2));

    return {
      treeTabName:  this.tabName || 'containers',
      treeTabLabel: this.tabLabel,
      addLabel:     this.addButtonLabel || '',
      newName:      '',
      containers,
    };
  },
  methods: {
    update() {
      const containers = [];

      this.containers.forEach((container) => {
        const newContainer = this.clone(container);

        delete newContainer._id;

        containers.push(newContainer);
      });

      // eslint-disable-next-line no-console
      console.log(`XXXXXX ContainersTab update() for ${ this.rootFieldName } setting containers: `, JSON.stringify(containers, null, 2));
      this.setFieldIfNotEmpty(this.rootFieldName, containers);
    },
    addContainer() {
      if (this.newName) {
        this.containers.push({ _id: randomStr(4), name: this.newName });
        this.newName = '';

        this.queueUpdate();
      }
    },
    removeContainer(index) {
      this.containers.splice(index, 1);

      this.queueUpdate();
    },
    updateContainer(neu) {
      const index = this.containers.findIndex(container => container._id === neu._id);

      console.log(`XXXXXX ContainersTab updateContainer() found index ${ index }`);

      if (index !== -1) {
        this.containers[index] = neu;
        this.queueUpdate();
      }
    },
    containerKey(container) {
      return this.createTabKey(this.tabName, container.name);
    },
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.containers');
    }

    if (!this.addLabel) {
      this.addLabel = this.t('verrazzano.common.buttons.addContainer');
    }

    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #default>
      <div class="row">
        <div class="col span-4">
          <LabeledInput
            v-model="newName"
            :mode="mode"
            :label="t('verrazzano.common.fields.newContainerName')"
          />
        </div>
        <div class="col span-4">
          <button
            type="button"
            class="btn role-tertiary add"
            data-testid="add-item"
            :disabled="isView"
            @click="addContainer()"
          >
            {{ t('verrazzano.common.buttons.addContainer') }}
          </button>
        </div>
      </div>
    </template>
    <template #nestedTabs>
      <ContainerTab
        v-for="(container, idx) in containers"
        :key="container._id"
        v-model="containers[idx]"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-label="container.name"
        :tab-name="containerKey(container)"
        @input="queueUpdate()"
      />
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
