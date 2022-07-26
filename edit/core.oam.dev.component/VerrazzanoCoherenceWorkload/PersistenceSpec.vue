<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledSelect from '@/components/form/LabeledSelect';
import PersistentStorageSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/PersistentStorageSpec';
import PersistentVolumeClaim from '@/components/verrazzano/PersistentVolumeClaim';
import Volume from '@/components/verrazzano/Volumes/Volume';

export default {
  name:       'PersistenceSpec',
  components: {
    LabeledSelect,
    PersistentStorageSpec,
    PersistentVolumeClaim,
    Volume,
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
    namespacedObject: {
      type:     Object,
      required: true
    },
  },
  computed: {
    persistenceModes() {
      return [
        { value: 'on-demand', label: this.t('verrazzano.coherence.types.persistenceModes.onDemand') },
        { value: 'active', label: this.t('verrazzano.coherence.types.persistenceModes.active') },
        { value: 'active-async', label: this.t('verrazzano.coherence.types.persistenceModes.activeAsync') },
      ];
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledSelect
          :value="getField('mode')"
          :mode="mode"
          :options="persistenceModes"
          option-key="value"
          option-label="label"
          :placeholder="getNotSetPlaceholder(value, 'mode')"
          :label="t('verrazzano.coherence.fields.persistenceMode')"
          @input="setFieldIfNotEmpty('mode', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.coherence.titles.persistentVolumeClaim') }}</h4>
      <PersistentVolumeClaim
        :value="getField('persistentVolumeClaim')"
        :mode="mode"
        @input="setFieldIfNotEmpty('persistentVolumeClaim', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.coherence.titles.volume') }}</h4>
      <Volume
        :value="getField('volume')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('volume', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.coherence.titles.snapshots') }}</h4>
      <PersistentStorageSpec
        :value="getField('snapshots')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('snapshots', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
