<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import Toleration from '@/components/verrazzano/Tolerations/Toleration';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'Tolerations',
  components: {
    ArrayListGrouped,
    Toleration,
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
    }
  },
};
</script>

<template>
  <div>
    <ArrayListGrouped
      v-model="value.tolerations"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.config.buttons.addToleration')"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton('tolerations')"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeProps.remove"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <Toleration
          v-model="props.row.value"
          :mode="mode"
        />
      </template>
    </ArrayListGrouped>
  </div>
</template>

<style scoped>

</style>
