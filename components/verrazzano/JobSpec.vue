<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import PodAffinityTerm from '@/components/verrazzano/PodAffinityTerm';
import PodTemplate from '@/components/verrazzano/PodTemplate';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'JobSpec',
  components: {
    Checkbox,
    LabeledInput,
    PodAffinityTerm,
    PodTemplate,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
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
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('activeDeadlineSeconds')"
          :mode="mode"
          type="Number"
          min="0"
          :placeholder="getNotSetPlaceholder(value, 'activeDeadlineSeconds')"
          :label="t('verrazzano.common.fields.jobSpec.activeDeadlineSeconds')"
          @input="setNumberField('activeDeadlineSeconds', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('backoffLimit')"
          :mode="mode"
          type="Number"
          min="0"
          :placeholder="getNotSetPlaceholder(value, 'backoffLimit')"
          :label="t('verrazzano.common.fields.jobSpec.backoffLimit')"
          @input="setNumberField('backoffLimit', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('completions')"
          :mode="mode"
          type="Number"
          min="0"
          :placeholder="getNotSetPlaceholder(value, 'completions')"
          :label="t('verrazzano.common.fields.jobSpec.completions')"
          @input="setNumberField('completions', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <div class="spacer-small" />
        <Checkbox
          :value="getField('manualSelector')"
          :mode="mode"
          :label="t('verrazzano.common.fields.jobSpec.manualSelector')"
          @input="setBooleanField('manualSelector', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('parallelism')"
          :mode="mode"
          type="Number"
          min="0"
          :placeholder="getNotSetPlaceholder(value, 'parallelism')"
          :label="t('verrazzano.common.fields.jobSpec.parallelism')"
          @input="setNumberField('parallelism', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('ttlSecondsAfterFinished')"
          :mode="mode"
          type="Number"
          min="0"
          :placeholder="getNotSetPlaceholder(value, 'ttlSecondsAfterFinished')"
          :label="t('verrazzano.common.fields.jobSpec.ttlSecondsAfterFinished')"
          @input="setNumberField('ttlSecondsAfterFinished', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h4>{{ t('verrazzano.common.titles.labelSelector') }}</h4>
      <PodAffinityTerm
        :value="getField('selector')"
        :mode="mode"
        @input="setFieldIfNotEmpty('selector', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h4>{{ t('verrazzano.common.titles.podTemplate') }}</h4>
      <PodTemplate
        :value="getField('template')"
        :mode="mode"
        @input="setFieldIfNotEmpty('template', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
