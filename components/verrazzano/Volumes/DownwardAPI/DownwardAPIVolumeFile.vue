<script>
// Added by Verrazzano
import FieldRef from '@/components/verrazzano/Volumes/DownwardAPI/FieldRef';
import LabeledInput from '@/components/form/LabeledInput';
import ResourceFieldRef from '@/components/verrazzano/Volumes/DownwardAPI/ResourceFieldRef';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'DownwardAPIVolumeFile',
  components: {
    FieldRef,
    LabeledInput,
    ResourceFieldRef,
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
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="getField('path')"
          :mode="mode"
          required
          :label="t('verrazzano.config.fields.volumes.downwardApi.path')"
          @input="setField('path', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="getField('mode')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.downwardApi.mode')"
          @input="setNumberField('mode', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.config.titles.volumes.downwardApi.fieldRef') }}</h4>
      <FieldRef
        :value="getField('fieldRef')"
        :mode="mode"
        @input="setFieldIfNotEmpty('fieldRef', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.config.titles.volumes.downwardApi.resourceFieldRef') }}</h4>
      <ResourceFieldRef
        :value="getField('resourceFieldRef')"
        :mode="mode"
        @input="setFieldIfNotEmpty('resourceFieldRef', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
