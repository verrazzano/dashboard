<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import JobSpec from '@/components/verrazzano/JobSpec';
import Labels from '@/components/form/Labels';

export default {
  name:       'ActionJob',
  components: {
    JobSpec,
    Labels,
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
};
</script>

<template>
  <div>
    <div>
      <Labels v-model="value" :mode="mode" display-side-by-side />
    </div>
    <div class="spacer-small" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.actionJobSpec') }}</h3>
      <JobSpec
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
