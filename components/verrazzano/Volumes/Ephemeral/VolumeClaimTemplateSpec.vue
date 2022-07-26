<script>
// Added by Verrazzano
import ContainerResources from '@/components/verrazzano/ContainerResources';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import PodAffinityTerm from '@/components/verrazzano/PodAffinityTerm';
import TypedLocalObjectReference from '@/components/verrazzano/TypedLocalObjectReference';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'VolumeClaimTemplateSpec',
  components: {
    ContainerResources,
    LabeledInput,
    LabeledSelect,
    PodAffinityTerm,
    TypedLocalObjectReference,
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
  computed: {
    accessModes() {
      return [
        { value: 'ReadWriteOnce', label: this.t('verrazzano.common.types.accessModes.rwOnce') },
        { value: 'ReadOnlyMany', label: this.t('verrazzano.common.types.accessModes.roMany') },
        { value: 'ReadWriteMany', label: this.t('verrazzano.common.types.accessModes.rwMany') },
        { value: 'ReadWriteOncePod', label: this.t('verrazzano.ccommon.types.accessModes.rwOncePod') },
      ];
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('volumeName')"
          :mode="mode"
          :label="t('verrazzano.common.fields.volumeName')"
          @input="setField('volumeName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('storageClassName')"
          :mode="mode"
          :label="t('verrazzano.common.fields.storageClassName')"
          @input="setField('storageClassName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('volumeMode')"
          :mode="mode"
          :label="t('verrazzano.common.fields.volumeMode')"
          @input="setField('volumeMode', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledSelect
          :value="getListField('accessModes')"
          :mode="mode"
          :options="accessModes"
          option-key="value"
          option-label="label"
          multiple="true"
          :label="t('verrazzano.common.fields.accessModes')"
          @input="setFieldIfNotEmpty('accessModes', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.dataSource') }}</h4>
      <TypedLocalObjectReference
        :value="getField('dataSource')"
        :mode="mode"
        @input="setFieldIfNotEmpty('dataSource', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.dataSourceRef') }}</h4>
      <TypedLocalObjectReference
        :value="getField('dataSourceRef')"
        :mode="mode"
        @input="setFieldIfNotEmpty('dataSourceRef', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.resources') }}</h4>
      <ContainerResources
        :value="getField('resources')"
        :mode="mode"
        @input="setFieldIfNotEmpty('resources', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.selector') }}</h4>
      <PodAffinityTerm
        :value="getField('selector')"
        :mode="mode"
        @input="setFieldIfNotEmpty('selector', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
