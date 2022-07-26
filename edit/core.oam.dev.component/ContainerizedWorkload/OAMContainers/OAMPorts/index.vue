<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import OAMPort from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMPorts/OAMPort';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'OAMPorts',
  components: {
    ArrayListGrouped,
    OAMPort,
  },
  mixins: [ContainerizedWorkloadHelper],
  props:  {
    // parent object (e.g., OAM Container)
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create',
    },
  },
  data() {
    const ports = (this.value.config || []).map((port) => {
      const newPort = this.clone(port);

      newPort._id = randomStr(4);

      return newPort;
    });

    return { ports };
  },
  computed: {
    showPortRemoveButton() {
      return !this.isView && Array.isArray(this.ports) && this.ports.length > 0;
    },
  },
  methods: {
    update() {
      const ports = [];

      this.ports.forEach((port) => {
        const newPort = this.clone(port);

        delete newPort._id;

        ports.push(newPort);
      });

      this.setFieldIfNotEmpty('ports', ports);
    },
    addPort() {
      this.ports.push({ _id: randomStr(4) });
    },
    removePort(index) {
      this.ports.splice(index, 1);

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
    v-model="ports"
    :mode="mode"
    :default-add-value="{ }"
    :add-label="t('verrazzano.containerized.buttons.addPort')"
    @add="addPort()"
  >
    <template #remove-button="removeProps">
      <button
        v-if="showPortRemoveButton"
        type="button"
        class="btn role-link close btn-sm"
        @click="removePort(removeProps.i)"
      >
        <i class="icon icon-2x icon-x" />
      </button>
      <span v-else />
    </template>
    <template #default="props">
      <OAMPort
        v-model="props.row.value"
        :mode="mode"
      />
    </template>
  </ArrayListGrouped>
</template>

<style scoped>

</style>
