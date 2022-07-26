<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import MonitoringExporterConfiguration
  from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/MonitoringExporter/MonitoringExporterConfiguration';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'MonitoringExporter',
  components: {
    LabeledInput,
    LabeledSelect,
    MonitoringExporterConfiguration,
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
      <div class="col span-6">
        <LabeledInput
          :value="getField('image')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.monitoringExporter.image')"
          @input="setFieldIfNotEmpty('image', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('imagePullPolicy')"
          :mode="mode"
          :options="imagePullPolicyOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.monitoringExporter.imagePullPolicy')"
          @input="setField('imagePullPolicy', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('port')"
          :mode="mode"
          type="Number"
          :min="minPortNumber"
          :max="maxPortNumber"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.monitoringExporter.port')"
          @input="setNumberField('image', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.monitoringExporter.configuration') }}</h4>
      <MonitoringExporterConfiguration
        :value="getField('configuration')"
        :mode="mode"
        @input="setFieldIfNotEmpty('configuration', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
