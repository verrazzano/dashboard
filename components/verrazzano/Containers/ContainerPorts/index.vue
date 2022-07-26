<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import ContainerPort from '@/components/verrazzano/Containers/ContainerPorts/ContainerPort';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ContainerPorts',
  components: {
    ArrayListGrouped,
    ContainerPort,
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
      v-model="value.ports"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.config.buttons.addPort')"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton('ports')"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeProps.remove"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <ContainerPort
          v-model="props.row.value"
          :mode="mode"
        />
      </template>
    </ArrayListGrouped>
  </div>
</template>

<style scoped>

</style>
