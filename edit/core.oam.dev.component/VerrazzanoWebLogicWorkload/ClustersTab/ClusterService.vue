<script>
// Added by Verrazzano
import KeyValue from '@/components/form/KeyValue';
import LabeledSelect from '@/components/form/LabeledSelect';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'ClusterService',
  components: {
    KeyValue,
    LabeledSelect,
  },
  mixins: [WeblogicWorkloadHelper],
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
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledSelect
          :value="getField('sessionAffinity')"
          :mode="mode"
          :options="sessionAffinityOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.common.fields.sessionAffinity')"
          @input="setField('sessionAffinity', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <KeyValue
          :value="getField('labels')"
          :mode="mode"
          :title="t('verrazzano.common.titles.labels')"
          :add-label="t('verrazzano.common.buttons.addLabel')"
          @input="setFieldIfNotEmpty('labels', $event)"
        />
      </div>
      <div class="col span-6">
        <KeyValue
          :value="getField('annotations')"
          :mode="mode"
          :title="t('verrazzano.common.titles.annotations')"
          :add-label="t('verrazzano.common.buttons.addAnnotation')"
          @input="setFieldIfNotEmpty('annotations', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
