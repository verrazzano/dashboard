<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import OAMVolume
  from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMResources/OAMVolumes/OAMVolume';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'OAMVolumes',
  components: {
    ArrayListGrouped,
    OAMVolume,
  },
  mixins: [ContainerizedWorkloadHelper],
  props:  {
    value: {
      // parent object (e.g., OAM Resources object)
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create',
    },
  },
  data() {
    const volumes = (this.value.volumes || []).map((volume) => {
      const newVolume = this.clone(volume);

      newVolume._id = randomStr(4);

      return newVolume;
    });

    return { volumes };
  },
  computed: {
    showVolumeRemoveButton() {
      return !this.isView && Array.isArray(this.volumes) && this.volumes.length > 0;
    },
  },
  methods: {
    update() {
      const volumes = [];

      this.volumes.forEach((volume) => {
        const newVolume = this.clone(volume);

        delete newVolume._id;

        volumes.push(newVolume);
      });

      this.setFieldIfNotEmpty('volumes', volumes);
    },
    addVolume() {
      this.volumes.push({ _id: randomStr(4) });
    },
    removeVolume(index) {
      this.volumes.splice(index, 1);

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
    v-model="volumes"
    :mode="mode"
    :default-add-value="{ }"
    :add-label="t('verrazzano.containerized.buttons.addVolume')"
    @add="addVolume()"
  >
    <template #remove-button="removeProps">
      <button
        v-if="showVolumeRemoveButton"
        type="button"
        class="btn role-link close btn-sm"
        @click="removeVolume(removeProps.i)"
      >
        <i class="icon icon-2x icon-x" />
      </button>
      <span v-else />
    </template>
    <template #default="props">
      <OAMVolume
        v-model="props.row.value"
        :mode="mode"
      />
    </template>
  </ArrayListGrouped>
</template>

<style scoped>

</style>
