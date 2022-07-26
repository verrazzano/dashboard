<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import OAMConfigFile
  from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMConfigFiles/OAMConfigFile';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'OAMConfigFiles',
  components: {
    ArrayListGrouped,
    OAMConfigFile,
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
    const configFiles = (this.value.config || []).map((configFile) => {
      const newConfigFile = this.clone(configFile);

      newConfigFile._id = randomStr(4);

      return newConfigFile;
    });

    return { configFiles };
  },
  computed: {
    showConfigFileRemoveButton() {
      return !this.isView && Array.isArray(this.configFiles) && this.configFiles.length > 0;
    },
  },
  methods: {
    update() {
      const configFiles = [];

      this.configFiles.forEach((configFile) => {
        const newConfigFile = this.clone(configFile);

        delete newConfigFile._id;

        configFiles.push(newConfigFile);
      });

      this.setFieldIfNotEmpty('config', configFiles);
    },
    addConfigFile() {
      this.configFiles.push({ _id: randomStr(4) });
    },
    removeConfigFile(index) {
      this.configFiles.splice(index, 1);

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
    v-model="configFiles"
    :mode="mode"
    :default-add-value="{ }"
    :add-label="t('verrazzano.containerized.buttons.addConfigFile')"
    @add="addConfigFile()"
  >
    <template #remove-button="removeProps">
      <button
        v-if="showConfigFileRemoveButton"
        type="button"
        class="btn role-link close btn-sm"
        @click="removeConfigFile(removeProps.i)"
      >
        <i class="icon icon-2x icon-x" />
      </button>
      <span v-else />
    </template>
    <template #default="props">
      <OAMConfigFile
        v-model="props.row.value"
        :mode="mode"
      />
    </template>
  </ArrayListGrouped>
</template>

<style scoped>

</style>
