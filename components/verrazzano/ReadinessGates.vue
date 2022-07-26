<script>
// Added by Verrazzano
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import debounce from 'lodash/debounce';

export default {
  name:       'ReadinessGates',
  components: { LabeledArrayList },
  mixins:     [VerrazzanoHelper],
  props:      {
    value: {
      type:    Array,
      default: () => ([])
    },
    mode: {
      type:    String,
      default: 'create'
    }
  },
  data() {
    const conditionTypes = [];

    this.value.forEach((readinessGate) => {
      conditionTypes.push(readinessGate.conditionType);
    });

    return { conditionTypes };
  },
  methods: {
    update() {
      const readinessGates = [];

      this.conditionTypes.forEach((conditionType) => {
        readinessGates.push({ conditionType });
      });

      this.$emit('input', readinessGates);
    },
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  }
};
</script>

<template>
  <div>
    <LabeledArrayList
      v-model="conditionTypes"
      :mode="mode"
      :value-label="t('verrazzano.config.fields.readinessGates.conditionType')"
      :add-label="t('verrazzano.config.buttons.addReadinessGate')"
      @input="queueUpdate"
    />
  </div>
</template>

<style scoped>

</style>
