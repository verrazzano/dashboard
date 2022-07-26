<script>
// Added by Verrazzano
import ObjectMetadata from '@/components/verrazzano/ObjectMetadata';
import PodSpec from '@/components/verrazzano/PodSpec';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'PodTemplate',
  components: {
    ObjectMetadata,
    PodSpec,
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
    namespacedObject: {
      type:     Object,
      required: true
    },
  },
};
</script>

<template>
  <div>
    <div>
      <ObjectMetadata
        :value="getField('metadata')"
        :mode="mode"
        @input="setFieldIfNotEmpty('metadata', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <PodSpec
        :value="getField('spec')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('spec', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
