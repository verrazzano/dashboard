<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import VolumeDevice from '@/components/verrazzano/VolumeDevices/VolumeDevice';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'VolumeDevices',
  components: {
    ArrayListGrouped,
    VolumeDevice,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      // parent object (e.g., container spec)
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
  },
  data() {
    const volumeDevices = (this.value.volumeDevices || []).map((volumeDevice) => {
      const newVolumeDevice = this.clone(volumeDevice);

      newVolumeDevice._id = randomStr(4);

      return newVolumeDevice;
    });

    return { volumeDevices };
  },
  methods: {
    update() {
      const volumeDevices = [];

      this.volumeDevices.forEach((volumeDevice) => {
        const newVolumeDevice = this.clone(volumeDevice);

        delete newVolumeDevice._id;

        volumeDevices.push(newVolumeDevice);
      });

      this.setFieldIfNotEmpty('volumeDevices', volumeDevices);
    },
    addVolumeDevice() {
      this.volumeDevices.push({ _id: randomStr(4) });
    },
    removeVolumeDevice(index) {
      this.volumeDevices.splice(index, 1);
      this.queueUpdate();
    },
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <div>
    <ArrayListGrouped
      v-model="volumeDevices"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.common.buttons.addVolumeDevice')"
      @add="addVolumeDevice()"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton('volumeDevices')"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeVolumeDevice(removeProps.i)"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <VolumeDevice
          :value="props.row.value"
          :mode="mode"
          @input="queueUpdate"
        />
      </template>
    </ArrayListGrouped>
  </div>
</template>

<style scoped>

</style>
