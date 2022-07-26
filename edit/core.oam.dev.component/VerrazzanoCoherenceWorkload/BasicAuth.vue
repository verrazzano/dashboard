<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import SecretKeySelector from '@/components/verrazzano/SecretKeySelector';

export default {
  name:       'BasicAuth',
  components: { SecretKeySelector },
  mixins:     [CoherenceWorkloadHelper],
  props:      {
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
    <h4>{{ t('verrazzano.coherence.titles.basicAuth.username') }}</h4>
    <SecretKeySelector
      :value="getField('username')"
      :mode="mode"
      :namespaced-object="namespacedObject"
      @input="setFieldIfNotEmpty('username', $event)"
    />
    <div class="spacer-small" />
    <h4>{{ t('verrazzano.coherence.titles.basicAuth.password') }}</h4>
    <SecretKeySelector
      :value="getField('password')"
      :mode="mode"
      :namespaced-object="namespacedObject"
      @input="setFieldIfNotEmpty('password', $event)"
    />
  </div>
</template>

<style scoped>

</style>
