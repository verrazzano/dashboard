<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import OAMEnvironmentVariable
  from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMEnvironmentVariables/OAMEnvironmentVariable';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'OAMEnvironmentVariables',
  components: {
    ArrayListGrouped,
    OAMEnvironmentVariable,
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
    const envVars = (this.value.env || []).map((envVar) => {
      const newEnvVar = this.clone(envVar);

      newEnvVar._id = randomStr(4);

      return newEnvVar;
    });

    return { envVars };
  },
  computed: {
    showEnvVarRemoveButton() {
      return !this.isView && Array.isArray(this.envVars) && this.envVars.length > 0;
    },
  },
  methods: {
    update() {
      const envVars = [];

      this.envVars.forEach((envVar) => {
        const newEnvVar = this.clone(envVar);

        delete newEnvVar._id;

        envVars.push(newEnvVar);
      });

      this.setFieldIfNotEmpty('env', envVars);
    },
    addEnvVar() {
      this.envVars.push({ _id: randomStr(4) });
    },
    removeEnvVar(index) {
      this.envVars.splice(index, 1);

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
    v-model="envVars"
    :mode="mode"
    :default-add-value="{ }"
    :add-label="t('verrazzano.common.buttons.addEnvVar')"
    @add="addEnvVar()"
  >
    <template #remove-button="removeProps">
      <button
        v-if="showEnvVarRemoveButton"
        type="button"
        class="btn role-link close btn-sm"
        @click="removeEnvVar(removeProps.i)"
      >
        <i class="icon icon-2x icon-x" />
      </button>
      <span v-else />
    </template>
    <template #default="props">
      <OAMEnvironmentVariable
        v-model="props.row.value"
        :mode="mode"
      />
    </template>
  </ArrayListGrouped>
</template>

<style scoped>

</style>
