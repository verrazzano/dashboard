<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import VolumeMount from '@/components/verrazzano/VolumeMounts/VolumeMount';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'VolumeMounts',
  components: {
    ArrayListGrouped,
    VolumeMount,
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
    const volumeMounts = (this.value.volumeMounts || []).map((volumeMount) => {
      const newVolumeMount = this.clone(volumeMount);

      newVolumeMount._id = randomStr(4);

      return newVolumeMount;
    });

    return { volumeMounts };
  },
  methods: {
    update() {
      const volumeMounts = [];

      this.volumeMounts.forEach((volumeMount) => {
        const newVolumeMount = this.clone(volumeMount);

        delete newVolumeMount._id;

        volumeMounts.push(newVolumeMount);
      });

      this.setFieldIfNotEmpty('volumeMounts', volumeMounts);
    },
    addVolumeMount() {
      this.volumeMounts.push({ _id: randomStr(4) });
    },
    removeVolumeMount(index) {
      this.volumeMounts.splice(index, 1);
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
      :value="volumeMounts"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.common.buttons.addVolumeMount')"
      @add="addVolumeMount()"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton('volumeMounts')"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeVolumeMount(removeProps.i)"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <VolumeMount
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
