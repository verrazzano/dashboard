<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import PersistentVolumeClaim from '@/components/verrazzano/PersistentVolumeClaim';
import VolumeClaimTemplateMetadata
  from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/VolumeClaimTemplateMetadata';

export default {
  name:       'VolumeClaimTemplateSpec',
  components: {
    PersistentVolumeClaim,
    VolumeClaimTemplateMetadata,
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
    <VolumeClaimTemplateMetadata
      :value="getField('metadata')"
      :mode="mode"
      @input="setFieldIfNotEmpty('metadata', $event)"
    />
    <div class="spacer" />
    <PersistentVolumeClaim
      :value="getField('spec')"
      :mode="mode"
      @input="setFieldIfNotEmpty('spec', $event)"
    />
  </div>
</template>

<style scoped>

</style>
