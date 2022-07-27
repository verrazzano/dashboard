<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import KeyValue from '@/components/form/KeyValue';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'ServerService',
  components: {
    Checkbox,
    KeyValue,
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
      <Checkbox
        :value="getField('precreateService')"
        :mode="mode"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.precreateService')"
        @input="setBooleanField('precreateService', $event)"
      />
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
