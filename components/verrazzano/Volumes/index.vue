<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import Volume from '@/components/verrazzano/Volumes/Volume';

export default {
  name:       'Volumes',
  components: {
    ArrayListGrouped,
    Volume,
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
    namespacedObject: {
      type:     Object,
      required: true
    }
  },
};
</script>

<template>
  <div>
    <ArrayListGrouped
      v-model="value.volumes"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.config.buttons.addVolume')"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton('volumes')"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeProps.remove"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <Volume
          v-model="props.row.value"
          :mode="mode"
          :namespaced-object="namespacedObject"
        />
      </template>
    </ArrayListGrouped>
  </div>
</template>

<style scoped>

</style>
