<script>
// Added by Verrazzano
import KeyValue from '@/components/form/KeyValue';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'VolumeClaimTemplateMetadata',
  components: { KeyValue },
  mixins:     [VerrazzanoHelper],
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
    <h4>{{ t('verrazzano.config.titles.volumes.ephemeral.metadata') }}</h4>
    <div class="row">
      <div class="col span-6">
        <KeyValue
          :value="getField('labels')"
          :mode="mode"
          :add-label="t('verrazzano.config.buttons.addLabel')"
          @input="setFieldIfNotEmpty('labels', $event)"
        />
      </div>
      <div class="col span-6">
        <KeyValue
          :value="getField('annotations')"
          :mode="mode"
          :add-label="t('verrazzano.config.buttons.addAnnotation')"
          @input="setFieldIfNotEmpty('annotations', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
