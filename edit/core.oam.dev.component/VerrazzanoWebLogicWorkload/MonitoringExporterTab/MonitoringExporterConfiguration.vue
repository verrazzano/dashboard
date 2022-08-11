<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'MonitoringExporterConfiguration',
  components: { Checkbox },
  mixins:     [WeblogicWorkloadHelper],
  props:      {
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
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('metricsNameSnakeCase')"
          :mode="mode"
          :label="t('verrazzano.weblogic.fields.monitoringExporter.metricsNameSnakeCase')"
          @input="setBooleanField('metricsNameSnakeCase', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('domainQualifier')"
          :mode="mode"
          :label="t('verrazzano.weblogic.fields.monitoringExporter.domainQualifier')"
          @input="setBooleanField('domainQualifier', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <p>{{ t('verrazzano.weblogic.fields.monitoringExporter.queries') }}</p>
  </div>
</template>

<style scoped>
  @import "../../verrazzano-styles.css";
</style>
