<script>
// Added by Verrazzano
import NodeAffinity from '@/components/verrazzano/NodeAffinity';
import PodAffinity from '@/components/verrazzano/PodAffinity';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'Affinity',
  components: {
    NodeAffinity,
    PodAffinity,
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
    nodeAffinityTitle: {
      type:    String,
      default: ''
    },
    podAffinityTitle: {
      type:    String,
      default: ''
    }
  },
  computed: {
    effectiveNodeAffinityTitle() {
      return this.nodeAffinityTitle || this.t('verrazzano.config.titles.podScheduler.nodeAffinity');
    },
    effectivePodAffinityTitle() {
      return this.podAffinityTitle || this.t('verrazzano.config.titles.podScheduler.podAffinity');
    }
  }
};
</script>

<template>
  <div>
    <div>
      <h4>{{ effectiveNodeAffinityTitle }}</h4>
      <NodeAffinity
        :value="getField('nodeAffinity')"
        :mode="mode"
        @input="setFieldIfNotEmpty('nodeAffinity', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ effectivePodAffinityTitle }}</h4>
      <PodAffinity
        v-model="value"
        :mode="mode"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
