<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import PersistentVolumeClaim from '@/components/verrazzano/PersistentVolumeClaim';
import Volume from '@/components/verrazzano/Volumes/Volume';

export default {
  name:       'PersistentStorageSpec',
  components: {
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
    }
  },
};
</script>

<template>
  <div>
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
  </div>
</template>

<style scoped>

</style>
