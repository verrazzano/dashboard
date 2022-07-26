<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';

export default {
  name:       'VolumeClaimTemplateMetadata',
  components: {
    KeyValue,
    LabeledInput,
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
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('name')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'metadata.name')"
          :label="t('verrazzano.coherence.fields.volumeClaimTemplate.name')"
          @input="setFieldIfNotEmpty('name', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <h3>{{ t('verrazzano.common.titles.labels') }}</h3>
    <div class="row">
      <div class="col span-12">
        <KeyValue
          :value="getField('labels')"
          :mode="mode"
          :add-label="t('verrazzano.common.buttons.addLabel')"
          :read-allowed="false"
          @input="setFieldIfNotEmpty('labels', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <h3>{{ t('verrazzano.common.titles.annotations') }}</h3>
    <div class="row">
      <div class="col span-12">
        <KeyValue
          :value="getField('annotations')"
          :mode="mode"
          :add-label="t('verrazzano.common.buttons.addAnnotation')"
          :read-allowed="false"
          @input="setFieldIfNotEmpty('annotations', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
