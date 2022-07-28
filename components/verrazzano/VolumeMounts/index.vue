<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import VolumeMount from '@/components/verrazzano/VolumeMounts/VolumeMount';

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
};
</script>

<template>
  <div>
    <ArrayListGrouped
      v-model="value.volumeMounts"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.common.buttons.addVolumeMount')"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton('volumeMounts')"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeProps.remove"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <VolumeMount
          v-model="props.row.value"
          :mode="mode"
        />
      </template>
    </ArrayListGrouped>
  </div>
</template>

<style scoped>

</style>
