<script>
// Added by Verrazzano
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import VolumeClaimTemplateMetadata from '@/components/verrazzano/VolumesTab/Ephemeral/VolumeClaimTemplateMetadata';
import VolumeClaimTemplateSpec from '@/components/verrazzano/VolumesTab/Ephemeral/VolumeClaimTemplateSpec';

export default {
  name:       'Ephemeral',
  components: {
    VolumeClaimTemplateMetadata,
    VolumeClaimTemplateSpec,
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
    <VolumeClaimTemplateMetadata
      :value="getField('volumeClaimTemplate.metadata')"
      :mode="mode"
      @input="setFieldIfNotEmpty('volumeClaimTemplate.metadata', $event)"
    />
    <div class="spacer-small" />
    <VolumeClaimTemplateSpec
      :value="getField('volumeClaimTemplate.spec')"
      :mode="mode"
      @input="setFieldIfNotEmpty('volumeClaimTemplate.spec', $event)"
    />
  </div>
</template>

<style scoped>

</style>
