<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import OAMContainer from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMContainer';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'OAMContainers',
  components: {
    ArrayListGrouped,
    OAMContainer,
  },
  mixins: [ContainerizedWorkloadHelper],
  props:  {
    // parent object (e.g., ContainerizedWorkload spec)
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create',
    },
    namespacedObject: {
      type:     Object,
      required: true
    },
  },
  data() {
    const containers = (this.value.containers || []).map((container) => {
      const newContainer = this.clone(container);

      newContainer._id = randomStr(4);

      return newContainer;
    });

    return { containers };
  },
  computed: {
    showContainerRemoveButton() {
      return !this.isView && Array.isArray(this.containers) && this.containers.length > 0;
    },
  },
  methods: {
    update() {
      const containers = [];

      this.containers.forEach((container) => {
        const newContainer = this.clone(container);

        delete newContainer._id;

        containers.push(newContainer);
      });

      this.setFieldIfNotEmpty('containers', containers);
    },
    addContainer() {
      this.containers.push({ _id: randomStr(4) });
    },
    removeContainer(index) {
      this.containers.splice(index, 1);

      this.queueUpdate();
    },
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <ArrayListGrouped
    v-model="containers"
    :mode="mode"
    :default-add-value="{ }"
    :add-label="t('verrazzano.common.buttons.addContainer')"
    @add="addContainer()"
  >
    <template #remove-button="removeProps">
      <button
        v-if="showContainerRemoveButton"
        type="button"
        class="btn role-link close btn-sm"
        @click="removeContainer(removeProps.i)"
      >
        <i class="icon icon-2x icon-x" />
      </button>
      <span v-else />
    </template>
    <template #default="props">
      <OAMContainer
        v-model="props.row.value"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="queueUpdate"
      />
    </template>
  </ArrayListGrouped>
</template>

<style scoped>

</style>
