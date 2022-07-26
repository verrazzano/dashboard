<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledSelect from '@/components/form/LabeledSelect';

export default {
  name:       'JVMGarbageCollectorSpec',
  components: {
    Checkbox,
    LabeledArrayList,
    LabeledSelect,
  },
  mixins: [CoherenceWorkloadHelper],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
  },
  computed: {
    collectors() {
      return [
        { value: 'Default', label: this.t('verrazzano.coherence.types.gcTypes.default') },
        { value: 'G1', label: this.t('verrazzano.coherence.types.gcTypes.g1') },
        { value: 'CMS', label: this.t('verrazzano.coherence.types.gcTypes.cms') },
        { value: 'Parallel', label: this.t('verrazzano.coherence.types.gcTypes.parallel') },
      ];
    }
  }
};
</script>

<template>
  <div class="row">
    <div class="col span-4">
      <div class="spacer-small" />
      <Checkbox
        :value="getField('logging')"
        :mode="mode"
        :label="t('verrazzano.coherence.fields.gcLogging')"
        @input="setBooleanField('logging', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledSelect
        :value="getField('collector')"
        :mode="mode"
        :options="collectors"
        option-key="value"
        option-label="label"
        :placeholder="getNotSetPlaceholder(value, 'collector')"
        :label="t('verrazzano.coherence.fields.garbageCollector')"
        @input="setFieldIfNotEmpty('collector', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledArrayList
        :value="getListField('args')"
        :mode="mode"
        :value-label="t('verrazzano.coherence.fields.garbageCollectorArg')"
        :add-label="t('verrazzano.coherence.buttons.addGarbageCollectorArg')"
        @input="setFieldIfNotEmpty('args', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
